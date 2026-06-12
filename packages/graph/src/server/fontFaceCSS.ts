import fs from 'fs'
import path from 'path'

const fontsDir = path.join(__dirname, '../../assets/fonts')

function fontDataUrl(filename: string): string {
  const data = fs.readFileSync(path.join(fontsDir, filename))
  return `data:font/woff2;base64,${data.toString('base64')}`
}

let cache: string | undefined

// @font-face CSS with embedded fonts, for server-side rendering of the graph
// (no external requests needed in the headless browser)
export function getGraphFontFaceCSS(): string {
  if (cache) return cache
  cache = `
@font-face {
  font-family: 'basier_circle';
  src: url('${fontDataUrl(
    'basiercircle-regular-webfont.woff2'
  )}') format('woff2');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'basier_circle';
  src: url('${fontDataUrl(
    'basiercircle-semibold-webfont.woff2'
  )}') format('woff2');
  font-weight: 700;
  font-style: normal;
}
`
  return cache
}
