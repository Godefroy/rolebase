import { defineEcConfig } from 'astro-expressive-code'

/**
 * Expressive Code renders every code block on the site, both the markdown
 * fences and any `<Code>` component.
 *
 * The options live here rather than in `astro.config.ts` because `<Code>`
 * requires a config it can load on its own.
 */
export default defineEcConfig({
  // The site is light only, so a single theme is enough.
  themes: ['one-light'],
  useDarkModeMediaQuery: false,
  defaultProps: { wrap: false },
  styleOverrides: {
    borderRadius: '0.5rem',
    uiFontFamily: 'var(--font-sans)',
    // The theme ships its own surface, which reads as a foreign panel on the
    // site background. Only the token colours are kept; the surfaces come from
    // the palette in src/styles/global.css.
    codeBackground: 'var(--color-bg-secondary)',
    borderColor: 'var(--color-border)',
    scrollbarThumbColor: 'var(--color-border)',
    scrollbarThumbHoverColor: 'var(--color-primary)',
    frames: {
      editorBackground: 'var(--color-bg-secondary)',
      editorTabBarBackground: 'var(--color-code-bg)',
      editorTabBarBorderBottomColor: 'var(--color-border)',
      editorActiveTabBackground: 'var(--color-bg-secondary)',
      editorActiveTabBorderColor: 'var(--color-border)',
      editorActiveTabIndicatorTopColor: 'var(--color-primary)',
      terminalBackground: 'var(--color-bg-secondary)',
      terminalTitlebarBackground: 'var(--color-code-bg)',
      terminalTitlebarBorderBottomColor: 'var(--color-border)',
      terminalTitlebarForeground: 'var(--color-text-secondary)',
    },
  },
  shiki: { langs: [] },
})
