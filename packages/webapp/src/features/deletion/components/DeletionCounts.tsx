import { SimpleGrid, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import DeletionCountTile from './DeletionCountTile'

interface Props {
  counts: Record<string, number>
}

// Non-zero counts of a deletion preview, as tiles
export default function DeletionCounts({ counts }: Props) {
  const { t } = useTranslation()
  const entries = Object.entries(counts).filter(([, count]) => count > 0)

  if (entries.length === 0) {
    return (
      <Text fontSize="sm" color="gray.500">
        {t('Deletion.nothing')}
      </Text>
    )
  }

  return (
    <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={2}>
      {entries.map(([key, count]) => (
        <DeletionCountTile
          key={key}
          count={count}
          label={t(`Deletion.counts.${key}` as any, { count })}
        />
      ))}
    </SimpleGrid>
  )
}
