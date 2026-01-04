import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { CSSProperties } from 'react'
import './globals.css'
import { BRAND_CONFIG } from '@/config/brand'
import { hexToHslCssVarValue } from '@/lib/color.utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} | Digital Menu`,
  description: BRAND_CONFIG.description,
  keywords: 'restaurant, menu, digital menu, food, ordering',
  authors: [{ name: BRAND_CONFIG.name }],
  openGraph: {
    title: BRAND_CONFIG.name,
    description: BRAND_CONFIG.description,
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const rootStyle: CSSProperties = {
    // Tailwind config maps colors to `hsl(var(--...))`, so we store `"H S% L%"` here.
    ['--primary' as any]: hexToHslCssVarValue(BRAND_CONFIG.colors.primary),
    ['--secondary' as any]: hexToHslCssVarValue(BRAND_CONFIG.colors.secondary),
    ['--accent' as any]: hexToHslCssVarValue(BRAND_CONFIG.colors.accent),
    ['--background' as any]: hexToHslCssVarValue(BRAND_CONFIG.colors.background),
    ['--foreground' as any]: hexToHslCssVarValue(BRAND_CONFIG.colors.text),
    ['--border' as any]: hexToHslCssVarValue(BRAND_CONFIG.colors.gray?.[200] ?? '#e5e5e5'),
    ['--radius' as any]: '0.75rem',
  }

  return (
    <html lang="en" style={rootStyle}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}