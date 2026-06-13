# @rolebase/graph

Interactive org chart visualization for Rolebase. It renders an organization as
a circle-packing diagram: every role is a circle, nested inside its parent, with
members shown inside their circles. The view is zoomable, pannable, and supports
selecting and dragging circles and members.

The same package powers three contexts from one codebase:

- **Interactive** — the live graph in the web app (zoom, pan, drag & drop,
  selection-driven relayout).
- **Static** — a non-interactive render (a blank page, or an image export),
  everything drawn in its final state with no animation.
- **Server** — the static render produced as HTML markup with no DOM access, to
  be loaded in a headless browser and screenshotted (e.g. PNG export).

## Technical choices

- **Layout with D3.** Circle packing (`d3-hierarchy`) computes the geometry, and
  `d3-zoom` drives pan/zoom. Everything else (rendering, animation, interaction
  glue) is custom.
- **DOM rendering, not SVG or Canvas.** Each node is an absolutely-positioned
  HTML element transformed with CSS, inside a single pan/zoom container that
  carries the zoom transform. This keeps text crisp, styling simple, and
  accessibility/event handling native, at the cost of having to manage GPU
  compositing carefully (see below).
- **Framework-agnostic core + thin React layer.** A plain core owns the data,
  layout, zoom, and the set of nodes to display, and communicates through
  events. React subscribes to those events and renders. The core never depends
  on React and makes no assumption that a browser DOM exists, which is what lets
  the static/server render work.
- **Windowing (culling).** Only the nodes actually visible in the viewport are
  mounted. The packing hierarchy doubles as a spatial index, so finding the
  visible subset is cheap. This is the main lever that keeps the DOM and the
  layer count bounded on large organizations.
- **Self-contained styles.** Styles are injected as a scoped `<style>` block, so
  the package renders identically whether it runs in the app, on a blank page,
  or server-side.
- **Compositing-budget-driven animation.** The animation strategy is shaped by
  the GPU memory budget of mobile browsers, not by what looks nicest in
  isolation. Transient work is engineered to collapse into a small, bounded
  number of composited layers.

## Things to watch when developing

- **GPU compositing memory is the binding constraint, especially on mobile.**
  On high-DPI phones each composited layer is far more expensive than on
  desktop, and exceeding the per-tab budget crashes the page. The hard rule:
  an animation must never promote roughly one GPU layer per node. Animate many
  elements together as a single layer, prefer instant (discrete) visibility
  changes over continuous per-element fades, and hide elements that are moving
  in bulk rather than transitioning all of them at once.

- **Don't derive per-frame styling from the live zoom.** Anything that reads the
  zoom continuously is re-evaluated every frame for every element and tends to
  re-composite the whole tree. Prefer values decided at culling time, which runs
  in discrete steps rather than on every frame.

- **Keep the core browser-free and SSR-safe.** The non-React core and the static
  render path must not assume a DOM or `window`; guard any browser-only API.
  Breaking this breaks the server export.

- **One component set, three render modes.** The node components are shared
  across interactive, static, and server rendering. A change has to hold in all
  three, including the headless-screenshot path (which has to wait for fonts and
  images before capturing).

- **Keep the export consistent with the app.** The static/server render must
  reproduce what users see, which means applying the same data preparation the
  app does (color inheritance, resized avatars, etc.) rather than rendering raw
  data.

- **Verify on a real device and inspect layers.** When touching rendering or
  animation, test on an actual high-DPI mobile device and look at the composited
  layers (Safari/Chrome layer inspector), not just the JS heap. Layer count and
  size are what matter here; a change can look fine on desktop and still spike
  layers on a phone.
