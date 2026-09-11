import { CirclesGraphViews, GraphEvents } from '@/graph/types'
import React, { useMemo, useState } from 'react'
import GraphContextMenu, {
  GraphContextMenuTarget,
} from '../components/GraphContextMenu'

interface Options {
  // The view the graph is drawn with (see GraphContextMenu)
  view?: CirclesGraphViews
  // Role edition only (proposal editor, demo): no org-wide navigation
  onlyRole?: boolean
  readOnly?: boolean
}

// Right click in the org chart: the graph events that open the menu, and the
// menu itself, to render next to the graph.
export default function useGraphContextMenu({
  view,
  onlyRole,
  readOnly,
}: Options = {}) {
  const [target, setTarget] = useState<GraphContextMenuTarget | undefined>()

  const events = useMemo<GraphEvents>(
    () => ({
      onCircleContextMenu: (circleId, position) =>
        setTarget((prev) => ({
          key: (prev?.key ?? 0) + 1,
          type: 'circle',
          circleId,
          position,
        })),
      onMemberContextMenu: (circleId, memberId, position) =>
        setTarget((prev) => ({
          key: (prev?.key ?? 0) + 1,
          type: 'member',
          circleId,
          memberId,
          position,
        })),
      onBackgroundContextMenu: (position) =>
        setTarget((prev) => ({
          key: (prev?.key ?? 0) + 1,
          type: 'background',
          position,
        })),
    }),
    []
  )

  const contextMenu = target ? (
    <GraphContextMenu
      key={target.key}
      target={target}
      view={view}
      onlyRole={onlyRole}
      readOnly={readOnly}
      onClose={() => setTarget(undefined)}
    />
  ) : null

  return { events, contextMenu }
}
