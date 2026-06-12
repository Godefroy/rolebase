import '@/editor/editorTheme.css'
import { SidebarProvider } from '@/layout/contexts/SidebarContext'
import { ApolloProvider } from '@apollo/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import '@rolebase/editor/src/react/styles.css'
import { StoreProvider } from 'easy-peasy'
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router'
import { createApolloClient } from './apolloClient'
import i18n from './i18n'
import AppRoute from './routes/AppRoute'
import { store } from './store'
import theme from './theme'
import { AuthProvider } from '@/user/contexts/AuthProvider'

const apolloClient = createApolloClient({
  // User admin role id "admin" is in URL query params
  'x-hasura-role': /[?&]admin(&|$)/.test(window.location.search)
    ? 'admin'
    : 'user',
})

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ApolloProvider client={apolloClient}>
          <AuthProvider>
            <SidebarProvider>
              <StoreProvider store={store}>
                <Router>
                  <AppRoute />
                </Router>
              </StoreProvider>
            </SidebarProvider>
          </AuthProvider>
        </ApolloProvider>
      </ChakraProvider>
    </I18nextProvider>
  )
}
