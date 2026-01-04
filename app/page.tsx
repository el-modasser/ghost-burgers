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
import Image from 'next/image'

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
        <div className="relative h-56 sm:h-64 md:h-80 overflow-hidden bg-gray-100">
          {/* Subtle brand tint overlay */}
          <div
            className="absolute inset-0 z-10 bg-linear-to-r from-primary/10 via-transparent to-secondary/10"
            aria-hidden
          />

          {/* Mobile hero */}
          <Image
            src="/images/hero/mob.png"
            alt={BRAND_CONFIG.name}
            fill
            priority
            sizes="(max-width: 767px) 100vw, 0px"
            className="object-cover md:hidden"
          />

          {/* Desktop hero */}
          <Image
            src="/images/hero/desk.png"
            alt={BRAND_CONFIG.name}
            fill
            priority
            sizes="(min-width: 768px) 100vw, 0px"
            className="hidden object-cover md:block"
          />

          {/* Bottom fade for nicer transition into content */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-linear-to-b from-transparent to-background"
            aria-hidden
          />
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
        config={BRAND_CONFIG}
        reserveBottomSpace={isOrderMode && BRAND_CONFIG.features.enableCart && getTotalItems() > 0}
      />
    </div>
  )
}