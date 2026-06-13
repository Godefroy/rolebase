import settings from '../settings'

const moveTransition = `${settings.move.duration}ms ease-out`

// Size of node before scaling
// Should be high enough to be divided for border width (in Panzoom)
// Should be low enough to not glitch when scaling
export const nodeSize = 200

const { baseSize } = settings.titles

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
.rb-graph .node.selected {
  border-width: calc(4px / var(--zoom-scale) / var(--node-scale));
}
.rb-graph .node.clickable:hover {
  border-color: var(--hover-outline-color);
  border-width: calc(4px / var(--zoom-scale) / var(--node-scale));
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
.rb-graph .node.drag-target {
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
  /* Discrete show/hide at zoom scale 1, like members (see above) */
  opacity: var(--members-opacity, 0);
  pointer-events: none;
}

.rb-graph .member {
  /* Show/hide at zoom scale 1, as a discrete step (--members-opacity flips
     0<->1 only when crossing the threshold, see Panzoom). Deriving this from
     --zoom-scale instead would re-evaluate and GPU-composite every member on
     each zoom frame while crossing the threshold (dozens of layers at once). */
  opacity: var(--members-opacity, 0);
  pointer-events: var(--member-pointer-events, auto);
  /* Position/scale transition kept for enter and data moves; no opacity
     transition (the step above is meant to be instant). */
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
