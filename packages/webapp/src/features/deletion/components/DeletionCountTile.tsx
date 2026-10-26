import { Box, Text } from '@chakra-ui/react'
import React from 'react'

interface Props {
  count: number
  label: string
}

export default function DeletionCountTile({ count, label }: Props) {
  return (
    <Box
      bg="gray.50"
      borderRadius="md"
      px={3}
      py={2}
      _dark={{ bg: 'whiteAlpha.100' }}
    >
      <Text fontSize="lg" fontWeight="bold" lineHeight="short">
        {count.toLocaleString()}
      </Text>
      <Text fontSize="xs" color="gray.500" noOfLines={2}>
        {label}
      </Text>
    </Box>
  )
}
