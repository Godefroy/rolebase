import { Box, Center, Flex, HStack } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

interface Props {
  icon?: ReactNode
  title: ReactNode
  // Indicator in the top-right corner, aligned with the first title line
  corner?: ReactNode
  // Metadata aligned left under the title (stacked) or before meta (inline)
  metaStart?: ReactNode
  meta?: ReactNode
  // Card layout: title on up to 2 lines, metadata on a second line
  stacked?: boolean
}

const metaItemsStyle = { '& > *': { flexShrink: 0 } }

// Content layout shared by task and thread items
export default function ListItemLayout({
  icon,
  title,
  corner,
  metaStart,
  meta,
  stacked,
}: Props) {
  const iconBox = icon && (
    <Center flexShrink={0} w={6} h={6} position="relative" zIndex={2}>
      {icon}
    </Center>
  )

  if (stacked) {
    return (
      <Flex align="flex-start" gap={2.5}>
        {iconBox}
        <Box flex={1} minW={0}>
          <Flex align="flex-start" gap={2}>
            <Box flex={1} minW={0}>
              {title}
            </Box>
            {corner && (
              <Center
                flexShrink={0}
                h={5}
                color="gray.500"
                _dark={{ color: 'gray.400' }}
              >
                {corner}
              </Center>
            )}
          </Flex>
          {(metaStart || meta) && (
            <Flex
              mt={2}
              align="center"
              flexWrap="wrap"
              columnGap={2}
              rowGap={1.5}
              fontSize="sm"
              color="gray.500"
              _dark={{ color: 'gray.400' }}
              sx={metaItemsStyle}
            >
              {metaStart && (
                <HStack spacing={2} sx={metaItemsStyle}>
                  {metaStart}
                </HStack>
              )}
              {meta && (
                // Kept together so it wraps as one block, aligned right
                <HStack spacing={2} ml="auto" sx={metaItemsStyle}>
                  {meta}
                </HStack>
              )}
            </Flex>
          )}
        </Box>
      </Flex>
    )
  }

  return (
    <Flex align="center" gap={2}>
      {iconBox}
      <Box flex={1} minW={0}>
        {title}
      </Box>
      {(corner || metaStart || meta) && (
        <HStack spacing={2} flexShrink={0} sx={metaItemsStyle}>
          {corner}
          {metaStart}
          {meta}
        </HStack>
      )}
    </Flex>
  )
}
