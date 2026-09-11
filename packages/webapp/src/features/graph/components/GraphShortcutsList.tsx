import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { GraphContext, GraphEvents } from '@rolebase/graph'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { CirclePick, CopyIcon, MoveIcon, PanIcon, SearchIcon } from 'src/icons'

type IconComponent = React.ComponentType<{ size?: number | string }>

export type ShortcutKey =
  | 'zoom'
  | 'pan'
  | 'open'
  | 'moveRole'
  | 'copyRole'
  | 'moveMember'
  | 'addMember'

// The graph event a shortcut relies on. Pan and zoom depend on the panzoom
// behaviour instead, so they have no handler.
const shortcuts: {
  key: ShortcutKey
  Icon: IconComponent
  event?: keyof GraphEvents
}[] = [
  { key: 'zoom', Icon: SearchIcon },
  { key: 'pan', Icon: PanIcon },
  { key: 'open', Icon: CirclePick, event: 'onCircleClick' },
  { key: 'moveRole', Icon: MoveIcon, event: 'onCircleMove' },
  { key: 'copyRole', Icon: CopyIcon, event: 'onCircleCopy' },
  { key: 'moveMember', Icon: MoveIcon, event: 'onMemberMove' },
  { key: 'addMember', Icon: CopyIcon, event: 'onMemberAdd' },
]

interface Props {
  // Narrow the list further, for a graph whose handlers are wired but lead
  // nowhere the reader can follow (e.g. a click that only zooms, with no panel)
  only?: ShortcutKey[]
}

// The interactions of the org chart, listed by the shortcuts panel and modal.
export default function GraphShortcutsList({ only }: Props) {
  const { t } = useTranslation()

  // Only list what this graph actually answers to: a view can disable an
  // interaction, and a read-only chart wires none of them.
  const graph = useContext(GraphContext)?.graph
  const visible = shortcuts.filter(({ key, event }) => {
    if (only && !only.includes(key)) return false
    if (!graph) return true
    if (!event) return !graph.zoomDisabled
    return !!graph.params.events[event]
  })

  return (
    <VStack align="stretch" spacing={4}>
      {visible.map(({ key, Icon }) => (
        <Flex key={key} align="center">
          <Flex
            align="center"
            justify="center"
            boxSize={10}
            mr={4}
            flexShrink={0}
            borderRadius="md"
            bg="gray.100"
            color="gray.600"
            _dark={{ bg: 'gray.700', color: 'gray.200' }}
          >
            <Icon size={22} />
          </Flex>
          <Box>
            <Text fontWeight="bold">{t(`GraphShortcuts.${key}_label`)}</Text>
            <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.300' }}>
              {t(`GraphShortcuts.${key}_desc`)}
            </Text>
          </Box>
        </Flex>
      ))}
    </VStack>
  )
}
