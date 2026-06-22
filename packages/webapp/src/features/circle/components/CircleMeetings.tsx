import Loading from '@/common/atoms/Loading'
import TextErrors from '@/common/atoms/TextErrors'
import MeetingsList from '@/meeting/components/MeetingsList'
import MeetingEditModal from '@/meeting/modals/MeetingEditModal'
import MeetingRecurringListModal from '@/meeting/modals/MeetingRecurringListModal'
import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import useOrgMember from '@/member/hooks/useOrgMember'
import { Button, Flex, Spacer, useDisclosure } from '@chakra-ui/react'
import { useCircleMeetingsSubscription } from '@gql'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { CreateIcon, MeetingRecurringIcon } from 'src/icons'
import OnboardingVideo, {
  OnboardingVideoType,
} from '@/onboarding/components/OnboardingVideo'

interface Props {
  circleId: string
}

export default function CircleMeetings({ circleId }: Props) {
  const { t } = useTranslation()
  const isMember = useOrgMember()
  const isAdmin = useOrgAdmin()

  const { data, error, loading } = useCircleMeetingsSubscription({
    variables: {
      circleId,
    },
  })
  const meetings = data?.meeting

  // Modals
  const createModal = useDisclosure()
  const recurringModal = useDisclosure()

  return (
    <>
      <Flex mb={4}>
        {isMember && (
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<CreateIcon size={20} />}
            onClick={createModal.onOpen}
          >
            {t('CircleMeetings.create')}
          </Button>
        )}

        <Spacer />
        <Button
          size="sm"
          variant="outline"
          leftIcon={<MeetingRecurringIcon size={20} />}
          onClick={recurringModal.onOpen}
        >
          {t('CircleMeetings.recurring')}
        </Button>
      </Flex>

      {loading && <Loading active size="md" />}
      <TextErrors errors={[error]} />

      {meetings && <MeetingsList meetings={meetings} noModal highlightToday />}

      {isAdmin && meetings?.length === 0 && (
        <OnboardingVideo type={OnboardingVideoType.CreateMeeting} mt={10} />
      )}

      {createModal.isOpen && (
        <MeetingEditModal
          defaultCircleId={circleId}
          isOpen
          onClose={createModal.onClose}
        />
      )}

      {recurringModal.isOpen && (
        <MeetingRecurringListModal
          circleId={circleId}
          isOpen
          onClose={recurringModal.onClose}
        />
      )}
    </>
  )
}
