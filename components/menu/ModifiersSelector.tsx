'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { ModifierGroup, ModifierOption } from '@/types'
import { getText } from '@/lib/menu.utils'
import { cn } from '@/lib/utils'

interface ModifiersSelectorProps {
    modifiers: Record<string, ModifierGroup>
    selectedModifiers: Record<string, string[]>
    onModifierSelect: (modifierGroupName: string, selectedOptions: string[]) => void
    language: string
    currencySymbol: string
    isModal?: boolean
    enableAnimations?: boolean
    highlightGroups?: string[]
}

export function ModifiersSelector({
    modifiers,
    selectedModifiers,
    onModifierSelect,
    language,
    currencySymbol,
    isModal = false,
    enableAnimations = true,
    highlightGroups = []
}: ModifiersSelectorProps) {
    if (!modifiers || Object.keys(modifiers).length === 0) return null

    const handleModifierClick = (
        e: React.MouseEvent,
        modifierGroupName: string,
        modifier: ModifierOption
    ) => {
        e.stopPropagation()

        const currentSelections = selectedModifiers[modifierGroupName] || []
        const modifierGroup = modifiers[modifierGroupName]
        const maxSelections = modifierGroup?.maxSelections || 1

        if (currentSelections.includes(modifier.name)) {
            // Remove modifier
            onModifierSelect(
                modifierGroupName,
                currentSelections.filter(name => name !== modifier.name)
            )
        } else {
            // Add modifier
            if (maxSelections === 1) {
                // Single selection - replace current
                onModifierSelect(modifierGroupName, [modifier.name])
            } else {
                // Multiple selections
                if (currentSelections.length < maxSelections) {
                    onModifierSelect(modifierGroupName, [...currentSelections, modifier.name])
                }
            }
        }
    }

    return (
        <div className={cn(
            'space-y-4',
            isModal ? 'p-4 bg-gray-50 rounded-xl' : 'p-3 bg-gray-50 rounded-lg'
        )}>
            {!isModal && (
                <h4 className="text-sm font-semibold text-gray-700">
                    {language === 'en' ? 'Customize:' : 'تخصيص:'}
                </h4>
            )}

            {Object.entries(modifiers).map(([modifierGroupName, modifierGroup]) => {
                const isHighlighted = highlightGroups.includes(modifierGroupName)
                const currentSelections = selectedModifiers[modifierGroupName] || []
                const isMissingRequired = Boolean(modifierGroup.required && currentSelections.length === 0)

                return (
                <div
                    key={modifierGroupName}
                    data-modifier-group={modifierGroupName}
                    className={cn(
                        'space-y-2 rounded-xl p-3 transition-colors',
                        isHighlighted && isMissingRequired ? 'bg-red-50 ring-1 ring-red-300' : 'bg-transparent'
                    )}
                >
                    <div className="flex items-center gap-2">
                        <h5 className="text-sm font-medium text-gray-900">
                            {getText(modifierGroup, 'name', language)}
                        </h5>
                        {modifierGroup.required && (
                            <span className="text-xs font-medium text-primary">
                                {language === 'en' ? 'Required' : 'مطلوب'}
                            </span>
                        )}
                        {modifierGroup.maxSelections > 1 && (
                            <span className="text-xs text-gray-500">
                                {language === 'en'
                                    ? `(Max ${modifierGroup.maxSelections})`
                                    : `(الحد الأقصى ${modifierGroup.maxSelections})`
                                }
                            </span>
                        )}
                    </div>

                    {isHighlighted && isMissingRequired && (
                        <div className="text-xs font-medium text-red-600">
                            {language === 'en'
                                ? 'Please select at least 1 option to continue.'
                                : 'يرجى اختيار خيار واحد على الأقل للمتابعة.'}
                        </div>
                    )}

                    <div className="space-y-2">
                        {modifierGroup.options.map((modifier) => {
                            const isSelected = selectedModifiers[modifierGroupName]?.includes(modifier.name) || false

                            return (
                                <motion.div
                                    key={modifier.name}
                                    whileHover={enableAnimations ? { scale: 1.02 } : undefined}
                                    whileTap={enableAnimations ? { scale: 0.98 } : undefined}
                                    onClick={(e) => handleModifierClick(e, modifierGroupName, modifier)}
                                    className={cn(
                                        'flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors',
                                        isSelected
                                            ? 'bg-primary/10 border border-primary'
                                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            'w-5 h-5 rounded border flex items-center justify-center transition-colors',
                                            isSelected
                                                ? 'bg-primary border-primary'
                                                : 'bg-white border-gray-300'
                                        )}>
                                            {isSelected && (
                                                <Check className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {getText(modifier, 'name', language)}
                                        </span>
                                    </div>

                                    {modifier.price > 0 && (
                                        <span className="text-sm font-semibold text-gray-900">
                                            +{currencySymbol}{modifier.price.toFixed(2)}
                                        </span>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            )})}
        </div>
    )
}