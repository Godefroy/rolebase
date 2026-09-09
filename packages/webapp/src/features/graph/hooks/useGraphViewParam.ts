import useQueryParams from '@/common/hooks/useQueryParams'
import { useMemo } from 'react'

// Graph view held in the URL, as its raw parameters. Every navigation that
// changes the selected circle or member rebuilds the query string, so it has
// to carry them over or the org chart falls back to the organization default.
export interface GraphViewParams {
  view?: string
  folded?: string
}

export default function useGraphViewParam(): GraphViewParams {
  const { view, folded } = useQueryParams<{ view: string; folded: string }>()
  return useMemo(() => ({ view, folded }), [view, folded])
}

// Append the view parameters to a query string being built
export function setGraphViewParams(
  params: URLSearchParams,
  graphView?: GraphViewParams
) {
  if (graphView?.view) params.set('view', graphView.view)
  if (graphView?.folded) params.set('folded', graphView.folded)
}
