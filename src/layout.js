import { TEXT_AREA } from './hex.js'

// Compute wrapped lines using opentype.js font metrics for consistency
// between preview and export.
export function computeLines(font, text, fontSize) {
  const maxWidth = TEXT_AREA.width
  const rawLines = text.split('\n')
  const result = []

  for (const raw of rawLines) {
    if (!raw.trim()) {
      result.push('')
      continue
    }
    const words = raw.split(' ')
    let current = ''
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word
      if (font.getAdvanceWidth(candidate, fontSize) > maxWidth && current) {
        result.push(current)
        current = word
      } else {
        current = candidate
      }
    }
    if (current) result.push(current)
  }

  return result
}

// Compute Y positions for each line, vertically centered in the text area.
export function computeLinePositions(lines, fontSize, lineHeight) {
  const lineHeightPx = fontSize * lineHeight
  const totalHeight = lines.length * lineHeightPx
  // SVG text y = baseline. Offset by ~0.75em from top of line.
  const baselineOffset = fontSize * 0.75
  const startY = TEXT_AREA.cy - totalHeight / 2 + baselineOffset

  return lines.map((_, i) => startY + i * lineHeightPx)
}

// X position for a line given alignment.
export function lineX(align) {
  if (align === 'start') return TEXT_AREA.left
  if (align === 'end') return TEXT_AREA.left + TEXT_AREA.width
  return TEXT_AREA.cx
}

export function isOverflowing(lines, fontSize, lineHeight) {
  return lines.length * fontSize * lineHeight > TEXT_AREA.height
}
