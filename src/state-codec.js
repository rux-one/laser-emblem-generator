// Binary encoding: 3-byte fixed header + UTF-8 text → base64url
//
// Byte 0: fontIndex (bits 0-3) | weightIndex (bit 4)
// Byte 1: fontSizeIndex = round((fontSize - 2) / 0.5)   → 0-36
// Byte 2: alignIndex (bits 0-1) | lineHeightIndex << 2  → lhIdx 0-22
// Bytes 3+: text as UTF-8

const ALIGN_MAP = ['middle', 'start', 'end']

export function encodeState({ fontIndex, weightIndex, fontSize, align, lineHeight, text }) {
  const b0 = (fontIndex & 0x0F) | ((weightIndex & 0x01) << 4)
  const b1 = Math.round((fontSize - 2) / 0.5) & 0xFF
  const b2 = (ALIGN_MAP.indexOf(align) & 0x03) | ((Math.round((lineHeight - 0.8) / 0.1) & 0x3F) << 2)

  const textBytes = new TextEncoder().encode(text)
  const buf = new Uint8Array(3 + textBytes.length)
  buf[0] = b0; buf[1] = b1; buf[2] = b2
  buf.set(textBytes, 3)

  return btoa(String.fromCharCode(...buf))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function decodeState(hash) {
  try {
    const pad = hash.replace(/-/g, '+').replace(/_/g, '/')
    const padded = pad + '=='.slice(0, (4 - pad.length % 4) % 4)
    const buf = Uint8Array.from(atob(padded), c => c.charCodeAt(0))
    if (buf.length < 3) return null

    const fontIndex    = buf[0] & 0x0F
    const weightIndex  = (buf[0] >> 4) & 0x01
    const fontSize     = 2 + (buf[1] & 0xFF) * 0.5
    const alignIdx     = buf[2] & 0x03
    const lineHeight   = parseFloat((0.8 + ((buf[2] >> 2) & 0x3F) * 0.1).toFixed(1))
    const align        = ALIGN_MAP[alignIdx] ?? 'middle'
    const text         = new TextDecoder().decode(buf.slice(3))

    return { fontIndex, weightIndex, fontSize, align, lineHeight, text }
  } catch {
    return null
  }
}
