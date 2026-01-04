import React from 'react'
import { MapPin, MessageCircle, Phone, Store } from 'lucide-react'
import type { BrandConfig } from '@/types'
import { cn } from '@/lib/utils'

interface FooterProps {
    language: 'en' | 'ar'
    config: BrandConfig
    /** When the fixed proceed button is visible, reserve enough space so it doesn't cover the footer */
    reserveBottomSpace?: boolean
}

export function Footer({
    language,
    config,
    reserveBottomSpace = false
}: FooterProps) {
    const displayName = language === 'ar' && config.name_ar ? config.name_ar : config.name
    const primaryBranch =
        config.branches.find((b) => b.id === config.defaultBranch) ?? config.branches[0]
    const whatsapp = config.contact?.whatsappNumber ?? primaryBranch?.whatsappNumber
    const waDigits = (whatsapp ?? '').replace(/[^\d]/g, '')
    const waHref = waDigits ? `https://wa.me/${waDigits}` : undefined
    const developedBy = language === 'ar' ? config.footer.developedBy.ar : config.footer.developedBy.en
    const copyrightText =
        language === 'ar' ? config.footer.copyrightText.ar : config.footer.copyrightText.en
    const year = new Date().getFullYear()

    return (
        <footer
            className={cn(
                'mt-10 border-t border-gray-200 bg-white',
                // Reserve space for the fixed ProceedOrderButton so it never covers footer content.
                reserveBottomSpace && 'pb-24'
            )}
            style={{
                paddingBottom: reserveBottomSpace
                    ? 'calc(6rem + env(safe-area-inset-bottom))'
                    : 'env(safe-area-inset-bottom)'
            }}
        >
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
                                <Store className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <div className="text-lg font-extrabold tracking-tight text-gray-900">
                                    {config.footer.showBrandName ? displayName : ' '}
                                </div>
                                {/* <div className="text-sm text-gray-600">
                                    {language === 'en' ? 'Order fast. Eat happy.' : 'اطلب بسرعة. استمتع بالأكل.'}
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* Branch / Address */}
                    <div className="space-y-3">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {language === 'en' ? 'Visit us' : 'زورنا'}
                        </div>
                        {primaryBranch ? (
                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-5 w-5 text-gray-600" />
                                    <div className="min-w-0">
                                        <div className="font-semibold text-gray-900">
                                            {language === 'ar' && primaryBranch.name_ar
                                                ? primaryBranch.name_ar
                                                : primaryBranch.name}
                                        </div>
                                        <div className="text-sm text-gray-600">{primaryBranch.address}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-600">
                                {language === 'en' ? 'No branch configured.' : 'لا يوجد فرع مُعرّف.'}
                            </div>
                        )}
                    </div>

                    {/* Contact */}
                    <div className="space-y-3">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {language === 'en' ? 'Contact' : 'تواصل'}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {waHref && (
                                <a
                                    href={waHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-95"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    {language === 'en' ? 'WhatsApp Order' : 'طلب واتساب'}
                                </a>
                            )}
                            {whatsapp && (
                                <a
                                    href={`tel:${whatsapp}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    <Phone className="h-4 w-4 text-gray-600" />
                                    {whatsapp}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm text-gray-600">
                        © {year} {displayName}. {copyrightText}
                    </div>
                    <div className="text-sm text-gray-500">
                        {developedBy}
                    </div>
                </div>
            </div>
        </footer>
    )
}