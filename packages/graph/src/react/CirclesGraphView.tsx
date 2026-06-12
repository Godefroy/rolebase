import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { CirclesGraph } from '../core/CirclesGraph'
import { CirclesGraphViews } from '../types'
import CirclesTitles from './CirclesTitles'
import { GraphRenderContext } from './GraphRenderContext'
import Nodes from './Nodes'
import { Panzoom } from './Panzoom'
import useCirclesGraph, { CirclesGraphProps } from './hooks/useCirclesGraph'
import { useNodeCursor } from './hooks/useNodeCursor'
import { graphStyles } from './styles'

// Force reset with fast refresh
// @refresh reset

export type CirclesGraphViewProps = CirclesGraphProps

export default forwardRef<CirclesGraph | undefined, CirclesGraphViewProps>(
  function CirclesGraphView(props, ref) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Instanciate graph
    const graph = useCirclesGraph(containerRef, props)

    // Expose ref
    useImperativeHandle(ref, () => graph)

    // Compute graph min size
    const cropWidth =
      props.width - (props.focusCrop?.left || 0) - (props.focusCrop?.right || 0)
    const cropHeight =
      props.height -
      (props.focusCrop?.top || 0) -
      (props.focusCrop?.bottom || 0)
    const graphMinSize = Math.min(cropWidth, cropHeight)

    // Cursor on nodes
    const cursor = useNodeCursor(graph)

    // Click outside => unselect circle
    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === containerRef.current) {
        props.events?.onClickOutside?.()
      }
    }

    const renderContext = useMemo(
      () => ({
        graph,
        colorMode: props.colorMode,
        events: graph?.params.events || {},
        isStatic: false,
      }),
      [graph, props.colorMode]
    )

    return (
      <div
        ref={containerRef}
        className={`rb-graph${
          props.view === CirclesGraphViews.Members
            ? ' rb-graph-show-members'
            : ''
        }${props.showAllNodes ? ' rb-graph-show-all' : ''}`}
        style={
          {
            width: `${props.width}px`,
            height: `${props.height}px`,
            '--graph-min-size': graphMinSize,
            '--node-cursor': cursor,
          } as React.CSSProperties
        }
        onClick={handleClickOutside}
      >
        <style>{graphStyles}</style>
        {graph && (
          <GraphRenderContext.Provider value={renderContext}>
            <Panzoom graph={graph}>
              <Nodes graph={graph} />
              <CirclesTitles graph={graph} />
            </Panzoom>
          </GraphRenderContext.Provider>
        )}
      </div>
    )
  }
)
