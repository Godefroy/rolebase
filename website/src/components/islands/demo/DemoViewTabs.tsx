import { CirclesGraphViews } from '@rolebase/shared/model/graph'
import type { DemoViewsText } from '../../../demo/orgDemoData'

interface Props {
  value: CirclesGraphViews
  onChange: (view: CirclesGraphViews) => void
  labels: DemoViewsText
}

// Big tab strip glued on top of the homepage demo, switching the org chart
// between its three framings. Plain styles: the strip renders before the heavy
// Chakra island loads.
export default function DemoViewTabs({ value, onChange, labels }: Props) {
  const tabs: Array<{ view: CirclesGraphViews; label: string }> = [
    { view: CirclesGraphViews.Circles, label: labels.circles },
    { view: CirclesGraphViews.Tree, label: labels.tree },
    { view: CirclesGraphViews.Members, label: labels.members },
  ]

  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        borderTopLeftRadius: '0.75rem',
        borderTopRightRadius: '0.75rem',
        border: '1px solid rgba(124, 58, 237, 0.18)',
        borderBottom: 0,
        overflow: 'hidden',
        background: 'rgba(124, 58, 237, 0.06)',
      }}
    >
      {/* Backgrounds live here rather than inline, so the hover state can win */}
      <style>{`.demo-view-tab{background:transparent}.demo-view-tab:hover{background:rgba(124,58,237,0.12)}.demo-view-tab[aria-selected='true']{background:#fff}`}</style>
      {tabs.map(({ view, label }, index) => {
        const selected = view === value
        return (
          <button
            key={view}
            type="button"
            role="tab"
            className="demo-view-tab"
            aria-selected={selected}
            onClick={() => onChange(view)}
            style={{
              flex: 1,
              minWidth: 0,
              padding: '0.9rem 0.5rem',
              fontSize: 'clamp(0.85rem, 2.4vw, 1.05rem)',
              fontWeight: selected ? 700 : 500,
              lineHeight: 1.2,
              color: selected ? '#6d28d9' : '#52525b',
              borderLeft:
                index === 0 ? 0 : '1px solid rgba(124, 58, 237, 0.18)',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
