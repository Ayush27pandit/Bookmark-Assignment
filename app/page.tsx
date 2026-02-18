import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AuthCard } from '@/components/AuthCard'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 bg-background overflow-hidden">
      {/* Soft background gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full" />

      <AuthCard />
    </main>
  )
}
