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
  // Hierarchical (tree) layout: uniform-width cards linked by edges.
  // All values are layout units (the tree layout does not rescale).
  tree: {
    cardWidth: 320,
    // Title block: vertical padding, then one or more wrapped lines
    cardTitlePadding: 16,
    titleFontSize: 26,
    titleLineHeight: 30,
    // Safety factor on the estimated title width (see titleLineCount): the
    // estimate must never fall short, or the title would be ellipsized.
    titleWidthSafety: 1.08,
    titleMaxLines: 4,
    // Inner padding of a card
    cardPadding: 14,
    // Corner radius and border of a card
    cardRadius: 12,
    cardBorder: 2,
    // Zoom scale applied when a card is selected. Fixed, because every card
    // has the same size: it puts a card and its neighbours on screen at a
    // readable size whatever the depth or the number of children.
    focusScale: 1,
    // Where the focused card sits vertically in the visible area. High up,
    // because a card's children hang below it and have to stay in view.
    focusVerticalRatio: 0.25,
    // Horizontal gap between two sibling cards
    gapX: 44,
    // Vertical gap between two levels
    gapY: 110,
    // Vertical gap between a card and the stack of parent-link cards hanging
    // from it, tighter than between levels: they belong to that card
    stackGapY: 20,
    // Gap between two cards of the same stack: just enough to tell them apart
    stackInnerGapY: 2,
    // Extra horizontal breathing space between two different subtrees
    subtreeSeparation: 1.25,
    // Member rows sit one step lighter than the card that lists them
    memberLightness: { light: 98, dark: 24 },
    // Members listed one per row inside the card
    memberRowHeight: 44,
    memberRowGap: 6,
    memberRowRadius: 8,
    memberRowPadding: 7,
    memberAvatarSize: 30,
    // Leader avatars of a card that shows participants instead of members
    leaderRadius: 22,
    leaderGap: 6,
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
    // Tree layout: member rows are mounted only above this on-screen height.
    // Cards stay readable long after a row becomes an unreadable sliver, so
    // rows get their own threshold.
    treeMemberMinScreenHeight: 14,
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
