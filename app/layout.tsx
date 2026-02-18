import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Smart Bookmark',
  description: 'Your personal link memory',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased font-sans">
      <body className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
