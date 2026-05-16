// Hexagon path derived from assets/shape.svg with all transforms applied.
// Original: matrix(0.70229616,0,0,0.70229616,15.850245,15.584179) on the path,
// plus translate(-2.9994838,-7.4329502) on the layer → combined tx=12.851, ty=8.151.
// SVG coordinate space matches the original viewBox: 94.510216 × 83.673889 mm.

export const SVG_WIDTH = 94.510216
export const SVG_HEIGHT = 83.673889
export const SVG_VIEWBOX = `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`

export const HEX_PATH =
  'M 68.487,78.620 ' +
  'c -1.839,1.062 -40.640,1.062 -42.479,0 ' +
  'c -1.839,-1.062 -21.244,-34.667 -21.244,-36.788 ' +
  'c 0,-2.124 19.405,-35.739 21.245,-36.788 ' +
  'c 1.839,-1.062 40.640,-1.062 42.479,0 ' +
  'c 1.839,1.062 21.244,34.667 21.244,36.788 ' +
  'c 0,2.124 -19.405,35.739 -21.243,36.788 z'

// Center of the hexagon in SVG coordinates
export const HEX_CX = 47.247
export const HEX_CY = 41.832

// Design colors
export const COLOR_SHAPE = '#c9a87c'   // light brown — hex fill
export const COLOR_TEXT  = '#3a1f0a'   // dark brown  — engraved text

// Safe inscribed text area (centered rectangle with comfortable margin from hex edges)
export const TEXT_AREA = {
  cx: 47.247,
  cy: 41.832,
  width: 65,
  height: 50,
  get left() { return this.cx - this.width / 2 },
  get top() { return this.cy - this.height / 2 },
}
