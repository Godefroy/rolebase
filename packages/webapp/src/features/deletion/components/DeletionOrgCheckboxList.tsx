import { Checkbox, HStack, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import DeletionOrgLink from './DeletionOrgLink'

interface Props {
  orgs: {
    id: string
    name: string
    slug: string | null
    archived: boolean
    choice: 'forced' | 'optional' | 'kept'
    deleted: boolean
  }[]
  onToggle(orgId: string): void
}

// Orgs a super admin may delete with a user: the forced ones are checked and
// locked, the co-owned ones are up to the admin
export default function DeletionOrgCheckboxList({ orgs, onToggle }: Props) {
  const { t } = useTranslation()

  return (
    <Stack spacing={2}>
      {orgs.map((org) => (
        <HStack key={org.id} spacing={2}>
          <Checkbox
            colorScheme="red"
            isChecked={org.deleted}
            isDisabled={org.choice === 'forced'}
            onChange={() => onToggle(org.id)}
          >
            <Text as="span" fontSize="sm">
              {org.name}
            </Text>
            <Text as="span" fontSize="xs" color="gray.500" ml={2}>
              {[
                org.choice === 'forced'
                  ? t('Deletion.user.orgForced')
                  : t('Deletion.user.orgCoOwned'),
                org.archived && t('Deletion.user.orgArchived'),
              ]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          </Checkbox>
          <DeletionOrgLink org={org} iconOnly />
        </HStack>
      ))}
    </Stack>
  )
}
