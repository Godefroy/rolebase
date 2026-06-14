import CircleContent from '@/circle/components/CircleContent'
import { graphButtonsProps } from '@/circle/components/CirclesGraphOptions'
import { CircleProvider } from '@/circle/contexts/CIrcleContext'
import {
  CircleMemberContext,
  CircleMemberContextValue,
} from '@/circle/contexts/CircleMemberContext'
import Loading from '@/common/atoms/Loading'
import { useElementSize } from '@/common/hooks/useElementSize'
import CirclesGraph, { CirclesGraphInstance } from '@/graph/CirclesGraph'
import GraphShortcutsModal from '@/graph/components/GraphShortcutsModal'
import { GraphProvider } from '@/graph/contexts/GraphContext'
import { CirclesGraphViews, GraphEvents } from '@/graph/types'
import { OrgDataProvider } from '@/org/contexts/OrgDataContext'
import { OrgEditProvider } from '@/org/contexts/OrgEditContext'
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react'
import { ProposalLog } from '@rolebase/shared/model/proposal'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HelpIcon } from 'src/icons'
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
  const draft = useProposalDraft(logs)
  const actions = useDraftOrgEditActions(draft)

  const boxRef = useRef<HTMLDivElement>(null)
  const boxSize = useElementSize(boxRef)
  const graphRef = useRef<CirclesGraphInstance>()
  const shortcutsModal = useDisclosure()

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
            onCircleMove: actions.moveCircle,
            onCircleCopy: actions.copyCircle,
            onMemberMove: async (memberId, parentCircleId, targetCircleId) => {
              if (targetCircleId)
                await actions.addCircleMember(targetCircleId, memberId)
              await actions.removeCircleMember(parentCircleId, memberId)
            },
            onMemberAdd: (memberId, circleId) =>
              actions.addCircleMember(circleId, memberId),
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

  return (
    <OrgDataProvider value={draft.orgData}>
      <OrgEditProvider value={actions}>
        <CircleMemberContext.Provider value={circleMemberValue}>
          <GraphProvider>
            <Flex h="100%" minH={0} flex="1" direction="column">
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

              <Flex flex="1" minH={0}>
                {/* Graph */}
                <Box
                  ref={boxRef}
                  flex="1"
                  position="relative"
                  overflow="hidden"
                >
                  {!draft.ready && <Loading active center />}
                  {draft.ready && draft.orgData.circles && boxSize && (
                    <CirclesGraph
                      ref={graphRef}
                      key={colorMode}
                      view={CirclesGraphViews.AllCircles}
                      circles={draft.orgData.circles}
                      events={events}
                      width={boxSize.width}
                      height={boxSize.height}
                      selectedCircleId={selectedCircleId}
                    />
                  )}
                  <Button
                    position="absolute"
                    top={2}
                    right={2}
                    {...graphButtonsProps}
                    leftIcon={<HelpIcon size={18} />}
                    onClick={shortcutsModal.onOpen}
                  >
                    {t('GraphShortcutsModal.button')}
                  </Button>
                </Box>

                {/* Side panel: role (with header) + logs */}
                <Flex
                  w="420px"
                  maxW="40%"
                  borderLeftWidth="1px"
                  direction="column"
                  minH={0}
                >
                  <Box flex="1" minH={0}>
                    {selectedCircleId ? (
                      <CircleProvider
                        circleId={selectedCircleId}
                        readOnly={readOnly}
                        isDraft={!readOnly && selectedCircleId === circleId}
                      >
                        <CircleContent
                          onlyRole
                          readOnly={readOnly}
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

                  <Box
                    borderTopWidth="1px"
                    p={4}
                    maxH="35%"
                    overflowY="auto"
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

            {shortcutsModal.isOpen && (
              <GraphShortcutsModal isOpen onClose={shortcutsModal.onClose} />
            )}
          </GraphProvider>
        </CircleMemberContext.Provider>
      </OrgEditProvider>
    </OrgDataProvider>
  )
}
