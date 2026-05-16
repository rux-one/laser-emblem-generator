import opentype from 'opentype.js'

// CSS imports for live preview rendering via @fontsource (latin subset only)
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/montserrat/latin-400.css'
import '@fontsource/montserrat/latin-700.css'
import '@fontsource/playfair-display/latin-400.css'
import '@fontsource/playfair-display/latin-700.css'
import '@fontsource/bebas-neue/latin-400.css'
import '@fontsource/cinzel/latin-400.css'
import '@fontsource/cinzel/latin-700.css'

// WOFF file URLs — bundled by Vite, parsed by opentype.js at export time
import interR from '@fontsource/inter/files/inter-latin-400-normal.woff?url'
import interB from '@fontsource/inter/files/inter-latin-700-normal.woff?url'
import montserratR from '@fontsource/montserrat/files/montserrat-latin-400-normal.woff?url'
import montserratB from '@fontsource/montserrat/files/montserrat-latin-700-normal.woff?url'
import playfairR from '@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff?url'
import playfairB from '@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff?url'
import bebasR from '@fontsource/bebas-neue/files/bebas-neue-latin-400-normal.woff?url'
import cinzelR from '@fontsource/cinzel/files/cinzel-latin-400-normal.woff?url'
import cinzelB from '@fontsource/cinzel/files/cinzel-latin-700-normal.woff?url'

export const FONTS = [
  {
    label: 'Inter',
    family: 'Inter',
    weights: [
      { label: 'Regular', value: 400, url: interR },
      { label: 'Bold', value: 700, url: interB },
    ],
  },
  {
    label: 'Montserrat',
    family: 'Montserrat',
    weights: [
      { label: 'Regular', value: 400, url: montserratR },
      { label: 'Bold', value: 700, url: montserratB },
    ],
  },
  {
    label: 'Playfair Display',
    family: 'Playfair Display',
    weights: [
      { label: 'Regular', value: 400, url: playfairR },
      { label: 'Bold', value: 700, url: playfairB },
    ],
  },
  {
    label: 'Bebas Neue',
    family: 'Bebas Neue',
    weights: [
      { label: 'Regular', value: 400, url: bebasR },
    ],
  },
  {
    label: 'Cinzel',
    family: 'Cinzel',
    weights: [
      { label: 'Regular', value: 400, url: cinzelR },
      { label: 'Bold', value: 700, url: cinzelB },
    ],
  },
]

const cache = new Map()

export async function loadOpentypeFont(woffUrl) {
  if (cache.has(woffUrl)) return cache.get(woffUrl)
  const buf = await fetch(woffUrl).then(r => r.arrayBuffer())
  const font = opentype.parse(buf)
  cache.set(woffUrl, font)
  return font
}
