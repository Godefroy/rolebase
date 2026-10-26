import { Tag, TagLabel, Wrap, WrapItem } from '@chakra-ui/react'
import React from 'react'

interface Props {
  orgs: { id: string; name: string; detail?: string }[]
}

export default function DeletionOrgList({ orgs }: Props) {
  return (
    <Wrap spacing={2}>
      {orgs.map((org) => (
        <WrapItem key={`${org.id}-${org.detail ?? ''}`}>
          <Tag size="md" variant="subtle" borderRadius="full">
            <TagLabel>
              {org.name}
              {org.detail && ` · ${org.detail}`}
            </TagLabel>
          </Tag>
        </WrapItem>
      ))}
    </Wrap>
  )
}
