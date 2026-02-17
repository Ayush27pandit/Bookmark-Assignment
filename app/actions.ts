'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addBookmark(formData: FormData) {
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
