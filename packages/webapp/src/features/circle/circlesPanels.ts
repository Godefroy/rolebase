// Panels of the org chart page that are not tied to a selection in the chart.
// The name of the panel is the `panel` query param of the page.
export const circlesPanels = [
  'shortcuts',
  'baseRoles',
  'vacantRoles',
  'logs',
  'share',
] as const

export type CirclesPanel = (typeof circlesPanels)[number]

export function isCirclesPanel(value?: string): value is CirclesPanel {
  return !!value && circlesPanels.includes(value as CirclesPanel)
}
