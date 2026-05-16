import { FONTS, loadOpentypeFont } from './fonts.js'
import { createPreviewSVG, renderPreview } from './preview.js'
import { generateSVG } from './export.js'
import { encodeState, decodeState } from './state-codec.js'

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

function populateWeightSelect(preserveIndex = false) {
  const sel = document.getElementById('weight-select')
  sel.innerHTML = ''
  currentFontDef().weights.forEach((w, i) => {
    const opt = document.createElement('option')
    opt.value = i
    opt.textContent = w.label
    sel.appendChild(opt)
  })
  if (!preserveIndex) state.weightIndex = 0
  sel.value = state.weightIndex
}

// Sync all form controls to current state (used when loading from URL hash)
function syncControlsToState() {
  document.getElementById('text-input').value = state.text
  document.getElementById('font-select').value = state.fontIndex
  populateWeightSelect(true)
  document.getElementById('size-input').value = state.fontSize
  document.getElementById('size-output').value = state.fontSize
  document.getElementById('align-select').value = state.align
  document.getElementById('lh-input').value = state.lineHeight
  document.getElementById('lh-output').value = state.lineHeight
}

let svg

async function loadFontAndUpdate() {
  const downloadBtn = document.getElementById('download-btn')
  const shareBtn = document.getElementById('share-btn')
  downloadBtn.disabled = true
  shareBtn.disabled = true
  try {
    state.font = await loadOpentypeFont(currentWeight().url)
    update()
  } finally {
    downloadBtn.disabled = false
    shareBtn.disabled = false
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

  const encoded = encodeState(state)
  history.replaceState(null, '', '#' + encoded)
  const urlInput = document.getElementById('share-url')
  if (urlInput) urlInput.value = location.href
}

;(async function init() {
  await document.fonts.ready

  const container = document.getElementById('svg-container')
  container.innerHTML = ''
  svg = createPreviewSVG()
  container.appendChild(svg)

  populateFontSelect()
  populateWeightSelect()

  // Restore state from URL hash if present
  const hash = location.hash.slice(1)
  if (hash) {
    const saved = decodeState(hash)
    if (saved) {
      state.text        = saved.text
      state.fontIndex   = Math.min(saved.fontIndex, FONTS.length - 1)
      state.fontSize    = saved.fontSize
      state.align       = saved.align
      state.lineHeight  = saved.lineHeight
      // Clamp weightIndex to available weights for the font
      state.weightIndex = Math.min(saved.weightIndex, currentFontDef().weights.length - 1)
      syncControlsToState()
    }
  }

  // ── Controls ──────────────────────────────────────────────

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

  // ── Download ──────────────────────────────────────────────

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

  // ── Share ─────────────────────────────────────────────────

  document.getElementById('share-btn').addEventListener('click', () => {
    const panel = document.getElementById('share-panel')
    panel.classList.remove('hidden')
    const input = document.getElementById('share-url')
    input.select()
  })

  document.getElementById('copy-btn').addEventListener('click', async () => {
    const input = document.getElementById('share-url')
    try {
      await navigator.clipboard.writeText(input.value)
    } catch {
      input.select()
      document.execCommand('copy')
    }
    const btn = document.getElementById('copy-btn')
    btn.classList.add('copied')
    setTimeout(() => btn.classList.remove('copied'), 1500)
  })

  await loadFontAndUpdate()
})()
