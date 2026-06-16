import { CirclesGraphView } from '@rolebase/graph'
import { CirclesGraphViews, type GraphEvents } from '@rolebase/graph'
import type { OrgData } from '@rolebase/shared/model/OrgData'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getDemoOrgData,
  type DemoOrgKey,
  type DemoTexts,
} from '../../demo/orgDemoData'

interface Props {
  // Which example organization to render ('demo' | 'simple'), as a string
  // since it comes from the Astro wrapper props.
  demo?: string
  // Translated role texts (the `demo` i18n subtree), passed from the wrapper
  texts: DemoTexts
  // Graph framing ('AllCircles' | 'Members' | …), as a string from the wrapper
  view?: string
  // Force members and deep circles visible at any zoom (static illustration)
  showAllNodes?: boolean
  // Zoom in on this circle on load (cleaner than showAllNodes for nested views)
  focus?: string
  colorMode?: 'light' | 'dark'
}

// Read-only, illustrative org chart used in documentation pages. Renders a
// static example organization with pan/zoom and circle selection only (no
// editing). Built on the same D3 graph as the product (`@rolebase/graph`).
export default function OrgChartView({
  demo = 'demo',
  texts,
  view = CirclesGraphViews.AllCircles,
  showAllNodes = true,
  focus,
  colorMode = 'light',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<{ selectCircle(id: string): void } | undefined>()
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  )
  const [selectedCircleId, setSelectedCircleId] = useState<string | undefined>(
    focus
  )

  const org: OrgData = useMemo(
    () => getDemoOrgData(demo as DemoOrgKey, texts),
    [demo, texts]
  )

  // Zoom in on the focused circle once the graph has settled (its initial
  // zoom-to-fit would otherwise override an up-front selection).
  useEffect(() => {
    if (!focus || !size) return
    const timeout = setTimeout(() => graphRef.current?.selectCircle(focus), 600)
    return () => clearTimeout(timeout)
  }, [focus, size])

  // Track the container size so the graph fills its wrapper.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (rect) setSize({ width: rect.width, height: rect.height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const events: GraphEvents = useMemo(
    () => ({
      onCircleClick: (circleId) => setSelectedCircleId(circleId),
      onMemberClick: (circleId) => setSelectedCircleId(circleId),
      onClickOutside: () => setSelectedCircleId(undefined),
    }),
    []
  )

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'left',
        borderRadius: '0.75rem',
        border: '1px solid rgba(124, 58, 237, 0.18)',
        overflow: 'hidden',
        background: '#fafafa',
      }}
    >
      {size && (
        <CirclesGraphView
          ref={graphRef as never}
          key={colorMode}
          view={view as CirclesGraphViews}
          org={org}
          width={size.width}
          height={size.height}
          colorMode={colorMode}
          events={events}
          selectedCircleId={selectedCircleId}
          showAllNodes={showAllNodes}
        />
      )}
    </div>
  )
}
