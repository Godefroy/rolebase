import { Avatar, Box, Flex, HStack, Text } from '@chakra-ui/react'
import React from 'react'

interface Props {
  title: string
  subtitle?: string | null
  avatarSrc?: string
  tags?: React.ReactNode
  actions?: React.ReactNode
}

export default function AdminDrawerHeader({
  title,
  subtitle,
  avatarSrc,
  tags,
  actions,
}: Props) {
  return (
    <Box pr={8}>
      <Flex align="center" gap={4}>
        <Avatar name={title} src={avatarSrc} size="lg" />
        <Box minW={0}>
          <Text fontSize="xl" fontWeight="semibold" noOfLines={1}>
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
          {tags && (
            <HStack spacing={2} mt={1.5}>
              {tags}
            </HStack>
          )}
        </Box>
      </Flex>
      {actions && (
        <HStack spacing={2} mt={4}>
          {actions}
        </HStack>
      )}
    </Box>
  )
}
