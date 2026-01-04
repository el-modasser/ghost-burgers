function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.trim().replace(/^#/, '')
  const normalized =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null

  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  return { r, g, b }
}

/**
 * Converts a hex color (e.g. "#F05A2A") to the Tailwind-compatible CSS var value used by:
 * `hsl(var(--primary))` → expects `"H S% L%"`
 */
export function hexToHslCssVarValue(hex: string): string {
  const rgb = parseHexColor(hex)
  if (!rgb) return '0 0% 0%'

  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  const l = (max + min) / 2

  let s = 0
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    switch (max) {
      case r:
        h = ((g - b) / delta) % 6
        break
      case g:
        h = (b - r) / delta + 2
        break
      default:
        h = (r - g) / delta + 4
        break
    }
    h = h * 60
    if (h < 0) h += 360
  }

  const hh = clamp(h, 0, 360)
  const ss = clamp(s * 100, 0, 100)
  const ll = clamp(l * 100, 0, 100)

  return `${hh.toFixed(1)} ${ss.toFixed(1)}% ${ll.toFixed(1)}%`
}


