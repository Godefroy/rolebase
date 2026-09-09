import { OrgData } from '@rolebase/shared/model/OrgData'
import { getColor } from '../helpers/colors'
import { omit } from '../helpers/omit'
import settings from '../settings'
import {
  CirclesGraphViews,
  GraphLayoutKind,
  GraphParams,
  RootElement,
} from '../types'
import { Graph } from './Graph'
import { computeLayout } from './layout'
import { viewStrategies } from './views'

export class CirclesGraph extends Graph<OrgData> {
  public org?: OrgData
  private dataIds: Set<string> | undefined
  private enterTimeout?: ReturnType<typeof setTimeout>
  // Node positions of the previous layout, to detect which nodes moved
  private prevPositions?: Map<string, { x: number; y: number; r: number }>
  // Edge paths of the previous layout, to detect which edges changed
  private prevLinkPaths?: Map<string, string>
  // Set by selectCircle: the next updateData is a relayout, so moved nodes
  // should be hidden during the animation (live data updates must not)
  private isSelectRelayout = false

  constructor(
    element: RootElement,
    public view: CirclesGraphViews,
    params: GraphParams
  ) {
    // Remove events disabled in this view
    const { omitEvents } = viewStrategies[view]
    super(
      element,
      omitEvents
        ? { ...params, events: omit(params.events, ...omitEvents) }
        : params
    )

    // Always show members on members view
    this.showAllMembers = view === CirclesGraphViews.Members

    // How this view places its nodes (drives culling and rendering)
    this.layoutKind = viewStrategies[view].layout ?? GraphLayoutKind.Pack
  }

  destroy() {
    if (this.enterTimeout) clearTimeout(this.enterTimeout)
    // @ts-ignore
    this.element = undefined
    // @ts-ignore
    this.params = undefined
    this.org = undefined

    super.destroy()
  }

  selectCircle(id: string | undefined) {
    // Apply the selection first, so React knows the focused circle before the
    // relayout (it must stay visible while moved nodes are hidden)
    this.selectedCircleId = id
    this.emit('selectCircle', id)

    // Relayout when the view depends on the selected circle. Hide moved nodes
    // during the animation (see updateData).
    if (viewStrategies[this.view].relayoutOnSelect && this.inputData) {
      this.isSelectRelayout = true
      this.updateData(this.inputData)
    }

    // While moved nodes are hidden, fill the background with the focus circle
    // parent color (instead of the white page) so the focus looks nested in it
    this.emit(
      'repositioningBg',
      this.repositionedIds.size > 0 ? this.getFocusParentColor(id) : undefined
    )

    // Focus immediately, after the relayout so it targets the new positions.
    // No deferral: with the compositing optimizations the focus animation is
    // cheap enough to run together with the data query and the side panel.
    if (id) {
      this.focusNodeId(id, true)
    }
  }

  // Background color of the focus circle parent (undefined for a root child).
  // Only meaningful when circles are nested: a tree keeps the page background.
  private getFocusParentColor(id: string | undefined) {
    if (!id || this.layoutKind === GraphLayoutKind.Tree) return undefined
    const node = this.nodes.find((n) => n.data.id === id)
    const parent = node?.parent
    if (!parent || parent.data.id === 'root') return undefined
    return getColor(
      this.params.colorMode,
      94,
      16,
      parent.depth,
      parent.data.colorHue
    )
  }

