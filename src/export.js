import { HEX_PATH, HEX_CX, HEX_CY, SVG_WIDTH, SVG_HEIGHT, SVG_VIEWBOX, TEXT_AREA, COLOR_SHAPE, COLOR_TEXT } from './hex.js'
import { computeLines, computeLinePositions, lineX } from './layout.js'

const INSET_SCALE = 0.91
const INSET_TRANSFORM =
  `translate(${HEX_CX},${HEX_CY}) scale(${INSET_SCALE}) translate(${-HEX_CX},${-HEX_CY})`

export function generateSVG(font, state) {
  const { text, fontFamily, fontWeight, fontSize, align, lineHeight } = state

  const lines = computeLines(font, text, fontSize)
  const yPositions = computeLinePositions(lines, fontSize, lineHeight)
  const x = lineX(align)

  const pathDatas = []
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue

    const lineWidth = font.getAdvanceWidth(lines[i], fontSize)
    let lineStartX = x
    if (align === 'middle') lineStartX = x - lineWidth / 2
    if (align === 'end') lineStartX = x - lineWidth

    const path = font.getPath(lines[i], lineStartX, yPositions[i], fontSize)
    const d = path.toPathData(3)
    if (d) pathDatas.push(d)
  }

  const textD = pathDatas.join(' ')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="${SVG_VIEWBOX}"
     width="${SVG_WIDTH}mm"
     height="${SVG_HEIGHT}mm">
  <path d="${HEX_PATH}" fill="${COLOR_SHAPE}" stroke="none"/>
  <path d="${HEX_PATH}" fill="none" stroke="${COLOR_TEXT}" stroke-width="0.5"
        transform="${INSET_TRANSFORM}"/>
  <path d="${textD}" fill="${COLOR_TEXT}"/>
</svg>`
}
