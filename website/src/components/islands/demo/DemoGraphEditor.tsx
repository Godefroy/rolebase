import CircleContent from '@/circle/components/CircleContent'
import {
  CircleMemberContext,
  type CircleMemberContextValue,
} from '@/circle/contexts/CircleMemberContext'
import { CircleProvider } from '@/circle/contexts/CIrcleContext'
import { useElementSize } from '@/common/hooks/useElementSize'
import CirclesGraph from '@/graph/CirclesGraph'
import GraphShortcutsButton from '@/graph/components/GraphShortcutsButton'
import MemberContent from '@/member/components/MemberContent'
import { useOrgContext, useOrgEditActions } from '@/org/contexts/OrgContext'
import { Box, Flex, useColorMode } from '@chakra-ui/react'
import { ArrowUpIcon } from 'src/icons'
import { CirclesGraphViews, type GraphEvents } from '@rolebase/graph'
import { useMemo, useRef, useState } from 'react'
import type { DemoUiText } from '../../../demo/orgDemoData'

interface Selection {
  circleId?: string
  memberId?: string
}

interface Props {
  ui?: DemoUiText
  // Desktop height of the island (mobile is content-driven).
  height?: string
}

// Editable product preview body: the real org-chart graph plus the real
// role/member panels, reading the live in-memory org context (DemoOrgProvider).
// Desktop: graph and panel side by side. Mobile: square graph (capped at
// 80dvh) with the panel stacked below, so the island grows instead of scrolling.
export default function DemoGraphEditor({ ui, height = '560px' }: Props) {
  const { colorMode } = useColorMode()
  const { orgData, ready } = useOrgContext()
  const actions = useOrgEditActions()

  const boxRef = useRef<HTMLDivElement>(null)
  const boxSize = useElementSize(boxRef)
  const [selection, setSelection] = useState<Selection>({})
  const hasSelection = !!(selection.circleId || selection.memberId)

  const events: GraphEvents = useMemo(
    () => ({
      onCircleClick: (circleId) => setSelection({ circleId }),
      onMemberClick: (circleId, memberId) => setSelection({ circleId, memberId }),
      onClickOutside: () => setSelection({}),
      onCircleMove: actions.moveCircle,
      onCircleCopy: actions.copyCircle,
      onMemberMove: async (memberId, parentCircleId, targetCircleId) => {
        if (targetCircleId) await actions.addCircleMember(targetCircleId, memberId)
        await actions.removeCircleMember(parentCircleId, memberId)
      },
      onMemberAdd: (memberId, circleId) =>
        actions.addCircleMember(circleId, memberId),
    }),
    [actions]
  )

  const circleMemberValue = useMemo<CircleMemberContextValue>(
    () => ({
      circleId: selection.circleId,
      memberId: selection.memberId,
      parentId: undefined,
      canFocus: false,
      goTo: (circleId, memberId) => setSelection({ circleId, memberId }),
    }),
    [selection]
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
              <CirclesGraph
                key={colorMode}
                view={CirclesGraphViews.AllCircles}
                org={orgData}
                events={events}
                width={boxSize.width}
                height={boxSize.height}
                selectedCircleId={selection.circleId}
              />
            </Box>
          )}

          {/* Keyboard/drag shortcuts, like the org chart options in the app */}
          <GraphShortcutsButton position="absolute" top={3} right={3} zIndex={1} />

          {/* Hint overlay, shown only while nothing is selected */}
          {!hasSelection && (
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

        {/* Role / member panel, only when something is selected. Desktop: to the
            right with its own scroll. Mobile: below, full height (no scroll). */}
        {hasSelection && (
          <Flex
            w={{ base: '100%', md: '340px' }}
            maxW={{ base: '100%', md: '45%' }}
            borderTopWidth={{ base: '1px', md: 0 }}
            borderLeftWidth={{ base: 0, md: '1px' }}
            direction="column"
            minH={0}
            overflowY={{ base: 'visible', md: 'auto' }}
          >
            {selection.memberId ? (
              <MemberContent
                id={selection.memberId}
                onClose={() => setSelection({})}
              />
            ) : (
              <CircleProvider circleId={selection.circleId!}>
                <CircleContent onlyRole onClose={() => setSelection({})} />
              </CircleProvider>
            )}
          </Flex>
        )}
      </Flex>
    </CircleMemberContext.Provider>
  )
}
