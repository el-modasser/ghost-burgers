'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { CartItem, MenuData } from '@/types'
import { MenuItemCard } from './MenuItemCard'
import { getCartItemId, getText } from '@/lib/menu.utils'

interface MenuGridProps {
    menuData: MenuData
    activeCategory: string
    onCategorySelect: (categoryId: string) => void
    getFilteredAndSortedItems: (categoryId: string) => any[]
    searchQuery: string
    onItemClick: (item: any, categoryId: string) => void
    onAddToCart: (item: any, quantity: number, selectedOption?: any, selectedModifiers?: Record<string, string[]>) => void
    onUpdateQuantity: (itemId: string, newQuantity: number) => void
    cart: any[]
    language: string
    features: any
    layout: any
    currency: any
    images: any
    animations: any
    isOrderMode: boolean
}

export function MenuGrid({
    menuData,
    activeCategory,
    onCategorySelect,
    getFilteredAndSortedItems,
    searchQuery,
    onItemClick,
    onAddToCart,
    onUpdateQuantity,
    cart,
    language,
    features,
    layout,
    currency,
    images,
    animations,
    isOrderMode
}: MenuGridProps) {
    const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

    const handleCategoryRef = (categoryId: string) => (el: HTMLDivElement | null) => {
        categoryRefs.current[categoryId] = el
    }

    const scrollToCategory = (categoryId: string) => {
        const element = categoryRefs.current[categoryId]
        if (element) {
            const headerOffset = 100
            const elementPosition = element.offsetTop
            const offsetPosition = elementPosition - headerOffset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })

            onCategorySelect(categoryId)
        }
    }

    const getCartSummaryForItem = (item: any, categoryId: string) => {
        const matching = (cart as CartItem[]).filter(ci => ci.name === item.name && ci.categoryId === categoryId)
        const totalQuantity = matching.reduce((sum, ci) => sum + (ci.quantity || 0), 0)
        const lastCartItem = matching.length > 0 ? matching[matching.length - 1] : null
        return { totalQuantity, lastCartItem }
    }

    const gridColumns = layout.itemsPerRow === 2
        ? 'md:grid-cols-2'
        : layout.itemsPerRow === 3
            ? 'md:grid-cols-2 lg:grid-cols-3'
            : 'md:grid-cols-2 lg:grid-cols-4'

    return (
        <div className="px-4 pb-16">
            {Object.entries(menuData).map(([categoryId, category]) => {
                const filteredItems = getFilteredAndSortedItems(categoryId)

                if (searchQuery && filteredItems.length === 0) {
                    return null
                }

                return (
                    <div
                        key={categoryId}
                        id={`category-${categoryId}`}
                        ref={handleCategoryRef(categoryId)}
                        className="mb-12 scroll-mt-24"
                    >
                        <motion.div
                            initial={animations.enableAnimations ? { opacity: 0, y: -12 } : undefined}
                            animate={animations.enableAnimations ? { opacity: 1, y: 0 } : undefined}
                            className="my-8"
                        >
                            <div className="flex items-end justify-between gap-3">
                                <h2 className="text-lg md:text-lg font-extrabold tracking-tight text-gray-900 leading-tight">
                                    {getText(category, 'name', language)}
                                </h2>
                                {searchQuery ? null : (
                                    <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">
                                        {filteredItems.length}
                                    </span>
                                )}
                            </div>
                            <div className="mt-3 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                        </motion.div>

                        {filteredItems.length > 0 ? (
                            <motion.div
                                initial={animations.enableAnimations ? { opacity: 0 } : undefined}
                                animate={animations.enableAnimations ? { opacity: 1 } : undefined}
                                className={`grid grid-cols-1 gap-6 ${gridColumns}`}
                            >
                                {filteredItems.map((item, index) => (
                                    // Use total quantity across variants; keep "last selection" so card can replicate.
                                    (() => {
                                        const { totalQuantity, lastCartItem } = getCartSummaryForItem(item, categoryId)

                                        // For cards we still want a stable ID for decrementing/replicating the last selection.
                                        const stableId = lastCartItem?.id ?? getCartItemId(item, item?.options?.[0], {})

                                        return (
                                    <MenuItemCard
                                        key={`${item.name}-${index}`}
                                        item={item}
                                        categoryId={categoryId}
                                        language={language}
                                        currency={currency}
                                        images={images}
                                        cartQuantity={totalQuantity}
                                        lastCartItem={lastCartItem}
                                        stableItemId={stableId}
                                        onAddToCart={onAddToCart}
                                        onUpdateQuantity={onUpdateQuantity}
                                        onItemClick={onItemClick}
                                        showImage={layout.showItemImages}
                                        showDescription={layout.showItemDescription}
                                        showQuantitySelector={layout.showQuantitySelector}
                                        enableProductOptions={features.enableProductOptions}
                                        enableModifiers={features.enableModifiers}
                                        enableAnimations={animations.enableAnimations}
                                        isOrderMode={isOrderMode}
                                    />
                                        )
                                    })()
                                ))}
                            </motion.div>
                        ) : searchQuery ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    {language === 'en'
                                        ? `No items found in "${getText(category, 'name', language)}"`
                                        : `لم يتم العثور على عناصر في "${getText(category, 'name', language)}"`
                                    }
                                </p>
                            </div>
                        ) : null}
                    </div>
                )
            })}

            {searchQuery && Object.keys(menuData).every(categoryId =>
                getFilteredAndSortedItems(categoryId).length === 0
            ) && (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            {language === 'en' ? 'No items found' : 'لم يتم العثور على عناصر'}
                        </h3>
                        <p className="text-gray-600">
                            {language === 'en'
                                ? 'Try searching for something else'
                                : 'حاول البحث عن شيء آخر'
                            }
                        </p>
                    </div>
                )}
        </div>
    )
}