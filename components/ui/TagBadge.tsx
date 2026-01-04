import React from 'react'
import { Flame, Sparkles, Star, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MenuItemTag } from '@/types'

interface TagBadgeProps {
  tag: MenuItemTag
  language: string
  size?: 'sm' | 'md'
  className?: string
}

export function TagBadge({ tag, language, size = 'sm', className }: TagBadgeProps) {
  const label = language === 'ar' && tag.text_ar ? tag.text_ar : tag.text

  const styles: Record<
    NonNullable<MenuItemTag['variant']>,
    { wrap: string; icon: React.ReactNode }
  > = {
    best_seller: {
      wrap: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white ring-1 ring-black/5',
      icon: <Star className="h-3.5 w-3.5" />
    },
    most_ordered: {
      wrap: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white ring-1 ring-black/5',
      icon: <TrendingUp className="h-3.5 w-3.5" />
    },
    new: {
      wrap: 'bg-gradient-to-r from-sky-600 to-indigo-500 text-white ring-1 ring-black/5',
      icon: <Sparkles className="h-3.5 w-3.5" />
    },
    hot: {
      wrap: 'bg-gradient-to-r from-rose-600 to-red-500 text-white ring-1 ring-black/5',
      icon: <Flame className="h-3.5 w-3.5" />
    },
    custom: {
      wrap: 'bg-black/85 text-white ring-1 ring-black/10',
      icon: <Sparkles className="h-3.5 w-3.5" />
    }
  }

  const variant = tag.variant ?? 'custom'
  const chosen = styles[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold tracking-wide shadow-sm backdrop-blur',
        size === 'md' && 'px-3 py-1.5 text-sm',
        chosen.wrap,
        className
      )}
      title={label}
    >
      <span className={cn('opacity-95', size === 'md' && 'scale-110')}>{chosen.icon}</span>
      <span className="leading-none">{label}</span>
    </span>
  )
}


