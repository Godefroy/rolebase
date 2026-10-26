import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import React from 'react'
import { FiTrash2 } from 'react-icons/fi'

interface Props {
  title: string
  subtitle?: React.ReactNode
}

export default function DeletionModalHeader({ title, subtitle }: Props) {
  return (
    <Flex align="center" gap={3} pr={8}>
      <Flex
        flexShrink={0}
        align="center"
        justify="center"
        boxSize={10}
        borderRadius="full"
        bg="red.100"
        color="red.600"
        _dark={{ bg: 'red.900', color: 'red.200' }}
      >
        <Icon as={FiTrash2} boxSize={5} />
      </Flex>
      <Box minW={0}>
        <Text fontSize="lg" fontWeight="semibold" lineHeight="short">
          {title}
        </Text>
        {subtitle && (
          <Text
            fontSize="sm"
            fontWeight="normal"
            color="gray.500"
            noOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </Box>
    </Flex>
  )
}
