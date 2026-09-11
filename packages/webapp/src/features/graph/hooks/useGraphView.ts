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
  const { view, folded } = useQueryParams<{ view: string; folded: string }>()
  const { org } = useOrgContext()

  return useMemo(
    () =>
      parseGraphView(view, folded === '1') ||
      parseGraphView(org?.defaultGraphView, org?.defaultGraphFolded) ||
      defaultGraphView,
    [view, folded, org?.defaultGraphView, org?.defaultGraphFolded]
  )
}
