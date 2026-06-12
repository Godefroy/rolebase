// Fit circles titles to their circle, in a static render.
// Self-contained: can be serialized and evaluated in a headless browser
// (e.g. page.evaluate(fitGraphTitles) with Puppeteer).
// Must be run after fonts are loaded (await document.fonts.ready).
export function fitGraphTitles() {
  // Keep in sync with settings.titles
  const baseSize = 500
  const centerCoverage = 0.9

  document
    .querySelectorAll<HTMLElement>('.circle-title-center[data-fit]')
    .forEach((element) => {
      const width = element.offsetWidth
      if (width > 0) {
        element.style.transform = `scale(${
          (baseSize * centerCoverage) / width
        })`
      }
    })
}
