import * as d3 from 'd3'
import { ZoomTransform } from 'd3'
import EventEmitter from 'eventemitter3'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'
import settings from '../settings'
import {
  Bounds,
  Data,
  GraphEvents,
  GraphLayoutKind,
  GraphParams,
  NodeData,
  Position,
  RootElement,
  TreeLink,
  VisibleNodes,
  ZoomFocusCircleScale,
} from '../types'
import { computeVisibleNodes } from './culling'
import { isConstrainedDevice, pixelRatio } from '../helpers/device'

const defaultFocusCrop: Position = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
}

const defaultFocusCircleScale: ZoomFocusCircleScale = (node) =>
  Math.max(200, node.r * 1.05)

export type GraphEmitterEvents = {
  zoomPosition: [ZoomTransform]
  zoomScale: [number]
  zoom: [ZoomTransform]
  resize: void
  nodesData: [NodeData[]]
  visibleNodes: [VisibleNodes]
  selectCircle: [string | undefined]
  // Background color shown behind the graph while moved nodes are hidden
  // during a select-relayout animation (the focus circle parent color)
  repositioningBg: [string | undefined]
}

export abstract class Graph<
  InputData = any,
> extends EventEmitter<GraphEmitterEvents> {
  public d3Root: d3.Selection<RootElement, NodeData, null, undefined>
  public zoomDisabled = false
  public inputData: InputData | undefined
  public root: NodeData | undefined
  public nodes: NodeData[] = []
  // How the current nodes were placed (drives culling and rendering)
  public layoutKind: GraphLayoutKind = GraphLayoutKind.Pack
  // Bounding box of the whole layout
  public layoutBounds: Bounds = { x0: 0, y0: 0, x1: 0, y1: 0 }
  // Center and radius framing the whole layout
  public layoutFocus: { x: number; y: number; r: number } = { x: 0, y: 0, r: 0 }
  // Box framing the whole layout (used when it is not square, e.g. a tree)
  public layoutFocusBox: Bounds = { x0: 0, y0: 0, x1: 0, y1: 0 }
  // Edges between nodes (hierarchical views)
  public layoutLinks: TreeLink[] = []
  // Subset of nodes currently mounted in the DOM (windowing)
  public visibleNodes: VisibleNodes = {
    nodes: [],
    titles: [],
    links: [],
    titleVisibility: new Map(),
    cullScale: 1,
    levelHiddenIds: new Set(),
    criticalScales: [],
  }
  // Ids of nodes added by the last data update (they animate on enter)
  public enteringIds = new Set<string>()
  // Ids of nodes that moved on a select-relayout: hidden during the enter
  // animation (except the focused circle) so they don't each promote a GPU
  // layer while transitioning to their new position
  public repositionedIds = new Set<string>()
  // Ids of the edges whose path changed on the last data update, or that it
  // added. An edge cannot morph from one shape to another, so it is drawn at
  // its arrival geometry and kept hidden until the nodes have moved there.
  // Edges the update left alone stay visible (see CirclesGraph.updateData).
  public movingLinkIds = new Set<string>()
  public selectedCircleId?: string
  // Members are visible at any zoom scale (e.g. Members view)
  public showAllMembers = false
  // Members and deep circles are visible at any zoom scale (e.g. export)
  public showAllNodes = false
  public width: number
  public height: number
  public zoomTransform = new ZoomTransform(1, 0, 0)
  protected zoomBehaviour: d3.ZoomBehavior<RootElement, any>
  protected focusCircleScale: ZoomFocusCircleScale
  public focusCrop: Position
  protected focusOffsetX: number
  protected focusOffsetY: number
  protected rootRadius: number
  private unmounted = false
  private lastCullTransform: ZoomTransform | undefined
  private cullRequest: number | undefined
  // Last programmatic focus, replayed against the new size when a resize
  // interrupts its animation (e.g. opening the side panel resizes the graph)
  private lastFocusNodeId: string | undefined
  private lastFocusAdaptScale = false
  private lastFocusTime = -Infinity

  constructor(
    public element: RootElement,
    public params: GraphParams
  ) {
    super()

    // Params
    const { width, height, focusCrop, focusCircleScale } = this.params
    this.width = width
    this.height = height
    this.zoomDisabled = params.zoomDisabled || false
    this.showAllNodes = params.showAllNodes || false
    this.focusCircleScale = focusCircleScale || defaultFocusCircleScale
    this.focusCrop = focusCrop || defaultFocusCrop
    this.focusOffsetX = getFocusOffsetX(width, focusCrop || defaultFocusCrop)
    this.focusOffsetY = getFocusOffsetY(height, focusCrop || defaultFocusCrop)
    this.rootRadius = 0

    // D3 root selection
    this.d3Root = d3.select<RootElement, NodeData>(element)

    // Zoom
    this.zoomBehaviour = d3
      .zoom<RootElement, any>()
      .filter((event) => {
        if (this.zoomDisabled) return false
        // Leave Ctrl/Cmd + mousedown on a node to the nodes drag & drop
        // (otherwise d3-zoom stops the event propagation and pans instead)
        const { onCircleMove, onMemberMove } = this.params.events
        if (
          (onCircleMove || onMemberMove) &&
          event.type === 'mousedown' &&
          (event.ctrlKey || event.metaKey) &&
          (event.target as Element | null)?.closest?.('.node')
        ) {
          return false
        }
        return true
      })
      .scaleExtent(settings.zoom.scaleExtent as [number, number])
      // On constrained devices, suppress per-node CSS transitions while the
      // view is actively panning/zooming (interactive gestures and programmatic
      // transitions both fire start/end). Without this, properties derived from
      // the zoom scale (member/title opacity) re-trigger a transition on every
      // frame, keeping one GPU layer promoted per node for the whole gesture.
      .on('start.transitions', () => {
        if (isConstrainedDevice) {
          this.element?.classList.add('rb-graph-zooming')
        }
      })
      .on('end.transitions', () => {
        if (isConstrainedDevice) {
          this.element?.classList.remove('rb-graph-zooming')
        }
      })
      .on('zoom', (event: d3.D3ZoomEvent<RootElement, any>) => {
        if (this.unmounted) return
        const hasMoved =
          this.zoomTransform.x !== event.transform.x ||
          this.zoomTransform.y !== event.transform.y
        const hasScaled = this.zoomTransform.k !== event.transform.k
        this.zoomTransform = event.transform
        if (hasMoved) {
          this.emit('zoomPosition', event.transform)
        }
        if (hasScaled) {
          this.emit('zoomScale', event.transform.k)
          this.updatePanExtentDebounced()
        }
        if (hasMoved || hasScaled) {
          this.emit('zoom', event.transform)
          this.checkCullOnZoom()
        }
      })
    this.d3Root.call(this.zoomBehaviour)
  }

  // Replace the event handlers. Subclasses narrow them: CirclesGraph drops the
  // ones its view disables, so the handlers the graph really answers to stay
  // the single source of truth (the shortcuts modal reads them).
  setEvents(events: GraphEvents) {
    this.params.events = events
  }

  destroy() {
    this.unmounted = true
    this.d3Root.on('.zoom', null)
    if (this.cullRequest !== undefined) {
      cancelAnimationFrame(this.cullRequest)
    }
    // Remove listeners
    this.removeAllListeners()
  }

  updateData(data: InputData) {
    this.inputData = data
  }

  selectCircle(id: string | undefined) {
    this.selectedCircleId = id
    this.emit('selectCircle', id)
    if (id) {
      this.focusNodeId(id, true)
    }
  }

  // Min size of the visible (cropped) area
  get graphMinSize() {
    return Math.min(
      this.width - this.focusCrop.left - this.focusCrop.right,
      this.height - this.focusCrop.top - this.focusCrop.bottom
    )
  }

  // Recompute the set of visible nodes (windowing)
  cull() {
    if (this.unmounted || !this.root) return
    this.lastCullTransform = this.zoomTransform
    this.visibleNodes = computeVisibleNodes({
      root: this.root,
      layout: this.layoutKind,
      links: this.layoutLinks,
      transform: this.zoomTransform,
      width: this.width,
      height: this.height,
      graphMinSize: this.graphMinSize,
      showAllMembers: this.showAllMembers,
      showAllNodes: this.showAllNodes,
      // Cull more aggressively on high-DPR/touch devices (see culling.ts)
      pixelRatio,
    })
    this.emit('visibleNodes', this.visibleNodes)
  }

  // Schedule a culling pass on next frame (coalesces multiple calls)
  scheduleCull() {
    if (this.cullRequest !== undefined) return
    this.cullRequest = requestAnimationFrame(() => {
      this.cullRequest = undefined
      this.cull()
    })
  }

  // Recompute culling when the view has moved enough since the last pass
  private checkCullOnZoom() {
    const last = this.lastCullTransform
    if (!last) {
      this.scheduleCull()
      return
    }
    const { recullScaleRatio, recullPanRatio } = settings.culling
    const { x, y, k } = this.zoomTransform
    const scaleRatio = k > last.k ? k / last.k : last.k / k
    const panExtent = Math.max(this.width, this.height) * recullPanRatio
    if (
      scaleRatio > recullScaleRatio ||
      Math.abs(x - last.x) > panExtent ||
      Math.abs(y - last.y) > panExtent ||
      // Zoom scale crossed a visibility threshold of children of a circle
      this.visibleNodes.criticalScales.some(
        (scale) => (last.k - scale) * (k - scale) < 0
      )
    ) {
      this.scheduleCull()
    }
  }

  updateRootRadius(radius: number) {
    this.rootRadius = radius

    // A wide tree can need a smaller scale than the default minimum to fit on
    // screen: lower the bound to the fitting scale, never above it
    const fitScale = radius > 0 ? this.graphMinSize / (radius * 2) : 1
    const [minScale, maxScale] = settings.zoom.scaleExtent
    this.zoomBehaviour.scaleExtent([Math.min(minScale, fitScale), maxScale])

    this.updatePanExtent()
  }

  // Change extent to which we can pan
  updatePanExtent() {
    const {
      width,
      height,
      rootRadius,
      zoomTransform: { k },
      focusCrop,
    } = this
    const extentX =
      rootRadius * 2 * k < width / 2
        ? width / k - rootRadius
        : width / k / 2 + rootRadius
    const extentY =
      rootRadius * 2 * k < height / 2
        ? height / k - rootRadius
        : height / k / 2 + rootRadius

    this.zoomBehaviour?.translateExtent([
      [-extentX + focusCrop.right / k, -extentY + focusCrop.bottom / k],
      [extentX - focusCrop.left / k, extentY - focusCrop.top / k],
    ])
  }

  updatePanExtentDebounced = debounce(this.updatePanExtent, 50)

  getDragEventPosition(event: d3.D3DragEvent<SVGGElement, Data, Element>) {
    const { x, y, k } = this.zoomTransform
    return {
      x: (event.sourceEvent.offsetX - x) / k,
      y: (event.sourceEvent.offsetY - y) / k,
    }
  }

  // Zoom to coordinates
  zoomTo(x: number, y: number, radius = 0, instant = false) {
    const scale = radius
      ? Math.min(
          settings.zoom.scaleExtent[1],
          Math.min(
            this.width - this.focusCrop.left - this.focusCrop.right,
            this.height - this.focusCrop.top - this.focusCrop.bottom
          ) /
            (radius * 2)
        )
      : this.zoomTransform.k

    this.zoomToScale(x, y, scale, instant)
  }

  // Zoom to a given scale on a point of the visible (cropped) area.
  // `verticalRatio` places that point in the area: centered by default.
  zoomToScale(
    x: number,
    y: number,
    scale: number,
    instant = false,
    verticalRatio = 0.5
  ) {
    let k = Math.min(settings.zoom.scaleExtent[1], scale)

    // Prevent from zooming to an intermediate state where opacity of members is too low
    if (k > 0.8 && k < 1) {
      k = 0.8
    }

    const cropHeight = this.height - this.focusCrop.top - this.focusCrop.bottom
    const offsetY =
      verticalRatio === 0.5
        ? this.focusOffsetY
        : cropHeight * verticalRatio + this.focusCrop.top

    const transform = new ZoomTransform(
      k,
      -x * k + this.focusOffsetX,
      -y * k + offsetY
    )

    // Apply synchronously when instant
    if (instant) {
      this.d3Root.call(this.zoomBehaviour.transform, transform)
      return
    }

    this.d3Root
      .transition()
      .duration(settings.zoom.duration)
      .ease(settings.zoom.transition)
      .call(this.zoomBehaviour.transform, transform)
  }

  // Zoom to fit a box in the visible (cropped) area. Unlike zoomTo, which
  // fits a radius in the smallest dimension, this uses both dimensions: a tree
  // is much wider than it is tall and would otherwise stay tiny.
  zoomToBox(box: Bounds, instant = false) {
    const width = box.x1 - box.x0
    const height = box.y1 - box.y0
    if (width <= 0 || height <= 0) return

    const cropWidth = this.width - this.focusCrop.left - this.focusCrop.right
    const cropHeight = this.height - this.focusCrop.top - this.focusCrop.bottom

    this.zoomToScale(
      (box.x0 + box.x1) / 2,
      (box.y0 + box.y1) / 2,
      Math.min(cropWidth / width, cropHeight / height),
      instant
    )
  }

  // Conserve center on window resize
  resize = throttle((width: number, height: number, focusCrop?: Position) => {
    if (this.unmounted) return
    focusCrop = focusCrop || defaultFocusCrop

    const focusOffsetX = getFocusOffsetX(width, focusCrop)
    const focusOffsetY = getFocusOffsetY(height, focusCrop)

    // Compute scale change ratio
    const prevCropWidth =
      this.width - this.focusCrop.left - this.focusCrop.right
    const prevCropHeight =
      this.height - this.focusCrop.top - this.focusCrop.bottom
    const cropWidth = width - focusCrop.left - focusCrop.right
    const cropHeight = height - focusCrop.top - focusCrop.bottom
    const scaleRatio =
      Math.min(cropWidth, cropHeight) / Math.min(prevCropWidth, prevCropHeight)

    const transform = new ZoomTransform(
      // Change scale to keep framing
      this.zoomTransform.k * scaleRatio,
      // Reposition
      (this.zoomTransform.x - this.focusOffsetX) * scaleRatio + focusOffsetX,
      (this.zoomTransform.y - this.focusOffsetY) * scaleRatio + focusOffsetY
    )

    this.width = width
    this.height = height
    this.focusCrop = focusCrop
    this.focusOffsetX = focusOffsetX
    this.focusOffsetY = focusOffsetY

    // If a focus is still animating, this resize was likely caused by the same
    // action (e.g. selecting a circle opens the side panel and resizes the
    // graph). Recompute the focus against the new size so it stays centered,
    // instead of preserving the now-stale framing.
    if (Date.now() - this.lastFocusTime < settings.zoom.duration) {
      this.focusNodeId(this.lastFocusNodeId, this.lastFocusAdaptScale)
    } else {
      this.d3Root
        .transition()
        .duration(settings.zoom.duration)
        .ease(settings.zoom.transition)
        .call(this.zoomBehaviour.transform, transform)
    }

    this.emit('resize')
    this.scheduleCull()
  }, 500)

  // Frame a tree card: always the same scale, since every card has the same
  // size, and placed high so the roles hanging under it stay in view
  focusCard(node: NodeData, instant?: boolean) {
    this.zoomToScale(
      node.x,
      node.y,
      settings.tree.focusScale,
      instant,
      settings.tree.focusVerticalRatio
    )
  }

  // Zoom on a node
  focusNode(node: NodeData, adaptScale?: boolean, instant?: boolean) {
    if (!node.r) return
    if (
      adaptScale &&
      this.layoutKind === GraphLayoutKind.Tree &&
      !this.params.focusCircleScale
    ) {
      this.focusCard(node, instant)
      return
    }
    this.zoomTo(
      node.x,
      node.y,
      adaptScale ? this.focusCircleScale(node) : 0,
      instant
    )
  }

  // Zoom on a node
  focusNodeId(nodeId?: string, adaptScale?: boolean, instant?: boolean) {
    if (!this.nodes || this.nodes.length === 0) return

    // No node given: frame the whole layout. Falling back to the biggest node
    // would centre a flat view on whichever circle happens to be the largest,
    // and a tree has no biggest card at all.
    if (!nodeId) {
      this.lastFocusNodeId = undefined
      this.lastFocusAdaptScale = adaptScale || false
      this.lastFocusTime = Date.now()
      if (this.layoutKind === GraphLayoutKind.Tree) {
        this.zoomToBox(this.layoutFocusBox, instant)
      } else {
        const { x, y, r } = this.layoutFocus
        this.zoomTo(
          x,
          y,
          adaptScale ? this.focusCircleScale({ r } as NodeData) : 0,
          instant
        )
      }
      return
    }

    const node = this.nodes.find((n) => n.data.id === nodeId)

    if (!node) return
    // Remember the request so a resize that interrupts the animation can
    // recompute it against the new dimensions (see resize)
    this.lastFocusNodeId = nodeId
    this.lastFocusAdaptScale = adaptScale || false
    this.lastFocusTime = Date.now()
    this.focusNode(node, adaptScale, instant)
  }

  focusNodeIdAfterData(
    nodeId?: string,
    adaptScale?: boolean,
    instant?: boolean
  ) {
    this.once('nodesData', () => this.focusNodeId(nodeId, adaptScale, instant))
  }
}

const getFocusOffsetX = (width: number, focusCrop: Position) =>
  (width - focusCrop.left - focusCrop.right) / 2 + focusCrop.left

const getFocusOffsetY = (height: number, focusCrop: Position) =>
  (height - focusCrop.top - focusCrop.bottom) / 2 + focusCrop.top
