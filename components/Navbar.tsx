'use client'

import { Bookmark, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export function Navbar({ userEmail }: { userEmail?: string }) {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-foreground tracking-tight">
                    <div className="bg-primary text-primary-foreground p-1 rounded-md">
                        <Bookmark size={18} />
                    </div>
                    <span>Smart Bookmark</span>
                </div>

                {userEmail && (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-secondary border flex items-center justify-center text-muted-foreground group-hover:bg-muted transition-colors">
                                <User size={16} />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                                {userEmail.split('@')[0]}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSignOut}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <LogOut size={16} className="mr-2" />
                            Sign out
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    )
}
