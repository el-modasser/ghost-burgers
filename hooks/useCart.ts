import { useState, useCallback, useEffect } from 'react'
import { CartItem, MenuItem } from '@/types'
import { getCartItemId, getItemPrice, getItemDisplayName } from '@/lib/menu.utils'

export function useCart(isOrderMode: boolean = true, language: string = 'en') {
    const [cart, setCart] = useState<CartItem[]>([])
    const [orderNotes, setOrderNotes] = useState('')

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('esto-cart')
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart))
            } catch (error) {
                console.error('Failed to load cart from localStorage:', error)
            }
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('esto-cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = useCallback((
        item: MenuItem,
        quantity: number = 1,
        selectedOption?: any,
        selectedModifiers: Record<string, string[]> = {},
        categoryId: string = ''
    ) => {
        if (!isOrderMode || !item) return

        const cartPrice = getItemPrice(item, selectedOption, selectedModifiers)
        const cartItemId = getCartItemId(item, selectedOption, selectedModifiers)

        setCart(prev => {
            const existingItem = prev.find(cartItem => cartItem.id === cartItemId)

            if (existingItem) {
                return prev.map(cartItem =>
                    cartItem.id === cartItemId
                        ? { ...cartItem, quantity: cartItem.quantity + quantity }
                        : cartItem
                )
            }

            return [...prev, {
                ...item,
                id: cartItemId,
                price: cartPrice,
                quantity,
                selectedOption,
                selectedModifiers,
                categoryId,
                displayName: getItemDisplayName(item, selectedOption, selectedModifiers, language)
            }]
        })
    }, [isOrderMode, language])

    const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
        if (!isOrderMode) return
        if (newQuantity <= 0) {
            removeFromCart(itemId)
            return
        }
        setCart(prev => prev.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        ))
    }, [isOrderMode])

    const removeFromCart = useCallback((itemId: string) => {
        if (!isOrderMode) return
        setCart(prev => prev.filter(item => item.id !== itemId))
    }, [isOrderMode])

    const clearCart = useCallback(() => {
        if (!isOrderMode) return
        setCart([])
        setOrderNotes('')
        localStorage.removeItem('esto-cart')
    }, [isOrderMode])

    const getTotalItems = useCallback(() =>
        cart.reduce((sum, item) => sum + item.quantity, 0), [cart])

    const getTotalPrice = useCallback(() =>
        cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart])

    return {
        cart,
        orderNotes,
        setOrderNotes,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
        setCart
    }
}