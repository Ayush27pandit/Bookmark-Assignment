import { Card } from '@/components/ui/card'

export function SkeletonCard() {
    return (
        <Card className="border-slate-100 bg-white shadow-none">
            <div className="p-4 flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                    <div className="h-2 bg-slate-50 rounded animate-pulse w-full" />
                </div>
            </div>
        </Card>
    )
}

export function BookmarkGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-8">
            {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}
