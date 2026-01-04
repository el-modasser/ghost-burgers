# Menu JSON Reference

This project’s menu data is loaded from `data/menu.json` (and can also exist per-client under `data/clients/<clientId>/menu.json`).

The structure below matches:
- The current `data/menu.json`
- The TypeScript interfaces in `types/index.ts` (`MenuData`, `MenuCategory`, `MenuItem`, etc.)

---

## Boilerplate (copy/paste templates)

### Minimal menu.json (1 category, 1 item)

Copy this into `data/menu.json` and replace the placeholder values:

```json
{
  "category_id_here": {
    "name": "Category Name (EN)",
    "name_ar": "اسم التصنيف (AR)",
    "heroImage": "",
    "items": [
      {
        "name": "Item Name (EN)",
        "name_ar": "اسم المنتج (AR)",
        "description": "Item description (EN)",
        "description_ar": "وصف المنتج (AR)",
        "price": 0,
        "image": "item-image.jpg"
      }
    ]
  }
}
```

### Full item template (options + modifiers)

Use this when an item has sizes/variants (**options**) and add-ons/required choices (**modifiers**):

```json
{
  "category_id_here": {
    "name": "Category Name (EN)",
    "name_ar": "اسم التصنيف (AR)",
    "heroImage": "",
    "items": [
      {
        "name": "Item Name (EN)",
        "name_ar": "اسم المنتج (AR)",
        "description": "Item description (EN)",
        "description_ar": "وصف المنتج (AR)",
        "price": 0,
        "image": "item-image.jpg",
        "options": [
          { "name": "Option 1 (EN)", "name_ar": "الخيار 1 (AR)", "price": 0 },
          { "name": "Option 2 (EN)", "name_ar": "الخيار 2 (AR)", "price": 0 }
        ],
        "modifiers": {
          "modifier_group_key_here": {
            "name": "Modifier Group Name (EN)",
            "name_ar": "اسم مجموعة الإضافات (AR)",
            "required": false,
            "maxSelections": 1,
            "options": [
              { "name": "Modifier Option 1 (EN)", "name_ar": "إضافة 1 (AR)", "price": 0 },
              { "name": "Modifier Option 2 (EN)", "name_ar": "إضافة 2 (AR)", "price": 0 }
            ]
          }
        }
      }
    ]
  }
}
```

### Price range template (when you don’t want options)

If you want the UI to show a min–max price range:

```json
{
  "category_id_here": {
    "name": "Category Name (EN)",
    "items": [
      {
        "name": "Item Name (EN)",
        "description": "Item description (EN)",
        "price": [0, 0],
        "image": "item-image.jpg"
      }
    ]
  }
}
```

---

## Top-level structure (`MenuData`)

The menu file is a JSON object where each key is a **category id** and the value is a **category object**.

```json
{
  "<categoryId>": { "name": "…", "items": [/* ... */] },
  "<categoryId2>": { "name": "…", "items": [/* ... */] }
}
```

- **`categoryId`**: `string`
  - Used internally for navigation and images
  - Example ids: `"appetizers"`, `"main_courses"`, `"desserts"`, `"beverages"`

---

## Category structure (`MenuCategory`)

Each category is an object with:

- **`name`**: `string` (required) — category name in English
- **`name_ar`**: `string` (optional) — category name in Arabic
- **`heroImage`**: `string` (optional) — currently present in JSON, can be `""`
- **`items`**: `MenuItem[]` (required)

Example:

```json
{
  "name": "Appetizers",
  "name_ar": "المقبلات",
  "heroImage": "",
  "items": [
    { "name": "Garlic Bread", "description": "…", "price": 8.99, "image": "1.jpeg" }
  ]
}
```

---

## Product / item structure (`MenuItem`)

Each item in `items[]` is a product object:

- **`name`**: `string` (required)
- **`name_ar`**: `string` (optional)
- **`description`**: `string` (required)
- **`description_ar`**: `string` (optional)
- **`price`**: `number | number[]` (required)
  - If it’s a number: a single fixed price
  - If it’s an array: a price range is displayed (min–max)
- **`image`**: `string` (optional)
  - Rendered using: `images.itemPath + categoryId + "/" + image`
  - Default config uses `images.itemPath = "/images/menu/"`
  - So the final URL is usually like: `/images/menu/<categoryId>/<image>`
