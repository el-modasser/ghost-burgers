'use client'

import React, { useState } from 'react'
import { Globe, Menu, ShoppingCart, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface HeaderProps {
    brandName: string
    brandNameAr?: string
    languages: Record<string, { name: string; dir: 'ltr' | 'rtl' }>
    currentLanguage: string
    onLanguageChange: (language: string) => void
    enableLanguageSwitcher: boolean
    colors: any
    showOrderButton?: boolean
    onOrderClick?: () => void
}

export function Header({
    brandName,
    brandNameAr,
    languages,
    currentLanguage,
    onLanguageChange,
    enableLanguageSwitcher,
    colors,
    showOrderButton = false,
    onOrderClick
}: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLanguageOpen, setIsLanguageOpen] = useState(false)

    const displayName = currentLanguage === 'ar' && brandNameAr ? brandNameAr : brandName

    return (
        <header
            className="absolute top-2 right-1 z-50"
        // style={{ backgroundColor: colors.background }}
        >
            <div className="container mx-auto px-4 py-2">
                <div className="flex items-center justify-end">
                    {/* <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: colors.primary }}
                        >
                            <span className="text-white font-bold">E</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {displayName}
                        </h1>
                    </div> */}

                    <div className="flex items-center gap-4">
                        {showOrderButton && (
                            <Button
                                variant="ghost"
                                size="md"
                                onClick={onOrderClick}
                                className="gap-2 bg-white/70 backdrop-blur-sm"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                {currentLanguage === 'ar' ? 'طلب' : 'Order'}
                            </Button>
                        )}
                        {enableLanguageSwitcher && (
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="md"
                                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                                    className="gap-2 bg-white/70 backdrop-blur-sm"
                                >
                                    <Globe className="w-4 h-4" />
                                    {currentLanguage.toUpperCase()}
                                </Button>

                                {isLanguageOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsLanguageOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 py-2 w-32 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                                            {Object.entries(languages).map(([code, lang]) => (
                                                <button
                                                    key={code}
                                                    onClick={() => {
                                                        onLanguageChange(code)
                                                        setIsLanguageOpen(false)
                                                    }}
                                                    className={cn(
                                                        'w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors',
                                                        currentLanguage === code && 'bg-gray-100 font-semibold'
                                                    )}
                                                >
                                                    {lang.name}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button> */}
                    </div>
                </div>

                {/* {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
                        <nav className="space-y-2">
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                                Menu
                            </a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                                About
                            </a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                                Contact
                            </a>
                        </nav>
                    </div>
                )} */}
            </div>
        </header>
    )
}