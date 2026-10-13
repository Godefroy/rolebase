// oEmbed for the public org chart page (/share/), so that tools reading oEmbed
// (Iframely, hence Canva, Notion...) can embed a share link as an iframe.
//
// The share page is a static file while an oEmbed discovery link carries the
// address of the page it describes, query included. It is therefore added here,
// per request, and the endpoint it points to is served here as well.
// https://oembed.com

interface Context {
  next: () => Promise<Response>
}

const sharePath = /^\/share\/?$/
const oembedPath = '/share/oembed'

// Size of the iframe when the consumer sets no limit
const defaultWidth = 1200
const defaultHeight = 800

export default async function share(request: Request, context: Context) {
  const url = new URL(request.url)

  if (url.pathname === oembedPath) {
    return getOembed(url)
  }

  const response = await context.next()
  const isHtml = response.headers.get('content-type')?.includes('text/html')
  if (
    !sharePath.test(url.pathname) ||
    !url.searchParams.get('orgId') ||
    !isHtml
  ) {
    return response
  }

  const oembedUrl = `${url.origin}${oembedPath}?url=${encodeURIComponent(
    url.href
  )}&format=json`
  const link = `<link rel="alternate" type="application/json+oembed" href="${escapeHtml(
    oembedUrl
  )}" title="Rolebase" />`

  const html = await response.text()
  const headers = new Headers(response.headers)
  headers.delete('content-length')
  headers.delete('etag')
  return new Response(html.replace('</head>', `  ${link}\n  </head>`), {
    status: response.status,
    headers,
  })
}

function getOembed(url: URL) {
  const format = url.searchParams.get('format')
  if (format && format !== 'json') {
    return new Response('Not Implemented', { status: 501 })
  }

  // Only describe share pages of this site
  const shareUrl = parseUrl(url.searchParams.get('url'))
  if (
    !shareUrl ||
    shareUrl.origin !== url.origin ||
    !sharePath.test(shareUrl.pathname) ||
    !shareUrl.searchParams.get('orgId')
  ) {
    return new Response('Not Found', { status: 404 })
  }

  const width = getSize(url.searchParams.get('maxwidth'), defaultWidth)
  const height = getSize(url.searchParams.get('maxheight'), defaultHeight)

  return Response.json(
    {
      version: '1.0',
      type: 'rich',
      title: 'Rolebase',
      provider_name: 'Rolebase',
      provider_url: url.origin,
      width,
      height,
      html: `<iframe src="${escapeHtml(
        shareUrl.href
      )}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`,
    },
    { headers: { 'Access-Control-Allow-Origin': '*' } }
  )
}

function parseUrl(value: string | null) {
  try {
    return value ? new URL(value) : undefined
  } catch {
    return undefined
  }
}

function getSize(max: string | null, defaultSize: number) {
  const maxSize = Number(max)
  return maxSize > 0 ? Math.min(Math.floor(maxSize), defaultSize) : defaultSize
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export const config = {
  path: ['/share', '/share/', oembedPath],
}
