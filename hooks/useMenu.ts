import { useState, useCallback } from 'react'
import { MenuData } from '@/types'

export function useMenu(menuData: MenuData) {
    const [searchQuery, setSearchQuery] = useState('')
    const [priceSort, setPriceSort] = useState<'default' | 'low-high' | 'high-low'>('default')

    const getFilteredAndSortedItems = useCallback((categoryId: string) => {
        const categoryData = menuData[categoryId]
        if (!categoryData?.items) return []

        let items = [...categoryData.items]

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            items = items.filter(item =>
                item.name.toLowerCase().includes(query) ||
                (item.name_ar && item.name_ar.includes(searchQuery)) ||
                item.description.toLowerCase().includes(query) ||
                (item.description_ar && item.description_ar.includes(searchQuery))
            )
        }

        // Sort by price
        if (priceSort === 'low-high') {
            items.sort((a, b) => {
                const priceA = Array.isArray(a.price) ? Math.min(...a.price) : a.price
                const priceB = Array.isArray(b.price) ? Math.min(...b.price) : b.price
                return priceA - priceB
            })
        } else if (priceSort === 'high-low') {
            items.sort((a, b) => {
                const priceA = Array.isArray(a.price) ? Math.max(...a.price) : a.price
                const priceB = Array.isArray(b.price) ? Math.max(...b.price) : b.price
                return priceB - priceA
            })
        }

        return items
    }, [searchQuery, priceSort, menuData])

    return {
        searchQuery,
        setSearchQuery,
        priceSort,
        setPriceSort,
        getFilteredAndSortedItems
    }
}