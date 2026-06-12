import { fitGraphTitles } from '@rolebase/graph/server'
import fs from 'fs'
import puppeteer, { Browser } from 'puppeteer-core'

// Common Chromium/Chrome paths (Docker image installs Chromium via apk)
const chromiumPaths = [
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
]

function getChromiumPath(): string {
  const envPath =
    process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH
  if (envPath) return envPath
  const path = chromiumPaths.find((p) => fs.existsSync(p))
  if (!path) {
    throw new Error(
      'Chromium not found. Set PUPPETEER_EXECUTABLE_PATH or install Chromium.'
    )
  }
  return path
}

let browserPromise: Promise<Browser> | undefined

async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      executablePath: getChromiumPath(),
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    })
    // Reset on launch failure so next call retries
    browserPromise.catch(() => {
      browserPromise = undefined
    })
  }
  const browser = await browserPromise
  if (!browser.connected) {
    browserPromise = undefined
    return getBrowser()
  }
  return browser
}

// Render an HTML page in a headless browser and screenshot it as PNG
// (transparent background when the page background is transparent)
export async function screenshotHtml(
  html: string,
  width: number,
  height: number
): Promise<Buffer> {
  const browser = await getBrowser()
  const page = await browser.newPage()

  try {
    await page.setViewport({ width, height })
    await page.setContent(html, { waitUntil: 'load', timeout: 30000 })
    // Wait for fonts and background images (avatars) to load
    await page.evaluate(async () => {
      await document.fonts.ready
      const urls = new Set<string>()
      document
        .querySelectorAll<HTMLElement>('.member, .circle-leader')
        .forEach((element) => {
          const background = getComputedStyle(element).backgroundImage
          const match = background?.match(/url\("?([^")]+)"?\)/)
          if (match) urls.add(match[1])
        })
      await Promise.all(
        Array.from(urls).map(
          (url) =>
            new Promise((resolve) => {
              const img = new Image()
              img.onload = img.onerror = () => resolve(undefined)
              img.src = url
            })
        )
      )
    })
    // Fit circles titles (needs DOM measures)
    await page.evaluate(fitGraphTitles)

    const screenshot = await page.screenshot({
      type: 'png',
      omitBackground: true,
      clip: { x: 0, y: 0, width, height },
    })
    return Buffer.from(screenshot)
  } finally {
    await page.close()
  }
}
