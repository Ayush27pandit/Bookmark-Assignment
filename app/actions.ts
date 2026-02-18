'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper for metadata fetching with retry and backoff
async function fetchMetadata(url: string, maxRetries = 2): Promise<string | null> {
    for (let i = 0; i <= maxRetries; i++) {
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout

            const response = await fetch(url, {
                signal: controller.signal,
                headers: { 'User-Agent': 'Smart-Bookmark-Bot/1.0' }
            })
            clearTimeout(timeoutId)

            if (!response.ok) throw new Error(`Status ${response.status}`)

            const html = await response.text()
            const match = html.match(/<title>(.*?)<\/title>/i)
            return match ? match[1].trim() : null
        } catch (err) {
            if (i === maxRetries) {
                console.error(`Final fetch failure for ${url}:`, err)
                return null
            }
            // Exponential backoff: 1s, 2s
            await new Promise(res => setTimeout(res, Math.pow(2, i) * 1000))
        }
    }
    return null
}

export async function addBookmark(formData: FormData) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { error: 'You must be signed in to add bookmarks' }

        let url = (formData.get('url') as string || '').trim()
        let title = (formData.get('title') as string || '').trim()

        if (!url) return { error: 'URL is required' }

        // Robust URL validation
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url
        }

        try {
            new URL(url)
        } catch (e) {
            return { error: 'Invalid URL format' }
        }

        // Automatic title fetching if missing
        if (!title) {
            title = await fetchMetadata(url) || new URL(url).hostname.replace('www.', '')
        }

        const { error } = await supabase.from('bookmarks').insert({
            title,
            url,
            user_id: user.id
        })

        if (error) {
            // Check for Postgres unique constraint violation
            if (error.code === '23505') {
                return { error: 'This link is already in your bookmarks' }
            }
            throw error
        }

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        console.error('Server Action Error (add):', error)
        return { error: 'Failed to connect to the database. Please try again later.' }
    }
}

export async function deleteBookmark(id: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { error: 'Unauthorized' }

        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) throw error

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        console.error('Server Action Error (delete):', error)
        return { error: 'Deletion failed. Check your connection.' }
    }
}

export async function getBookmarks(limit: number = 12, cursor?: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { error: 'Unauthorized', data: [] }

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

        if (error) throw error

        return { data: data || [], success: true }
    } catch (error: any) {
        console.error('Server Action Error (get):', error)
        return { error: 'Could not fetch your bookmarks. Is you internet working?', data: [] }
    }
}
