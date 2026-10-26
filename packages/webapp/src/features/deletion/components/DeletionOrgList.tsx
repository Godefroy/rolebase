import { Tag, TagLabel, Wrap, WrapItem } from '@chakra-ui/react'
import React from 'react'
import DeletionOrgLink from './DeletionOrgLink'

interface Props {
  orgs: {
    id: string
    name: string
    slug?: string | null
    archived?: boolean
    detail?: string
  }[]
}

export default function DeletionOrgList({ orgs }: Props) {
  return (
    <Wrap spacing={2}>
      {orgs.map((org) => (
        <WrapItem key={`${org.id}-${org.detail ?? ''}`}>
          <Tag size="md" variant="subtle" borderRadius="full">
            <TagLabel>
              <DeletionOrgLink org={org}>
                {org.name}
                {org.detail && ` · ${org.detail}`}
              </DeletionOrgLink>
            </TagLabel>
          </Tag>
        </WrapItem>
      ))}
    </Wrap>
  )
}
