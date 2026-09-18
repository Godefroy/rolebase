import useQueryParams from '@/common/hooks/useQueryParams'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  GraphView,
  defaultGraphView,
  parseGraphView,
} from '@rolebase/shared/model/graph'
import { useMemo } from 'react'

// The view the org chart is currently drawn with: the one held in the URL,
// else the organization default.
export default function useGraphView(): GraphView {
  const { view, folded, members } = useQueryParams<{
    view: string
    folded: string
    members: string
  }>()
  const { org } = useOrgContext()

  return useMemo(
    () =>
      parseGraphView(view, folded === '1', members !== '0') ||
      parseGraphView(
        org?.defaultGraphView,
        org?.defaultGraphFolded,
        org?.defaultGraphMembers
      ) ||
      defaultGraphView,
    [
      view,
      folded,
      members,
      org?.defaultGraphView,
      org?.defaultGraphFolded,
      org?.defaultGraphMembers,
    ]
  )
}
