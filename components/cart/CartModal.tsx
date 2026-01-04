'use client'

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ShoppingCart, MessageCircle, Trash2, MapPin, Truck, Store } from 'lucide-react'
import { CartItem, BrandConfig, MenuData } from '@/types'
import { CartItem as CartItemComponent } from './CartItem'
import { BranchSelection } from './BranchSelection'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import { cn } from '@/lib/utils'
import { AnimatePresence, animate, motion, useDragControls, useMotionValue, useTransform } from 'framer-motion'

interface CartModalProps {
    isOpen: boolean
    onClose: () => void
    cart: CartItem[]
    orderNotes: string
    setOrderNotes: (notes: string) => void
    updateQuantity: (itemId: string, quantity: number) => void
    removeFromCart: (itemId: string) => void
    clearCart: () => void
    selectedBranch: string
    setSelectedBranch: (branchId: string) => void
    language: string
    currency: any
    features: any
    branches: any
    menuData: MenuData
    animations: any
}

export function CartModal({
    isOpen,
    onClose,
    cart,
    orderNotes,
    setOrderNotes,
    updateQuantity,
    removeFromCart,
    clearCart,
    selectedBranch,
    setSelectedBranch,
    language,
    currency,
    features,
    branches,
    menuData,
    animations
}: CartModalProps) {
    const { sendOrder, isSending } = useWhatsApp()
    const [showNotes, setShowNotes] = useState(false)
    const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup')
    const [deliveryAddress, setDeliveryAddress] = useState('')
    const [showDeliveryValidation, setShowDeliveryValidation] = useState(false)
    const deliveryRef = useRef<HTMLDivElement | null>(null)

    // Bottom-sheet behavior (same engine as ItemModal)
    const [present, setPresent] = useState(false)
    const dragControls = useDragControls()
    const y = useMotionValue(0)
    const closeAnimRef = useRef<ReturnType<typeof animate> | null>(null)
    const isClosingRef = useRef(false)
    const closedYRef = useRef(1000)

    const overlayOpacity = useTransform(y, (latest) => {
        const closed = closedYRef.current || 1
        const t = Math.min(1, Math.max(0, latest / closed))
        return 1 - t
    })

    const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])
    const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart])

    const getClosedY = useCallback(() => {
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

    const requestClose = useCallback(() => {
        if (!present) return
        // Start the closing animation immediately to avoid the "flash" frame.
        isClosingRef.current = true
        snapToClosed()
        onClose()
    }, [onClose, present, snapToClosed])

    // Open lifecycle
    useLayoutEffect(() => {
        if (!isOpen) return
        isClosingRef.current = false
        setPresent(true)
        setShowNotes(false)
        setOrderType('pickup')
        setDeliveryAddress('')
        setShowDeliveryValidation(false)
        closedYRef.current = getClosedY()
        y.set(closedYRef.current)
        requestAnimationFrame(() => snapToOpen())
    }, [getClosedY, isOpen, snapToOpen, y])

    // Lock body scroll + ESC
    useEffect(() => {
        if (!present) return
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') requestClose()
        }
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.body.style.overflow = 'unset'
            document.removeEventListener('keydown', handleEscape)
        }
    }, [present, requestClose])

    // Close lifecycle (animate out even if parent toggles isOpen immediately)
    useEffect(() => {
        if (!present) return
        if (isOpen) return
        if (!isClosingRef.current) snapToClosed()
        const t = window.setTimeout(() => {
            setPresent(false)
        }, 240)
        return () => window.clearTimeout(t)
    }, [isOpen, present, snapToClosed, y])

    const handleSendOrder = async () => {
        if (orderType === 'delivery' && !deliveryAddress.trim()) {
            setShowDeliveryValidation(true)
            deliveryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            return
        }

        await sendOrder(
            cart,
            orderNotes,
            orderType,
            deliveryAddress,
            language,
            currency,
            selectedBranch,
            branches,
            menuData
        )
        clearCart()
        requestClose()
    }

    const handleDragEnd = useCallback((_: PointerEvent, info: { offset: { y: number }, velocity: { y: number } }) => {
        const closeOffsetY = 120
        const closeVelocityY = 900
        if (info.offset.y > closeOffsetY || info.velocity.y > closeVelocityY) {
            requestClose()
            return
        }
        snapToOpen()
    }, [requestClose, snapToOpen])

    return (
        <AnimatePresence>
            {present && (
                <>
                    <motion.div
                        style={{ opacity: overlayOpacity }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={requestClose}
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={language === 'en' ? 'Your order' : 'طلبك'}
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

                            {/* Header */}
                            <div className="px-6 pb-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                            {language === 'en' ? 'Your Order' : 'طلبك'}
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 leading-tight">
                                            {language === 'en'
                                                ? `${totalItems} item${totalItems === 1 ? '' : 's'}`
                                                : `${totalItems} عنصر`
                                            }
                                        </div>
                                    </div>
                                    <button
                                        onClick={requestClose}
                                        aria-label={language === 'en' ? 'Close' : 'إغلاق'}
                                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow-sm ring-1 ring-black/5 active:scale-95 transition-transform"
                                    >
                                        <span className="text-xl leading-none">×</span>
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable content */}
                            <div className="flex-1 overflow-y-auto overscroll-contain px-6">
                                {cart.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                            <ShoppingCart className="w-9 h-9 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {language === 'en' ? 'Your cart is empty' : 'سلة التسوق فارغة'}
                                        </h3>
                                        <p className="text-gray-600">
                                            {language === 'en'
                                                ? 'Add items from the menu to get started'
                                                : 'أضف عناصر من القائمة للبدء'
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6 pb-8">
                                        {features.enableBranchSelection && (
                                            <BranchSelection
                                                branches={branches}
                                                selectedBranch={selectedBranch}
                                                onSelectBranch={setSelectedBranch}
                                                language={language}
                                            />
                                        )}

                                        {/* Pickup / Delivery */}
                                        <div className="rounded-2xl border border-gray-200 bg-white p-4">
                                            <div className="flex items-center justify-between gap-3 mb-3">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {language === 'en' ? 'Order type' : 'نوع الطلب'}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOrderType('pickup')
                                                        setShowDeliveryValidation(false)
                                                    }}
                                                    className={cn(
                                                        'flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold border transition-colors',
                                                        orderType === 'pickup'
                                                            ? 'bg-primary text-white border-primary'
                                                            : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                                                    )}
                                                >
                                                    <Store className="h-4 w-4" />
                                                    {language === 'en' ? 'Pickup' : 'استلام'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setOrderType('delivery')}
                                                    className={cn(
                                                        'flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold border transition-colors',
                                                        orderType === 'delivery'
                                                            ? 'bg-secondary text-white border-secondary'
                                                            : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                                                    )}
                                                >
                                                    <Truck className="h-4 w-4" />
                                                    {language === 'en' ? 'Delivery' : 'توصيل'}
                                                </button>
                                            </div>

                                            {orderType === 'delivery' && (
                                                <div ref={deliveryRef} className="mt-4">
                                                    <Input
                                                        value={deliveryAddress}
                                                        onChange={(e) => {
                                                            setDeliveryAddress(e.target.value)
                                                            if (showDeliveryValidation) setShowDeliveryValidation(false)
                                                        }}
                                                        placeholder={
                                                            language === 'en'
                                                                ? 'Delivery destination (building, street, area...)'
                                                                : 'وجهة التوصيل (المبنى، الشارع، المنطقة...)'
                                                        }
                                                        label={language === 'en' ? 'Delivery destination *' : 'وجهة التوصيل *'}
                                                        icon={<MapPin className="h-4 w-4" />}
                                                        error={
                                                            showDeliveryValidation && !deliveryAddress.trim()
                                                                ? (language === 'en' ? 'Delivery destination is required.' : 'وجهة التوصيل مطلوبة.')
                                                                : undefined
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            {cart.map((item) => (
                                                <CartItemComponent
                                                    key={item.id}
                                                    item={item}
                                                    onUpdateQuantity={updateQuantity}
                                                    onRemove={removeFromCart}
                                                    language={language}
                                                    currency={currency}
                                                />
                                            ))}
                                        </div>

                                        <div className="space-y-3">
                                            <button
                                                onClick={() => setShowNotes(!showNotes)}
                                                className="w-full p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors text-left border border-gray-200"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-gray-900">
                                                        {language === 'en' ? 'Add special instructions' : 'إضافة تعليمات خاصة'}
                                                    </span>
                                                    <span className="text-primary font-bold">
                                                        {showNotes ? '▲' : '▼'}
                                                    </span>
                                                </div>
                                            </button>

                                            {showNotes && (
                                                <textarea
                                                    value={orderNotes}
                                                    onChange={(e) => setOrderNotes(e.target.value)}
                                                    placeholder={
                                                        language === 'en'
                                                            ? 'Any special requests or dietary requirements...'
                                                            : 'أي طلبات خاصة أو متطلبات غذائية...'
                                                    }
                                                    className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                                    rows={3}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sticky footer */}
                            <div
                                className={cn(
                                    'sticky bottom-0 left-0 right-0 z-10',
                                    'bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]'
                                )}
                                style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
                            >
                                <div className="p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">
                                            {language === 'en' ? 'Total' : 'المجموع'}
                                        </span>
                                        <span className="text-2xl font-bold text-secondary">
                                            {currency.symbol}{totalPrice.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            onClick={clearCart}
                                            variant="outline"
                                            className="flex-1"
                                            disabled={cart.length === 0}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            {language === 'en' ? 'Clear All' : 'مسح الكل'}
                                        </Button>

                                        {features.enableWhatsAppOrder && (
                                            <Button
                                                onClick={handleSendOrder}
                                                variant="primary"
                                                loading={isSending}
                                                className="flex-1"
                                                disabled={cart.length === 0 || (orderType === 'delivery' && !deliveryAddress.trim())}
                                            >
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                {language === 'en' ? 'Send Order' : 'إرسال الطلب'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}