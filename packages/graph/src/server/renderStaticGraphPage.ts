import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import StaticCirclesGraph, {
  StaticCirclesGraphProps,
} from '../static/StaticCirclesGraph'
import { getGraphFontFaceCSS } from './fontFaceCSS'

export interface RenderStaticGraphPageOptions {
  // CSS background of the page (default: transparent)
  background?: string
}

// Render a full standalone HTML page containing the static graph.
// Load it in a headless browser, wait for fonts and images, run
// fitGraphTitles(), then screenshot it to get an image of the org chart.
export function renderStaticGraphPage(
  props: StaticCirclesGraphProps,
  options: RenderStaticGraphPageOptions = {}
): string {
  const markup = renderToStaticMarkup(
    React.createElement(StaticCirclesGraph, props)
  )

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
${getGraphFontFaceCSS()}
html, body {
  margin: 0;
  padding: 0;
  background: ${options.background || 'transparent'};
}
</style>
</head>
<body>${markup}</body>
</html>`
}
