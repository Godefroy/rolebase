import CircleContent from '@/circle/components/CircleContent'
import { CircleProvider } from '@/circle/contexts/CIrcleContext'
import {
  CircleMemberContext,
  CircleMemberContextValue,
} from '@/circle/contexts/CircleMemberContext'
import Loading from '@/common/atoms/Loading'
import { useElementSize } from '@/common/hooks/useElementSize'
import CirclesGraph, { CirclesGraphInstance } from '@/graph/CirclesGraph'
import GraphShortcutsButton from '@/graph/components/GraphShortcutsButton'
import { GraphProvider } from '@/graph/contexts/GraphContext'
import { CirclesGraphViews, GraphEvents } from '@/graph/types'
import DraftOrgProvider from '@/org/contexts/DraftOrgProvider'
import ReadonlyOrgProvider from '@/org/contexts/ReadonlyOrgProvider'
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { ProposalLog } from '@rolebase/shared/model/proposal'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useDraftOrgEditActions from '../hooks/useDraftOrgEditActions'
import useProposalDraft from '../hooks/useProposalDraft'
import ProposalLogList from './ProposalLogList'

interface Props {
  logs: ProposalLog[]
  // The thread's circle: the only circle a member can edit without governance
  // rights (the proposal concerns it and goes to a vote).
  circleId?: string
  // Read-only viewer of the modified org chart (no editing, no save)
  readOnly?: boolean
  onChange?(logs: ProposalLog[]): void
  onClose(): void
}

