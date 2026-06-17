import { truthy } from '@rolebase/shared/helpers/truthy'
import React, { useEffect, useMemo, useRef } from 'react'
import { Graph } from '../../core/Graph'
import { isPointInsideCircle } from '../../helpers/isPointInsideCircle'
import { NodeData, NodeType } from '../../types'

interface Position {
  x: number
  y: number
}

interface DragNode {
  node: NodeData
  element: HTMLDivElement
  title?: HTMLDivElement
}

export function useDragNode(graph: Graph | undefined, node: NodeData) {
  const events = graph?.params.events
  const dragOrigin = useRef<Position>()
  const dragNodes = useRef<DragNode[]>([])
  const dragTargets = useRef<DragNode[]>([])
  const dragTarget = useRef<DragNode | undefined>()

  // Stable document listeners delegating to the latest handlers
  const latestHandlers = useRef<{
    move(event: MouseEvent): void
    up(event: MouseEvent): void
  }>({ move: () => undefined, up: () => undefined })
  const documentListeners = useMemo(
    () => ({
      move: (event: MouseEvent) => latestHandlers.current.move(event),
      up: (event: MouseEvent) => latestHandlers.current.up(event),
    }),
    []
  )

  const canDrag = useMemo(
    () =>
      // Disable when events are not provided
      events?.onCircleMove &&
      events?.onMemberMove &&
      // Disable for invited circles (links)
      node.data.id.indexOf('_') === -1,
    [node, graph]
  )

  // Apply drag action
  // @returns true if the node has been moved, false if its position has to be reset
  const handleDragEnd = async (event: MouseEvent): Promise<boolean> => {
    if (!graph) return false
    // Read the handlers live: they are rebuilt after each edit and only the
    // graph holds the latest ones (see useGraph). The captured `events` above
    // can lag a render, which would make a second move read stale org data.
    const events = graph.params.events
    if (!events) return false
    if (!dragTargets.current || !dragTarget.current) return false
    const targetCircleId = dragTarget.current.node.data.id

    try {
      const differentParent = node.data.parentId !== targetCircleId
      if (node.data.type === NodeType.Circle && node.data.entityId) {
        if (event.shiftKey) {
          // Copy circle to another circle
          const newCircleId = await events.onCircleCopy?.(
            node.data.entityId,
            targetCircleId
          )
          if (newCircleId) {
            graph.focusNodeIdAfterData(targetCircleId, true)
          }
        } else if (differentParent) {
          // Move circle to another circle
          await events.onCircleMove?.(node.data.entityId, targetCircleId)
          graph.focusNodeIdAfterData(targetCircleId, true)
          return true
        }
      } else if (
        node.data.type === NodeType.Member &&
        node.data.parentId &&
        node.data.entityId &&
        differentParent &&
        targetCircleId
      ) {
        const memberId = node.data.entityId
        if (event.shiftKey) {
          // Copy member to another circle
          await events.onMemberAdd?.(memberId, targetCircleId)
          graph.focusNodeIdAfterData(targetCircleId, true)
        } else {
          // Move member to another circle
          await events.onMemberMove?.(
            node.data.entityId,
            node.data.parentId,
            targetCircleId
          )
          graph.focusNodeIdAfterData(targetCircleId, true)
          return true
        }
      }
    } catch (error) {
      return false
    }
    return false
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const isDragging =
      graph &&
      canDrag &&
      // Disable when mousewheel is pressed
      event.button !== 1 &&
      // Control/Command key is pressed
      (event.ctrlKey || event.metaKey)
    if (!isDragging) return

    // Register mouse position
    dragOrigin.current = { x: event.clientX, y: event.clientY }

    // Register nodes to drag
    const descendants = node.descendants()
    dragNodes.current = [node, ...descendants]
      .map((d) => {
        const element = getNodeElement(d)
        const title = getTitleElement(d)
        if (!element) return
        return {
          node: d,
          element,
          title,
        }
      })
      .filter(truthy)

    // Register targets
    dragTargets.current = graph.nodes
      .filter(
        (d) =>
          !descendants.includes(d) &&
          d.data.type === NodeType.Circle &&
          d.data.id.indexOf('_') === -1
      )
      .map((d) => {
        const element = getNodeElement(d)
        // Exclude unmounted and hidden circles from drop targets
        if (!element || element.classList.contains('level-hidden')) return
        return {
          node: d,
          element,
        }
      })
      .filter(truthy)

    // Add classes
    dragNodes.current[0].element.classList.add('drag-node')
    dragNodes.current.forEach((d) => {
      d.element.classList.add('dragging')
      d.title?.classList.add('dragging')
    })

    document.addEventListener('mouseup', documentListeners.up)
    document.addEventListener('mousemove', documentListeners.move)
  }

  const handleMouseUp = async (event: MouseEvent) => {
    document.removeEventListener('mouseup', documentListeners.up)
    document.removeEventListener('mousemove', documentListeners.move)

    // Remove classes
    dragNodes.current[0]?.element.classList.remove('drag-node')
    dragNodes.current.forEach((d) => {
      d.element.classList.remove('dragging')
      d.title?.classList.remove('dragging')
    })
    dragTarget.current?.element.classList.remove('drag-target')

    // Reset dragged circles
    const actionMoved = await handleDragEnd(event)
    if (dragNodes.current && !actionMoved) {
      dragNodes.current.forEach((d) => {
        setTimeout(() => {
          // Read the node's current layout position rather than the one
          // captured at drag start. On a copy, the data updates and a
          // re-layout builds new node objects, so the captured `d.node`
          // holds a stale position. Using it here would override React's
          // correct render when the action resolves faster than this reset.
          const current = graph?.nodes.find((n) => n.data.id === d.node.data.id)
          const x = current ? current.x : d.node.x
          const y = current ? current.y : d.node.y
          d.element.style.translate = `${x}px ${y}px`
          if (d.title) {
            d.title.style.translate = `${x}px ${y}px`
          }
        }, 0)
      })
    }

    // Reset refs
    dragOrigin.current = undefined
    dragNodes.current = []
    dragTargets.current = []
    dragTarget.current = undefined
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!graph || !dragOrigin.current || !dragTargets.current) return

    const { k } = graph.zoomTransform
    const dX = (event.clientX - dragOrigin.current.x) / k
    const dY = (event.clientY - dragOrigin.current.y) / k

    dragNodes.current.forEach((d) => {
      d.element.style.translate = `${d.node.x + dX}px ${d.node.y + dY}px`
      if (d.title) {
        d.title.style.translate = `${d.node.x + dX}px ${d.node.y + dY}px`
      }
    })

    const target = getTargetNodeData(dragTargets.current, event, graph)

    if (target !== dragTarget.current) {
      dragTarget.current?.element.classList.remove('drag-target')
      if (target) {
        dragTarget.current = target
        target.element.classList.add('drag-target')
      }
    }
  }

  // Keep latest handlers in a ref so that document listeners stay stable:
  // a re-render in the middle of a drag must not detach them
  latestHandlers.current = { move: handleMouseMove, up: handleMouseUp }

  // Cleanup event listeners on unmount
  useEffect(
    () => () => {
      document.removeEventListener('mouseup', documentListeners.up)
      document.removeEventListener('mousemove', documentListeners.move)
    },
    []
  )

  return {
    canDrag,
    handleMouseDown,
  }
}

