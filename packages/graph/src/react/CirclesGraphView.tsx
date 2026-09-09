import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { CirclesGraph } from '../core/CirclesGraph'
import { CirclesGraphViews, GraphLayoutKind } from '../types'
import CirclesTitles from './CirclesTitles'
import { GraphRenderContext } from './GraphRenderContext'
import Nodes from './Nodes'
import { Panzoom } from './Panzoom'
import GraphTreeLinks from './GraphTreeLinks'
import useCirclesGraph, { CirclesGraphProps } from './hooks/useCirclesGraph'
import { useNodeCursor } from './hooks/useNodeCursor'
import { useRepositioningBg } from './hooks/useRepositioningBg'
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

    // Hierarchical views render cards linked by edges instead of packed
    // circles: their name lives in the card, so no title layer
    const isTree = graph?.layoutKind === GraphLayoutKind.Tree

    // Background color shown while moved nodes are hidden (select-relayout)
    const repositioningBg = useRepositioningBg(graph)

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
        }${props.showAllNodes ? ' rb-graph-show-all' : ''}${
          isTree ? ' rb-graph-tree' : ''
        }`}
        style={
          {
            width: `${props.width}px`,
            height: `${props.height}px`,
            '--graph-min-size': graphMinSize,
            '--node-cursor': cursor,
            // Opaque: a translucent stroke would darken where edges cross
            '--link-color': props.colorMode === 'dark' ? '#585c66' : '#cbcbd1',
          } as React.CSSProperties
        }
        onClick={handleClickOutside}
      >
        <style>{graphStyles}</style>
        <div
          className="rb-graph-reposition-bg"
          style={{
            backgroundColor: repositioningBg,
            // Appear instantly when set (entry); the CSS transition only plays
            // when it clears (exit) to fade the background out
            transition: repositioningBg ? 'none' : undefined,
          }}
        />
        {graph && (
          <GraphRenderContext.Provider value={renderContext}>
            <Panzoom graph={graph}>
              {isTree && <GraphTreeLinks graph={graph} />}
              <Nodes graph={graph} />
              {!isTree && <CirclesTitles graph={graph} />}
            </Panzoom>
          </GraphRenderContext.Provider>
        )}
      </div>
    )
  }
)
