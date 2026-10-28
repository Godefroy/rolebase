import { fitGraphTitles } from '@rolebase/graph/server'
import fs from 'fs'
import puppeteer, { Browser, Page } from 'puppeteer-core'

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

// Close Chromium when idle to free its memory between exports
const browserIdleTimeout = 60 * 1000

let browserPromise: Promise<Browser> | undefined
let activeScreenshots = 0
let idleTimer: NodeJS.Timeout | undefined

function scheduleBrowserClose() {
  clearTimeout(idleTimer)
  idleTimer = setTimeout(async () => {
    if (activeScreenshots > 0 || !browserPromise) return
    const promise = browserPromise
    browserPromise = undefined
    try {
      const browser = await promise
      await browser.close()
    } catch (error) {
      console.error('Failed to close Chromium', error)
    }
  }, browserIdleTimeout)
}

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
  clearTimeout(idleTimer)
  activeScreenshots++
  try {
    const browser = await getBrowser()
    const page = await browser.newPage()
    try {
      return await renderScreenshot(page, html, width, height)
    } finally {
      await page.close()
    }
  } finally {
    activeScreenshots--
    if (activeScreenshots === 0) scheduleBrowserClose()
  }
}

async function renderScreenshot(
  page: Page,
  html: string,
  width: number,
  height: number
): Promise<Buffer> {
  await page.setViewport({ width, height })
  await page.setContent(html, { waitUntil: 'load', timeout: 30000 })
  // Wait for fonts and avatar images to load.
  // Avatars are rendered as <img> elements (member-image / circle-leader-image),
  // so wait for each to finish loading before screenshotting.
  await page.evaluate(async () => {
    await document.fonts.ready
    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>(
        '.member-image, .circle-leader-image'
      )
    )
    await Promise.all(
      images.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.onload = img.onerror = () => resolve(undefined)
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
}
