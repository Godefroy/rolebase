// Detects devices where GPU compositing memory is the binding constraint:
// high-DPR and/or touch screens. This matters most on iOS, where every
// browser (including Chrome) runs on WebKit with devicePixelRatio 3, so each
// composited layer's backing store costs DPR² = 9x a desktop (DPR 1) layer.
// When many nodes transition at once, one GPU layer is promoted per node and
// the per-tab memory budget is quickly exceeded, which crashes the page.
//
// Used to:
// - cull more aggressively (fewer mounted nodes) — see culling.ts
// - suppress per-node transitions during pan/zoom — see Graph.ts / styles.ts
// so the layer count stays bounded on these devices.

export const pixelRatio =
  typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

export const isConstrainedDevice =
  typeof window !== 'undefined'
    ? pixelRatio >= 2.5 ||
      window.matchMedia?.('(pointer: coarse)')?.matches === true
    : false

// A node bigger than this many viewports does not transition (translate/scale):
// animating it promotes a backing store far larger than the screen for a
// barely-perceptible motion (we only see a portion of it). Lower on
// constrained devices so oversized ancestor circles snap during the holarchy
// select/relayout animation instead of spiking compositing memory, while the
// selected circle (~1 viewport) and its sub-circles still animate.
export const giantViewportRatio = isConstrainedDevice ? 1.5 : 3

