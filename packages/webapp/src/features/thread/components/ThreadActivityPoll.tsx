import Loading from '@/common/atoms/Loading'
import Markdown from '@/common/atoms/Markdown'
import TextErrors from '@/common/atoms/TextErrors'
import { useAuth } from '@/user/hooks/useAuth'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import {
  Card,
  CardBody,
  Link,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import {
  useCreateThreadPollAnswerMutation,
  useThreadPollAnswersSubscription,
  useUpdateThreadPollAnswerMutation,
} from '@gql'
import { ThreadActivityPollFragment } from '@rolebase/shared/model/thread_activity'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import usePollState from '../hooks/usePollState'
import ActivityPollModal from '../modals/ActivityPollModal'
import ThreadActivityLayout from './ThreadActivityLayout'
import ThreadActivityPollResult from './ThreadActivityPollResult'
import ThreadActivityPollVote from './ThreadActivityPollVote'

interface Props {
  activity: ThreadActivityPollFragment
}

export default function ThreadActivityPoll({ activity }: Props) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const currentMember = useCurrentMember()
  const isMember = useOrgMember()

  // Edit modal
  const isUserOwner = user?.id === activity.userId
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure()

  // Answers
  const [createPollAnswer] = useCreateThreadPollAnswerMutation()
  const [updatePollAnswer] = useUpdateThreadPollAnswerMutation()
  const { data, error, loading } = useThreadPollAnswersSubscription({
    variables: { activityId: activity.id },
  })
  const answers = data?.thread_poll_answer

  const { ended, userAnswer } = usePollState(activity, answers)

  const [editing, setEditing] = useState(false)

  // Show vote buttons by default if poll not ended
  // and user has not answered or results are hidden
  useEffect(() => {
    setEditing(
      !ended && isMember && (!userAnswer || activity.data.hideUntilEnd)
    )
  }, [userAnswer, ended, activity.data.hideUntilEnd])

  // Vote
  const handleVote = (choicesPoints: number[]) => {
    if (!answers || !user || !currentMember) return
    const existingAnswer = answers.find((a) => a.userId === user.id)
    if (existingAnswer) {
      updatePollAnswer({
        variables: {
          id: existingAnswer.id,
          values: {
            choicesPoints,
          },
        },
      })
    } else {
      createPollAnswer({
        variables: {
          values: {
            activityId: activity.id,
            memberId: currentMember.id,
            choicesPoints,
          },
        },
      })
    }
  }

  return (
    <ThreadActivityLayout
      activity={activity}
      allowDelete
      onEdit={isUserOwner ? onEditOpen : undefined}
    >
      <Text color="gray.500" _dark={{ color: 'gray.300' }}>
        {t(`ThreadActivityPoll.text`)}
      </Text>

      <Card mt={5} variant="activity">
        <CardBody>
          <VStack spacing={2} alignItems="start" role="group">
            <Markdown>{activity.data.question}</Markdown>

            {loading && <Loading active size="md" />}
            <TextErrors errors={[error]} />

            {answers &&
              (editing ? (
                <>
                  <ThreadActivityPollVote
                    activity={activity}
                    answers={answers}
                    onVote={handleVote}
                  />
                  {(ended || !activity.data.hideUntilEnd) && (
                    <Link onClick={() => setEditing(false)}>
                      {t(`ThreadActivityPoll.showResults`)}
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <ThreadActivityPollResult
                    activity={activity}
                    answers={answers}
                  />
                  {!ended && isMember && (
                    <Link onClick={() => setEditing(true)}>
                      {t(`ThreadActivityPoll.changeVote`)}
                    </Link>
                  )}
                </>
              ))}
          </VStack>
        </CardBody>
      </Card>

      {isEditOpen && (
        <ActivityPollModal
          isOpen
          threadId={activity.threadId}
          activity={activity}
          onClose={onEditClose}
        />
      )}
    </ThreadActivityLayout>
  )
}