  updateData(org: OrgData) {
    const firstDraw = !this.inputData
    super.updateData(org)
    this.org = org

    const layout = computeLayout(org, this.view, this.selectedCircleId, {
      hideMembers: this.params.hideMembers,
    })
    const { root, nodes } = layout
    this.root = root
    this.nodes = nodes
    this.layoutBounds = layout.bounds
    this.layoutFocus = layout.focus
    this.layoutFocusBox = layout.focusBox
    this.layoutLinks = layout.links

    const isSelect = this.isSelectRelayout
    this.isSelectRelayout = false
    // An animation (enter/reposition) is currently playing
    const animating = this.enterTimeout !== undefined

    // Nodes added by this update (they animate on enter).
    // On the first draw, animate nothing: mounting the whole tree with a
    // translate+scale transition promotes one GPU layer per node all at once,
    // which overflows the compositing memory budget on mobile (WebKit, DPR 3)
    // and crashes the page. The initial nodes appear directly at their
    // position; only nodes added by later data updates animate on enter.
    const prevIds = this.dataIds
    this.dataIds = new Set(nodes.map((node) => node.data.id))
    const newEntering = prevIds
      ? new Set(nodes.map((n) => n.data.id).filter((id) => !prevIds.has(id)))
      : new Set<string>()

    const prevPositions = this.prevPositions
    this.prevPositions = new Map(
      nodes.map((n) => [n.data.id, { x: n.x, y: n.y, r: n.r }])
    )

    if (isSelect) {
      // Select-relayout: find existing nodes that actually moved. They are
      // hidden during the animation (except the focused circle) so they don't
      // each promote a GPU layer while transitioning to their new position.
      this.enteringIds = newEntering
      this.repositionedIds =
        prevPositions !== undefined
          ? new Set(
              nodes
                .filter((n) => {
                  const p = prevPositions.get(n.data.id)
                  if (!p) return false // entering node, not repositioning
                  // Any change moves the node (its CSS transition runs and
                  // promotes a layer), so hide it. d3 packing is deterministic:
                  // a truly unmoved node is bit-identical and stays visible.
                  return n.x !== p.x || n.y !== p.y || n.r !== p.r
                })
                .map((n) => n.data.id)
            )
          : new Set()
    } else if (animating) {
      // A non-select update during an ongoing select animation (typically the
      // side panel query refreshing the store) must not reveal the hidden
      // moving nodes: keep the current flags, just add any genuinely new nodes.
      newEntering.forEach((id) => this.enteringIds.add(id))
    } else {
      this.enteringIds = newEntering
      this.repositionedIds = new Set()
    }

    // Edges changed or added by this update. An edge cannot be animated from
    // one shape to another: it is drawn at its arrival geometry while the
    // cards are still gliding to theirs, so it stays hidden until they get
    // there. Edges the update left alone keep their place and stay visible.
    const prevLinkPaths = this.prevLinkPaths
    this.prevLinkPaths = new Map(layout.links.map((l) => [l.id, l.path]))
    const changedLinks = prevLinkPaths
      ? new Set(
          layout.links
            .filter((l) => prevLinkPaths.get(l.id) !== l.path)
            .map((l) => l.id)
        )
      : new Set<string>()

    if (animating && !isSelect) {
      // Mid-animation update: the edges already waiting stay hidden
      changedLinks.forEach((id) => this.movingLinkIds.add(id))
    } else {
      this.movingLinkIds = changedLinks
    }

    // Update root radius
    this.updateRootRadius(layout.panRadius || 0)

    // Zoom at first draw, synchronously before culling: nothing must render
    // with the identity transform, it would mount a large fully-detailed
    // subset of nodes (crash on mobile).
    // A packing is fitted whole, its nested circles staying legible at any
    // size. A tree opens on its first card, framed exactly as selecting it
    // would: fitting a whole chart would shrink every card past reading.
    if (firstDraw) {
      const firstCard =
        this.layoutKind === GraphLayoutKind.Tree ? nodes[0] : undefined
      if (firstCard) {
        this.focusCard(firstCard, true)
      } else {
        this.zoomTo(root.x, root.y, this.focusCircleScale(root), true)
      }
    }

    // Save and dispatch nodes data
    this.emit('nodesData', this.nodes)
    this.cull()

    // Once the animation has played, clear the entering/repositioned flags so
    // the grouped nodes (animated together by EnterGroup) and the temporarily
    // hidden moved nodes hand off to the normal flat rendering, which the
    // windowing/culling then manages again. Keep the existing timer running
    // for a non-select update mid-animation, so the schedule isn't extended.
    if (isSelect || !animating) {
      if (this.enterTimeout) clearTimeout(this.enterTimeout)
      if (
        this.enteringIds.size > 0 ||
        this.repositionedIds.size > 0 ||
        this.movingLinkIds.size > 0
      ) {
        this.enterTimeout = setTimeout(() => {
          this.enterTimeout = undefined
          this.enteringIds = new Set()
          this.repositionedIds = new Set()
          this.movingLinkIds = new Set()
          // Restore the normal background and re-emit a fresh visible set so
          // React re-renders the (now flat) nodes
          this.emit('repositioningBg', undefined)
          this.cull()
        }, settings.move.duration + 50)
      }
    }
  }
}