function getNodeElement(node: NodeData) {
  return document.getElementById(`node-${node.data.id}`) as HTMLDivElement
}

function getTitleElement(node: NodeData) {
  return document.getElementById(
    `circle-title-${node.data.id}`
  ) as HTMLDivElement
}

function getTargetNodeData(
  targetNodes: DragNode[],
  event: MouseEvent,
  graph: Graph
): DragNode | null {
  const position = getDragEventPosition(event, graph)

  // Get circles under the mouse
  const currentTargets = targetNodes.filter(({ node }) =>
    isPointInsideCircle(position.x, position.y, node.x, node.y, node.r)
  )

  // Get last descendants under the mouse
  return (
    currentTargets.reduce<{ max: number; dragNode?: DragNode }>(
      (acc, dragNode) =>
        !dragNode || dragNode.node.depth > acc.max
          ? { max: dragNode.node.depth, dragNode }
          : acc,
      { max: 0 }
    ).dragNode || null
  )
}

function getDragEventPosition(event: MouseEvent, graph: Graph) {
  const { x, y, k } = graph.zoomTransform
  const graphRect = (graph.element as HTMLDivElement).getBoundingClientRect()

  return {
    x: (event.clientX - graphRect.left - x) / k,
    y: (event.clientY - graphRect.top - y) / k,
  }
}
