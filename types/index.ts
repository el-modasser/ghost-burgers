// Core Types
export interface MenuItemOption {
    name: string;
    name_ar?: string;
    price: number;
}

export interface ModifierOption {
    name: string;
    name_ar?: string;
    price: number;
}

export interface ModifierGroup {
    name: string;
    name_ar?: string;
    required: boolean;
    maxSelections: number;
    options: ModifierOption[];
}

export type MenuItemTagVariant = 'best_seller' | 'most_ordered' | 'new' | 'hot' | 'custom';

export interface MenuItemTag {
    /** What will be displayed inside the tag/badge */
    text: string;
    text_ar?: string;
    /** Optional preset styling */
    variant?: MenuItemTagVariant | string;
}

export interface MenuItem {
    name: string;
    name_ar?: string;
    description: string;
    description_ar?: string;
    price: number | number[];
    image?: string;
    options?: MenuItemOption[];
    modifiers?: Record<string, ModifierGroup>;
    /** Optional badge/tag (e.g. "Best Seller", "Most Ordered") */
    tag?: MenuItemTag;
}

export interface MenuCategory {
    heroImage?: string;
    name: string;
    name_ar?: string;
    items: MenuItem[];
}

export interface MenuData {
    [categoryId: string]: MenuCategory;
}

// Cart Types
export interface CartItem {
    id: string;
    name: string;
    name_ar?: string;
    description?: string;
    price: number;
    quantity: number;
    selectedOption?: MenuItemOption;
    selectedModifiers: Record<string, string[]>;
    categoryId: string;
    displayName: string;
    image?: string;
    modifiers?: Record<string, ModifierGroup>;
}

// Brand Configuration Types
export interface BrandColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    gray: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };
}

export interface BrandFeatures {
    enableHeroImage: boolean;
    enableLanguageSwitcher: boolean;
    enableSearch: boolean;
    enablePriceSorting: boolean;
    enableCart: boolean;
    enableWhatsAppOrder: boolean;
    enableItemModal: boolean;
    enableDragScroll: boolean;
    enableBranchSelection: boolean;
    enableProductOptions: boolean;
    enableModifiers: boolean;
}

export interface Branch {
    id: string;
    name: string;
    name_ar?: string;
    whatsappNumber: string;
    address: string;
}

export interface Language {
    code: string;
    name: string;
    dir: 'ltr' | 'rtl';
}

export interface Currency {
    code: string;
    symbol: string;
    symbolEn: string;
    format: string;
}

export interface BrandLayout {
    itemsPerRow: 2 | 3 | 4;
    showItemImages: boolean;
    showItemDescription: boolean;
    showQuantitySelector: boolean;
    stickyCategories: boolean;
}

export interface BrandAnimations {
    enableAnimations: boolean;
    animationSpeed: number;
    staggerDelay: number;
}

export interface BrandFooter {
    copyrightText: {
        en: string;
        ar: string;
    };
    developedBy: {
        en: string;
        ar: string;
    };
    showBrandName: boolean;
}

export interface BrandConfig {
    // Brand Identity
    id: string;
    name: string;
    name_ar?: string;
    description: string;
    description_ar?: string;

    // Styling
    colors: BrandColors;

    // Features
    features: BrandFeatures;

    // Business Info
    branches: Branch[];
    defaultBranch: string;

    languages: Record<string, Language>;
    defaultLanguage: string;

    currency: Currency;

    contact: {
        whatsappNumber: string;
        whatsappMessage: {
            en: string;
            ar: string;
        };
    };

    // Media
    images: {
        heroPath: string;
        itemPath: string;
        defaultHero: string;
    };

    // Layout
    layout: BrandLayout;

    // Footer
    footer: BrandFooter;

    // Animations
    animations: BrandAnimations;
}