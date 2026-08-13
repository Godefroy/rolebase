export {}

// Mermaid is only pulled in on pages that actually contain a diagram.
const nodes = document.querySelectorAll<HTMLElement>('pre.mermaid')

if (nodes.length > 0) {
  const { default: mermaid } = await import('mermaid')
  // Tuned to the warm cream surfaces and the purple accent of
  // src/styles/global.css.
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      fontFamily: 'var(--font-sans)',
      background: 'rgb(253, 246, 234)',
      primaryColor: 'hsl(262, 89%, 95%)',
      primaryBorderColor: 'hsl(262, 89%, 68%)',
      primaryTextColor: 'hsl(31.3, 12.7%, 9%)',
      secondaryColor: 'hsl(31.3, 19%, 91%)',
      tertiaryColor: 'hsl(31.3, 44.2%, 97.9%)',
      lineColor: 'hsl(31.3, 15%, 48.4%)',
      textColor: 'hsl(31.3, 12.7%, 9%)',
    },
    securityLevel: 'strict',
  })
  await mermaid.run({ nodes })
}
