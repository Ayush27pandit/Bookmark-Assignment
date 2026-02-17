'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Trash2, ExternalLink, Globe } from 'lucide-react'
import { deleteBookmark } from '@/app/actions'
import { motion, AnimatePresence } from 'framer-motion'

type Bookmark = {
    id: string
    title: string
    url: string
    created_at: string
    user_id: string
}

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const supabase = createClient()

    useEffect(() => {
        // Update local state when initialBookmarks prop changes (e.g. after server action revalidation)
        setBookmarks(initialBookmarks)
    }, [initialBookmarks])

    useEffect(() => {
        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((current) => [payload.new as Bookmark, ...current])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((current) => current.filter((b) => b.id !== payload.old.id))
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((current) => current.map(b => b.id === payload.new.id ? payload.new as Bookmark : b))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const handleDelete = async (id: string) => {
        // Optimistic update
        const previous = bookmarks
        setBookmarks((current) => current.filter((b) => b.id !== id))

        const res = await deleteBookmark(id)
        if (!res.success) {
            // Revert if failed
            setBookmarks(previous)
            alert(res.error)
        }
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                <p className="text-lg">No bookmarks yet.</p>
                <p className="text-sm">Add one to get started!</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
                {bookmarks.map((bookmark) => (
                    <motion.div
                        layout
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        key={bookmark.id}
                        className="group relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                <Globe className="w-5 h-5" />
                            </div>
                            <button
                                onClick={() => handleDelete(bookmark.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Delete bookmark"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate mb-1" title={bookmark.title}>
                            {bookmark.title}
                        </h3>

                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-500 dark:text-gray-400 truncate block hover:underline hover:text-blue-500 flex items-center gap-1"
                        >
                            {new URL(bookmark.url).hostname}
                            <ExternalLink className="w-3 h-3 inline" />
                        </a>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
