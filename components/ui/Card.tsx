import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outline'
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
    const variants = {
        default: 'bg-white border border-gray-200',
        elevated: 'bg-white shadow-lg',
        outline: 'border-2 border-gray-200 bg-transparent'
    }

    return (
        <div
            className={cn(
                'rounded-xl p-6',
                variants[variant],
                className
            )}
            {...props}
        />
    )
}