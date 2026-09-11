import GraphShortcutsContent from '@/graph/components/GraphShortcutsContent'
import LogsContent from '@/log/components/LogsContent'
import BaseRolesContent from '@/role/components/BaseRolesContent'
import VacantRolesContent from '@/role/components/VacantRolesContent'
import React from 'react'
import { CirclesPanel } from '../circlesPanels'
import CirclesShareContent from './CirclesShareContent'

interface Props {
  panel: CirclesPanel
  changeTitle?: boolean
  flowHeight?: boolean
  onClose?: () => void
}

// The org chart panel opened by the settings menu, by name.
export default function CirclesPanelContent({ panel, ...contentProps }: Props) {
  switch (panel) {
    case 'shortcuts':
      return <GraphShortcutsContent {...contentProps} />
    case 'baseRoles':
      return <BaseRolesContent {...contentProps} />
    case 'vacantRoles':
      return <VacantRolesContent {...contentProps} />
    case 'logs':
      return <LogsContent {...contentProps} />
    case 'share':
      return <CirclesShareContent {...contentProps} />
  }
}
