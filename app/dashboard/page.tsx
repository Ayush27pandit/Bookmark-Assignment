import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { BookmarkInput } from '@/components/BookmarkInput'
import BookmarkList from '@/components/BookmarkList'
import { Navbar } from '@/components/Navbar'

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
        .limit(12)

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar userEmail={user.email} />

            <main className="flex-1 container max-w-[1200px] mx-auto px-4 py-8">
                <div className="max-w-[800px] mx-auto mb-12">
                    <div className="flex flex-col gap-1 mb-6">
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Collect your inspiration
                        </h1>
                        <p className="text-sm text-slate-500 font-medium tracking-tight">
                            Save, organize and revisit the best parts of the web.
                        </p>
                    </div>

                    <BookmarkInput />
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                            Recently Added
                        </h2>
                        <span className="text-xs font-medium text-slate-400">
                            {bookmarks?.length || 0} Bookmarks
                        </span>
                    </div>

                    <BookmarkList initialBookmarks={bookmarks || []} />
                </div>
            </main>

            <footer className="border-t py-8 mt-auto">
                <div className="container max-w-[1200px] mx-auto px-4 text-center">
                    <p className="text-xs text-slate-400 font-medium tracking-wide">
                        Powered by Supabase & Next.js • Design inspired by Raycast
                    </p>
                </div>
            </footer>
        </div>
    )
}
