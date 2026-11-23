import { oembedPath, share } from './share'
// Every file of the website under /en and /fr, written by scripts/build-site.sh.
import websitePaths from './website-paths.generated.json'

const website = new Set<string>(websitePaths)

interface Env {
  ASSETS: Fetcher
}

/**
 * Only the paths of `run_worker_first` in `wrangler.jsonc` reach this Worker.
 * Everything else is served from the assets: the website's pages as files, and
 * any other navigation as the webapp (`not_found_handling`), whose routes start
 * with an organization slug and can't be listed.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // The root is the website, in the visitor's language (French gets `/fr`,
    // everyone else `/en`), rather than the webapp's index.html.
    if (url.pathname === '/') {
      const first = (request.headers.get('Accept-Language') ?? '').trim().toLowerCase()
      url.pathname = first.startsWith('fr') ? '/fr' : '/en'
      return new Response(null, {
        status: 302,
        headers: { Location: url.toString(), Vary: 'Accept-Language' },
      })
    }

    if (url.pathname === '/share' || url.pathname === '/share/' || url.pathname === oembedPath) {
      return share(request, env.ASSETS)
    }

    // Website pages: a missing one gets the website's 404, not the webapp
    // (the assets would answer it, as for any path without a file). A trailing
    // slash is left to the assets, which redirect it to the page.
    if (/^\/(en|fr)\//.test(url.pathname) && !url.pathname.endsWith('/')) {
      const path = decodeURI(url.pathname).replace(/\.html$/, '')
      if (!website.has(path)) {
        const notFound = await env.ASSETS.fetch(new Request(new URL('/404', url)))
        return new Response(notFound.body, { status: 404, headers: notFound.headers })
      }
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
