import React from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FooterProps {
    language: 'en' | 'ar'
    brandName: string
    brandNameAr?: string
    footer: {
        copyrightText: { en: string; ar: string }
        developedBy: { en: string; ar: string }
        showBrandName: boolean
    }
}

export function Footer({
    language,
    brandName,
    brandNameAr,
    footer
}: FooterProps) {
    const displayName = language === 'ar' && brandNameAr ? brandNameAr : brandName

    return (
        <footer>
          
        </footer>
    )
}