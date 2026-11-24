import { Box, Flex, FlexProps, Heading, HStack, Spacer } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

interface Props extends Omit<FlexProps, 'title'> {
  title?: ReactNode
  filters?: ReactNode
  actions?: ReactNode
}

// Page header: title, optional content next to it (children), filters and actions.
// On mobile, actions stay on the title row and filters move to their own row.
export default function PageHeader({
  title,
  filters,
  actions,
  children,
  ...flexProps
}: Props) {
  return (
    <Flex
      w="100%"
      alignItems="center"
      flexWrap={{ base: 'wrap', md: 'nowrap' }}
      columnGap={5}
      {...flexProps}
    >
      {title && (
        <Heading as="h1" size="lg" flexShrink={0} noOfLines={1}>
          {title}
        </Heading>
      )}

      {children}

      {filters && (
        // On desktop, filters take the remaining width and wrap inside it,
        // so title and actions always stay on one row
        <Box
          order={{ base: 1, md: 0 }}
          w={{ base: '100%', md: 'auto' }}
          flex={{ base: 'none', md: '1 1 0' }}
          minW={0}
        >
          {filters}
        </Box>
      )}

      {!filters && <Spacer />}

      {actions && (
        <HStack spacing={2} my={1} flexShrink={0} ml="auto">
          {actions}
        </HStack>
      )}
    </Flex>
  )
}
