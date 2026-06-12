import { Box, BoxProps } from '@chakra-ui/react'
import React from 'react'

interface Props extends BoxProps {
  readOnly?: boolean
  isFocused?: boolean
}

// Chakra container providing the visual chrome of the editor
// (border, focus ring, background), themed for light/dark modes
export default function EditorContainer({
  readOnly,
  isFocused,
  children,
  ...boxProps
}: Props) {
  return (
    <Box
      position="relative"
      bg={readOnly ? undefined : 'whiteAlpha.500'}
      borderWidth={readOnly ? 0 : '1px'}
      borderRadius={readOnly ? 0 : 'md'}
      borderColor={isFocused ? 'outline' : undefined}
      boxShadow={
        isFocused && !readOnly
          ? '0 0 0 1px var(--chakra-colors-outline)'
          : undefined
      }
      outline={0}
      _dark={{
        bg: readOnly ? undefined : 'blackAlpha.100',
      }}
      _invalid={{
        borderColor: 'red.500',
        _dark: {
          borderColor: 'red.300',
        },
      }}
      {...boxProps}
    >
      {children}
    </Box>
  )
}
