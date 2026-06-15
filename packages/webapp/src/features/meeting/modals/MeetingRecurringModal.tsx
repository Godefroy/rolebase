import CircleButton from '@/circle/components/CircleButton'
import Loading from '@/common/atoms/Loading'
import ModalCloseStaticButton from '@/common/atoms/ModalCloseStaticButton'
import TextErrors from '@/common/atoms/TextErrors'
import useDateLocale from '@/common/hooks/useDateLocale'
import { useOrgContext } from '@/org/contexts/OrgContext'
import ParticipantsNumber from '@/participants/components/ParticipantsNumber'
import {
  Alert,
  AlertIcon,
  Button,
  FormLabel,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Select,
  Spacer,
  Tooltip,
  useDisclosure,
  UseModalProps,
  Wrap,
} from '@chakra-ui/react'
import { useMeetingRecurringSubscription } from '@gql'
import { RRuleUTC } from '@rolebase/shared/helpers/RRuleUTC'
import { truthy } from '@rolebase/shared/helpers/truthy'
import { ParticipantMember } from '@rolebase/shared/model/member'
import { capitalizeFirstLetter } from '@utils/capitalizeFirstLetter'
import { add, format } from 'date-fns'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { MeetingRecurringIcon, PrivacyIcon } from 'src/icons'
import useCreateMeeting from '../hooks/useCreateMeeting'
import MeetingRecurringEditModal from './MeetingRecurringEditModal'

interface Props extends UseModalProps {
  id: string
  defaultDate?: Date
}

export default function MeetingRecurringModal({
  id,
  defaultDate,
  ...modalProps
}: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dateLocale = useDateLocale()
  const createMeeting = useCreateMeeting()

  // Get recurring meeting
  const { data, loading, error } = useMeetingRecurringSubscription({
    variables: { id },
  })

  const meetingRecurring = data?.meeting_recurring_by_pk

  // Participants
  const { orgData } = useOrgContext()
  const members = orgData?.members

  // Circle
  const circle = orgData?.getCircle(meetingRecurring?.circleId)
  const participants = useMemo(
    () =>
      meetingRecurring?.scope &&
      orgData &&
      members &&
      orgData
        .getScopeMemberIds(meetingRecurring?.scope)
        .map((id): ParticipantMember | undefined => {
          const member = members.find((m) => m.id === id)
          if (!member) return
          return { member, circlesIds: [] }
        })
        .filter(truthy),
    [meetingRecurring, orgData]
  )

  // Next dates
  const nextDates = useMemo(() => {
    if (!meetingRecurring) return

    // Exclude meetings from rrule
    const rrule = new RRuleUTC(meetingRecurring.rrule)
    rrule.excludeDates(meetingRecurring.meetings.map((m) => m.recurringDate))

    // After and before dates
    const after = new Date()
    const before = new Date()
    before.setFullYear(before.getFullYear() + 1)

    return rrule
      .between(after, before, true, (date, i) => i < 10)
      .map((date) => date.toISOString())
  }, [meetingRecurring])

  // Additional date
  const additionalDate = useMemo(() => {
    const dateStr = defaultDate?.toISOString()
    if (!dateStr || nextDates?.includes(dateStr)) return
    return dateStr
  }, [defaultDate, nextDates])

  // Next date select
  const [nextDate, setNextDate] = React.useState<string | undefined>(
    defaultDate?.toISOString()
  )

  const editModal = useDisclosure()

  // Create meeting occurrence
  const handleCreate = async () => {
    if (!meetingRecurring || !nextDate || !participants) return
    const result = await createMeeting({
      orgId: meetingRecurring.orgId,
      circleId: meetingRecurring.circleId,
      startDate: nextDate,
      endDate: add(new Date(nextDate), {
        minutes: meetingRecurring.duration,
      }).toISOString(),
      title: meetingRecurring.template.title,
      stepsConfig: meetingRecurring.template.stepsConfig,
      videoConf: meetingRecurring.videoConf,
      private: meetingRecurring.private,
      invitedReadonly: meetingRecurring.invitedReadonly,
      recurringDate: nextDate,
      recurringId: meetingRecurring.id,
      meeting_attendees: {
        data: participants.map(({ member }) => ({ memberId: member.id })),
      },
    })

    if (!result) return
    navigate(result.path)
  }

  return (
    <Modal size="xl" blockScrollOnMount={false} {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Wrap spacing={2} flex={1} align="center">
            <HStack spacing={2} alignItems="center">
              <MeetingRecurringIcon />
              <Heading as="h1" size="md">
                {t('MeetingHeader.heading', {
                  title: meetingRecurring?.template.title || '…',
                })}
              </Heading>
            </HStack>

            <Spacer />

            <HStack spacing={2}>
              {meetingRecurring?.private && (
                <Tooltip
                  label={t('MeetingHeader.private', {
                    role: orgData?.getRole(circle?.roleId)?.name,
                  })}
                  hasArrow
                >
                  <PrivacyIcon size={20} />
                </Tooltip>
              )}

              {circle && <CircleButton circle={circle} />}

              {participants && (
                <ParticipantsNumber participants={participants} />
              )}

              <ModalCloseStaticButton />
            </HStack>
          </Wrap>

          <TextErrors errors={[error]} />

          <Alert status="info" my={10}>
            <AlertIcon />
            {t('MeetingRecurringModal.info')}
          </Alert>

          <FormLabel>{t('MeetingRecurringModal.createLabel')}</FormLabel>
          <Select
            value={nextDate}
            onChange={(e) => setNextDate(e.target.value)}
          >
            {(additionalDate
              ? nextDates?.concat(additionalDate)
              : nextDates
            )?.map((date) => (
              <option key={date} value={date}>
                {capitalizeFirstLetter(
                  format(new Date(date), 'PPPP, HH:mm', { locale: dateLocale })
                )}
              </option>
            ))}
          </Select>
        </ModalBody>

        <ModalFooter>
          {loading ? (
            <Loading active size="md" />
          ) : (
            <Button onClick={editModal.onOpen}>
              {t('MeetingRecurringModal.edit')}
            </Button>
          )}

          <Spacer />

          <Button
            colorScheme="blue"
            isDisabled={loading}
            onClick={handleCreate}
          >
            {t('MeetingRecurringModal.create')}
          </Button>
        </ModalFooter>
      </ModalContent>

      {editModal.isOpen && (
        <MeetingRecurringEditModal
          isOpen
          meetingRecurring={meetingRecurring ?? undefined}
          onClose={editModal.onClose}
        />
      )}
    </Modal>
  )
}
