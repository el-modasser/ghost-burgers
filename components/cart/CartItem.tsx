'use client'

import React from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { CartItem as CartItemType } from '@/types'
import { getText } from '@/lib/menu.utils'
import { cn } from '@/lib/utils'

interface CartItemProps {
    item: CartItemType
    onUpdateQuantity: (itemId: string, quantity: number) => void
    onRemove: (itemId: string) => void
    language: string
    currency: any
}

export function CartItem({
    item,
    onUpdateQuantity,
    onRemove,
    language,
    currency
}: CartItemProps) {
    const totalPrice = item.price * item.quantity

    return (
        <div className="p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h4 className="font-bold text-gray-900">
                        {item.displayName}
                    </h4>
                    {item.selectedOption && (
                        <p className="text-sm text-gray-600 mt-1">
                            {getText(item.selectedOption, 'name', language)}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            {item.selectedModifiers && Object.keys(item.selectedModifiers).length > 0 && (
                <div className="mb-3 space-y-2">
                    {Object.entries(item.selectedModifiers).map(([modifierGroupName, selectedOptionNames]) => {
                        if (!item.modifiers || !item.modifiers[modifierGroupName]) return null

                        const modifierGroup = item.modifiers[modifierGroupName]

                        return (
                            <div key={modifierGroupName}>
                                <p className="text-xs font-medium text-gray-700 mb-1">
                                    {getText(modifierGroup, 'name', language)}:
                                </p>
                                <div className="space-y-1">
                                    {selectedOptionNames.map(optionName => {
                                        const option = modifierGroup.options.find(opt => opt.name === optionName)
                                        if (!option) return null

                                        return (
                                            <div key={optionName} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">
                                                    • {getText(option, 'name', language)}
                                                </span>
                                                {option.price > 0 && (
                                                    <span className="text-gray-700 font-medium">
                                                        +{currency.symbol}{option.price.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold min-w-8 text-center">
                        {item.quantity}
                    </span>
                    <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>

                <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                        {currency.symbol}{totalPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                        {currency.symbol}{item.price.toFixed(2)} each
                    </div>
                </div>
            </div>
        </div>
    )
}