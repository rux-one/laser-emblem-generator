import { HEX_PATH, HEX_CX, HEX_CY, SVG_VIEWBOX, COLOR_SHAPE, COLOR_TEXT } from './hex.js'
import { computeLines, computeLinePositions, lineX, isOverflowing } from './layout.js'

const NS = 'http://www.w3.org/2000/svg'

// Scale hex path around its center to produce an inset decorative outline
const INSET_SCALE = 0.91
const INSET_TRANSFORM =
  `translate(${HEX_CX},${HEX_CY}) scale(${INSET_SCALE}) translate(${-HEX_CX},${-HEX_CY})`

export function createPreviewSVG() {
  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('viewBox', SVG_VIEWBOX)
  svg.style.cssText = 'width:100%;height:100%;display:block;'

  // Hex fill
  const hexFill = document.createElementNS(NS, 'path')
  hexFill.setAttribute('d', HEX_PATH)
  hexFill.setAttribute('fill', COLOR_SHAPE)
  hexFill.setAttribute('stroke', 'none')
  svg.appendChild(hexFill)

  // Inset outline
  const inset = document.createElementNS(NS, 'path')
  inset.setAttribute('d', HEX_PATH)
  inset.setAttribute('fill', 'none')
  inset.setAttribute('stroke', COLOR_TEXT)
  inset.setAttribute('stroke-width', '0.5')
  inset.setAttribute('transform', INSET_TRANSFORM)
  svg.appendChild(inset)

  const textGroup = document.createElementNS(NS, 'g')
  textGroup.id = 'preview-text'
  svg.appendChild(textGroup)

  return svg
}

export function renderPreview(svg, state) {
  const { font, text, fontFamily, fontWeight, fontSize, align, lineHeight } = state
  const group = svg.getElementById('preview-text')
  group.innerHTML = ''

  const lines = computeLines(font, text, fontSize)
  const yPositions = computeLinePositions(lines, fontSize, lineHeight)
  const x = lineX(align)
  const anchor = align === 'start' ? 'start' : align === 'end' ? 'end' : 'middle'

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue
    const el = document.createElementNS(NS, 'text')
    el.setAttribute('x', x)
    el.setAttribute('y', yPositions[i])
    el.setAttribute('text-anchor', anchor)
    el.setAttribute('font-family', `'${fontFamily}', sans-serif`)
    el.setAttribute('font-weight', fontWeight)
    el.setAttribute('font-size', fontSize)
    el.setAttribute('fill', COLOR_TEXT)
    el.textContent = lines[i]
    group.appendChild(el)
  }

  return { overflows: isOverflowing(lines, fontSize, lineHeight) }
}
