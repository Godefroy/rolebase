import { CircleFullFragment } from '@rolebase/shared/gql'
import { omit } from '../helpers/omit'
import { CirclesGraphViews, GraphParams, RootElement } from '../types'
import { Graph } from './Graph'
import { computeLayout } from './layout'
import { viewStrategies } from './views'

export class CirclesGraph extends Graph<CircleFullFragment[]> {
  public origCircles: CircleFullFragment[] = []
  private dataIds: Set<string> | undefined

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
  }

  destroy() {
    // @ts-ignore
    this.element = undefined
    // @ts-ignore
    this.params = undefined
    // @ts-ignore
    this.origCircles = undefined

    super.destroy()
  }

  selectCircle(id: string | undefined) {
    super.selectCircle(id)
    // Redraw graph when the view depends on the selected circle
    if (viewStrategies[this.view].relayoutOnSelect && this.inputData) {
      this.updateData(this.inputData)
    }
  }

  updateData(circles: CircleFullFragment[]) {
    const firstDraw = !this.inputData
    super.updateData(circles)
    this.origCircles = circles

    const { root, nodes } = computeLayout(
      circles,
      this.view,
      this.selectedCircleId
    )
    this.root = root
    this.nodes = nodes

    // Track nodes added by this update, to animate them on enter
    const prevIds = this.dataIds
    this.dataIds = new Set(nodes.map((node) => node.data.id))
    this.enteringIds = prevIds
      ? new Set(nodes.map((n) => n.data.id).filter((id) => !prevIds.has(id)))
      : this.dataIds

    // Update root radius
    this.updateRootRadius(nodes[0]?.r || root.r || 0)

    // Zoom on root circle at first draw
    if (firstDraw) {
      setTimeout(
        () => this.zoomTo(root.x, root.y, this.focusCircleScale(root)),
        0
      )
    }

    // Save and dispatch nodes data
    this.emit('nodesData', this.nodes)
    this.cull()
  }
}
