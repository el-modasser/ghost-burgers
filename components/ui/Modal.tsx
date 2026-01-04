'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
    showCloseButton?: boolean
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true
}: ModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-2xl'
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end" onClick={onClose}>
                        <motion.div
                            initial={{ scale: 1, opacity: 1, y: "100%" }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 1, opacity: 1, y: "100%" }}
                            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                            className={cn(
                                'w-[100vw]  bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden',
                                sizeClasses[size]
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {(title || showCloseButton) && (
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                    {title && (
                                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                                    )}
                                    {showCloseButton && (
                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5 text-gray-500" />
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="overflow-y-auto max-h-[calc(85vh)] pb-4">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}