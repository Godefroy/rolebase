import { CircleFullFragment } from '@rolebase/shared/gql'
import { RefObject, useMemo } from 'react'
import { CirclesGraph } from '../../core/CirclesGraph'
import { CirclesGraphViews, GraphParams, RootElement } from '../../types'
import useGraph, { GraphProps } from './useGraph'

export interface CirclesGraphProps
  extends Omit<
    GraphProps<CircleFullFragment[], CirclesGraph>,
    'data' | 'init'
  > {
  view: CirclesGraphViews
  circles: CircleFullFragment[]
}

export default function useCirclesGraph(
  elementRef: RefObject<RootElement>,
  { view, circles, ...props }: CirclesGraphProps
) {
  const graphProps = useMemo(
    () => ({
      ...props,
      data: circles,
      init: (params: GraphParams) => {
        if (!elementRef.current) {
          throw new Error('Graph: Element ref is not set')
        }
        return new CirclesGraph(elementRef.current, view, params)
      },
    }),
    [props, circles]
  )
  return useGraph<CircleFullFragment[], CirclesGraph>(graphProps)
}
