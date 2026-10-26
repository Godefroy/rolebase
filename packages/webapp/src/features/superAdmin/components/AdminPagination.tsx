import { Button, HStack, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  offset: number
  pageSize: number
  totalCount: number
  onChange(offset: number): void
}

export default function AdminPagination({
  offset,
  pageSize,
  totalCount,
  onChange,
}: Props) {
  const { t } = useTranslation()

  if (totalCount <= pageSize) return null

  return (
    <HStack mt={4} spacing={4} justify="center">
      <Button
        size="sm"
        isDisabled={offset === 0}
        onClick={() => onChange(Math.max(0, offset - pageSize))}
      >
        {t('SuperAdmin.pagination.previous')}
      </Button>
      <Text fontSize="sm">
        {Math.floor(offset / pageSize) + 1} / {Math.ceil(totalCount / pageSize)}
      </Text>
      <Button
        size="sm"
        isDisabled={offset + pageSize >= totalCount}
        onClick={() => onChange(offset + pageSize)}
      >
        {t('SuperAdmin.pagination.next')}
      </Button>
    </HStack>
  )
}
