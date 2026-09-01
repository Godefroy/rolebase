import fs from 'fs'
import path from 'path'
import type { PluginOption } from 'vite'

const ROUTES_DIR = path.resolve(__dirname, '../src/routes')

// Segments the Umami URL hook must leave alone. Anything else in first position
// is an org slug, replaced with `:slug` so the Pages report lists screens rather
// than one row per organization (see index.html).
//
// Collecting every `path=` in src/routes over-collects: it picks up nested
// routes (`roles`, `users`…) that are not top-level. That is the safe
// direction. The hook replaces a first segment only when it is *absent* from
// this list, so a superset can at worst leave an org slug unnormalised, while a
// missing entry would rewrite a real screen to `/:slug`.
export function readAppRootPaths(): string[] {
  const segments = fs
    .readdirSync(ROUTES_DIR)
    .filter((file) => file.endsWith('.tsx'))
    .flatMap((file) =>
      Array.from(
        fs
          .readFileSync(path.join(ROUTES_DIR, file), 'utf8')
          .matchAll(/path="([^"]+)"/g),
        (match) => match[1].split('/')[0]
      )
    )
    .filter((segment) => segment && segment !== '*' && !segment.startsWith(':'))

  const roots = [...new Set(segments)].sort()

  // The router moved or changed shape: fail the build rather than ship a hook
  // that renames real screens to `/:slug`.
  for (const expected of ['orgs', 'login', 'settings']) {
    if (!roots.includes(expected)) {
      throw new Error(
        `Umami app roots: "${expected}" not found in src/routes, the router shape changed`
      )
    }
  }

  return roots
}

// Injects the list into index.html, so adding a route never needs an edit there.
export default function umamiAppRoots(): PluginOption {
  return {
    name: 'rolebase-umami-app-roots',
    transformIndexHtml(html: string) {
      return html.replace(
        '__UMAMI_APP_ROOTS__',
        JSON.stringify(readAppRootPaths())
      )
    },
  }
}
