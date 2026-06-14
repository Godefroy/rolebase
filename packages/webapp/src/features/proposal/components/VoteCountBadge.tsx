import { Badge } from '@chakra-ui/react'
import React from 'react'

interface Props {
  colorScheme: string
  count: number
  label: string
  onClick?(): void
}

// A vote count tag, clickable to open the voters modal on the matching tab.
export default function VoteCountBadge({
  colorScheme,
  count,
  label,
  onClick,
}: Props) {
  return (
    <Badge
      colorScheme={colorScheme}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      cursor={onClick ? 'pointer' : 'default'}
      _hover={onClick ? { opacity: 0.8 } : undefined}
      onClick={onClick}
    >
      {count} {label}
    </Badge>
  )
}
