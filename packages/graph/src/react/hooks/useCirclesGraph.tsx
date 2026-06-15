import { OrgData } from '@rolebase/shared/model/OrgData'
import { RefObject, useMemo } from 'react'
import { CirclesGraph } from '../../core/CirclesGraph'
import { CirclesGraphViews, GraphParams, RootElement } from '../../types'
import useGraph, { GraphProps } from './useGraph'

export interface CirclesGraphProps
  extends Omit<GraphProps<OrgData, CirclesGraph>, 'data' | 'init'> {
  view: CirclesGraphViews
  org: OrgData
}

export default function useCirclesGraph(
  elementRef: RefObject<RootElement>,
  { view, org, ...props }: CirclesGraphProps
) {
  const graphProps = useMemo(
    () => ({
      ...props,
      data: org,
      init: (params: GraphParams) => {
        if (!elementRef.current) {
          throw new Error('Graph: Element ref is not set')
        }
        return new CirclesGraph(elementRef.current, view, params)
      },
    }),
    [props, org]
  )
  return useGraph<OrgData, CirclesGraph>(graphProps)
}
