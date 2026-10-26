import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

interface Props {
  title: string
  subtitle?: string | null
  avatarSrc?: string
  aside?: React.ReactNode
  dimmed?: boolean
  onSelect?(): void
}

// Line of a list in the admin side panel, clickable when onSelect is set
export default function AdminListItem({
  title,
  subtitle,
  avatarSrc,
  aside,
  dimmed,
  onSelect,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.()
    }
  }

  return (
    <Flex
      align="center"
      gap={3}
      px={2}
      py={1.5}
      mx={-2}
      borderRadius="md"
      opacity={dimmed ? 0.6 : 1}
      {...(onSelect && {
        tabIndex: 0,
        role: 'button',
        'aria-label': title,
        cursor: 'pointer',
        _hover: { bg: 'gray.50', _dark: { bg: 'whiteAlpha.100' } },
        onClick: onSelect,
        onKeyDown: handleKeyDown,
      })}
    >
      <Avatar name={title} src={avatarSrc} size="sm" />
      <Box flex={1} minW={0}>
        <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text fontSize="xs" color="gray.500" noOfLines={1}>
            {subtitle}
          </Text>
        )}
      </Box>
      {aside}
    </Flex>
  )
}
