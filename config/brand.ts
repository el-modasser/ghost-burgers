import { BrandConfig } from '@/types';

export const BRAND_CONFIG: BrandConfig = {
    id: 'ghost-burgers',
    name: 'Ghost Burgers',
    name_ar: 'مطعم غوست برجرز',
    description: 'Delicious Burgers, Amazing Fries, and More!',
    description_ar: 'طعام لذيذ يقدم طازجًا يوميًا ومشروبات جذابة',

    colors: {
        primary: '#ED1C24',
        secondary: '#fabe42',
        accent: '#FFDD00',
        background: '#FFFFFF',
        text: '#1A1A1A',
        gray: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717'
        }
    },

    features: {
        enableHeroImage: true,
        enableLanguageSwitcher: false,
        enableSearch: true,
        enablePriceSorting: true,
        enableCart: true,
        enableWhatsAppOrder: true,
        enableItemModal: true,
        enableDragScroll: true,
        enableBranchSelection: true,
        enableProductOptions: true,
        enableModifiers: true
    },

    branches: [
        {
            id: 'main',
            name: 'Main Branch',
            name_ar: 'الفرع الرئيسي',
            whatsappNumber: '+254795692258',
            address: 'Westfield Mbaazi'
        }
    ],
    defaultBranch: 'main',

    languages: {
        en: { code: 'en', name: 'English', dir: 'ltr' },
    },
    defaultLanguage: 'en',

    currency: {
        code: 'KES',
        symbol: 'KES',
        symbolEn: 'KES',
        format: 'en-US'
    },

    contact: {
        whatsappNumber: '+254795692258',
        whatsappMessage: {
            en: "Hello! I'd like to place an order from Ghost Burgers.\n\n",
            ar: "مرحباً! أود تقديم طلب من مطعم غوست برجرز.\n\n"
        }
    },

    images: {
        heroPath: '/images/hero/',
        itemPath: '/images/menu/',
        defaultHero: 'default-hero.jpg'
    },

    layout: {
        itemsPerRow: 3,
        showItemImages: true,
        showItemDescription: true,
        showQuantitySelector: true,
        stickyCategories: true
    },

    footer: {
        copyrightText: {
            en: 'All rights reserved.',
            ar: 'جميع الحقوق محفوظة.'
        },
        developedBy: {
            en: 'Powered by Esto Digital Menu',
            ar: 'مدعوم من إستو القائمة الرقمية'
        },
        showBrandName: true
    },

    animations: {
        enableAnimations: true,
        animationSpeed: 0.3,
        staggerDelay: 0.1
    }
};