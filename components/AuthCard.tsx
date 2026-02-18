'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { Bookmark, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { motion } from 'framer-motion'

export function AuthCard() {
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        setIsLoading(true)
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 w-full max-w-[420px]"
        >
            <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="space-y-4 text-center pb-8 pt-10">
                    <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg shadow-primary/25 w-fit">
                        <Bookmark size={32} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Smart Bookmark
                        </h1>
                        <p className="text-muted-foreground font-medium tracking-tight">
                            Your personal link memory.
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="pb-8">
                    <Button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full h-12 text-sm font-semibold rounded-xl bg-card border border-border text-foreground hover:bg-secondary/50 hover:border-border/80 shadow-sm flex gap-3 transition-all active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        )}
                        Continue with Google
                    </Button>
                </CardContent>
                <CardFooter className="bg-secondary/10 border-t border-border/50 justify-center py-5 rounded-b-xl">
                    <p className="text-[11px] text-muted-foreground/60 font-medium tracking-wide font-mono">
                        COLLECT • ORGANIZE • REVISIT
                    </p>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
