import { CircleMemberProvider } from '@/circle/contexts/CircleMemberProvider'
import useWindowSize from '@/common/hooks/useWindowSize'
import { OrgEditProvider } from '@/org/contexts/OrgEditContext'
import useDbOrgEditActions from '@/org/hooks/useDbOrgEditActions'
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

  // Database-backed org edit actions, available everywhere (graph, role panel,
  // and the global circle modal). The proposal editor overrides this locally.
  const dbEditActions = useDbOrgEditActions()

  return (
    <OrgEditProvider value={dbEditActions}>
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
    </OrgEditProvider>
  )
}
