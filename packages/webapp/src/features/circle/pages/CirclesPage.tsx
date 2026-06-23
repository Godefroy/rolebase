import ModalPanel, { modalPanelWidth } from '@/common/atoms/ModalPanel'
import { Title } from '@/common/atoms/Title'
import { useElementSize } from '@/common/hooks/useElementSize'
import useOverflowHidden from '@/common/hooks/useOverflowHidden'
import useQueryParams from '@/common/hooks/useQueryParams'
import CirclesGraph from '@/graph/CirclesGraph'
import { GraphProvider } from '@/graph/contexts/GraphContext'
import useGraphEvents from '@/graph/hooks/useGraphEvents'
import { CirclesGraphViews } from '@/graph/types'
import { SidebarContext } from '@/layout/contexts/SidebarContext'
import MemberContent from '@/member/components/MemberContent'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import { Box, useBreakpointValue, useColorMode } from '@chakra-ui/react'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import CircleContent from '../components/CircleContent'
import CirclesGraphOptions from '../components/CirclesGraphOptions'
import { CircleProvider } from '../contexts/CIrcleContext'

type CirclesPageParams = {
  circleId: string
  memberId: string
  parentId: string
}

enum Panels {
  None,
  Circle,
  Member,
}

export default function CirclesPage() {
  const { t } = useTranslation()
  const sidebarContext = useContext(SidebarContext)

  // On desktop (lg+) the panel is a fixed side panel and the page does not
  // scroll. Below lg the graph and panel stack vertically and the whole page
  // scrolls as one, the graph taking the first part of the screen.
  const isSidePanel = useBreakpointValue({ base: false, lg: true }) ?? false
  useOverflowHidden(isSidePanel)

  const queryParams = useQueryParams<CirclesPageParams>()
  const navigateOrg = useNavigateOrg()
  const { org, orgData } = useOrgContext()
  const [ready, setReady] = useState(false)

  // Content size
  const boxRef = useRef<HTMLDivElement>(null)
  const boxSize = useElementSize(boxRef)

  // Panels
  const [panel, setPanel] = useState<Panels>(Panels.None)
  const [view, setView] = useState<CirclesGraphViews>(
    org?.defaultGraphView || CirclesGraphViews.AllCircles
  )
  const [circleId, setCircleId] = useState<string | undefined>()
  const [memberId, setMemberId] = useState<string | null | undefined>()
  const [parentId, setParentId] = useState<string | undefined>()

  // Data
  const circles = orgData?.circles
  const events = useGraphEvents()

  const handleClosePanel = useCallback(() => navigateOrg('roles'), [])

  // Zoom offset to keep the focused circle visible next to the side panel
  const focusCropRight =
    useBreakpointValue({
      base: 0,
      lg: panel === Panels.None ? 0 : modalPanelWidth,
    }) || 0
  const focusCrop = useMemo(
    () => ({
      top: 0,
      left: 0,
      right: focusCropRight,
      bottom: 0,
    }),
    [focusCropRight]
  )

  // URL params
  useEffect(() => {
    if (!ready) return

    // Focus circle (use parentId if available, otherwise circleId)
    setCircleId(queryParams.circleId)
    setParentId(queryParams.parentId)

    // Open panel
    if (queryParams.memberId) {
      setMemberId(queryParams.memberId)
      setPanel(Panels.Member)
    } else if (queryParams.circleId) {
      setPanel(Panels.Circle)
    } else {
      setPanel(Panels.None)
    }
  }, [ready, JSON.stringify(queryParams)])

  // When the page scrolls as one (mobile/tablet), scroll back to the top on
  // selection change so the graph, re-focusing on the new circle/member, is
  // visible instead of staying scrolled down in the panel.
  useEffect(() => {
    if (isSidePanel) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [circleId, memberId, isSidePanel])

  // Color mode
  const { colorMode } = useColorMode()

  // Use effect to update view when org changes
  useEffect(() => {
    if (org?.defaultGraphView) {
      setView(org.defaultGraphView)
    }
  }, [org])

  return (
    <GraphProvider>
      <Box
        ref={boxRef}
        id="circles-graph"
        position={isSidePanel ? 'absolute' : 'relative'}
        top={isSidePanel ? 0 : undefined}
        left={isSidePanel ? 0 : undefined}
        bottom={isSidePanel ? 0 : undefined}
        right={isSidePanel ? 0 : undefined}
        h={
          isSidePanel
            ? undefined
            : panel === Panels.None
            ? `calc(100dvh - ${sidebarContext?.height || 0}px)`
            : '50dvh'
        }
        overflow="hidden"
      >
        {org && orgData && boxSize && (
          <CirclesGraph
            key={view + colorMode}
            view={view}
            org={orgData}
            events={events}
            width={boxSize.width}
            height={boxSize.height}
            focusCrop={focusCrop}
            selectedCircleId={parentId ? `${parentId}_${circleId}` : circleId}
            onReady={() => setReady(true)}
          />
        )}
      </Box>

      {panel === Panels.Circle && circleId && (
        <ModalPanel isOpen onClose={handleClosePanel}>
          <CircleProvider circleId={circleId}>
            <CircleContent changeTitle flowHeight={!isSidePanel} />
          </CircleProvider>
        </ModalPanel>
      )}

      {panel === Panels.Member && memberId && (
        <ModalPanel isOpen onClose={handleClosePanel}>
          <MemberContent id={memberId} changeTitle />
        </ModalPanel>
      )}

      {panel === Panels.None && (
        <Title>{t('CirclesPage.title', { org: org?.name })}</Title>
      )}

      <CirclesGraphOptions
        view={view}
        onViewChange={setView}
        position="absolute"
        top={0}
        left={0}
        right={focusCrop.right}
        zIndex={2}
        p={2}
        pl={
          sidebarContext?.minimize.isOpen && !sidebarContext?.isMobile ? 12 : 2
        }
      />
    </GraphProvider>
  )
}
