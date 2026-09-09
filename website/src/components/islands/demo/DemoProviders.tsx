import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  Observable,
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { ModalContextProvider } from '@chakra-ui/modal'
import { GraphProvider } from '@rolebase/graph'
import { AuthContext, type AuthContextType } from '@/user/contexts/AuthProvider'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import WebappProviders from '../WebappProviders'
import '@/editor/editorTheme.css'
import '@rolebase/editor/src/react/styles.css'

// A no-op Apollo client: the demo is seeded from a static fixture and never
// hits the network. All editing goes through the in-memory org provider
// (including members), so queries/subscriptions just resolve empty and panels
// fall back to the in-memory OrgData.
const mockApolloClient = new ApolloClient({
  link: new ApolloLink(
    (operation) =>
      new Observable((observer) => {
        // Return null for each top-level field requested, so the result is
        // well-formed (no "missing field" cache error) and resolves loading.
        const def = getMainDefinition(operation.query)
        const data: Record<string, null> = {}
        if (def.kind === 'OperationDefinition') {
          for (const sel of def.selectionSet.selections) {
            if (sel.kind === 'Field') {
              data[sel.alias?.value ?? sel.name.value] = null
            }
          }
        }
        observer.next({ data })
        observer.complete()
      })
  ),
  cache: new InMemoryCache(),
})

// Mock auth: a static "logged-in" demo user. Its id matches the demo member
// flagged as the current user, so useCurrentMember resolves and edit
// permissions behave as in the real app.
const mockAuth: AuthContextType = {
  user: { id: 'demo-user', roles: ['user'] } as AuthContextType['user'],
  session: null,
  isAuthenticated: true,
  isLoading: false,
}

interface Props {
  lang?: string
  children: ReactNode
}

// Provider stack for the product-preview islands. Mirrors the webapp's App.tsx
// on top of WebappProviders (i18n + Chakra), adding a static, network-free
// Apollo client and a memory router. The org context is provided by the caller
// (read-only or draft), closer to the graph.
export default function DemoProviders({ lang = 'en', children }: Props) {
  return (
    <WebappProviders lang={lang}>
      <ApolloProvider client={mockApolloClient}>
        <AuthContext.Provider value={mockAuth}>
          <MemoryRouter>
            {/* The role/member panels render a modal close button that reads
                the nearest Chakra modal context (in the app they live inside a
                modal). Provide a no-op stub so they render inline. */}
            <ModalContextProvider value={{ onClose: () => {} } as never}>
              <GraphProvider>{children}</GraphProvider>
            </ModalContextProvider>
          </MemoryRouter>
        </AuthContext.Provider>
      </ApolloProvider>
    </WebappProviders>
  )
}
