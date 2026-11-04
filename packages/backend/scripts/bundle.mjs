// Precompile the backend for production: running it through tsx keeps an
// esbuild service and every transpiled source in memory
import { build } from 'esbuild'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const backendDir = path.resolve(import.meta.dirname, '..')
const outfile = path.join(backendDir, 'dist/server.js')

// Load dependencies from node_modules at runtime, and bundle only workspace
// packages and what the backend can't resolve by itself (nested node_modules)
const externalDependencies = {
  name: 'external-dependencies',
  setup({ onResolve, resolve }) {
    onResolve(
      { filter: /^[^./]/ },
      async ({ path: id, resolveDir, kind, pluginData }) => {
        if (pluginData?.resolving) return
        const options = { kind, pluginData: { resolving: true } }
        const fromImporter = await resolve(id, { ...options, resolveDir })
        const fromBackend = await resolve(id, {
          ...options,
          resolveDir: backendDir,
        })
        const isShared =
          fromBackend.path === fromImporter.path &&
          fromBackend.path.includes('/node_modules/')
        return isShared || fromImporter.errors.length > 0
          ? { path: id, external: true }
          : fromImporter
      }
    )
  },
}

// Keep the __dirname of each source file, which reads files relative to it
const preserveDirname = {
  name: 'preserve-dirname',
  setup({ onLoad }) {
    onLoad({ filter: /\.[cm]?[jt]sx?$/ }, async ({ path: file }) => {
      const source = await readFile(file, 'utf8')
      if (!source.includes('__dirname')) return
      const relativeDir = path.relative(path.dirname(outfile), path.dirname(file))
      const ext = path.extname(file).slice(1)
      return {
        contents: source.replace(
          /\b__dirname\b/g,
          `require('node:path').join(__dirname, ${JSON.stringify(relativeDir)})`
        ),
        loader: ext === 'ts' || ext === 'tsx' || ext === 'jsx' ? ext : 'js',
      }
    })
  },
}

await build({
  entryPoints: [path.join(backendDir, 'src/index.ts')],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node24',
  sourcemap: true,
  logLevel: 'warning',
  plugins: [externalDependencies, preserveDirname],
})
