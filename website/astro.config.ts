import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import mdx from '@astrojs/mdx'
import netlify from '@astrojs/netlify'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import svgr from 'vite-plugin-svgr'
import rehypeExternalLinks from 'rehype-external-links'
import { redirects } from './src/redirects'
import rehypeMdClass from './src/utils/rehype-md-class'
import { getExternalLinkRel } from './src/utils/external-links'
import enrichMd from './src/integrations/enrich-md'
import config from './website.config'

// The website is built in isolation (its own node_modules), so the reused
// org-chart code is pulled straight from the workspace TypeScript source via
// Vite aliases / tsconfig paths rather than through npm workspace links. The
// webapp components' runtime deps (Chakra, Apollo, Tiptap…) resolve from the
// repo-root node_modules, which is an ancestor of packages/webapp.
const sharedDir = fileURLToPath(new URL('../packages/shared', import.meta.url))
const graphEntry = fileURLToPath(
  new URL('../packages/graph/src/index.ts', import.meta.url)
)
const webappSrc = fileURLToPath(new URL('../packages/webapp/src', import.meta.url))

const { site, langs, defaultLang } = config

export default defineConfig({
  site,
  adapter: netlify({
    // Netlify's on-demand image service only exists on their production
    // runtime — `npm run dev` would get broken image URLs. Enable it only
    // when building for production.
    imageCDN: process.env.NODE_ENV === 'production',
    edgeMiddleware: false,
  }),
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  redirects,
  markdown: {
    rehypePlugins: [
      rehypeMdClass,
      [rehypeExternalLinks, { target: '_blank', rel: getExternalLinkRel }],
    ],
  },
  integrations: [
    mdx(),
    react(),
    sitemap({
      // Exclude root URL (redirects to /en/) to avoid duplicate hreflang entries
      filter: (page) => page !== `${site}/`,
      i18n: {
        defaultLocale: defaultLang,
        locales: Object.fromEntries(langs.map((l) => [l, l])),
      },
    }),
    enrichMd(),
  ],
  vite: {
    plugins: [
      // A few webapp components import SVGs as React components. Scope the
      // transform to webapp source so the website's own `.svg` asset imports
      // keep returning URLs/ImageMetadata.
      // Cast to any: vite-plugin-svgr is typed against a different Vite copy
      // than the one Astro bundles, so their PluginOption types diverge.
      svgr({
        exportAsDefault: true,
        include: '**/packages/webapp/**/*.svg',
      }) as any,
    ],
    resolve: {
      // Single instances across the island and the bundled workspace/webapp
      // source (these live in the repo-root node_modules, the island's React in
      // website/node_modules) — duplicates would break hooks/contexts/styling.
      dedupe: [
        'react',
        'react-dom',
        'react-router',
        'react-i18next',
        'i18next',
        '@emotion/react',
        '@emotion/styled',
        '@chakra-ui/react',
        '@apollo/client',
      ],
      // Explicit (global) aliases for the workspace source and the webapp's
      // internal specifiers, so imports resolve the same whether they come from
      // the website islands or from within the bundled webapp source.
      alias: [
        { find: '@gql', replacement: `${webappSrc}/graphql.generated.ts` },
        { find: '@rolebase/graph', replacement: graphEntry },
        { find: /^@rolebase\/shared\//, replacement: `${sharedDir}/` },
        { find: '@rolebase/shared', replacement: sharedDir },
        { find: /^@\//, replacement: `${webappSrc}/features/` },
        { find: /^@images\//, replacement: `${webappSrc}/images/` },
        { find: /^@store\//, replacement: `${webappSrc}/store/` },
        { find: /^@utils\//, replacement: `${webappSrc}/utils/` },
        { find: /^src\//, replacement: `${webappSrc}/` },
      ],
    },
  },
  i18n: {
    defaultLocale: defaultLang,
    locales: [...langs],
    routing: {
      prefixDefaultLocale: true,
    },
  },
})
