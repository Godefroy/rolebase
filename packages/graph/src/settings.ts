import * as d3 from 'd3'

export default {
  // Determines size of the circle
  memberValue: 10,
  padding: {
    circleWithoutSubCircle: 3,
    circleWithSubCircles: 3,
    circleWithSingleSubCircle: 5,
    membersCircle: 0.5,
  },
  zoom: {
    scaleExtent: [0.05, 3],
    transition: d3.easeCubicOut,
    duration: 500,
  },
  highlight: {
    transition: d3.easeCircleOut,
    duration: 150,
    increaseRadius: 5,
  },
  move: {
    transition: d3.easeCubicInOut,
    duration: 500,
  },
  style: {
    fontFamily: 'basier_circle, sans-serif',
  },
  // Windowing: only nodes visible in the viewport are mounted in the DOM
  culling: {
    // Circles with a smaller radius on screen are culled (with their subtree)
    minScreenRadius: 1.5,
    // Viewport is expanded by this ratio of its max dimension before culling,
    // so that nodes are mounted before they enter the visible area
    viewportMargin: 0.3,
    // Culling is recomputed when the zoom scale changes by this ratio
    recullScaleRatio: 1.2,
    // ... or when the pan moves by this ratio of the viewport max dimension
    recullPanRatio: 0.15,
    // Members are mounted when zoom scale * margin > 1
    // (CSS shows them only when scale > 1, the margin pre-mounts them)
    memberScaleMargin: 1.25,
    // Zoom scale uncertainty applied when testing titles visibility,
    // must be >= recullScaleRatio
    titleScaleMargin: 1.3,
  },
  // Constants of circles titles sizing and opacity (CSS formulas)
  titles: {
    baseSize: 500,
    centerCoverage: 0.9,
    gap: 0.01,
    rate: 100,
    threshold: 2 / 3,
    topThreshold: 2 / 3,
  },
}
