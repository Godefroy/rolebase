import { Box, Tag, Text } from '@chakra-ui/react'
import { EntityChange, EntityChangeType } from '@rolebase/shared/model/log'
import React, { Suspense, lazy } from 'react'

// Lazy loading because it's using the editor
const ObjectDiff = lazy(() => import('./ObjectDiff'))

interface Props<Entity extends {}> {
  type: string
  entityChange: EntityChange<Entity>
}

export default function LogEntityChanges<Entity extends {}>({
  type,
  entityChange,
}: Props<Entity>) {
  return (
    <Suspense fallback={null}>
      <Box>
        <Text fontSize="sm" mb={2}>
          <Tag
            size="sm"
            colorScheme={
              entityChange.type === EntityChangeType.Create
                ? 'green'
                : entityChange.type === EntityChangeType.Update
                  ? 'blue'
                  : 'red'
            }
          >
            {entityChange.type}
          </Tag>{' '}
          {type} / {entityChange.id}
        </Text>

        {entityChange.type === EntityChangeType.Create && (
          <ObjectDiff value={entityChange.data} />
        )}

        {entityChange.type === EntityChangeType.Update && (
          <ObjectDiff
            value={entityChange.newData}
            compareValue={entityChange.prevData}
          />
        )}
      </Box>
    </Suspense>
  )
}
