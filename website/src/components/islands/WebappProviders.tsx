import { ChakraProvider } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from 'src/i18n'
import theme from 'src/theme'

interface Props {
  lang?: string
  children: ReactNode
}

// Everything a webapp component needs to render inside the site, and nothing
// more: translations and Chakra. Kept free of the Apollo client, the router and
// the editor styles so a page that only borrows a control (see OrgChartView)
// stays light; DemoProviders stacks those on top for the editable preview.
//
// Confine Chakra's CSS reset to the island. The reset is injected unlayered,
// and unlayered CSS beats every Tailwind @layer regardless of specificity, so a
// global reset flattens the page (headings, list and paragraph spacing...).
// Scoping it with `:where(...)` keeps it off the rest of the page while the
// `:where()` wrapper keeps its specificity at zero, so it still never overrides
// Chakra's own component styles. The scope also covers `.chakra-portal`
// (menus/modals/tooltips render there, outside the island) so they get the
// reset too. disableGlobalStyle drops Chakra's global <body>/<html> styles
// (background, color, font); the demo + portal base styles are reapplied in
// global.css.
export default function WebappProviders({ lang = 'en', children }: Props) {
  if (i18n.language !== lang) i18n.changeLanguage(lang)
  return (
    <I18nextProvider i18n={i18n}>
      <ChakraProvider
        theme={theme}
        resetScope=":where(.rolebase-webapp, .chakra-portal)"
        disableGlobalStyle
      >
        <div className="rolebase-webapp">{children}</div>
      </ChakraProvider>
    </I18nextProvider>
  )
}
