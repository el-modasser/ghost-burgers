'use client'

import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'

interface ProceedOrderButtonProps {
    onClick: () => void
    totalItems: number
    totalPrice: number
    language: string
    currency: any
}

export function ProceedOrderButton({
    onClick,
    totalItems,
    totalPrice,
    language,
    currency
}: ProceedOrderButtonProps) {
    if (totalItems === 0) return null

    return (
        <motion.div

            className="fixed bottom-6  w-full  z-40"
        >
            <button
                onClick={onClick}
                className="flex items-center gap-4 m-auto px-6 py-4 bg-primary text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow"
            >
                <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="font-bold">
                        {totalItems} {language === 'en' ? 'items' : 'عنصر'}
                    </span>
                </div>
                <div className="h-6 w-px bg-white/30" />
                <div className="font-bold">
                    {currency.symbol} {totalPrice.toFixed(2)}
                </div>
                <div className="font-semibold">
                    {language === 'en' ? 'View Order' : 'عرض الطلب'}
                </div>
            </button>
        </motion.div>
    )
}