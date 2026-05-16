import { HEX_PATH, SVG_VIEWBOX } from './hex.js'
import { computeLines, computeLinePositions, lineX, isOverflowing } from './layout.js'

const NS = 'http://www.w3.org/2000/svg'

export function createPreviewSVG() {
  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('viewBox', SVG_VIEWBOX)
  svg.style.cssText = 'width:100%;height:100%;display:block;'

  const hexPath = document.createElementNS(NS, 'path')
  hexPath.setAttribute('d', HEX_PATH)
  hexPath.setAttribute('fill', 'none')
  hexPath.setAttribute('stroke', '#111')
  hexPath.setAttribute('stroke-width', '0.4')
  svg.appendChild(hexPath)

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
    el.setAttribute('fill', '#1a1a1a')
    el.textContent = lines[i]
    group.appendChild(el)
  }

  return { overflows: isOverflowing(lines, fontSize, lineHeight) }
}
