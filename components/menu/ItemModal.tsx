'use client'

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Check, X, Plus, Minus } from 'lucide-react'
import { AnimatePresence, animate, motion, useDragControls, useMotionValue, type PanInfo } from 'framer-motion'
import { MenuItem, MenuItemOption } from '@/types'
import { getText, getItemPrice, formatPrice } from '@/lib/menu.utils'
import { ModifiersSelector } from './ModifiersSelector'
import { Button } from '@/components/ui/Button'
import { TagBadge } from '@/components/ui/TagBadge'
import { cn } from '@/lib/utils'

interface ItemModalProps {
    isOpen: boolean
    onClose: () => void
    item: MenuItem | null
    categoryId: string | null
    onAddToCart: (
        item: MenuItem,
        quantity: number,
        selectedOption?: MenuItemOption,
        selectedModifiers?: Record<string, string[]>,
        categoryId?: string
    ) => void
    language: string
    currency: any
    features: any
    layout: any
    images: any
    animations: any
    isOrderMode: boolean
}

type ActiveModalData = {
    item: MenuItem
    categoryId: string
}

export function ItemModal({
    isOpen,
    onClose,
    item,
    categoryId,
    onAddToCart,
    language,
    currency,
    features,
    layout,
    images,
    animations,
    isOrderMode
}: ItemModalProps) {
    // Keep a stable snapshot while animating out (prevents "null item" flicker).
    const [active, setActive] = useState<ActiveModalData | null>(null)
    // Keep rendering while exit animation runs (even if parent already set isOpen=false).
    const [present, setPresent] = useState(false)

    // Sheet drag behavior: only the handle starts the drag (prevents scroll/drag fights).
    const dragControls = useDragControls()
    const y = useMotionValue(0)
    const closeAnimRef = useRef<ReturnType<typeof animate> | null>(null)

    const [selectedOption, setSelectedOption] = useState<MenuItemOption | undefined>(undefined)
    const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({})
    const [quantity, setQuantity] = useState(1)
    const [showValidation, setShowValidation] = useState(false)

    const getClosedY = useCallback(() => {
        // "Closed" position far enough to fully hide the sheet.
        if (typeof window === 'undefined') return 1000
        return Math.max(window.innerHeight, 800)
    }, [])

    const cancelCloseAnim = useCallback(() => {
        if (closeAnimRef.current) {
            closeAnimRef.current.stop()
            closeAnimRef.current = null
        }
    }, [])

    const snapToOpen = useCallback(() => {
        cancelCloseAnim()
        closeAnimRef.current = animate(y, 0, {
            type: 'spring',
            stiffness: 360,
            damping: 42,
            bounce: 0
        })
    }, [cancelCloseAnim, y])

    const snapToClosed = useCallback(() => {
        cancelCloseAnim()
        closeAnimRef.current = animate(y, getClosedY(), {
            duration: 0.22,
            ease: 'easeInOut'
        })
    }, [cancelCloseAnim, getClosedY, y])

    // When opened with a valid item, snapshot it before paint (prevents first-open animation glitches).
    useLayoutEffect(() => {
        if (!isOpen) return
        if (!item || !categoryId) return
        setActive({ item, categoryId })
        setPresent(true)
        // Start closed then open deterministically (no overshoot).
        y.set(getClosedY())
        // Next frame ensures layout is ready before animating.
        requestAnimationFrame(() => snapToOpen())
    }, [isOpen, item, categoryId, getClosedY, snapToOpen, y])

    // Reset selection state when the active item changes.
    useEffect(() => {
        if (!active) return
        setQuantity(1)
        setSelectedModifiers({})
        setSelectedOption(active.item.options?.[0])
        setShowValidation(false)
    }, [active])

    // Lock body scroll and enable ESC close when sheet is open.
    useEffect(() => {
        if (!present) return
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.body.style.overflow = 'unset'
            document.removeEventListener('keydown', handleEscape)
        }
    }, [present, onClose])

    const handleModifierSelect = useCallback((modifierGroupName: string, selectedOptions: string[]) => {
        setSelectedModifiers(prev => ({
            ...prev,
            [modifierGroupName]: selectedOptions
        }))
    }, [])

    const itemPrice = useMemo(() => {
        if (!active) return 0
        return getItemPrice(active.item, selectedOption, selectedModifiers)
    }, [active, selectedOption, selectedModifiers])

    const missingRequiredModifierGroups = useMemo(() => {
        if (!active) return [] as string[]
        const mods = active.item.modifiers
        if (!mods) return [] as string[]

        return Object.entries(mods)
            .filter(([, group]) => group.required)
            .map(([groupKey]) => groupKey)
            .filter((groupKey) => (selectedModifiers[groupKey] || []).length === 0)
    }, [active, selectedModifiers])

    const canAddToCart = missingRequiredModifierGroups.length === 0

    const totalPrice = useMemo(() => itemPrice * quantity, [itemPrice, quantity])

    const handleAddToCart = useCallback(() => {
        if (!active) return
        if (!canAddToCart) {
            setShowValidation(true)
            // Scroll to the first missing required group (best-effort).
            const firstMissing = missingRequiredModifierGroups[0]
            if (firstMissing && typeof document !== 'undefined') {
                const el = document.querySelector(`[data-modifier-group="${firstMissing}"]`)
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            return
        }
        onAddToCart(active.item, quantity, selectedOption, selectedModifiers, active.categoryId)
        onClose()
    }, [active, canAddToCart, missingRequiredModifierGroups, onAddToCart, onClose, quantity, selectedOption, selectedModifiers])

    const handleDragEnd = useCallback((_: PointerEvent, info: PanInfo) => {
        // iOS-feel thresholds: close if dragged down enough OR flicked down fast.
        const closeOffsetY = 120
        const closeVelocityY = 900
        if (info.offset.y > closeOffsetY || info.velocity.y > closeVelocityY) {
            onClose()
            return
        }
        snapToOpen()
    }, [onClose, snapToOpen])

    // If parent closes, animate down then unmount locally.
    useEffect(() => {
        if (!present) return
        if (isOpen) return
        snapToClosed()
        const t = window.setTimeout(() => {
            setPresent(false)
            setActive(null)
            y.set(0)
        }, 240)
        return () => window.clearTimeout(t)
    }, [isOpen, present, snapToClosed, y])

    // If we have nothing to render, bail.
    if (!present || !active) return null

    return (
        <AnimatePresence>
            {present && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={language === 'en' ? 'Item details' : 'تفاصيل العنصر'}
                        drag="y"
                        dragControls={dragControls}
                        dragListener={false}
                        dragConstraints={{ top: 0, bottom: getClosedY() }}
                        dragElastic={0.08}
                        dragMomentum={false}
                        onDragEnd={handleDragEnd}
                        style={{ y }}
                        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl overflow-hidden ring-1 ring-black/5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col h-[92vh] max-h-[92vh]">
                            {/* Handle (drag-to-dismiss) */}
                            <div
                                className="flex justify-center pt-3 pb-2"
                                style={{ touchAction: 'none' }}
                                onPointerDown={(e) => dragControls.start(e)}
                            >
                                <div className="w-12 h-1.5 bg-gray-300/90 rounded-full" />
                            </div>

                            {/* Scrollable content */}
                            <div className="flex-1 overflow-y-auto overscroll-contain">
                                {layout.showItemImages && active.item.image && (
                                    <div className="relative h-64 w-full overflow-hidden">
                                        <Image
                                            src={`${images.itemPath}${active.categoryId}/${active.item.image}`}
                                            alt={getText(active.item, 'name', language)}
                                            fill
                                            className="object-cover"
                                            sizes="100vw"
                                        />
                                     
                                        <button
                                            onClick={onClose}
                                            aria-label={language === 'en' ? 'Close' : 'إغلاق'}
                                            className="absolute top-4 right-4 w-10 h-10 bg-white/85 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg ring-1 ring-black/5 active:scale-95 transition-transform"
                                        >
                                            <X className="w-5 h-5 text-gray-700" />
                                        </button>
                                    </div>
                                )}

                                <div className="px-6 pt-5">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                        {getText(active.item, 'name', language)}
                                    </h2>

                                    {active.item.tag && (
                                        <div className="mb-4">
                                            <TagBadge tag={active.item.tag} language={language} size="md" />
                                        </div>
                                    )}

                                    {layout.showItemDescription && (
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {getText(active.item, 'description', language)}
                                        </p>
                                    )}

                                    {features.enableProductOptions && active.item.options && active.item.options.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                                {language === 'en' ? 'Options' : 'الخيارات'}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {active.item.options.map((option) => {
                                                    const basePrice = Array.isArray(active.item.price) ? active.item.price[0] : active.item.price
                                                    const isSelected = selectedOption?.name === option.name

                                                    return (
                                                        <button
                                                            key={option.name}
                                                            onClick={() => setSelectedOption(option)}
                                                            className={cn(
                                                                'p-4 rounded-2xl border text-left transition-all min-h-[56px] active:scale-[0.99]',
                                                                isSelected
                                                                    ? 'border-primary bg-primary/5 shadow-sm'
                                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                                            )}
                                                        >
                                                            <div className="flex justify-between items-center gap-3">
                                                                <div className="flex items-center gap-3">
                                                                    <span
                                                                        className={cn(
                                                                            'w-6 h-6 rounded-full border flex items-center justify-center',
                                                                            isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-300'
                                                                        )}
                                                                        aria-hidden
                                                                    >
                                                                        {isSelected && <Check className="w-4 h-4 text-white" />}
                                                                    </span>
                                                                    <span className="font-semibold text-gray-900">
                                                                        {getText(option, 'name', language)}
                                                                    </span>
                                                                </div>
                                                                {option.price !== basePrice && (
                                                                    <span className="text-primary font-bold">
                                                                        +{currency.symbol}{option.price.toFixed(2)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {features.enableModifiers && active.item.modifiers && Object.keys(active.item.modifiers).length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                                {language === 'en' ? 'Customize' : 'تخصيص'}
                                            </h3>
                                            <ModifiersSelector
                                                modifiers={active.item.modifiers}
                                                selectedModifiers={selectedModifiers}
                                                onModifierSelect={handleModifierSelect}
                                                language={language}
                                                currencySymbol={currency.symbol}
                                                isModal={true}
                                                enableAnimations={animations.enableAnimations}
                                                highlightGroups={showValidation ? missingRequiredModifierGroups : []}
                                            />
                                        </div>
                                    )}

                                    <div className="border-t border-gray-200 pt-6 pb-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <div className="text-sm text-gray-600">
                                                    {language === 'en' ? 'Price per item' : 'السعر للقطعة'}
                                                </div>
                                                <div className="text-2xl font-bold text-primary">
                                                    {formatPrice(itemPrice, language, currency)}
                                                </div>
                                            </div>

                                            {isOrderMode && (
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                                                        <button
                                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition-transform"
                                                            aria-label={language === 'en' ? 'Decrease quantity' : 'تقليل الكمية'}
                                                        >
                                                            <Minus className="w-5 h-5 text-gray-700" />
                                                        </button>
                                                        <span className="text-xl font-bold w-8 text-center">
                                                            {quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => setQuantity(prev => prev + 1)}
                                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition-transform"
                                                            aria-label={language === 'en' ? 'Increase quantity' : 'زيادة الكمية'}
                                                        >
                                                            <Plus className="w-5 h-5 text-gray-700" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {isOrderMode && (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                                                    <span className="font-semibold text-gray-900">
                                                        {language === 'en' ? 'Total' : 'المجموع'}
                                                    </span>
                                                    <span className="text-2xl font-bold text-secondary">
                                                        {formatPrice(totalPrice, language, currency)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isOrderMode && (
                                <div
                                    className={cn(
                                        'sticky bottom-0 left-0 right-0 z-10',
                                        'bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]'
                                    )}
                                    style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
                                >
                                    <div className="p-4">
                                        <Button
                                            onClick={handleAddToCart}
                                            variant="primary"
                                            size="lg"
                                            fullWidth
                                            className="shadow-2xl"
                                            disabled={!canAddToCart}
                                        >
                                            <span className="flex w-full items-center justify-between">
                                                <span className="inline-flex items-center">
                                                    <Plus className="w-5 h-5 mr-2" />
                                                    {language === 'en'
                                                        ? `Add ${quantity}`
                                                        : `أضف ${quantity}`
                                                    }
                                                </span>
                                                <span className="font-bold">
                                                    {formatPrice(totalPrice, language, currency)}
                                                </span>
                                            </span>
                                        </Button>

                                        {!canAddToCart && showValidation && (
                                            <div className="mt-3 text-xs font-medium text-red-600 text-center">
                                                {language === 'en'
                                                    ? 'Please complete the required selections above.'
                                                    : 'يرجى إكمال الاختيارات المطلوبة أعلاه.'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}