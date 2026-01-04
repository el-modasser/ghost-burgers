# Esto - Digital Menu Solution

A modern, customizable digital menu system for restaurants built with Next.js 14.

## Features

- 🎨 Fully customizable brand colors and styling
- 🌐 Multi-language support (English & Arabic)
- 📱 Fully responsive design
- 🛒 Shopping cart with WhatsApp integration
- ⚡ Fast performance with Next.js
- 🎯 SEO optimized
- 🔧 Easy configuration via JSON files

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Open http://localhost:3000

## Configuration

### Brand Configuration
Edit `config/brand.ts` to customize:
- Brand name and colors
- Features enabled/disabled
- Branch locations
- Currency and language settings

### Menu Data
Edit `data/menu.json` to customize:
- Menu categories and items
- Prices and descriptions
- Product options and modifiers
- Images

## Usage

### Order Mode
Add `?order=true` to URL to enable ordering functionality.

### Custom Client Configuration
Use `?client=client-id` to load specific client configuration.

## Deployment

### Vercel (Recommended)
```bash
vercel deploy