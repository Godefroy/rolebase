import type { AstroIntegration } from 'astro'
import { readFileSync, writeFileSync } from 'fs'
import { join, relative } from 'path'
import { fileURLToPath } from 'url'
import { globSync } from 'glob'
import TurndownService from 'turndown'

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
})
turndown.remove([
  'svg' as any,
  'video',
  'picture',
  'script',
  'style',
  'noscript',
  'iframe',
  'button',
])

// Page chrome inside <main> (docs sidebar, table of contents, breadcrumb,
// previous/next links) is a `nav`, alone or in an `aside`. An `aside` without
// a `nav` is content (key takeaways, call to action) and stays.
turndown.remove(
  (node) =>
    node.nodeName === 'NAV' ||
    (node.nodeName === 'ASIDE' && !!node.querySelector('nav'))
)

// Fence long enough to wrap code that itself contains backtick fences.
function fence(code: string, lang: string): string {
  const longest = Math.max(
    2,
    ...(code.match(/`{3,}/g) ?? []).map((run) => run.length)
  )
  const marks = '`'.repeat(longest + 1)
  return `\n\n${marks}${lang}\n${code}\n${marks}\n\n`
}

// Expressive Code renders one `<div class="ec-line">` per line, which Turndown
// would flatten into a single paragraph. Rebuild the fenced block, with the
// frame's file name as a lead line.
turndown.addRule('expressiveCode', {
  filter: (node) =>
    node.nodeName === 'DIV' && node.classList.contains('expressive-code'),
  replacement: (_content, node) => {
    const element = node as HTMLElement
    const pre = element.querySelector('pre')
    if (!pre) return ''
    const lines = Array.from(pre.querySelectorAll('.ec-line')).map((line) =>
      (line.querySelector('.code') ?? line).textContent!.replace(/\n$/, '')
    )
    const lang = pre.getAttribute('data-language') ?? ''
    const title = element.querySelector('figcaption .title')?.textContent
    const code = fence(lines.join('\n'), lang === 'plaintext' ? '' : lang)
    return title ? `\n\n\`${title}\`${code}` : code
  },
})

// Mermaid diagrams stay as source, rendered in the browser by the site.
turndown.addRule('mermaid', {
  filter: (node) =>
    node.nodeName === 'PRE' && node.classList.contains('mermaid'),
  replacement: (_content, node) =>
    fence(node.textContent!.replace(/\n$/, ''), 'mermaid'),
})

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

/**
 * Astro integration that generates .md files from rendered HTML pages.
 * Extracts title and description from <head>, content from <main>.
 */
export default function enrichMd(): AstroIntegration {
  let siteUrl = ''
  return {
    name: 'enrich-md',
    hooks: {
      'astro:config:done': ({ config }) => {
        siteUrl = config.site?.replace(/\/$/, '') || ''
      },
      'astro:build:done': ({ dir }) => {
        const distDir = fileURLToPath(dir)
        const htmlFiles = globSync('**/*.html', { cwd: distDir })

        let generated = 0
        const mdPages: Array<{ urlPath: string; mdUrlPath: string }> = []

        for (const htmlFile of htmlFiles) {
          const htmlPath = join(distDir, htmlFile)
          const html = readFileSync(htmlPath, 'utf-8')

          // Skip redirect pages (no <main>)
          const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)
          if (!mainMatch) continue

          // Extract metadata from <head>
          // The 404 pages are no content.
          if (/(^|\/)404\.html$/.test(htmlFile)) continue

          const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/)
          const descMatch = html.match(
            /<meta\s+name="description"\s+content="([^"]*)"/
          )
          const title = titleMatch?.[1]?.trim()
          if (!title) continue
          const description = descMatch?.[1]
            ? decodeHtmlEntities(descMatch[1])
            : undefined

          // Convert body
          const body = turndown.turndown(mainMatch[1]).trim()
          if (!body) continue

          // Build URL from file path
          const slug = relative(distDir, htmlPath)
            .replace(/\.html$/, '')
            .replace(/(^|\/)index$/, '')
          const url = slug ? `${siteUrl}/${slug}` : `${siteUrl}/`

          // Build frontmatter
          const fm = [
            '---',
            `title: ${JSON.stringify(decodeHtmlEntities(title))}`,
            ...(description
              ? [`description: ${JSON.stringify(description)}`]
              : []),
            `url: ${JSON.stringify(url)}`,
            '---',
          ].join('\n')

          const mdPath = htmlPath.replace(/\.html$/, '.md')
          writeFileSync(mdPath, `${fm}\n\n${body}\n`)
          generated++

          const urlPath = slug ? `/${slug}` : '/'
          const mdUrlPath = slug ? `/${slug}.md` : '/index.md'
          mdPages.push({ urlPath, mdUrlPath })
        }

        // _headers: advertise the .md alternate for each HTML page and serve
        // .md files with the correct content type. Cloudflare reads at most 100
        // rules, so the pages of a folder share one splat rule (every page there
        // has its .md, only redirect stubs don't and they never render).
        // `public/_headers` is copied into dist before this runs, and the write
        // below replaces it, so its rules are carried over first.
        let staticHeaders = ''
        try {
          staticHeaders = `${readFileSync(join(distDir, '_headers'), 'utf-8').trim()}\n\n`
        } catch {
          // No static _headers, nothing to carry over.
        }
        const alternate = (path: string) =>
          `  Link: <${path}>; rel="alternate"; type="text/markdown"`
        const sections: string[] = []
        const folders = new Set<string>()
        for (const { urlPath, mdUrlPath } of mdPages) {
          const folder = urlPath.match(/^\/([^/]+)\/./)?.[1]
          if (folder) folders.add(folder)
          else sections.push(`${urlPath}\n${alternate(mdUrlPath)}`)
        }
        for (const folder of [...folders].sort()) {
          sections.push(`/${folder}/*\n${alternate(`/${folder}/:splat.md`)}`)
        }
        // Last, so it also strips the Link a folder rule gives its .md files.
        sections.push(
          '/*.md\n  ! Link\n  Content-Type: text/markdown; charset=utf-8'
        )
        writeFileSync(
          join(distDir, '_headers'),
          `${staticHeaders}${sections.join('\n\n')}\n`
        )

        console.log(
          `Generated ${generated} .md files and _headers with ${sections.length} rules`
        )
      },
    },
  }
}
