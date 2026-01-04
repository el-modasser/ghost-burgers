'use client'

import React from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface SearchAndFilterProps {
    searchQuery: string
    onSearchChange: (value: string) => void
    priceSort: 'default' | 'low-high' | 'high-low'
    onPriceSortChange: (value: 'default' | 'low-high' | 'high-low') => void
    language: string
    enableSearch: boolean
    enablePriceSorting: boolean
}

export function SearchAndFilter({
    searchQuery,
    onSearchChange,
    priceSort,
    onPriceSortChange,
    language,
    enableSearch,
    enablePriceSorting
}: SearchAndFilterProps) {
    return (
        <div className="px-4 py-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4 md:justify-between">
            {enableSearch && (
                <div className="flex-1 max-w-md">
                    <Input
                        type="text"
                        placeholder={language === 'en' ? 'Search dishes...' : 'ابحث في الأطباق...'}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        icon={<Search className="w-4 h-4" />}
                        className="w-full"
                    />
                </div>
            )}

            {/* {enablePriceSorting && (
                <div className="w-full md:w-auto">
                    <Select
                        value={priceSort}
                        onChange={(e) => onPriceSortChange(e.target.value as any)}
                        options={[
                            { value: 'default', label: language === 'en' ? 'Sort by Price' : 'ترتيب حسب السعر' },
                            { value: 'low-high', label: language === 'en' ? 'Price: Low to High' : 'السعر: من الأقل للأعلى' },
                            { value: 'high-low', label: language === 'en' ? 'Price: High to Low' : 'السعر: من الأعلى للأقل' }
                        ]}
                        className="w-full md:w-64"
                    />
                </div>
            )} */}
        </div>
    )
}