'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CategoryNavigation } from '@/components/menu/CategoryNavigation'
import { SearchAndFilter } from '@/components/menu/SearchAndFilter'
import { MenuGrid } from '@/components/menu/MenuGrid'
import { ItemModal } from '@/components/menu/ItemModal'
import { CartModal } from '@/components/cart/CartModal'
import { ProceedOrderButton } from '@/components/cart/ProceedOrderButton'
import { useCart } from '@/hooks/useCart'
import { useMenu } from '@/hooks/useMenu'
import { BRAND_CONFIG } from '@/config/brand'
import menuData from '@/data/menu.json'

export default function HomePage() {
    const [language, setLanguage] = useState<'en' | 'ar'>(BRAND_CONFIG.defaultLanguage as 'en' | 'ar')
    const [selectedBranch, setSelectedBranch] = useState(BRAND_CONFIG.defaultBranch)
    const [isOrderMode, setIsOrderMode] = useState(true)
    const [activeCategory, setActiveCategory] = useState(Object.keys(menuData)[0])
    const [isItemModalOpen, setIsItemModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [selectedItemCategory, setSelectedItemCategory] = useState<string | null>(null)
    const [isCartOpen, setIsCartOpen] = useState(false)

    const {
        cart,
        orderNotes,
        setOrderNotes,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
    } = useCart(isOrderMode, language)

    const {
        searchQuery,
        setSearchQuery,
        priceSort,
        setPriceSort,
        getFilteredAndSortedItems,
    } = useMenu(menuData)

    useEffect(() => {
        // Default is ORDER mode. View-only mode is enabled by `?view=true`.
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            setIsOrderMode(params.get('view') !== 'true')
        }
    }, [])

    useEffect(() => {
        // Set document direction based on language
        document.documentElement.dir = BRAND_CONFIG.languages[language].dir
        document.documentElement.lang = language
    }, [language])

    const handleItemClick = (item: any, categoryId: string) => {
        if (!BRAND_CONFIG.features.enableItemModal) return
        setSelectedItem(item)
        setSelectedItemCategory(categoryId)
        setIsItemModalOpen(true)
    }

    const handleAddToCart = (
        item: any,
        quantity: number,
        selectedOption?: any,
        selectedModifiers?: Record<string, string[]>,
        categoryId?: string
    ) => {
        // IMPORTANT: use the explicit categoryId when provided (quick-add on card),
        // otherwise fall back to the currently opened modal category.
        addToCart(item, quantity, selectedOption, selectedModifiers, categoryId || selectedItemCategory || '')
    }

    return (
        <div className="min-h-screen bg-background text-foreground" style={{ direction: BRAND_CONFIG.languages[language].dir }}>
            <Header
                brandName={BRAND_CONFIG.name}
                brandNameAr={BRAND_CONFIG.name_ar}
                languages={BRAND_CONFIG.languages}
                currentLanguage={language}
                onLanguageChange={(lang) => setLanguage(lang as 'en' | 'ar')}
                enableLanguageSwitcher={BRAND_CONFIG.features.enableLanguageSwitcher}
                colors={BRAND_CONFIG.colors}
                showOrderButton={!isOrderMode}
                onOrderClick={() => {
                    if (typeof window === 'undefined') return
                    const url = new URL(window.location.href)
                    url.searchParams.delete('view')
                    window.location.href = url.toString()
                }}
            />

            {BRAND_CONFIG.features.enableHeroImage && (
                <div
                    className="h-64 md:h-80 bg-linear-to-r from-primary/20 to-secondary/20 flex items-center justify-center"
                    style={{ backgroundColor: BRAND_CONFIG.colors.primary + '20' }}
                >
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {language === 'ar' && BRAND_CONFIG.name_ar ? BRAND_CONFIG.name_ar : BRAND_CONFIG.name}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {language === 'ar' && BRAND_CONFIG.description_ar
                                ? BRAND_CONFIG.description_ar
                                : BRAND_CONFIG.description}
                        </p>
                    </div>
                </div>
            )}

            <SearchAndFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                priceSort={priceSort}
                onPriceSortChange={setPriceSort}
                language={language}
                enableSearch={BRAND_CONFIG.features.enableSearch}
                enablePriceSorting={BRAND_CONFIG.features.enablePriceSorting}
            />

            <CategoryNavigation
                menuData={menuData}
                activeCategory={activeCategory}
                onCategorySelect={setActiveCategory}
                language={language}
                sticky={BRAND_CONFIG.layout.stickyCategories}
                enableDragScroll={BRAND_CONFIG.features.enableDragScroll}
            />

            <MenuGrid
                menuData={menuData}
                activeCategory={activeCategory}
                onCategorySelect={setActiveCategory}
                getFilteredAndSortedItems={getFilteredAndSortedItems}
                searchQuery={searchQuery}
                onItemClick={handleItemClick}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={updateQuantity}
                cart={cart}
                language={language}
                features={BRAND_CONFIG.features}
                layout={BRAND_CONFIG.layout}
                currency={BRAND_CONFIG.currency}
                images={BRAND_CONFIG.images}
                animations={BRAND_CONFIG.animations}
                isOrderMode={isOrderMode}
            />

            {isOrderMode && BRAND_CONFIG.features.enableCart && getTotalItems() > 0 && (
                <ProceedOrderButton
                    onClick={() => setIsCartOpen(true)}
                    totalItems={getTotalItems()}
                    totalPrice={getTotalPrice()}
                    language={language}
                    currency={BRAND_CONFIG.currency}
                />
            )}

            <ItemModal
                isOpen={isItemModalOpen}
                onClose={() => setIsItemModalOpen(false)}
                item={selectedItem}
                categoryId={selectedItemCategory}
                onAddToCart={handleAddToCart}
                language={language}
                currency={BRAND_CONFIG.currency}
                features={BRAND_CONFIG.features}
                layout={BRAND_CONFIG.layout}
                images={BRAND_CONFIG.images}
                animations={BRAND_CONFIG.animations}
                isOrderMode={isOrderMode}
            />

            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                orderNotes={orderNotes}
                setOrderNotes={setOrderNotes}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
                language={language}
                currency={BRAND_CONFIG.currency}
                features={BRAND_CONFIG.features}
                branches={BRAND_CONFIG.branches}
                menuData={menuData}
                animations={BRAND_CONFIG.animations}
            />

            <Footer
                language={language}
                brandName={BRAND_CONFIG.name}
                brandNameAr={BRAND_CONFIG.name_ar}
                footer={BRAND_CONFIG.footer}
            />
        </div>
    )
}