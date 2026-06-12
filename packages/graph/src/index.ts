// Core
export { CirclesGraph } from './core/CirclesGraph'
export { Graph } from './core/Graph'
export type { GraphEmitterEvents } from './core/Graph'
export { computeVisibleNodes } from './core/culling'
export { computeLayout } from './core/layout'
export type { Layout } from './core/layout'
export { viewStrategies } from './core/views'
export type { CircleData, ViewStrategy } from './core/views'

// React components
export { default as CirclesGraphView } from './react/CirclesGraphView'
export type { CirclesGraphViewProps } from './react/CirclesGraphView'
export { GraphContext, GraphProvider } from './react/GraphContext'

// Static rendering (browser-safe; server helpers are in '@rolebase/graph/server')
export { fitGraphTitles } from './static/fitGraphTitles'
export { default as StaticCirclesGraph } from './static/StaticCirclesGraph'
export type { StaticCirclesGraphProps } from './static/StaticCirclesGraph'

// Types and settings
export { default as graphSettings } from './settings'
export * from './types'
