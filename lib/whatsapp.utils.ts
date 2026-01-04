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

    cart.forEach((item, index) => {
        // find original MenuItem once up-front (used for price + modifiers)
        let originalItem: MenuItem | undefined
        for (const category in menuData) {
            const found = menuData[category].items?.find(it => it.name === item.name)
            if (found) {
                originalItem = found
                break
            }
        }

        // use item.price if present, otherwise compute from original MenuItem if available
        const itemPrice = item.price ?? (originalItem ? getItemPrice(originalItem, item.selectedOption, item.selectedModifiers) : 0)
        const itemTotal = itemPrice * item.quantity

        message += `${index + 1}. ${item.displayName}\n`
        message += `   ${language === 'en' ? 'Quantity' : 'الكمية'}: ${item.quantity}\n`
        message += `   ${language === 'en' ? 'Price' : 'السعر'}: ${symbol} ${itemPrice.toLocaleString(currency.format)} ${language === 'en' ? 'each' : 'للقطعة'}\n`

        if (item.selectedModifiers && Object.keys(item.selectedModifiers).length > 0 && originalItem?.modifiers) {
            message += `   ${language === 'en' ? 'Modifiers' : 'التعديلات'}:\n`

            Object.entries(item.selectedModifiers).forEach(([modifierGroupName, selectedOptionNames]) => {
                const modifierGroup = originalItem!.modifiers![modifierGroupName]
                if (modifierGroup && modifierGroup.options && selectedOptionNames.length > 0) {
                    const groupName = getText(modifierGroup, 'name', language)
                    message += `     ${groupName}:\n`

                    selectedOptionNames.forEach(optionName => {
                        const option = modifierGroup.options.find(opt => opt.name === optionName)
                        if (option) {
                            const optionText = getText(option, 'name', language)
                            const optionPrice = option.price
                            message += `       - ${optionText}`
                            if (optionPrice > 0) {
                                message += ` (+${symbol} ${optionPrice.toLocaleString(currency.format)})`
                            }
                            message += `\n`
                        }
                    })
                }
            })
        }

        message += `   ${language === 'en' ? 'Total' : 'المجموع'}: ${symbol} ${itemTotal.toLocaleString(currency.format)}\n\n`

        // accumulate subtotal as we go (avoid later reduce relying on item.price)
        subtotal += itemTotal
    })

    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
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