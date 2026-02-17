import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import { LogOut } from 'lucide-react'

export default async function Dashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg">
                            B
                        </div>
                        <span>Bookmarker</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:inline-block">Logged in as {user.email}</span>
                        <form action="/auth/signout" method="post">
                            <button
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                formAction={async () => {
                                    'use server'
                                    const supabase = await createClient()
                                    await supabase.auth.signOut()
                                    redirect('/')
                                }}
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">My Bookmarks</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage and access your favorite links from anywhere.</p>
                </div>

                <AddBookmarkForm />

                <BookmarkList initialBookmarks={bookmarks || []} />
            </main>
        </div>
    )
}
