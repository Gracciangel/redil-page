import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const source = fileURLToPath(new URL('../src/assets/brand-mark.png', import.meta.url))
const iconsDir = fileURLToPath(new URL('../public/icons/', import.meta.url))
const appleIcon = fileURLToPath(new URL('../public/apple-touch-icon.png', import.meta.url))

await mkdir(iconsDir, { recursive: true })

await sharp(source).resize(192, 192).png().toFile(`${iconsDir}icon-192.png`)
await sharp(source).resize(512, 512).png().toFile(`${iconsDir}icon-512.png`)
await sharp(source).resize(180, 180).png().toFile(appleIcon)

// Maskable: el logo queda dentro del "safe zone" (80% del ícono) sobre fondo negro.
const inner = await sharp(source).resize(340, 340).png().toBuffer()
await sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 1 },
  },
})
  .composite([{ input: inner, gravity: 'center' }])
  .png()
  .toFile(`${iconsDir}maskable-512.png`)

console.log(`Iconos generados desde ${source} en ${root}`)
