import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

interface Props {
  title: string
  description: string
  children: React.ReactNode
}

// Irreversible or sensitive action of the admin side panel, with its button
export default function AdminDangerAction({
  title,
  description,
  children,
}: Props) {
  return (
    <Flex align="center" gap={4}>
      <Box flex={1} minW={0}>
        <Text fontSize="sm" fontWeight="medium">
          {title}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {description}
        </Text>
      </Box>
      <Box flexShrink={0}>{children}</Box>
    </Flex>
  )
}
