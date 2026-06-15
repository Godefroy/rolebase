import { BoxProps, VStack } from '@chakra-ui/react'
import {
  useCreateMeetingAttendeeMutation,
  useDeleteMeetingAttendeeMutation,
  useUpdateMeetingAttendeeMutation,
} from '@gql'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { truthy } from '@rolebase/shared/helpers/truthy'
import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CreateIcon } from 'src/icons'
import MemberSearchButton from '../../search/components/MemberSearchButton'
import { MeetingContext } from '../contexts/MeetingContext'
import MeetingAttendeeItem from './MeetingAttendeeItem'

export default function MeetingAttendeesList(boxProps: BoxProps) {
  const { meeting, isEnded, canEdit, forceEdit } = useContext(MeetingContext)!
  const editable = canEdit && (!isEnded || forceEdit)
  const members = useOrgContext().orgData?.members
  const { t } = useTranslation()
  const [createAttendee] = useCreateMeetingAttendeeMutation()
  const [updateAttendee] = useUpdateMeetingAttendeeMutation()
  const [deleteAttendee] = useDeleteMeetingAttendeeMutation()

  // Enrich attendees with members
  const attendees = useMemo(
    () =>
      meeting?.meeting_attendees
        .map((attendee) => {
          const member = members?.find((m) => m.id === attendee.memberId)
          if (!member) return
          return { ...attendee, member }
        })
        .filter(truthy)
        .sort((a, b) => a.member.name.localeCompare(b.member.name)) || [],
    [meeting, members]
  )

  const attendeesMemberIds = useMemo(
    () => attendees?.map((a) => a.memberId) || [],
    [attendees]
  )

  const handlePresentChange = (id: string, present: boolean | null) => {
    updateAttendee({
      variables: { id, values: { present } },
    })
  }

  const handleAdd = (memberId: string) => {
    if (!meeting) return
    createAttendee({
      variables: {
        values: {
          meetingId: meeting.id,
          memberId,
        },
      },
    })
  }

  const handleRemove = (id: string) => {
    if (!meeting) return
    if (!confirm(t('MeetingAttendees.confirmRemove'))) return
    deleteAttendee({ variables: { id } })
  }

  if (!attendees) return null

  return (
    <VStack align="start" {...boxProps}>
      {attendees.map((attendee) => (
        <MeetingAttendeeItem
          key={attendee.memberId}
          attendee={attendee}
          member={attendee.member}
          editable={editable}
          onPresentChange={(present) =>
            handlePresentChange(attendee.id, present)
          }
          onRemove={() => handleRemove(attendee.id)}
        />
      ))}

      {editable && (
        <MemberSearchButton
          excludeIds={attendeesMemberIds}
          size="sm"
          variant="outline"
          leftIcon={<CreateIcon size={20} />}
          onSelect={handleAdd}
        >
          {t('MeetingAttendees.add')}
        </MemberSearchButton>
      )}
    </VStack>
  )
}
