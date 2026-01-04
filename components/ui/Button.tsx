import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    fullWidth?: boolean
}

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center rounded-[0.4rem] justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg'

    const variants = {
        primary: 'bg-primary text-white rounded-[0.4rem] hover:bg-primary/90',
        secondary: 'bg-secondary text-white rounded-[0.4rem] hover:bg-secondary/90',
        outline: 'border border-gray-300 rounded-[0.4rem] bg-transparent hover:bg-gray-100',
        ghost: 'bg-transparent hover:bg-gray-100 rounded-[0.4rem]'
    }

    const sizes = {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4',
        lg: 'h-12 px-6 text-lg'
    }

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {children}
        </button>
    )
}