import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { CirclesGraph } from '../core/CirclesGraph'
import { CirclesGraphViews, GraphLayoutKind } from '../types'
import CirclesTitles from './CirclesTitles'
import { GraphRenderContext } from './GraphRenderContext'
import Minimap from './Minimap'
import Nodes from './Nodes'
import ScrollZoomHint from './ScrollZoomHint'
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

    // The graph never shows the browser context menu, whether or not the app
    // opens one of its own (node right clicks bubble up to here too).
    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      // Right click on the background (nodes handle their own menu)
      if (event.target !== containerRef.current) return
      props.events?.onBackgroundContextMenu?.({
        x: event.clientX,
        y: event.clientY,
      })
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
        }${props.scrollable ? ' rb-graph-scrollable' : ''}`}
        style={
          {
            width: `${props.width}px`,
            height: `${props.height}px`,
            '--graph-min-size': graphMinSize,
            '--node-cursor': cursor,
            // Opaque: a translucent stroke would darken where edges cross
            '--link-color': props.colorMode === 'dark' ? '#585c66' : '#cbcbd1',
            // Minimap panel, its hairline and the frame of the current view
            // in it. The panel is nearly opaque: it sits over the graph, and
            // the shapes it draws have to read against it.
            '--minimap-bg':
              props.colorMode === 'dark'
                ? 'rgba(26, 26, 30, 0.93)'
                : 'rgba(255, 255, 255, 0.93)',
            '--minimap-border-color':
              props.colorMode === 'dark'
                ? 'rgba(255, 255, 255, 0.14)'
                : 'rgba(0, 0, 0, 0.1)',
            '--minimap-scrim-color':
              props.colorMode === 'dark'
                ? 'rgba(0, 0, 0, 0.1)'
                : 'rgba(90, 90, 100, 0.05)',
            '--minimap-viewport-color':
              props.colorMode === 'dark' ? '#a1a1aa' : '#71717a',
          } as React.CSSProperties
        }
        onClick={handleClickOutside}
        onContextMenu={handleContextMenu}
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
            {props.minimap !== false && <Minimap graph={graph} />}
            {props.scrollable && props.scrollZoomHint && (
              <ScrollZoomHint graph={graph} label={props.scrollZoomHint} />
            )}
          </GraphRenderContext.Provider>
        )}
      </div>
    )
  }
)
