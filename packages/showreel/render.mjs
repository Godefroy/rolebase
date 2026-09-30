// Renders the reel with headless Chromium, then muxes it with the soundtrack.
//   node render.mjs                     full render to out/rolebase-reel.mp4
//   node render.mjs preview 1.2,7.5     single frames (seconds) to preview/
import { chromium } from '../../website/node_modules/playwright/index.mjs'
import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const dir = path.dirname(new URL(import.meta.url).pathname)
process.chdir(dir)
const FPS = 60, DUR = 24
const times = process.argv[2] === 'preview' ? process.argv[3].split(',').map(Number) : null
const frames = times ?? Array.from({ length: FPS * DUR }, (_, i) => i / FPS)
const outDir = times ? 'preview' : 'frames'

execFileSync('node', ['extract.mjs'], { stdio: 'inherit' })
fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(outDir, { recursive: true })

const WORKERS = times ? 1 : 8
const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] })
const t0 = Date.now()
async function worker(w) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  page.on('pageerror', e => console.log('pageerror:', e.message))
  await page.goto('file://' + dir + '/index.html')
  await page.waitForFunction(() => window.READY === true, null, { timeout: 20000 })
  for (let f = w; f < frames.length; f += WORKERS) {
    await page.evaluate(t => renderFrame(t), frames[f])
    const name = times ? `t${frames[f].toFixed(2)}.png` : `${String(f).padStart(5, '0')}.png`
    await page.screenshot({ path: `${outDir}/${name}` })
    if (!times && f % 120 === 0) console.log('frame', f, ((Date.now() - t0) / 1000).toFixed(0) + 's')
  }
}
await Promise.all(Array.from({ length: WORKERS }, (_, w) => worker(w)))
await browser.close()
console.log('frames done', ((Date.now() - t0) / 1000).toFixed(1) + 's')

if (!times) {
  execFileSync('node', ['synth.mjs'], { stdio: 'inherit' })
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', 'frames/%05d.png', '-i', 'out/audio.wav',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k',
    '-movflags', '+faststart', '-shortest', 'out/rolebase-reel.mp4'], { stdio: 'inherit' })
  console.log('out/rolebase-reel.mp4')
}
