import { Box, BoxProps, Heading, HStack } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

interface Props extends Omit<BoxProps, 'title'> {
  title?: ReactNode
  filters?: ReactNode
  actions?: ReactNode
}

// Widths of the header itself (not of the screen), so that the layout follows
// the space left by the sidebar and by a detail column
const inlineFiltersWidth = 820
const buttonTextsWidth = 1000

// Page header: title, optional content next to it (children), filters and actions.
// When narrow, filters move to their own row (title and actions stay on the
// first one) and buttons with showText="wide" show their icon only.
// Classes page-header-inline-only and page-header-stacked-only show an element
// only with inline or stacked filters.
// Below desktop, title and buttons are smaller (size the buttons with
// pageHeaderButtonSize).
export default function PageHeader({
  title,
  filters,
  actions,
  children,
  ...boxProps
}: Props) {
  return (
    <Box
      w="100%"
      minW={0}
      sx={{
        containerType: 'inline-size',
        containerName: 'page-header',
        '& .page-header-row': {
          display: 'grid',
          alignItems: 'center',
          columnGap: 5,
          gridTemplateColumns: 'minmax(0, auto) auto minmax(0, 1fr) auto',
          gridTemplateAreas: '"title children filters actions"',
        },
        [`@container page-header (max-width: ${inlineFiltersWidth - 1}px)`]: {
          '& .page-header-row': {
            columnGap: 3,
            gridTemplateAreas: `"title children . actions" "filters filters filters filters"`,
          },
          '& .page-header-inline-only': { display: 'none' },
        },
        [`@container page-header (min-width: ${inlineFiltersWidth}px)`]: {
          '& .page-header-stacked-only': { display: 'none' },
        },
        [`@container page-header (max-width: ${buttonTextsWidth - 1}px)`]: {
          '& .icon-text-button-wide': { paddingInline: 0 },
          '& .icon-text-button-wide .chakra-button__icon': { marginEnd: 0 },
          '& .icon-text-button-label': { display: 'none' },
        },
      }}
      {...boxProps}
    >
      <Box className="page-header-row">
        {title && (
          <Heading
            as="h1"
            size={{ base: 'md', lg: 'lg' }}
            gridArea="title"
            noOfLines={1}
          >
            {title}
          </Heading>
        )}

        {children && <Box gridArea="children">{children}</Box>}

        {filters && (
          <Box gridArea="filters" minW={0}>
            {filters}
          </Box>
        )}

        {actions && (
          <HStack spacing={2} my={1} gridArea="actions" justifySelf="end">
            {actions}
          </HStack>
        )}
      </Box>
    </Box>
  )
}

// Size of the header buttons: smaller below desktop
export const pageHeaderButtonSize = { base: 'sm', lg: 'md' }