export default function ProposalGraphEditor({
  logs,
  circleId,
  readOnly,
  onChange,
  onClose,
}: Props) {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()

  // On desktop (lg+) the role panel and changes list sit in a fixed side panel
  // to the right of the graph, each with its own scroll. Below lg they flow
  // below the graph and the whole modal scrolls as one (like CirclesPage).
  const isSidePanel = useBreakpointValue({ base: false, lg: true }) ?? false

  // The current member acts as a leader of the thread's circle while editing,
  // so they can prepare changes on it (Agile governance).
  const currentMember = useCurrentMember()
  const actingLeader = useMemo(
    () =>
      !readOnly && currentMember && circleId
        ? { circleId, member: currentMember }
        : undefined,
    [readOnly, currentMember, circleId]
  )
  const draft = useProposalDraft(logs, actingLeader)
  const actions = useDraftOrgEditActions(draft)

  const boxRef = useRef<HTMLDivElement>(null)
  const boxSize = useElementSize(boxRef)
  const graphRef = useRef<CirclesGraphInstance>()

  // Selected circle (local, no URL navigation in the editor). Open on the
  // thread's circle, the one the proposal concerns.
  const [selectedCircleId, setSelectedCircleId] = useState<string | undefined>(
    circleId
  )

  // Zoom on the thread's circle once the graph is ready. Selecting alone can be
  // overridden by the graph's initial zoom-to-fit, so re-focus after it settles.
  useEffect(() => {
    if (!draft.ready || !circleId) return
    const timeout = setTimeout(() => {
      graphRef.current?.selectCircle(circleId)
    }, 500)
    return () => clearTimeout(timeout)
  }, [draft.ready, circleId])

  // Editor graph events: edits go through the draft actions, selection is local.
  // In read-only mode, only selection is kept (no editing).
  const events: GraphEvents = useMemo(
    () =>
      readOnly
        ? {
            onCircleClick: (circleId) => setSelectedCircleId(circleId),
            onMemberClick: (circleId) => setSelectedCircleId(circleId),
            onClickOutside: () => setSelectedCircleId(undefined),
          }
        : {
            onCircleClick: (circleId) => setSelectedCircleId(circleId),
            onMemberClick: (circleId) => setSelectedCircleId(circleId),
            onClickOutside: () => setSelectedCircleId(undefined),
            onCircleMove: async (circleId, targetCircleId) => {
              await actions.moveCircle(circleId, targetCircleId)
              return true
            },
            onCircleCopy: actions.copyCircle,
            onMemberMove: async (memberId, parentCircleId, targetCircleId) => {
              if (targetCircleId)
                await actions.addCircleMember(targetCircleId, memberId)
              await actions.removeCircleMember(parentCircleId, memberId)
              return true
            },
            onMemberAdd: async (memberId, circleId) => {
              await actions.addCircleMember(circleId, memberId)
              return true
            },
          },
    [actions, readOnly]
  )

  const handleDone = () => {
    onChange?.(draft.logs)
    onClose()
  }

  // Scope circle/member links to the editor: selecting opens the local role
  // panel instead of navigating away to the global circle modal.
  const circleMemberValue = useMemo<CircleMemberContextValue>(
    () => ({
      circleId: selectedCircleId,
      memberId: undefined,
      parentId: undefined,
      canFocus: false,
      goTo: (circleId) => setSelectedCircleId(circleId),
    }),
    [selectedCircleId]
  )

  const content = (
    <CircleMemberContext.Provider value={circleMemberValue}>
      <GraphProvider>
            <Flex
              direction="column"
              h={isSidePanel ? '100%' : undefined}
              minH={isSidePanel ? 0 : '100%'}
              flex={isSidePanel ? '1' : undefined}
            >
              <Flex
                p={3}
                align="center"
                borderBottomWidth="1px"
                bg="yellow.50"
                _dark={{ bg: 'yellow.900' }}
              >
                <Box>
                  <Heading size="md">
                    {t(
                      readOnly
                        ? 'ProposalGraphEditor.headingView'
                        : 'ProposalGraphEditor.heading'
                    )}
                  </Heading>
                  {!readOnly && (
                    <Text
                      mt={1}
                      fontSize="sm"
                      color="gray.500"
                      _dark={{ color: 'gray.300' }}
                    >
                      {t('ProposalGraphEditor.subtitle')}
                    </Text>
                  )}
                </Box>
                <Box flex="1" />
                <Button
                  colorScheme="yellow"
                  onClick={readOnly ? onClose : handleDone}
                >
                  {t(readOnly ? 'common.close' : 'ProposalGraphEditor.done')}
                </Button>
              </Flex>

              {/*
                Graph + panel. The direction flips with the breakpoint (row on
                desktop, column below lg) but the graph Box below stays the same
                element either way, so its ResizeObserver (useElementSize) keeps
                tracking the window resize instead of going stale on a remount.
              */}
              <Flex
                direction={isSidePanel ? 'row' : 'column'}
                flex={isSidePanel ? '1' : undefined}
                minH={isSidePanel ? 0 : undefined}
              >
                {/* Graph: fills the space next to the panel on desktop, a
                    fixed-height band above the panel when stacked. */}
                <Box
                  ref={boxRef}
                  flex={isSidePanel ? '1' : undefined}
                  h={isSidePanel ? undefined : '50dvh'}
                  flexShrink={0}
                  position="relative"
                  overflow="hidden"
                >
                  {!draft.ready && <Loading active center />}
                  {draft.ready && draft.orgData && boxSize && (
                    <CirclesGraph
                      ref={graphRef}
                      key={colorMode}
                      view={CirclesGraphViews.AllCircles}
                      org={draft.orgData}
                      events={events}
                      width={boxSize.width}
                      height={boxSize.height}
                      selectedCircleId={selectedCircleId}
                    />
                  )}
                  <GraphShortcutsButton position="absolute" top={2} right={2} />
                </Box>

                {/* Side panel (desktop) / stacked below the graph (mobile):
                    role then changes list. */}
                <Flex
                  direction="column"
                  w={isSidePanel ? '420px' : 'full'}
                  maxW={isSidePanel ? '40%' : undefined}
                  borderLeftWidth={isSidePanel ? '1px' : undefined}
                  borderTopWidth={isSidePanel ? undefined : '1px'}
                  minH={isSidePanel ? 0 : undefined}
                >
                  <Box flex={isSidePanel ? '1' : undefined} minH={isSidePanel ? 0 : undefined}>
                    {selectedCircleId ? (
                      <CircleProvider circleId={selectedCircleId}>
                        <CircleContent
                          onlyRole
                          readOnly={readOnly}
                          flowHeight={!isSidePanel}
                          onClose={() => setSelectedCircleId(undefined)}
                        />
                      </CircleProvider>
                    ) : (
                      <Box p={4} color="gray.500" _dark={{ color: 'gray.300' }}>
                        {t(
                          readOnly
                            ? 'ProposalGraphEditor.viewCircle'
                            : 'ProposalGraphEditor.selectCircle'
                        )}
                      </Box>
                    )}
                  </Box>

                  {/* Changes: scrolls within the panel on desktop, flows to its
                      natural height when stacked. */}
                  <Box
                    borderTopWidth="1px"
                    p={4}
                    maxH={isSidePanel ? '35%' : undefined}
                    overflowY={isSidePanel ? 'auto' : undefined}
                    flexShrink={0}
                  >
                    <Heading size="sm" mb={3}>
                      {t('ProposalGraphEditor.changes')}
                    </Heading>
                    <ProposalLogList
                      logs={draft.logs}
                      onRemove={readOnly ? undefined : draft.removeLog}
                    />
                  </Box>
                </Flex>
              </Flex>
            </Flex>
      </GraphProvider>
    </CircleMemberContext.Provider>
  )

  return readOnly ? (
    <ReadonlyOrgProvider
      orgData={draft.orgData}
      roleOverlays={draft.roleOverlays}
    >
      {content}
    </ReadonlyOrgProvider>
  ) : (
    <DraftOrgProvider draft={draft}>{content}</DraftOrgProvider>
  )
}
