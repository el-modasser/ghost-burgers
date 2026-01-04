import { MenuItem, CartItem, BrandConfig } from '@/types'

export function getText(item: any, field: string, language: string): string {
    if (!item) return ''
    if (language === 'ar' && item[`${field}_ar`]) {
        return item[`${field}_ar`]
    }
    return item[field] || ''
}

export function getItemPrice(item: MenuItem, selectedOption?: any, selectedModifiers: Record<string, string[]> = {}): number {
    let basePrice = 0

    if (Array.isArray(item.price)) {
        basePrice = item.price[0] || 0
    } else {
        basePrice = item.price || 0
    }

    if (selectedOption && item.options && item.options.length > 0) {
        const option = item.options.find(opt => opt.name === selectedOption.name)
        if (option) {
            basePrice = option.price
        }
    }

    if (selectedModifiers && item.modifiers) {
        Object.entries(selectedModifiers).forEach(([modifierGroupName, selectedOptionNames]) => {
            const modifierGroup = item.modifiers![modifierGroupName]
            if (modifierGroup && modifierGroup.options) {
                selectedOptionNames.forEach(optionName => {
                    const option = modifierGroup.options.find(opt => opt.name === optionName)
                    if (option) {
                        basePrice += option.price
                    }
                })
            }
        })
    }

    return basePrice
}

export function getCartItemId(item: MenuItem, selectedOption?: any, selectedModifiers: Record<string, string[]> = {}): string {
    let id = item.name

    if (selectedOption && selectedOption.name) {
        id += `_${selectedOption.name}`
    }

    if (selectedModifiers) {
        Object.entries(selectedModifiers).forEach(([modifierGroupName, selectedOptionNames]) => {
            if (selectedOptionNames && selectedOptionNames.length > 0) {
                selectedOptionNames.forEach(optionName => {
                    id += `_${modifierGroupName}_${optionName}`
                })
            }
        })
    }

    return id
}

export function getItemDisplayName(item: MenuItem, selectedOption?: any, selectedModifiers: Record<string, string[]> = {}, language: string = 'en'): string {
    const baseName = getText(item, 'name', language)
    let displayName = baseName

    if (selectedOption && selectedOption.name) {
        const optionText = getText(selectedOption, 'name', language)
        displayName += ` (${optionText})`
    }

    return displayName
}

export function formatPrice(price: number | number[], language: string, currency: BrandConfig['currency']): string {
    if (Array.isArray(price)) {
        if (price.length === 0) return `${currency.symbol} 0`
        if (price.length === 1) return `${currency.symbol} ${price[0].toLocaleString(currency.format)}`
        const min = Math.min(...price)
        const max = Math.max(...price)
        return `${currency.symbol} ${min.toLocaleString(currency.format)} - ${max.toLocaleString(currency.format)}`
    }

    return `${currency.symbol} ${price.toLocaleString(currency.format)}`
}