import MembersMultiSelect from '@/member/components/MembersMultiSelect'
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  SimpleGrid,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteIcon } from 'src/icons'
import { getRepresentativeRole, OrgType } from '../orgTypes'
import { RoleDraft } from './orgSetupTypes'

interface Props {
  role: RoleDraft
  orgType: OrgType
  onChange(patch: Partial<RoleDraft>): void
  onRemove(): void
}

export default function RoleAssignmentItem({
  role,
  orgType,
  onChange,
  onRemove,
}: Props) {
  const { t } = useTranslation()

  // The responsible occupies the model's representation (leader) role
  const leaderLabel = t(
    `Onboarding.roles.${getRepresentativeRole(orgType).nameKey}.name`
  )

  const setResponsible = (id: string) =>
    onChange({
      responsibleId: id,
      participantIds: role.participantIds.filter((p) => p !== id),
    })

  const addParticipant = (id: string) =>
    onChange({ participantIds: [...role.participantIds, id] })

  const removeParticipant = (id: string) =>
    onChange({ participantIds: role.participantIds.filter((p) => p !== id) })

  return (
    <Box borderWidth="1px" borderRadius="md" p={4}>
      <Flex mb={4} gap={2} align="center">
        <Input
          value={role.name}
          onChange={(e) => onChange({ name: e.target.value })}
          flex={1}
          size="lg"
          autoComplete="off"
        />
        <IconButton
          aria-label={t('common.delete')}
          icon={<DeleteIcon size="1em" />}
          variant="ghost"
          onClick={onRemove}
        />
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel fontSize="sm">{leaderLabel}</FormLabel>
          <MembersMultiSelect
            membersIds={role.responsibleId ? [role.responsibleId] : []}
            excludeMembersIds={role.participantIds}
            max={1}
            onAdd={setResponsible}
            onRemove={() => onChange({ responsibleId: undefined })}
            // The responsible is required, so prompt it with a primary button
            buttonProps={{ colorScheme: 'blue', variant: 'solid' }}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">{t('OrgSetupModal.participants')}</FormLabel>
          <MembersMultiSelect
            membersIds={role.participantIds}
            excludeMembersIds={role.responsibleId ? [role.responsibleId] : []}
            onAdd={addParticipant}
            onRemove={removeParticipant}
          />
        </FormControl>
      </SimpleGrid>
    </Box>
  )
}
