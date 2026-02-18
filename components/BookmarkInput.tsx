'use client'

import { useState, useRef, useTransition } from 'react'
import { Plus, Loader2, Link as LinkIcon, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { addBookmark } from '@/app/actions'

export function BookmarkInput() {
    const [isPending, startTransition] = useTransition()
    const [showTitle, setShowTitle] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    async function handleAction(formData: FormData) {
        startTransition(async () => {
            const res = await addBookmark(formData)
            if (res.success) {
                formRef.current?.reset()
                setShowTitle(false)
            } else {
                alert(res.error)
            }
        })
    }

    return (
        <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardContent className="p-4">
                <form ref={formRef} action={handleAction} className="space-y-3">
                    <div className="flex flex-col gap-3">
                        <div className="relative group">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                name="url"
                                type="url"
                                required
                                placeholder="Paste any link..."
                                className="pl-10 h-11 bg-input border-none focus-visible:ring-1 focus-visible:ring-primary rounded-lg pr-24"
                                onFocus={() => setShowTitle(true)}
                                autoComplete="off"
                                disabled={isPending}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:block">
                                <span className="text-[10px] uppercase font-bold text-slate-400 bg-white border px-1.5 py-0.5 rounded tracking-widest">
                                    URL
                                </span>
                            </div>
                        </div>

                        {showTitle && (
                            <div className="relative animate-in slide-in-from-top-2 duration-200">
                                <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    name="title"
                                    placeholder="Title (optional)"
                                    className="pl-10 h-11 bg-input border-none focus-visible:ring-1 focus-visible:ring-primary rounded-lg"
                                    autoComplete="off"
                                    disabled={isPending}
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-1">
                            <p className="text-[11px] text-muted-foreground hidden sm:block">
                                {isPending ? "Analyzing link..." : "Tip: Paste a link and we'll handle the rest."}
                            </p>
                            <div className="flex gap-2 w-full sm:w-auto">
                                {showTitle && !isPending && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowTitle(false)}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <FormButton isPending={isPending} />
                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

function FormButton({ isPending }: { isPending: boolean }) {
    return (
        <Button
            type="submit"
            className="w-full sm:w-auto h-9 bg-primary text-primary-foreground hover:bg-primary/90 font-medium min-w-[140px]"
            disabled={isPending}
        >
            {isPending ? (
                <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Adding...
                </>
            ) : (
                <>
                    <Plus size={16} className="mr-2" />
                    Add Bookmark
                </>
            )}
        </Button>
    )
}
