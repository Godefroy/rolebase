import ModalPanel, { modalPanelWidth } from '@/common/atoms/ModalPanel'
import { Title } from '@/common/atoms/Title'
import { useElementSize } from '@/common/hooks/useElementSize'
import useIsSidePanel from '@/common/hooks/useIsSidePanel'
import useOverflowHidden from '@/common/hooks/useOverflowHidden'
import useUpdatableQueryParams from '@/common/hooks/useUpdatableQueryParams'
import CirclesGraph from '@/graph/CirclesGraph'
import { GraphProvider } from '@/graph/contexts/GraphContext'
import useGraphContextMenu from '@/graph/hooks/useGraphContextMenu'
import useGraphEvents from '@/graph/hooks/useGraphEvents'
import useGraphView from '@/graph/hooks/useGraphView'
import { SidebarContext } from '@/layout/contexts/SidebarContext'
import MemberContent from '@/member/components/MemberContent'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Box, useColorMode } from '@chakra-ui/react'
import { GraphView } from '@rolebase/shared/model/graph'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { CirclesPanel, isCirclesPanel } from '../circlesPanels'
import CircleContent from '../components/CircleContent'
import CirclesGraphOptions from '../components/CirclesGraphOptions'
import CirclesPanelContent from '../components/CirclesPanelContent'
import { CircleProvider } from '../contexts/CIrcleContext'

type CirclesPageParams = {
  circleId: string
  memberId: string
  parentId: string
  view: string
  folded: string
  panel: string
}

enum Panels {
  None,
  Circle,
  Member,
  // A panel of the settings menu, named by the `panel` query param
  Settings,
}

export default function CirclesPage() {
  const { t } = useTranslation()
  const sidebarContext = useContext(SidebarContext)

  // On desktop (lg+) the panel is a fixed side panel and the page does not
  // scroll. Below lg the graph and panel stack vertically and the whole page
  // scrolls as one, the graph taking the first part of the screen.
  const isSidePanel = useIsSidePanel()
  useOverflowHidden(isSidePanel)

  const { params: queryParams, changeParams } =
    useUpdatableQueryParams<CirclesPageParams>()
  const { org, orgData } = useOrgContext()
  const [ready, setReady] = useState(false)

  // Content size
  const boxRef = useRef<HTMLDivElement>(null)
  const boxSize = useElementSize(boxRef)

  // Panels
  const [panel, setPanel] = useState<Panels>(Panels.None)
  const [settingsPanel, setSettingsPanel] = useState<CirclesPanel | undefined>()
  const [circleId, setCircleId] = useState<string | undefined>()
  const [memberId, setMemberId] = useState<string | null | undefined>()
  const [parentId, setParentId] = useState<string | undefined>()

  // Graph view, kept in the URL like the selected circle so it is shareable
  // and survives navigation. Falls back to the organization default.
  const graphView = useGraphView()

  // Graph events, plus the right click menu rendered below the graph
  const graphEvents = useGraphEvents()
  const { events: contextMenuEvents, contextMenu } = useGraphContextMenu({
    view: graphView.view,
  })
  const events = useMemo(
    () => ({ ...graphEvents, ...contextMenuEvents }),
    [graphEvents, contextMenuEvents]
  )

  const handleViewChange = useCallback(
    ({ view, folded }: GraphView) =>
      changeParams({ view, folded: folded ? '1' : undefined }),
    [changeParams]
  )

  const handleClosePanel = useCallback(
    () =>
      changeParams({
        circleId: undefined,
        memberId: undefined,
        parentId: undefined,
        panel: undefined,
      }),
    [changeParams]
  )

  // Zoom offset to keep the focused circle visible next to the side panel
  const focusCropRight =
    isSidePanel && panel !== Panels.None ? modalPanelWidth : 0
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

    // Open panel. A selection made from a settings panel (a link in a log
    // entry, a vacant role) takes over the panel, and closing it goes back to
    // the org chart.
    setSettingsPanel(
      isCirclesPanel(queryParams.panel) ? queryParams.panel : undefined
    )
    if (queryParams.memberId) {
      setMemberId(queryParams.memberId)
      setPanel(Panels.Member)
    } else if (queryParams.circleId) {
      setPanel(Panels.Circle)
    } else if (isCirclesPanel(queryParams.panel)) {
      setPanel(Panels.Settings)
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
            key={`${graphView.view}${graphView.folded}${colorMode}`}
            view={graphView.view}
            folded={graphView.folded}
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

      {contextMenu}

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

      {panel === Panels.Settings && settingsPanel && (
        <ModalPanel isOpen onClose={handleClosePanel}>
          <CirclesPanelContent
            panel={settingsPanel}
            changeTitle
            flowHeight={!isSidePanel}
          />
        </ModalPanel>
      )}

      {panel === Panels.None && (
        <Title>{t('CirclesPage.title', { org: org?.name })}</Title>
      )}

      <CirclesGraphOptions
        value={graphView}
        onChange={handleViewChange}
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
