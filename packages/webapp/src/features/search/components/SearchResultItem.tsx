import { Box, BoxProps } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { SearchItem } from '../searchTypes'
import SearchResultContent from './SearchResultContent'
import {
  getSearchResultTitle,
  searchItemTitleSeparator,
} from './searchResultUtils'

export { searchItemTitleSeparator }

interface Props extends BoxProps {
  item?: SearchItem
  prevItem?: SearchItem
  highlighted?: boolean
  highlightedBg?: string
  size?: string
}

export default React.forwardRef<HTMLDivElement, Props>(
  function SearchResultItem(
    { item, prevItem, highlighted, highlightedBg, size, ...boxProps },
    ref
  ) {
    const { title, depth } = useMemo(
      () => getSearchResultTitle(item, prevItem),
      [item, prevItem]
    )

    return (
      <Box
        role="option"
        tabIndex={0}
        aria-label={item?.title}
        aria-selected={highlighted || undefined}
        ref={ref}
        pointerEvents="auto"
        display="flex"
        alignItems="center"
        justifyContent="start"
        cursor="pointer"
        py={2}
        pl={`calc(var(--chakra-sizes-3) + ${depth * 20}px)`}
        _hover={{ bg: 'gray.100', _dark: { bg: 'whiteAlpha.100' } }}
        {...boxProps}
        bg={highlighted && highlightedBg ? highlightedBg : boxProps?.bg}
      >
        <SearchResultContent item={item} size={size} title={title} />
      </Box>
    )
  }
)
