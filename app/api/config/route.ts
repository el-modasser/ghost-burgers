import { NextRequest, NextResponse } from 'next/server'
import { BRAND_CONFIG } from '@/config/brand'
import menuData from '@/data/menu.json'

export async function GET(request: NextRequest) {
    try {
        // Get client ID from query parameters
        const { searchParams } = new URL(request.url)
        const clientId = searchParams.get('client') || 'demo'

        // In production, you would load client-specific config here
        // For now, return the default config
        const response = {
            config: BRAND_CONFIG,
            menu: menuData
        }

        return NextResponse.json(response, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
            }
        })
    } catch (error) {
        console.error('Failed to load config:', error)
        return NextResponse.json(
            { error: 'Failed to load configuration' },
            { status: 500 }
        )
    }
}