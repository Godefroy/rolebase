import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import React from 'react'
import { IconType } from 'react-icons'

export type DeletionTone = 'delete' | 'anonymize' | 'keep' | 'todo'

const toneColors: Record<DeletionTone, string> = {
  delete: 'red',
  anonymize: 'orange',
  keep: 'gray',
  todo: 'blue',
}

interface Props {
  tone: DeletionTone
  icon: IconType
  title: string
  description?: string
  children?: React.ReactNode
}

// A block of a deletion recap, colored by what happens to its content
export default function DeletionSection({
  tone,
  icon,
  title,
  description,
  children,
}: Props) {
  const color = toneColors[tone]

  return (
    <Box
      borderWidth="1px"
      borderLeftWidth="4px"
      borderLeftColor={`${color}.400`}
      borderRadius="md"
      p={4}
      _dark={{ borderLeftColor: `${color}.300` }}
    >
      <Flex align="center" gap={2}>
        <Icon
          as={icon}
          color={`${color}.500`}
          _dark={{ color: `${color}.300` }}
        />
        <Text fontWeight="semibold" fontSize="sm">
          {title}
        </Text>
      </Flex>
      {description && (
        <Text fontSize="sm" color="gray.500" mt={1}>
          {description}
        </Text>
      )}
      {children && <Box mt={3}>{children}</Box>}
    </Box>
  )
}
