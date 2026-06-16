import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react'
import type { DemoOrgKey, DemoTexts } from '../../../demo/orgDemoData'
import IslandSpinner from '../IslandSpinner'

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

// Homepage product-preview island: a real, editable Rolebase org chart (graph +
// role/member panels) running entirely in the browser from a static fixture.
export default function DemoOrgEditor({
  demo = 'demo',
  texts,
  lang = 'en',
  height = '560px',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
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

  return (
    <div
      ref={ref}
      className={cls}
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '0.75rem',
        border: '1px solid rgba(124, 58, 237, 0.18)',
        overflow: 'hidden',
        background: '#fff',
        textAlign: 'left',
      }}
    >
      {/* Reserve a square-ish area on mobile and the desktop height on >=md, so
          the placeholder and the loading spinner have room before hydration. */}
      <style>{`.${cls}{min-height:min(80dvh,100vw)}@media (min-width:768px){.${cls}{min-height:${height}}}`}</style>
      {visible ? (
        <Suspense fallback={<IslandSpinner />}>
          <DemoOrgEditorInner
            demo={demo as DemoOrgKey}
            texts={texts}
            lang={lang}
            height={height}
          />
        </Suspense>
      ) : (
        <IslandSpinner />
      )}
    </div>
  )
}
