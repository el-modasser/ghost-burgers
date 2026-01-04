'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { MenuData } from '@/types'
import { getText } from '@/lib/menu.utils'
import { cn } from '@/lib/utils'

interface CategoryNavigationProps {
    menuData: MenuData
    activeCategory: string
    onCategorySelect: (categoryId: string) => void
    language: string
    sticky?: boolean
    enableDragScroll?: boolean
}

export function CategoryNavigation({
    menuData,
    activeCategory,
    onCategorySelect,
    language,
    sticky = true,
    enableDragScroll = true
}: CategoryNavigationProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [showLeftScroll, setShowLeftScroll] = useState(false)
    const [showRightScroll, setShowRightScroll] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const isProgrammaticScrollRef = useRef(false)

    const checkScroll = () => {
        if (!scrollContainerRef.current) return

        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        setShowLeftScroll(scrollLeft > 0)
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1)
    }

    useEffect(() => {
        checkScroll()
        window.addEventListener('resize', checkScroll)
        return () => window.removeEventListener('resize', checkScroll)
    }, [])

    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeButton = scrollContainerRef.current.querySelector(
                `[data-category-id="${activeCategory}"]`
            ) as HTMLElement

            if (activeButton) {
                const container = scrollContainerRef.current
                const buttonRect = activeButton.getBoundingClientRect()
                const containerRect = container.getBoundingClientRect()

                if (buttonRect.left < containerRect.left || buttonRect.right > containerRect.right) {
                    const scrollLeft = activeButton.offsetLeft - (container.offsetWidth / 2) + (activeButton.offsetWidth / 2)

                    container.scrollTo({
                        left: scrollLeft,
                        behavior: 'smooth'
                    })
                }
            }
        }
    }, [activeCategory])

    const scrollToCategorySection = useCallback((categoryId: string) => {
        const el = document.getElementById(`category-${categoryId}`)
        if (!el) {
            onCategorySelect(categoryId)
            return
        }

        isProgrammaticScrollRef.current = true
        onCategorySelect(categoryId)

        // Match header + nav height
        const offset = 120
        const top = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })

        // Allow IntersectionObserver to resume after smooth scroll finishes.
        window.setTimeout(() => {
            isProgrammaticScrollRef.current = false
        }, 500)
    }, [onCategorySelect])

    // Auto-highlight active category while user scrolls the page.
    useEffect(() => {
        const ids = Object.keys(menuData)
        if (ids.length === 0) return

        const elements = ids
            .map((id) => document.getElementById(`category-${id}`))
            .filter(Boolean) as HTMLElement[]

        if (elements.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (isProgrammaticScrollRef.current) return

                // Pick the entry closest to the top that is intersecting.
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top))

                const first = visible[0]
                if (!first?.target?.id) return

                const id = first.target.id.replace('category-', '')
                if (id && id !== activeCategory) onCategorySelect(id)
            },
            {
                root: null,
                // Make "active" when section is around the upper-middle of viewport (feels like iOS).
                rootMargin: '-35% 0px -55% 0px',
                threshold: 0.01,
            }
        )

        elements.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [menuData, activeCategory, onCategorySelect])

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return

        const scrollAmount = 200
        const newScrollLeft = scrollContainerRef.current.scrollLeft +
            (direction === 'left' ? -scrollAmount : scrollAmount)

        scrollContainerRef.current.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        })
    }

    // Drag to scroll functionality
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!enableDragScroll || !scrollContainerRef.current) return

        setIsDragging(true)
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
        setScrollLeft(scrollContainerRef.current.scrollLeft)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return
        e.preventDefault()

        const x = e.pageX - scrollContainerRef.current.offsetLeft
        const walk = (x - startX) * 2
        scrollContainerRef.current.scrollLeft = scrollLeft - walk
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    return (
        <div className={cn(
            'bg-white/90 backdrop-blur-xl border-b border-gray-200/60',
            sticky && 'sticky top-0 z-40'
        )}>
            <div className="relative">
                {/* {showLeftScroll && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-r-lg shadow-lg"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                )}

                {showRightScroll && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-l-lg shadow-lg"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                )} */}

                <div
                    ref={scrollContainerRef}
                    className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide"
                    onScroll={checkScroll}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                    {Object.entries(menuData).map(([categoryId, category]) => (
                        <button
                            key={categoryId}
                            data-category-id={categoryId}
                            onClick={() => scrollToCategorySection(categoryId)}
                            className={cn(
                                'relative px-5 py-2.5 whitespace-nowrap font-semibold transition-all rounded-full',
                                activeCategory === categoryId
                                    ? 'text-gray-900'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            )}
                        >
                            {getText(category, 'name', language)}
                            {activeCategory === categoryId && (
                                <motion.div
                                    layoutId="category-underline"
                                    className="absolute left-3 right-3 -bottom-1 h-1 rounded-full bg-primary"
                                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}