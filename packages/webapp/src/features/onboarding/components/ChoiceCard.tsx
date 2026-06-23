import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { CheckIcon } from 'src/icons'

interface Props {
  label: string
  description?: string
  selected: boolean
  // radio (single-select) or checkbox (multi-select) semantics
  multi?: boolean
  onToggle(): void
}

// One selectable option card, shared by the single- and multi-select groups.
export default function ChoiceCard({
  label,
  description,
  selected,
  multi,
  onToggle,
}: Props) {
  return (
    <Flex
      as="button"
      type="button"
      role={multi ? 'checkbox' : 'radio'}
      aria-checked={selected}
      tabIndex={0}
      onClick={onToggle}
      align="start"
      justify="space-between"
      gap={3}
      textAlign="left"
      px={4}
      py={3}
      borderRadius="10px"
      borderWidth="1px"
      borderColor={selected ? 'blue.500' : 'inherit'}
      bg={selected ? 'blue.50' : 'transparent'}
      _dark={{
        borderColor: selected ? 'blue.400' : 'whiteAlpha.300',
        bg: selected ? 'whiteAlpha.50' : 'transparent',
      }}
      _hover={{ borderColor: selected ? 'blue.500' : 'gray.300' }}
      transition="border-color 0.12s, background-color 0.12s"
    >
      <Box>
        <Text fontSize="sm" fontWeight="medium">
          {label}
        </Text>
        {description && (
          <Text fontSize="xs" color="gray.500">
            {description}
          </Text>
        )}
      </Box>
      <Box visibility={selected ? 'visible' : 'hidden'} flexShrink={0}>
        <CheckIcon size="1em" color="var(--chakra-colors-blue-500)" />
      </Box>
    </Flex>
  )
}
