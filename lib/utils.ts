import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = '$', locale: string = 'en-US'): string {
    return `${currency}${amount.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`
}

export function truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

export function getImageUrl(path: string, category: string, image: string): string {
    if (image.startsWith('http')) return image
    return `${path}${category}/${image}`
}