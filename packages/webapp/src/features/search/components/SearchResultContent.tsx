import CircleByIdButton from '@/circle/components/CircleByIdButton'
import useDateLocale from '@/common/hooks/useDateLocale'
import { Box, Spacer, Text } from '@chakra-ui/react'
import { capitalizeFirstLetter } from '@utils/capitalizeFirstLetter'
import { format } from 'date-fns'
import React from 'react'
import { SearchItem } from '../searchTypes'
import SearchResultIcon from './SearchResultIcon'

interface Props {
  item?: SearchItem
  size?: string
  title: string
}

export default function SearchResultContent({ item, size, title }: Props) {
  const dateLocale = useDateLocale()

  if (!item) return null

  return (
    <>
      <SearchResultIcon item={item} size={size} />
      <Box ml={2} textAlign="left">
        {title}
      </Box>

      <Spacer />

      {item.date && (
        <Text fontSize="xs" color="gray.500" _dark={{ color: 'gray.300' }}>
          {capitalizeFirstLetter(
            format(new Date(item.date), 'PPPP', {
              locale: dateLocale,
            })
          )}
        </Text>
      )}

      {item.circleId && (
        <CircleByIdButton
          id={item.circleId}
          ml={2}
          size={size === 'sm' ? 'xs' : 'sm'}
        />
      )}
    </>
  )
}
