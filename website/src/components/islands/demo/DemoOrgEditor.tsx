import { CirclesGraphViews } from '@rolebase/shared/model/graph'
import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react'
import type { DemoOrgKey, DemoTexts } from '../../../demo/orgDemoData'
import IslandSpinner from '../IslandSpinner'
import DemoViewTabs from './DemoViewTabs'

// The heavy editor (Chakra + Apollo + webapp panels + graph) is code-split and
// only fetched once the demo scrolls into view, keeping the homepage light.
const DemoOrgEditorInner = lazy(() => import('./DemoOrgEditorInner'))

interface Props {
  demo?: string
  texts: DemoTexts
  lang?: string
  // Desktop height. On mobile the island is content-driven (square graph + the
  // panel stacked below).
  height?: string
}

// The hierarchical tree reads best on a classic company org chart (departments
// and named directors), so that tab swaps the example organization too.
const TREE_DEMO: DemoOrgKey = 'classic'

// Homepage product-preview island: a real, editable Rolebase org chart (graph +
// role/member panels) running entirely in the browser from a static fixture,
// with tabs switching between the three org chart views.
export default function DemoOrgEditor({
  demo = 'demo',
  texts,
  lang = 'en',
  height = '560px',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [view, setView] = useState<CirclesGraphViews>(CirclesGraphViews.Circles)
  const id = useId().replace(/[:]/g, '')
  const cls = `demo-org-island-${id}`

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // The tree tab runs on its own example organization, so the in-memory draft
  // is re-seeded (and edits reset) only when moving to or from that dataset.
  const demoKey =
    view === CirclesGraphViews.Tree ? TREE_DEMO : (demo as DemoOrgKey)

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <DemoViewTabs
        value={view}
        onChange={setView}
        labels={texts.views}
      />

      <div
        className={cls}
        style={{
          position: 'relative',
          width: '100%',
          borderBottomLeftRadius: '0.75rem',
          borderBottomRightRadius: '0.75rem',
          border: '1px solid rgba(124, 58, 237, 0.18)',
          // No line between the tabs and the chart: the active tab flows
          // straight into the panel
          borderTop: 0,
          overflow: 'hidden',
          background: '#fff',
          textAlign: 'left',
        }}
      >
        {/* Reserve a square-ish area on mobile and the desktop height on >=md,
            so the placeholder and the loading spinner have room before
            hydration. */}
        <style>{`.${cls}{min-height:min(80dvh,100vw)}@media (min-width:768px){.${cls}{min-height:${height}}}`}</style>
        {visible ? (
          <Suspense fallback={<IslandSpinner />}>
            <DemoOrgEditorInner
              key={demoKey}
              demo={demoKey}
              view={view}
              texts={texts}
              lang={lang}
              height={height}
            />
          </Suspense>
        ) : (
          <IslandSpinner />
        )}
      </div>
    </div>
  )
}
