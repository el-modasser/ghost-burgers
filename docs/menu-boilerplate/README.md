# Menu boilerplate pack (copy/paste)

This folder contains **ready JSON templates** to help you build a menu quickly.

## What to copy where

- To start from a full empty menu with multiple categories:
  - Copy `docs/menu-boilerplate/menu.empty.json` → `data/menu.json`
- To manage categories as separate files (for your workflow):
  - Use files under `docs/menu-boilerplate/categories/*.json`
  - When ready, copy each category object into `data/menu.json` under its category id key
- For product/item variations you can copy into any category’s `items[]`:
  - Use `docs/menu-boilerplate/item.templates.json`

## Notes

- Category ids (top-level keys) should be URL/file friendly, e.g. `burgers`, `chicken_sandwiches`, `drinks`.
- Images are typically loaded from `/images/menu/<categoryId>/<image>`.


