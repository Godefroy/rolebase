import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Alert,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Text,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { CreateIcon } from 'src/icons'
import MembersMultiSelect from '../../member/components/MembersMultiSelect'
import useCircleParticipants from '../hooks/useCircleParticipants'
import ParticipantsNumber from './ParticipantsNumber'

interface Props {
  circleId: string
  membersIds: string[]
  onMembersIdsChange(membersIds: string[]): void
}

export default function ParticipantsCircleExtraMembers({
  circleId,
  membersIds,
  onMembersIdsChange,
}: Props) {
  const { t } = useTranslation()
  const currentMember = useCurrentMember()
  const { orgData } = useOrgContext()

  const handleAddMember = (id: string) => {
    if (membersIds.includes(id)) return
    onMembersIdsChange([...membersIds, id])
  }

  const handleRemoveMember = (id: string) => {
    onMembersIdsChange(membersIds.filter((m) => m !== id))
  }

  // Participants
  const circle = orgData?.getCircle(circleId)
  const participants = useCircleParticipants(circle)

  return (
    <FormControl>
      <VStack alignItems="flex-start" spacing={3}>
        <FormLabel display="flex" alignItems="center">
          {t('ParticipantsCircleExtraMembers.invite')}
        </FormLabel>

        <Flex alignItems="center">
          <ParticipantsNumber mr={2} participants={participants} />
          <Text fontSize="sm">
            {t('ParticipantsCircleExtraMembers.circleParticipants', {
              role: orgData?.getRole(circle?.roleId)?.name,
            })}
          </Text>
        </Flex>

        <MembersMultiSelect
          membersIds={membersIds}
          excludeMembersIds={participants.map((p) => p.member.id)}
          onAdd={handleAddMember}
          onRemove={handleRemoveMember}
        />

        {circleId &&
          currentMember &&
          !participants.some((p) => p.member.id === currentMember.id) &&
          !membersIds.some((id) => id === currentMember.id) && (
            <Alert status="warning">
              {t('ParticipantsCircleExtraMembers.inviteWarning')}
              <Button
                variant="solid"
                colorScheme="yellow"
                leftIcon={<CreateIcon />}
                ml={3}
                minW="25%"
                onClick={() => handleAddMember(currentMember.id)}
              >
                {t('ParticipantsCircleExtraMembers.inviteButton')}
              </Button>
            </Alert>
          )}
      </VStack>
    </FormControl>
  )
}
