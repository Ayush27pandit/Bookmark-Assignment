'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { BookmarkCard } from './BookmarkCard'
import { EmptyState } from './EmptyState'
import { AnimatePresence } from 'framer-motion'
import { getBookmarks } from '@/app/actions'
import { Button } from './ui/button'
import { Loader2, ChevronDown } from 'lucide-react'

interface Bookmark {
    id: string
    title: string
    url: string
    created_at: string
}

const PAGE_SIZE = 12

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(initialBookmarks.length === PAGE_SIZE)
    const supabase = createClient()

    useEffect(() => {
        setBookmarks(initialBookmarks)
        setHasMore(initialBookmarks.length === PAGE_SIZE)
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
                        setBookmarks((current) => {
                            // Avoid duplicates if insert happens during pagination
                            if (current.some(b => b.id === payload.new.id)) return current
                            return [payload.new as Bookmark, ...current]
                        })
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

    const handleLoadMore = async () => {
        if (loading || !hasMore) return

        setLoading(true)
        const lastBookmark = bookmarks[bookmarks.length - 1]
        const cursor = lastBookmark?.created_at

        const res = await getBookmarks(PAGE_SIZE, cursor)

        if (res.success && res.data) {
            setBookmarks(current => [...current, ...res.data])
            setHasMore(res.data.length === PAGE_SIZE)
        }
        setLoading(false)
    }

    const handleDelete = (id: string) => {
        setBookmarks((current) => current.filter((b) => b.id !== id))
    }

    if (bookmarks.length === 0) {
        return (
            <div className="pt-12">
                <EmptyState onAddClick={() => {
                    const input = document.querySelector('input[name="url"]') as HTMLInputElement
                    input?.focus()
                }} />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                <AnimatePresence mode="popLayout" initial={false}>
                    {bookmarks.map((bookmark) => (
                        <BookmarkCard
                            key={bookmark.id}
                            bookmark={bookmark}
                            onDelete={handleDelete}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {hasMore && (
                <div className="flex justify-center pt-4">
                    <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="rounded-full px-8 border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all bg-card shadow-sm h-11"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin mr-2" />
                        ) : (
                            <ChevronDown size={16} className="mr-2" />
                        )}
                        {loading ? "Loading..." : "Load more bookmarks"}
                    </Button>
                </div>
            )}
        </div>
    )
}
