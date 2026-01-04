import { CartItem, MenuItem, BrandConfig, MenuData } from '@/types'
import { getText, getItemPrice } from './menu.utils'

export function composeWhatsAppMessage(
    cart: CartItem[],
    orderNotes: string,
    language: string,
    currency: BrandConfig['currency'],
    selectedBranch: string,
    branches: BrandConfig['branches'],
    menuData: MenuData
): string {
    const branch = branches.find(b => b.id === selectedBranch)
    const symbol = language === 'en' ? currency.symbolEn : currency.symbol

    let message = language === 'en'
        ? "Hello! I'd like to place an order.\n\n"
        : "مرحباً! أود تقديم طلب.\n\n"

    if (branch) {
        const branchName = language === 'ar' && branch.name_ar ? branch.name_ar : branch.name
        message += `${language === 'en' ? 'Branch' : 'الفرع'}: ${branchName}\n`
        message += `${language === 'en' ? 'Address' : 'العنوان'}: ${branch.address}\n\n`
    }

    message += `*${language === 'en' ? 'Order Details' : 'تفاصيل الطلب'}:*\n`
    message += `${language === 'en' ? '====================' : '════════════════════'}\n\n`

    let subtotal = 0

    cart.forEach((item, index) => {
        // Cart items already store the final unit price (including option + modifiers).
        // Fall back to computing from the original menu item only if needed.
        const unitPrice =
            typeof item.price === 'number'
                ? item.price
                : (() => {
                    let originalItem: MenuItem | undefined
                    for (const category in menuData) {
                        const found = menuData[category].items?.find(it => it.name === item.name)
                        if (found) {
                            originalItem = found
                            break
                        }
                    }
                    return originalItem ? getItemPrice(originalItem, item.selectedOption, item.selectedModifiers) : 0
                })()

        const itemTotal = unitPrice * item.quantity
        subtotal += itemTotal

        message += `${index + 1}. ${item.displayName}\n`
        message += `   ${language === 'en' ? 'Quantity' : 'الكمية'}: ${item.quantity}\n`
        message += `   ${language === 'en' ? 'Unit price' : 'سعر القطعة'}: ${symbol} ${unitPrice.toLocaleString(currency.format)}\n`

        if (item.selectedOption?.name) {
            const optionLabel = getText(item.selectedOption, 'name', language)
            message += `   ${language === 'en' ? 'Option' : 'الخيار'}: ${optionLabel}\n`
        }

        if (item.selectedModifiers && Object.keys(item.selectedModifiers).length > 0) {
            message += `   ${language === 'en' ? 'Customizations' : 'التعديلات'}:\n`

            Object.entries(item.selectedModifiers).forEach(([modifierGroupKey, selectedOptionNames]) => {
                if (!selectedOptionNames || selectedOptionNames.length === 0) return

                const group = item.modifiers?.[modifierGroupKey]
                const groupName = group ? getText(group, 'name', language) : modifierGroupKey
                message += `     ${groupName}:\n`

                selectedOptionNames.forEach((optionName) => {
                    const opt = group?.options?.find(o => o.name === optionName)
                    const optLabel = opt ? getText(opt, 'name', language) : optionName
                    const optPrice = opt?.price ?? 0
                    message += `       - ${optLabel}`
                    if (optPrice > 0) {
                        message += ` (+${symbol} ${optPrice.toLocaleString(currency.format)})`
                    }
                    message += `\n`
                })
            })
        }

        message += `   ${language === 'en' ? 'Line total' : 'إجمالي الصنف'}: ${symbol} ${itemTotal.toLocaleString(currency.format)}\n\n`
    })

    message += `${language === 'en' ? '====================' : '════════════════════'}\n`
    message += `${language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}: ${symbol} ${subtotal.toLocaleString(currency.format)}\n`

    if (orderNotes.trim()) {
        message += `\n*${language === 'en' ? 'Special Instructions' : 'تعليمات خاصة'}:*\n`
        message += `${orderNotes}\n`
    }

    message += `\n*${language === 'en' ? 'Total Amount' : 'المبلغ الإجمالي'}:* ${symbol} ${subtotal.toLocaleString(currency.format)}\n\n`

    const now = new Date()
    const orderTime = now.toLocaleString(language === 'en' ? 'en-US' : 'ar-SA')
    message += `${language === 'en' ? 'Order Time' : 'وقت الطلب'}: ${orderTime}\n\n`
    message += language === 'en' ? 'Thank you!' : 'شكراً لك!'

    return encodeURIComponent(message)
}