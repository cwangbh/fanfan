// Draws the app icon (a rice bowl with chopsticks) as PNGs without any image libraries.
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const BG = [47, 125, 79]
const FG = [255, 255, 255]
const STICK = [233, 196, 106]

function crc32(buf: Buffer) {
  let c = ~0
  for (const b of buf) {
    c ^= b
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}

function chunk(type: string, data: Buffer) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}

/** Colour at (x, y) in a 0..1 square. */
function shade(x: number, y: number): number[] {
  const distToSegment = (ax: number, ay: number, bx: number, by: number) => {
    const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2)))
    return Math.hypot(x - (ax + t * (bx - ax)), y - (ay + t * (by - ay)))
  }
  // Chopsticks behind the bowl
  if (distToSegment(0.62, 0.16, 0.42, 0.56) < 0.028 || distToSegment(0.74, 0.2, 0.5, 0.56) < 0.028) return STICK
  // Rice mound
  if (Math.hypot((x - 0.5) / 0.27, (y - 0.53) / 0.14) < 1 && y < 0.56) return FG
  // Bowl: lower half of an ellipse, plus a foot
  const inBowl = y >= 0.55 && Math.hypot((x - 0.5) / 0.33, (y - 0.55) / 0.25) < 1
  const inFoot = y >= 0.78 && y <= 0.84 && Math.abs(x - 0.5) < 0.12
  if (inBowl || inFoot) return FG
  return BG
}

function png(size: number) {
  const ss = 4
  const raw = Buffer.alloc((size * 3 + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0
    for (let x = 0; x < size; x++) {
      const acc = [0, 0, 0]
      for (let sy = 0; sy < ss; sy++)
        for (let sx = 0; sx < ss; sx++) {
          const c = shade((x + (sx + 0.5) / ss) / size, (y + (sy + 0.5) / ss) / size)
          for (let i = 0; i < 3; i++) acc[i] += c[i]
        }
      for (let i = 0; i < 3; i++) raw[y * (size * 3 + 1) + 1 + x * 3 + i] = Math.round(acc[i] / (ss * ss))
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

for (const [name, size] of [['pwa-192.png', 192], ['pwa-512.png', 512], ['apple-touch-icon.png', 180]] as const) {
  writeFileSync(`public/${name}`, png(size))
  console.log(`public/${name}`)
}
