import CircleActionsMenu from '@/circle/components/CircleActionsMenu'
import { CircleProvider } from '@/circle/contexts/CIrcleContext'
import CirclesGraphSettingsMenu from '@/circle/components/CirclesGraphSettingsMenu'
import MemberActionsMenu from '@/member/components/MemberActionsMenu'
import { CirclesGraphViews } from '@/graph/types'
import { PointerPosition } from '@rolebase/graph'
import React from 'react'

// What was right clicked in the org chart
export type GraphContextMenuTarget = {
  // Incremented on each right click, to remount the menu on the new position
  key: number
  position: PointerPosition
} & (
  | { type: 'circle'; circleId: string }
  | { type: 'member'; circleId: string; memberId: string }
  | { type: 'background' }
)

interface Props {
  target: GraphContextMenuTarget
  // The view the graph is drawn with: the members view lists the roles of a
  // member, where acting on the role a node sits in makes no sense
  view?: CirclesGraphViews
  // Role edition only (proposal editor, demo): no org-wide navigation
  onlyRole?: boolean
  readOnly?: boolean
  onClose(): void
}

// Menu opened by a right click in the org chart: the actions of the role or
// member panel, or the org chart options on the background.
export default function GraphContextMenu({
  target,
  view,
  onlyRole,
  readOnly,
  onClose,
}: Props) {
  if (target.type === 'circle') {
    return (
      <CircleProvider circleId={target.circleId}>
        <CircleActionsMenu
          anchor={target.position}
          onlyRole={onlyRole}
          readOnly={readOnly}
          onClose={onClose}
        />
      </CircleProvider>
    )
  }

  if (target.type === 'member') {
    return (
      <MemberActionsMenu
        id={target.memberId}
        circleId={
          view === CirclesGraphViews.Members ? undefined : target.circleId
        }
        anchor={target.position}
        onClose={onClose}
      />
    )
  }

  return <CirclesGraphSettingsMenu anchor={target.position} onClose={onClose} />
}
