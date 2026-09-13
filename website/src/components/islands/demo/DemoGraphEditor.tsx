import CircleContent from '@/circle/components/CircleContent'
import {
  CircleMemberContext,
  type CircleMemberContextValue,
} from '@/circle/contexts/CircleMemberContext'
import { CircleProvider } from '@/circle/contexts/CIrcleContext'
import { useElementSize } from '@/common/hooks/useElementSize'
import CirclesGraph from '@/graph/CirclesGraph'
import GraphShortcutsButton from '@/graph/components/GraphShortcutsButton'
import GraphShortcutsContent from '@/graph/components/GraphShortcutsContent'
import useGraphContextMenu from '@/graph/hooks/useGraphContextMenu'
import MemberContent from '@/member/components/MemberContent'
import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'
import { Box, Flex, useColorMode, useToast } from '@chakra-ui/react'
import { ArrowUpIcon } from 'src/icons'
import {
  CirclesGraphViews,
  isMac,
  type GraphEvents,
} from '@rolebase/graph'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DemoUiText } from '../../../demo/orgDemoData'

// What the panel next to the org chart shows: a selection made in the chart,
// or the org chart shortcuts (the app opens them as a panel too).
type Panel =
  | { kind: 'circle'; circleId: string }
  | { kind: 'member'; memberId: string; circleId?: string }
  | { kind: 'shortcuts' }

interface Props {
  ui?: DemoUiText
  // Desktop height of the island (mobile is content-driven).
  height?: string
  // Org chart framing, driven by the tabs above the island
  view?: CirclesGraphViews
}

