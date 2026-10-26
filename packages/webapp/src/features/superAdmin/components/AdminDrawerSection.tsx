import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

interface Props {
  title: string
  count?: number
  danger?: boolean
  children: React.ReactNode
}

// Titled block of the admin side panel
export default function AdminDrawerSection({
  title,
  count,
  danger,
  children,
}: Props) {
  return (
    <Box
      as="section"
      borderWidth="1px"
      borderRadius="lg"
      borderColor={danger ? 'red.200' : undefined}
      _dark={{ borderColor: danger ? 'red.800' : undefined }}
      p={4}
    >
      <Flex align="baseline" gap={2} mb={3}>
        <Text
          fontSize="xs"
          fontWeight="semibold"
          textTransform="uppercase"
          letterSpacing="wider"
          color={danger ? 'red.500' : 'gray.500'}
        >
          {title}
        </Text>
        {count !== undefined && (
          <Text fontSize="xs" color="gray.400">
            {count}
          </Text>
        )}
      </Flex>
      {children}
    </Box>
  )
}
