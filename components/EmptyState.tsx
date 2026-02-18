'use client'

import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyState({ onAddClick }: { onAddClick: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 mb-6 shadow-sm">
                <Bookmark size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">
                No bookmarks yet
            </h3>
            <p className="text-sm text-slate-500 max-w-[280px] mb-8 leading-relaxed">
                Save links you want to revisit and keep your web life organized and calm.
            </p>
            <Button
                onClick={onAddClick}
                className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6 rounded-full font-medium"
            >
                Add your first bookmark
            </Button>
        </div>
    )
}
