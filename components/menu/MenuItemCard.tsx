'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { CartItem, MenuItem, MenuItemOption } from '@/types'
import { getCartItemId, getText, getItemPrice, formatPrice } from '@/lib/menu.utils'
import { ModifiersSelector } from './ModifiersSelector'
import { Button } from '@/components/ui/Button'
import { TagBadge } from '@/components/ui/TagBadge'
import { cn } from '@/lib/utils'

interface MenuItemCardProps {
    item: MenuItem
    categoryId: string
    language: string
    currency: any
    images: any
    cartQuantity: number
    lastCartItem?: CartItem | null
    stableItemId?: string
    onAddToCart: (
        item: MenuItem,
        quantity: number,
        selectedOption?: MenuItemOption,
        selectedModifiers?: Record<string, string[]>,
        categoryId?: string
    ) => void
    onUpdateQuantity: (itemId: string, newQuantity: number) => void
    onItemClick: (item: MenuItem, categoryId: string) => void
    showImage: boolean
    showDescription: boolean
    showQuantitySelector: boolean
    enableProductOptions: boolean
    enableModifiers: boolean
    enableAnimations: boolean
    isOrderMode: boolean
}

export function MenuItemCard({
    item,
    categoryId,
    language,
    currency,
    images,
    cartQuantity,
    lastCartItem = null,
    stableItemId,
    onAddToCart,
    onUpdateQuantity,
    onItemClick,
    showImage,
    showDescription,
    showQuantitySelector,
    enableProductOptions,
    enableModifiers,
    enableAnimations,
    isOrderMode
}: MenuItemCardProps) {
    const [selectedOption, setSelectedOption] = useState<MenuItemOption | undefined>(
        item.options && item.options.length > 0 ? item.options[0] : undefined
    )
    const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({})
    const [showModifiers, setShowModifiers] = useState(false)

    const itemPrice = getItemPrice(item, selectedOption, selectedModifiers)
    const itemId = stableItemId ?? getCartItemId(item, selectedOption, selectedModifiers)

    const basePrice = Array.isArray(item.price) ? item.price[0] : item.price
    const isPriceDifferent = selectedOption ? itemPrice !== basePrice : false

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation()
        onAddToCart(item, 1, selectedOption, selectedModifiers, categoryId)
    }

    const hasRequiredModifiers =
        !!item.modifiers && Object.values(item.modifiers).some((group) => group.required)

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isOrderMode) return

        // If already in cart, replicate the last selection (best UX; matches "Uber add again").
        if (cartQuantity > 0 && lastCartItem) {
            onAddToCart(item, 1, lastCartItem.selectedOption, lastCartItem.selectedModifiers, categoryId)
            return
        }

        // If there are required selections and nothing in cart yet, open modal so user can choose.
        if (hasRequiredModifiers) {
            onItemClick(item, categoryId)
            return
        }

        // No required choices: direct add with default option + no modifiers.
        onAddToCart(item, 1, selectedOption, {}, categoryId)
    }

    const handleQuickRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isOrderMode) return
        if (cartQuantity <= 0) return

        // Decrement the last selection (works even if cartQuantity is an aggregate across variants).
        if (lastCartItem?.id) {
            const currentVariantQty = lastCartItem.quantity ?? 0
            onUpdateQuantity(lastCartItem.id, Math.max(0, currentVariantQty - 1))
            return
        }

        onUpdateQuantity(itemId, Math.max(0, cartQuantity - 1))
    }

    const handleModifierSelect = (modifierGroupName: string, selectedOptions: string[]) => {
        setSelectedModifiers(prev => ({
            ...prev,
            [modifierGroupName]: selectedOptions
        }))
    }

    return (
        <motion.div
            initial={enableAnimations ? { opacity: 0, y: 20 } : undefined}
            animate={enableAnimations ? { opacity: 1, y: 0 } : undefined}
            transition={enableAnimations ? { duration: 0.3 } : undefined}
            whileHover={enableAnimations ? { y: -4 } : undefined}
            onClick={() => onItemClick(item, categoryId)}
            className="bg-white relative rounded-2xl grid grid-cols-3 justify-between shadow-lg overflow-hidden cursor-pointer border border-gray-200 hover:border-primary/30 transition-all"
        >


            <div className="p-5 col-span-2">
                <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                            {getText(item, 'name', language)}
                        </h3>
                    </div>

                    <div className="text-left shrink-0">
                        <div className="">
                            {formatPrice(itemPrice, language, currency)}
                        </div>
                        {isPriceDifferent && (
                            <div className="text-sm text-gray-500 line-through">
                                {formatPrice(basePrice, language, currency)}
                            </div>
                        )}
                    </div>
                </div>

                {showDescription && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {getText(item, 'description', language)}
                    </p>
                )}

                {/* Tag under description (relative/in-flow). If description is hidden, show under name. */}
                {item.tag && (
                    <div className=' absolute bottom-2 left-5 z-50'>
                        <TagBadge tag={item.tag} language={language} />
                    </div>
                )}

                {/* {enableProductOptions && item.options && item.options.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                {language === 'en' ? 'Options:' : 'الخيارات:'}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {item.options.map((option) => (
                                <button
                                    key={option.name}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedOption(option)
                                    }}
                                    className={cn(
                                        'px-3 py-1.5 text-sm rounded-[0.4rem] border transition-colors',
                                        selectedOption?.name === option.name
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                    )}
                                >
                                    {getText(option, 'name', language)}
                                    {option.price !== basePrice && (
                                        <span className="ml-1 font-semibold">
                                            +{currency.symbol}{option.price.toFixed(2)}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {enableModifiers && item.modifiers && Object.keys(item.modifiers).length > 0 && (
                    <div className="mb-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowModifiers(!showModifiers)
                            }}
                            className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <span className="text-sm font-medium text-gray-700">
                                {language === 'en' ? 'Customize your order' : 'تخصيص طلبك'}
                            </span>
                            <ChevronDown className={cn(
                                'w-4 h-4 text-gray-500 transition-transform',
                                showModifiers && 'rotate-180'
                            )} />
                        </button>

                        {showModifiers && (
                            <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                                <ModifiersSelector
                                    modifiers={item.modifiers}
                                    selectedModifiers={selectedModifiers}
                                    onModifierSelect={handleModifierSelect}
                                    language={language}
                                    currencySymbol={currency.symbol}
                                    enableAnimations={enableAnimations}
                                />
                            </div>
                        )}
                    </div>
                )}

                {isOrderMode && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        {showQuantitySelector && cartQuantity > 0 ? (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onUpdateQuantity(itemId, cartQuantity - 1)
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-lg font-bold text-gray-900 min-w-[2rem] text-center">
                                    {cartQuantity}
                                </span>
                                <button
                                    onClick={handleAddToCart}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Button
                                onClick={handleAddToCart}
                                variant="primary"
                                size="sm"
                                className="flex-1"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'Add to Order' : 'أضف إلى الطلب'}
                            </Button>
                        )}
                    </div>
                )} */}
            </div>  {showImage && item.image && (
                <div className="relative col-span-1 w-full overflow-hidden">
                    <Image
                        src={`${images.itemPath}${categoryId}/${item.image}`}
                        alt={getText(item, 'name', language)}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Quick add/remove overlay (always show +; required items open modal until there is 1 in cart) */}
                    {isOrderMode && (
                        <div className="absolute bottom-2 right-2 z-10">
                            {/* Constant-size container so it never “shrinks” when quantity changes */}
                            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md rounded-full shadow-lg ring-1 ring-black/5 px-1 py-1">
                                {cartQuantity > 0 && (
                                    <button
                                        onClick={handleQuickRemove}
                                        className="w-8 h-8 rounded-full bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center active:scale-95 transition-transform"
                                        aria-label={language === 'en' ? 'Remove one' : 'إزالة واحد'}
                                    >
                                        <Minus className="w-4 h-4 text-gray-800" />
                                    </button>
                                )}

                                {cartQuantity > 0 && (
                                    <span className="min-w-[1.6rem] text-center text-sm font-bold text-gray-900">
                                        {cartQuantity}
                                    </span>
                                )}

                                <button
                                    onClick={handleQuickAdd}
                                    className={cn(
                                        'w-8 h-8 rounded-full shadow-md ring-1 ring-black/5 flex items-center justify-center active:scale-95 transition-transform',
                                        cartQuantity > 0 ? 'bg-primary' : 'bg-white'
                                    )}
                                    aria-label={hasRequiredModifiers
                                        ? (language === 'en' ? 'Customize / Add' : 'تخصيص / إضافة')
                                        : (language === 'en' ? 'Add one' : 'أضف واحد')}
                                >
                                    <Plus className={cn('w-4 h-4', cartQuantity > 0 ? 'text-white' : 'text-gray-900')} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    )
}