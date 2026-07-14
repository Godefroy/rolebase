import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'
// import visualizer from 'rollup-plugin-visualizer'
import { fileURLToPath } from 'url'
import { defineConfig, PluginOption } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

const plugins: PluginOption[] = [
  svgr({ exportAsDefault: true }),
  react(),
  // Scope the tsconfig scan to the webapp's own tsconfig. Without `root`,
  // vite-tsconfig-paths crawls the whole workspace and chokes on
  // website/tsconfig.json (its `extends: "astro/tsconfigs/strict"` resolves
  // via astro's exports map, which the bundled tsconfck fails to follow).
  tsconfigPaths({ root: __dirname }),
  // visualizer({
  //   template: 'treemap',
  // }),
]

// Only upload sourcemaps in production when auth token is available
if (
  process.env.SENTRY_AUTH_TOKEN &&
  process.env.SENTRY_URL &&
  process.env.SENTRY_ORG &&
  process.env.SENTRY_PROJECT
) {
  plugins.push(
    sentryVitePlugin({
      url: process.env.SENTRY_URL,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    })
  )
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins,
  optimizeDeps: {
    // react-easy-crop is only imported from lazy-loaded modals, so Vite's
    // initial scan misses it and re-optimizes at runtime ("Outdated Optimize
    // Dep"). Pre-bundle it upfront to avoid the reload/corrupted-module issue.
    //
    // lowlight (via the lazy-loaded editor's code-block extension) is the same
    // case, but worse: it pulls highlight.js/lib/all.js (~190 language imports),
    // so a runtime re-optimize disposes esbuild's scan mid-flight and throws
    // "Invalid command: on-resolve". Pre-bundling it upfront in the cold scan
    // (which completes fine) avoids the race and leaves it cached.
    include: [
      'react-easy-crop',
      'lowlight',
      '@tiptap/extension-code-block-lowlight',
    ],
  },
  build: {
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      // Multiple entry points: https://stackoverflow.com/questions/70522494/multiple-entry-points-in-vite
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        share: fileURLToPath(new URL('./share/index.html', import.meta.url)),
      },
    },
  },
  server: {
    port: 5175,
  },
  resolve: {
    alias: [
      {
        // Prevent yjs from being imported twice (from its CommonJS and ECMAScript version), by forcing an alias on it
        // More info: https://github.com/yjs/yjs/issues/438
        find: 'yjs',
        replacement: path.resolve(
          __dirname,
          '../../node_modules/yjs/dist/yjs.mjs'
        ),
      },
    ],
  },
})
