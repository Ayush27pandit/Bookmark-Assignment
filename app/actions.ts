'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addBookmark(formData: FormData) {
    // Add a small artificial delay so the user can actually see the "Adding..." state
    await new Promise(resolve => setTimeout(resolve, 800));
    const supabase = await createClient()

    const title = formData.get('title') as string
    const url = formData.get('url') as string

    if (!title || !url) {
        return { error: 'Title and URL are required' }
    }

    // Basic URL validation
    let finalUrl = url
    if (!/^https?:\/\//i.test(url)) {
        finalUrl = 'https://' + url
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase.from('bookmarks').insert({
        title,
        url: finalUrl,
        user_id: user.id
    })

    if (error) {
        console.error('Error adding bookmark:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function deleteBookmark(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase.from('bookmarks').delete().eq('id', id).eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function getBookmarks(limit: number = 12, cursor?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized', data: [] }
    }

    let query = supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (cursor) {
        query = query.lt('created_at', cursor)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching bookmarks:', error)
        return { error: error.message, data: [] }
    }

    return { data: data || [], success: true }
}
