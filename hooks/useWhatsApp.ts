import { useState } from 'react'
import { CartItem, BrandConfig, MenuData } from '@/types'
import { composeWhatsAppMessage } from '@/lib/whatsapp.utils'

export function useWhatsApp() {
    const [isSending, setIsSending] = useState(false)

    const sendOrder = async (
        cart: CartItem[],
        orderNotes: string,
        orderType: 'pickup' | 'delivery',
        deliveryAddress: string,
        language: string,
        currency: BrandConfig['currency'],
        selectedBranch: string,
        branches: BrandConfig['branches'],
        menuData: MenuData
    ) => {
        if (cart.length === 0) {
            alert(language === 'en' ? 'Your cart is empty' : 'سلة التسوق فارغة')
            return
        }

        setIsSending(true)

        try {
            const message = composeWhatsAppMessage(
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

            const branch = branches.find(b => b.id === selectedBranch)
            const rawNumber = branch?.whatsappNumber || ''
            const digitsOnly = rawNumber.replace(/[^\d]/g, '')

            if (!digitsOnly) {
                alert(language === 'en' ? 'Missing WhatsApp number for this branch.' : 'رقم واتساب غير متوفر لهذا الفرع.')
                return
            }

            const whatsappUrl = `https://wa.me/${digitsOnly}?text=${message}`

            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank')

        } catch (error) {
            console.error('Failed to send order:', error)
            alert(language === 'en' ? 'Failed to send order. Please try again.' : 'فشل إرسال الطلب. الرجاء المحاولة مرة أخرى.')
        } finally {
            setIsSending(false)
        }
    }

    return {
        sendOrder,
        isSending
    }
}