// Editable product preview body: the real org-chart graph plus the real
// role/member panels, reading the live in-memory org context (DemoOrgProvider).
// Desktop: graph and panel side by side. Mobile: square graph (capped at
// 80dvh) with the panel stacked below, so the island grows instead of scrolling.
export default function DemoGraphEditor({
  ui,
  height = '560px',
  view = CirclesGraphViews.Circles,
}: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const { colorMode } = useColorMode()
  const { orgData, ready } = useOrgContext()
  const actions = useOrgEditActions()

  // The hierarchical tree spreads far wider than the packed circles, so it is
  // framed on the whole layout and keeps its member cards drawn at any zoom.
  const isTree = view === CirclesGraphViews.Tree

  const boxRef = useRef<HTMLDivElement>(null)
  const boxSize = useElementSize(boxRef)
  const [panel, setPanel] = useState<Panel | undefined>()
  // The circle the chart is focused on, when the panel comes from a selection
  const panelCircleId =
    panel && 'circleId' in panel ? panel.circleId : undefined
  const panelMemberId = panel?.kind === 'member' ? panel.memberId : undefined

  // When the selected role or member is archived it leaves the org data, so
  // close the panel.
  useEffect(() => {
    if (!ready || !orgData) return
    if (
      (panelCircleId && !orgData.getCircle(panelCircleId)) ||
      (panelMemberId && !orgData.getMember(panelMemberId))
    ) {
      setPanel(undefined)
    }
  }, [orgData, ready, panelCircleId, panelMemberId])

  // Right click menu: the role actions only (no org-wide navigation here)
  const { events: contextMenuEvents, contextMenu } = useGraphContextMenu({
    view,
    onlyRole: true,
  })

  const events: GraphEvents = useMemo(() => {
    // A single-member role can hold only one member; warn and refuse otherwise.
    const memberAddRefused = (circleId: string) => {
      const circle = orgData?.getCircle(circleId)
      const role = circle && orgData?.getRole(circle.roleId)
      if (
        role?.singleMember &&
        (orgData?.membersOf(circleId).length ?? 0) >= 1
      ) {
        toast({
          title: t('GraphActions.singleMemberFull'),
          status: 'warning',
          duration: 4000,
          isClosable: true,
        })
        return true
      }
      return false
    }
    return {
      ...contextMenuEvents,
      onCircleClick: (circleId) => setPanel({ kind: 'circle', circleId }),
      onMemberClick: (circleId, memberId) =>
        setPanel({ kind: 'member', circleId, memberId }),
      onClickOutside: () => setPanel(undefined),
      onCircleMove: async (circleId, targetCircleId) => {
        await actions.moveCircle(circleId, targetCircleId)
        return true
      },
      onCircleCopy: actions.copyCircle,
      onMemberMove: async (memberId, parentCircleId, targetCircleId) => {
        if (targetCircleId && memberAddRefused(targetCircleId)) return false
        if (targetCircleId) await actions.addCircleMember(targetCircleId, memberId)
        await actions.removeCircleMember(parentCircleId, memberId)
        return true
      },
      onMemberAdd: async (memberId, circleId) => {
        if (memberAddRefused(circleId)) return false
        await actions.addCircleMember(circleId, memberId)
        return true
      },
    }
  }, [actions, orgData, toast, t, contextMenuEvents])

  const circleMemberValue = useMemo<CircleMemberContextValue>(
    () => ({
      circleId: panelCircleId,
      memberId: panelMemberId,
      parentId: undefined,
      canFocus: false,
      goTo: (circleId, memberId) =>
        setPanel(
          memberId
            ? { kind: 'member', circleId, memberId }
            : circleId
              ? { kind: 'circle', circleId }
              : undefined
        ),
    }),
    [panelCircleId, panelMemberId]
  )

  return (
    <CircleMemberContext.Provider value={circleMemberValue}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        h={{ base: 'auto', md: height }}
        w="100%"
        minH={0}
      >
        {/* Graph. Desktop: fills the row. Mobile: square, capped at 80dvh. The
            graph is absolutely positioned so its explicit pixel size never
            dictates the flex box width — the box resizes freely and the graph
            re-measures to fit. */}
        <Box
          ref={boxRef}
          flex={{ md: 1 }}
          minW={0}
          w={{ base: '100%', md: 'auto' }}
          maxW={{ base: '80dvh', md: 'none' }}
          mx={{ base: 'auto', md: 0 }}
          sx={{ aspectRatio: { base: '1', md: 'auto' } }}
          maxH={{ base: '80dvh', md: 'none' }}
          position="relative"
          overflow="hidden"
          flexShrink={0}
        >
          {ready && orgData && boxSize && (
            <Box position="absolute" inset={0}>
              {/* The graph reads its view at init only, like in the app: a
                  new key rebuilds it when the tab changes */}
              <CirclesGraph
                key={`${view}${colorMode}`}
                view={view}
                org={orgData}
                events={events}
                width={boxSize.width}
                height={boxSize.height}
                showAllNodes={isTree}
                selectedCircleId={panelCircleId}
                scrollable
                scrollZoomHint={ui?.scrollZoom.replace(
                  '{key}',
                  isMac ? '⌘' : 'Ctrl'
                )}
              />
            </Box>
          )}

          {contextMenu}

          {/* Keyboard/drag shortcuts, opened in the panel like in the app */}
          <GraphShortcutsButton
            position="absolute"
            top={3}
            right={3}
            zIndex={1}
            onClick={() => setPanel({ kind: 'shortcuts' })}
          />

          {/* Hint overlay, only on the circles view while no panel is open */}
          {!panel && view === CirclesGraphViews.Circles && (
            <Flex
              position="absolute"
              bottom="16px"
              left="50%"
              transform="translateX(-50%)"
              align="center"
              gap={2}
              px={4}
              py={2}
              borderRadius="full"
              bg="white"
              color="purple.600"
              fontSize="sm"
              fontWeight="medium"
              borderWidth="1px"
              borderColor="blackAlpha.200"
              pointerEvents="none"
              _dark={{ bg: 'gray.700', color: 'purple.200', borderColor: 'whiteAlpha.300' }}
            >
              <ArrowUpIcon size={18} />
              {ui?.clickRole ?? 'Click on a role'}
            </Flex>
          )}
        </Box>

        {/* Panel, only when a role, a member or the shortcuts are open.
            Desktop: to the right with its own scroll. Mobile: below, full
            height (no scroll). */}
        {panel && (
          <Flex
            w={{ base: '100%', md: '340px' }}
            maxW={{ base: '100%', md: '45%' }}
            borderTopWidth={{ base: '1px', md: 0 }}
            borderLeftWidth={{ base: 0, md: '1px' }}
            direction="column"
            minH={0}
            overflowY={{ base: 'visible', md: 'auto' }}
          >
            {panel.kind === 'shortcuts' ? (
              <GraphShortcutsContent
                flowHeight
                onClose={() => setPanel(undefined)}
              />
            ) : panel.kind === 'member' ? (
              <MemberContent
                id={panel.memberId}
                onClose={() => setPanel(undefined)}
              />
            ) : (
              <CircleProvider circleId={panel.circleId}>
                <CircleContent onlyRole onClose={() => setPanel(undefined)} />
              </CircleProvider>
            )}
          </Flex>
        )}
      </Flex>
    </CircleMemberContext.Provider>
  )
}
