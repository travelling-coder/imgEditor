class ColorConverter {
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const sanitizedHex = hex.replace(/^#/, '')

    if (!/^[0-9A-Fa-f]{6}$/.test(sanitizedHex)) {
      return null
    }

    const r = parseInt(sanitizedHex.substring(0, 2), 16)
    const g = parseInt(sanitizedHex.substring(2, 4), 16)
    const b = parseInt(sanitizedHex.substring(4, 6), 16)

    return { r, g, b }
  }

  static rgbToHex(r: number, g: number, b: number): string | null {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      return null
    }

    const rHex = r.toString(16).padStart(2, '0')
    const gHex = g.toString(16).padStart(2, '0')
    const bHex = b.toString(16).padStart(2, '0')

    return `#${rHex}${gHex}${bHex}`
  }
}

export default ColorConverter
