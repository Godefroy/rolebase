import { Tr } from '@chakra-ui/react'
import React from 'react'

interface Props {
  label: string
  isSelected: boolean
  onSelect(): void
  children: React.ReactNode
}

// Table row opening an item in the admin side panel
export default function AdminTableRow({
  label,
  isSelected,
  onSelect,
  children,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <Tr
      tabIndex={0}
      role="button"
      aria-label={label}
      aria-pressed={isSelected}
      cursor="pointer"
      bg={isSelected ? 'blue.50' : undefined}
      _hover={{ bg: isSelected ? 'blue.50' : 'gray.50' }}
      _focusVisible={{ outline: '2px solid', outlineColor: 'blue.400' }}
      _dark={{
        bg: isSelected ? 'whiteAlpha.200' : undefined,
        _hover: { bg: 'whiteAlpha.100' },
      }}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      {children}
    </Tr>
  )
}