- **`options`**: `MenuItemOption[]` (optional)
  - Used for size/variant selection (e.g. Small/Medium/Large)
  - Selecting an option typically sets the base price to `option.price`
- **`modifiers`**: `Record<string, ModifierGroup>` (optional)
  - Used for add-ons / required choices (e.g. “Choose Side”, “Extra Sauce”)
  - The **object keys** (e.g. `"side"`, `"sauce"`) are internal ids for the modifier group
- **`tag`**: `MenuItemTag` (optional)
  - Adds a nice badge on the **item card** and **item modal**
  - Use it for things like “Best Seller” / “Most Ordered”

---

## Tags / badges (`MenuItemTag`)

- **`text`**: `string` (required)
- **`text_ar`**: `string` (optional)
- **`variant`**: one of:
  - `"best_seller" | "most_ordered" | "new" | "hot" | "custom"` (optional)

Example:

```json
{
  "tag": { "text": "Best Seller", "text_ar": "الأكثر مبيعاً", "variant": "best_seller" }
}
```

---

## Options (`MenuItemOption`)

An item option is:

- **`name`**: `string` (required)
- **`name_ar`**: `string` (optional)
- **`price`**: `number` (required)

Example:

```json
{
  "name": "Large",
  "name_ar": "كبير",
  "price": 29.99
}
```

---

## Modifiers (`ModifierGroup` + `ModifierOption`)

### Modifier group (`ModifierGroup`)

A modifier group is stored under `item.modifiers.<modifierGroupKey>`:

- **`name`**: `string` (required)
- **`name_ar`**: `string` (optional)
- **`required`**: `boolean` (required)
- **`maxSelections`**: `number` (required)
  - Maximum number of options the user can select in this group
- **`options`**: `ModifierOption[]` (required)

### Modifier option (`ModifierOption`)

- **`name`**: `string` (required)
- **`name_ar`**: `string` (optional)
- **`price`**: `number` (required)
  - Added on top of the base price

Example:

```json
{
  "modifiers": {
    "side": {
      "name": "Choose Side",
      "name_ar": "اختر الطبق الجانبي",
      "required": true,
      "maxSelections": 1,
      "options": [
        { "name": "Rice", "name_ar": "أرز", "price": 0 },
        { "name": "French Fries", "name_ar": "بطاطس مقلية", "price": 1.0 }
      ]
    }
  }
}
```

---

## Full item example (with `options` + `modifiers`)

```json
{
  "name": "Grilled Salmon",
  "name_ar": "سلمون مشوي",
  "description": "Fresh salmon fillet with lemon butter sauce and vegetables",
  "description_ar": "شرائح سلمون طازجة مع صلصة الزبدة والليمون والخضروات",
  "price": 24.99,
  "image": "salmon.jpg",
  "options": [
    { "name": "Regular", "name_ar": "عادي", "price": 24.99 },
    { "name": "Large", "name_ar": "كبير", "price": 29.99 }
  ],
  "modifiers": {
    "side": {
      "name": "Choose Side",
      "name_ar": "اختر الطبق الجانبي",
      "required": true,
      "maxSelections": 1,
      "options": [
        { "name": "Mashed Potatoes", "name_ar": "بطاطس مهروسة", "price": 0 },
        { "name": "French Fries", "name_ar": "بطاطس مقلية", "price": 1.0 }
      ]
    },
    "sauce": {
      "name": "Extra Sauce",
      "name_ar": "صلصة إضافية",
      "required": false,
      "maxSelections": 2,
      "options": [
        { "name": "Lemon Butter", "name_ar": "زبدة الليمون", "price": 0.5 },
        { "name": "Garlic Sauce", "name_ar": "صلصة الثوم", "price": 0.5 }
      ]
    }
  }
}
```

---

## Notes / gotchas

- **`price` as an array**: some items in `data/menu.json` use `price: [min, max]`. The UI displays a range, but if you also provide `options`, the selected option’s `price` becomes the base price.
- **Modifier keys matter**: `modifiers` is an object, not an array. Keys like `"side"` or `"cheese"` should be unique within the item.


