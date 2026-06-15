import { CircleMemberProvider } from '@/circle/contexts/CircleMemberProvider'
import useWindowSize from '@/common/hooks/useWindowSize'
import DbOrgProvider from '@/org/contexts/DbOrgProvider'
import { useOrgRouteParams } from '@/org/hooks/useOrgRouteParams'
import { Box } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { SidebarContext } from '../contexts/SidebarContext'
import Sidebar from './Sidebar'

interface Props {
  children: React.ReactNode
}

export default function LoggedLayout({ children }: Props) {
  const windowSize = useWindowSize()
  const sidebarContext = useContext(SidebarContext)
  const { orgId, slug } = useOrgRouteParams()

  // Database-backed org data and edit actions, available everywhere (sidebar,
  // graph, role panel, global circle modal). The proposal editor overrides this
  // locally with an in-memory draft.
  return (
    <DbOrgProvider orgId={orgId} slug={slug}>
      <CircleMemberProvider>
        <Sidebar />
        <Box
          position="relative"
          h={0}
          minH={`${windowSize.height - (sidebarContext?.height || 0)}px`}
          ml={sidebarContext?.width ? `${sidebarContext?.width}px` : 0}
          mt={sidebarContext?.height ? `${sidebarContext?.height}px` : 0}
          sx={{
            '@media print': {
              ml: 0,
              mt: 0,
            },
          }}
        >
          {children}
        </Box>
      </CircleMemberProvider>
    </DbOrgProvider>
  )
}
