import { FONTS, loadOpentypeFont } from './fonts.js'
import { createPreviewSVG, renderPreview } from './preview.js'
import { generateSVG } from './export.js'

const state = {
  text: 'EMBLEM',
  fontIndex: 0,
  weightIndex: 0,
  fontSize: 8,
  align: 'middle',
  lineHeight: 1.2,
  font: null,
}

function currentFontDef() { return FONTS[state.fontIndex] }
function currentWeight() { return currentFontDef().weights[state.weightIndex] }

function populateFontSelect() {
  const sel = document.getElementById('font-select')
  FONTS.forEach((f, i) => {
    const opt = document.createElement('option')
    opt.value = i
    opt.textContent = f.label
    sel.appendChild(opt)
  })
}

function populateWeightSelect() {
  const sel = document.getElementById('weight-select')
  sel.innerHTML = ''
  currentFontDef().weights.forEach((w, i) => {
    const opt = document.createElement('option')
    opt.value = i
    opt.textContent = w.label
    sel.appendChild(opt)
  })
  state.weightIndex = 0
}

let svg

async function loadFontAndUpdate() {
  const btn = document.getElementById('download-btn')
  btn.disabled = true
  try {
    state.font = await loadOpentypeFont(currentWeight().url)
    update()
  } finally {
    btn.disabled = false
  }
}

function update() {
  if (!state.font) return
  const { overflows } = renderPreview(svg, {
    ...state,
    fontFamily: currentFontDef().family,
    fontWeight: currentWeight().value,
  })
  document.getElementById('overflow-warning').classList.toggle('hidden', !overflows)
}

;(async function init() {
  await document.fonts.ready

  const container = document.getElementById('svg-container')
  container.innerHTML = ''
  svg = createPreviewSVG()
  container.appendChild(svg)

  populateFontSelect()
  populateWeightSelect()

  document.getElementById('text-input').addEventListener('input', e => {
    state.text = e.target.value
    update()
  })

  document.getElementById('font-select').addEventListener('change', e => {
    state.fontIndex = parseInt(e.target.value)
    populateWeightSelect()
    loadFontAndUpdate()
  })

  document.getElementById('weight-select').addEventListener('change', e => {
    state.weightIndex = parseInt(e.target.value)
    loadFontAndUpdate()
  })

  document.getElementById('size-input').addEventListener('input', e => {
    state.fontSize = parseFloat(e.target.value)
    document.getElementById('size-output').value = state.fontSize
    update()
  })

  document.getElementById('align-select').addEventListener('change', e => {
    state.align = e.target.value
    update()
  })

  document.getElementById('lh-input').addEventListener('input', e => {
    state.lineHeight = parseFloat(e.target.value)
    document.getElementById('lh-output').value = state.lineHeight
    update()
  })

  document.getElementById('download-btn').addEventListener('click', async () => {
    const btn = document.getElementById('download-btn')
    btn.disabled = true
    btn.textContent = 'Generating…'
    try {
      const font = await loadOpentypeFont(currentWeight().url)
      const svgStr = generateSVG(font, {
        ...state,
        fontFamily: currentFontDef().family,
        fontWeight: currentWeight().value,
      })
      const blob = new Blob([svgStr], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'emblem.svg'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      btn.disabled = false
      btn.textContent = 'Download SVG'
    }
  })

  await loadFontAndUpdate()
})()
