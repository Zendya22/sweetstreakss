import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '../lib/AppContext'
import { getCurrentUser } from '../lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import { Toaster } from '../components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SweetStreaks - Sugar-Free Tracking App',
  description: 'Track your sugar-free journey with streaks, challenges, and achievements',
  manifest: '/site.webmanifest',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#2d7d52',
}

async function getUserOnServer() {
  try {
    const { user } = await getCurrentUser()
    return user
  } catch (error) {
    console.error('Error getting user on server:', error)
    return null
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get user on server side for initial auth state
  const user = await getUserOnServer()

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <AppProvider user={user}>
          <div className="min-h-screen bg-background">
            {children}
          </div>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
                border: '1px solid #bbf7d0',
                color: '#064e3b',
              },
            }}
          />
        </AppProvider>
      </body>
    </html>
  )
}