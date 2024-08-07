import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {
  ScrollRestoration,
  experimental_ScrollRestorationBeforeHydration as ScrollRestorationBeforeHydration,
} from 'next-scroll-restoration'
import './global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isExperimentalScrollRestorationEnabled = false

  return (
    <html>
      <head>
        {isExperimentalScrollRestorationEnabled && (
          <ScrollRestorationBeforeHydration />
        )}
      </head>
      <body className={inter.className}>
        {children}
        {isExperimentalScrollRestorationEnabled && (
          <p
            style={{
              position: 'fixed',
              bottom: 0,
              right: 16,
              borderRadius: '4px',
              background: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              padding: '0.5rem',
            }}
          >
            Experimental Scroll Restoration Before Hydration:{' '}
            {isExperimentalScrollRestorationEnabled ? 'Enabled' : 'Disabled'}
          </p>
        )}
        <ScrollRestoration />
      </body>
    </html>
  )
}
