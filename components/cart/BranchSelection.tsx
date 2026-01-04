'use client'

import React from 'react'
import { MapPin } from 'lucide-react'
import { Branch } from '@/types'
import { getText } from '@/lib/menu.utils'
import { cn } from '@/lib/utils'

interface BranchSelectionProps {
    branches: Branch[]
    selectedBranch: string
    onSelectBranch: (branchId: string) => void
    language: string
}

export function BranchSelection({
    branches,
    selectedBranch,
    onSelectBranch,
    language
}: BranchSelectionProps) {
    if (!branches || branches.length <= 1) return null

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900">
                    {language === 'en' ? 'Select Branch' : 'اختر الفرع'}
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {branches.map((branch) => (
                    <button
                        key={branch.id}
                        onClick={() => onSelectBranch(branch.id)}
                        className={cn(
                            'p-4 rounded-xl border text-left transition-all',
                            selectedBranch === branch.id
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-gray-300'
                        )}
                    >
                        <div className="font-medium text-gray-900 mb-1">
                            {getText(branch, 'name', language)}
                        </div>
                        <div className="text-sm text-gray-600">
                            {branch.address}
                        </div>
                        {selectedBranch === branch.id && (
                            <div className="mt-2 text-xs font-medium text-primary">
                                {language === 'en' ? 'Selected' : 'محدد'}
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}