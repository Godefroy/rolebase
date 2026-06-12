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

.rb-graph .node {
  position: absolute;
  transition:
    translate ${moveTransition},
    scale ${moveTransition},
    box-shadow ${moveTransition},
    opacity ${moveTransition};
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
  /* Fade in when approaching zoom scale 1 */
  opacity: clamp(0, (var(--zoom-scale) - 1) * 20 + 1, 1);
  pointer-events: none;
}

.rb-graph .member {
  background-position: center;
  background-size: cover;
  background-origin: border-box;
  /* Fade in when approaching zoom scale 1 */
  opacity: clamp(0, (var(--zoom-scale) - 1) * 20 + 1, 1);
  pointer-events: var(--member-pointer-events, auto);
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
