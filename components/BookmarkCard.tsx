'use client'

import { useState } from 'react'
import { ExternalLink, Copy, Trash2, Globe, Check, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { deleteBookmark } from '@/app/actions'
import { motion } from 'framer-motion'
import { isToday, isYesterday, format } from 'date-fns'

interface Bookmark {
    id: string
    title: string
    url: string
    created_at: string
}

export function BookmarkCard({ bookmark, onDelete }: { bookmark: Bookmark, onDelete: (id: string) => void }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [copied, setCopied] = useState(false)
    const domain = new URL(bookmark.url).hostname.replace('www.', '')

    const handleCopy = () => {
        navigator.clipboard.writeText(bookmark.url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        const res = await deleteBookmark(bookmark.id)
        if (res.success) {
            onDelete(bookmark.id)
        } else {
            setIsDeleting(false)
            alert(res.error)
        }
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="group relative bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 border-border overflow-hidden">
                <div className="p-4 flex gap-4">
                    {/* Favicon placeholder/icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Globe size={18} />
                    </div>

                    <div className="flex-1 min-w-0 pr-24">
                        <h3 className="text-sm font-medium text-foreground truncate mb-1">
                            {bookmark.title || domain}
                        </h3>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                                {domain}
                            </span>
                            <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-[10px] font-medium text-zinc-400 capitalize whitespace-nowrap">
                                    {isToday(new Date(bookmark.created_at))
                                        ? 'today'
                                        : isYesterday(new Date(bookmark.created_at))
                                            ? 'yesterday'
                                            : format(new Date(bookmark.created_at), 'MMM d, yyyy')}
                                </span>
                                <span className="text-zinc-300">•</span>
                                <span className="text-xs text-muted-foreground truncate opacity-60">
                                    {bookmark.url}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions panel - visible on hover */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 rounded-md bg-card/90 border shadow-sm hover:text-primary"
                            onClick={() => window.open(bookmark.url, '_blank')}
                        >
                            <ExternalLink size={14} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 rounded-md bg-card/90 border shadow-sm hover:text-primary"
                            onClick={handleCopy}
                        >
                            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 rounded-md bg-card/90 border shadow-sm hover:text-red-600"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
