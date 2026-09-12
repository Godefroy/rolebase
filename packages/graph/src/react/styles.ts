import settings from '../settings'

const moveTransition = `${settings.move.duration}ms ease-out`
// Edges cannot be animated from one shape to another, so they step aside while
// nodes move and fade back in, over the same duration, once they have arrived
const linkFade = `opacity ${moveTransition}`

// Size of node before scaling
// Should be high enough to be divided for border width (in Panzoom)
// Should be low enough to not glitch when scaling
export const nodeSize = 200

const { baseSize } = settings.titles
const {
  cardRadius,
  cardBorder,
  cardPadding,
  cardTitlePadding,
  titleFontSize,
  titleLineHeight,
  memberRowRadius,
  memberRowPadding,
} = settings.tree

const minimap = settings.minimap

// Styles of the graph, scoped under the .rb-graph container class.
// Rendered in a <style> tag by the graph components, so the package
// works in the webapp, in a blank page and in server rendering.
export const graphStyles = `
.rb-graph,
.rb-graph * {
  box-sizing: border-box;
}
.rb-graph {
  position: relative;
  overflow: hidden;
  font-family: ${settings.style.fontFamily};
}
.rb-graph-panzoom {
  position: relative;
  transform-origin: top left;
  user-select: none;
}
/* Viewport-fixed background shown while moved nodes are hidden during a
   select-relayout animation: filled with the focus circle parent color so the
   focus looks nested in it (replacing the white page). Behind the panzoom. */
.rb-graph-reposition-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: background-color ${moveTransition};
}
/* Wrapper that reveals a set of entering sibling nodes as a single composited
   layer: only its transform is animated (scale 0 -> 1 about the parent center),
   so its children paint into this one layer instead of one layer per node.
   Sits at the panzoom origin so children keep their absolute coordinates. */
.rb-graph .enter-group {
  position: absolute;
  transition:
    transform ${moveTransition},
    opacity ${moveTransition};
}
.rb-graph .enter-group-content {
  position: absolute;
  top: 0;
  left: 0;
}

.rb-graph .node {
  position: absolute;
  /* Only translate/scale are transitioned (enter and data moves).
     - opacity is intentionally not transitioned: it toggles on the
       level-hidden crossfade, and animating it would promote one GPU layer
       per circle for the whole fade (a spike when circles appear/disappear).
       The fade is now an instant snap, in phase with the discrete titles.
     - box-shadow only applies to the dragged node (.drag-node below). */
  transition:
    translate ${moveTransition},
    scale ${moveTransition};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 50%;
  background-color: var(--bg-color);
  border-width: 0;
  border-style: solid;
  border-color: var(--outline-color);
}
/* Hover, selection and drop-target outlines are drawn by an overlay rather
   than by the node's own border or shadow:
   - a border takes part in the box model (box-sizing: border-box), so making
     one appear shrinks the content box, shifting the node content and
     resizing the avatar images laid against the padding box;
   - an inset shadow paints under the children, so the avatar image, which
     covers the whole node, hides it.
   The overlay is a pseudo-element, generated last, so it paints above every
   child. It exists only on the one or two nodes concerned, and only they read
   the per-frame --zoom-scale. */
.rb-graph .node.selected::after,
.rb-graph .node.clickable:hover::after,
.rb-graph .node.drag-target::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border-style: solid;
  border-color: var(--outline-color);
  border-width: calc(4px / var(--zoom-scale) / var(--node-scale));
  pointer-events: none;
}
.rb-graph .node.clickable:hover::after {
  border-color: var(--hover-outline-color);
}
.rb-graph .node.drag-node {
  box-shadow: 0 10px 10px var(--box-shadow-color);
  /* Restore the shadow fade only on the node being dragged */
  transition:
    translate ${moveTransition},
    scale ${moveTransition},
    box-shadow ${moveTransition},
    opacity ${moveTransition};
}
.rb-graph .node.dragging {
  opacity: 0.7;
  z-index: 1;
  /* Reset transition while dragging to avoid lagging behind the mouse */
  transition: box-shadow ${moveTransition} !important;
}
.rb-graph .node.drag-target::after {
  border-width: calc(8px / var(--zoom-scale) / var(--node-scale));
}
/* Nodes inside a circle that displays its centered title:
   faded out (crossfade with the title) and click-through */
.rb-graph .node.level-hidden {
  opacity: 0;
  pointer-events: none;
}
/* Elements much bigger than the viewport must not transition: animating
   them promotes them to huge composited layers (crash on mobile) */
.rb-graph .node.giant,
.rb-graph .circle-title.giant {
  transition: none;
}
/* Nodes inside an EnterGroup are animated together by the wrapper transform,
   so they need no individual transition: keeping one would let the browser
   promote each child to its own GPU layer instead of painting them all into
   the single wrapper layer. */
.rb-graph .node.in-enter-group {
  transition: none;
}
/* While actively panning/zooming on a constrained device (class toggled on
   zoom start/end in Graph.ts), suppress every node/title transition. The
   panzoom container handles the visual movement with a single transform;
   without this, scale-derived opacity changes animate each frame and promote
   one GPU layer per node for the whole gesture, overflowing memory on mobile. */
.rb-graph-zooming .node,
.rb-graph-zooming .circle-title,
.rb-graph-zooming .circle-title-center,
.rb-graph-zooming .circle-title-top {
  transition: none !important;
}

/* Hierarchical views: cards linked by edges, listing their members.
   A rectangular node is rendered at its layout size (--node-scale is 1), so
   every inner size below is expressed in layout units and scales with the
   panzoom transform, without any per-frame CSS variable dependency. */
.rb-graph .node.rect {
  border-radius: ${cardRadius}px;
}
.rb-graph .node.card {
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 ${cardPadding}px;
  overflow: hidden;
}
/* One member per row: avatar, then name, aligned left */
.rb-graph .node.card-member {
  border-radius: ${memberRowRadius}px;
  justify-content: flex-start;
  text-align: left;
  padding: 0 ${memberRowPadding}px;
  overflow: hidden;
}
.rb-graph .card-member-avatar {
  position: relative;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--outline-color);
}
.rb-graph .card-member-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
.rb-graph .card-member-initial {
  color: white;
  font-weight: bold;
  font-size: 18px;
  line-height: 1;
}
.rb-graph .card-member-name {
  margin-left: ${memberRowPadding + 2}px;
  font-size: 22px;
  line-height: 1.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Invited role (link): a dashed outline tells it apart from a sub-role. It is
   always there, at a fixed width, so it never shifts the card content. The
   hover and selection outlines are shadows and stack on top of it. */
.rb-graph .node.card-link {
  border-style: dashed;
  border-width: ${cardBorder}px;
}
.rb-graph .card-title {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 100%;
  font-size: ${titleFontSize}px;
  line-height: ${titleLineHeight}px;
  font-weight: bold;
  padding: ${cardTitlePadding}px 0;
}
.rb-graph .card-title-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--title-lines, 1);
  overflow: hidden;
  overflow-wrap: anywhere;
}
/* Edges, in a single SVG behind the cards. The stroke keeps a constant
   on-screen width, like the node outlines. Reading --zoom-scale (which changes
   every frame) costs one style recomputation on this single element, instead
   of one per edge. */
.rb-graph .tree-links {
  position: absolute;
  overflow: visible;
  pointer-events: none;
  stroke-width: calc(2px / var(--zoom-scale));
}
.rb-graph .tree-link {
  fill: none;
  stroke: var(--link-color);
  stroke-linecap: round;
  transition: ${linkFade};
}
/* An edge steps aside while its endpoints move, and while its node is dragged.
   Hiding is instant, so a stale path is never seen; only the fade back in is
   animated, and only on the edges the change actually touched. */
.rb-graph .tree-link.moving,
.rb-graph .tree-link.dragging {
  opacity: 0;
  transition: none;
}

/* Minimap: overview of the whole layout, in the bottom right corner of the
   visible area (its offsets are set inline, a side panel pushes it aside). It
   sits outside the panzoom, so it stays put while the graph moves under it.
   Clicking or dragging it moves the view to the pointer. */
.rb-graph-minimap {
  position: absolute;
  z-index: 10;
  border-radius: ${minimap.radius}px;
  /* The map fills the panel, so the frame of the view reaches its edges */
  overflow: hidden;
  background-color: var(--minimap-bg);
  box-shadow: 0 0 0 1px var(--minimap-border-color);
  cursor: grab;
  touch-action: none;
  user-select: none;
}
.rb-graph-minimap.dragging {
  cursor: grabbing;
}
.rb-graph-minimap svg {
  display: block;
  overflow: hidden;
}
/* Everything outside the frame is dimmed: the map says at a glance which part
   of the chart is on screen. */
.rb-graph-minimap .minimap-scrim {
  fill: var(--minimap-scrim-color);
}
/* Frame of what is currently on screen. Its stroke keeps its width on screen,
   whatever the scale the layout is drawn at in the map. */
.rb-graph-minimap .minimap-viewport {
  fill: none;
  stroke: var(--minimap-viewport-color);
  stroke-width: 1.5px;
  vector-effect: non-scaling-stroke;
}

.rb-graph .circle-title {
  position: absolute;
  transition:
    translate ${moveTransition},
    scale ${moveTransition};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  pointer-events: none;
}
.rb-graph .circle-title.dragging {
  opacity: 0.7;
  z-index: 1;
  transition: none !important;
}
.rb-graph .circle-title-center {
  font-weight: bold;
  white-space: nowrap;
  font-size: 100px;
}
.rb-graph .circle-title-top {
  position: absolute;
  transform-origin: bottom center;
  /* Acceptable font size for a one-member role at zoom-scale 3 and scale 1 */
  font-size: 36px;
  max-height: 2em;
  min-width: 130%;
  word-wrap: normal;
  font-weight: bold;
  line-height: 1em;
}

.rb-graph .circle-leader {
  display: flex;
  position: absolute;
  top: 0;
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  align-items: center;
  justify-content: center;
  /* Discrete show/hide at zoom scale 1 (flipped only when crossing the
     threshold, see Panzoom), so leaders don't re-composite every zoom frame */
  opacity: var(--leaders-opacity, 0);
  pointer-events: none;
}

.rb-graph .member {
  /* Members follow the level-hidden rule like circles: visible by default
     (inherited node opacity), hidden via .node.level-hidden when their circle
     shows its centered title. No zoom-scale gate. */
  /* Position/scale transition kept for enter and data moves; no opacity
     transition (visibility is meant to be instant). */
  transition:
    translate ${moveTransition},
    scale ${moveTransition};
}
/* Avatar rendered as an <img> (not a background-image) so the platform can
   decode it asynchronously and evict it when off-screen, bounding image
   memory on mobile. Same for circle leaders below. */
.rb-graph .member-image,
.rb-graph .circle-leader-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  pointer-events: none;
}
/* Always show members on members view */
.rb-graph.rb-graph-show-members .member {
  opacity: 1 !important;
  pointer-events: auto;
}
/* Show members, leaders and deep circles at any zoom scale (e.g. export) */
.rb-graph.rb-graph-show-all .member {
  opacity: 1 !important;
  pointer-events: auto;
}
.rb-graph.rb-graph-show-all .circle-leader {
  opacity: 1 !important;
}
.rb-graph .member-name {
  color: white;
  text-shadow:
    -1px -1px 0 rgba(0, 0, 0, 0.3),
    1px -1px 0 rgba(0, 0, 0, 0.3),
    -1px 1px 0 rgba(0, 0, 0, 0.3),
    1px 1px 0 rgba(0, 0, 0, 0.3);
  font-size: ${nodeSize / 6}px;
}
.rb-graph .member-name:hover {
  display: block !important;
}
`

// Extra styles for static rendering (server-side or blank page export):
// no animations, everything is rendered in its final state
export const staticGraphStyles = `
.rb-graph-static .node,
.rb-graph-static .circle-title,
.rb-graph-static .circle-title-center,
.rb-graph-static .circle-title-top {
  transition: none !important;
}
/* Top titles are navigation helpers, irrelevant in a fixed image
   (and the root one would be clipped by the frame) */
.rb-graph-static .circle-title-top {
  display: none;
}
`

export { baseSize as titleBaseSize }
