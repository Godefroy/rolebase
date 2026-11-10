import IconTextButton from '@/common/atoms/IconTextButton'
import { EditorHandle } from '@/editor'
import CollabEditor from '@/editor/components/CollabEditor'
import useCircleParticipants from '@/participants/hooks/useCircleParticipants'
import useExtraParticipants from '@/participants/hooks/useExtraParticipants'
import ThreadStatusIcon from '@/thread/components/ThreadStatusIcon'
import useCreateThreadMeetingNote from '@/thread/hooks/useCreateThreadMeetingNote'
import { CloseIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  Text,
} from '@chakra-ui/react'
import {
  ThreadActivityFragment,
  Thread_Status_Enum,
  ThreadsWithMeetingNoteSubscription,
  useUpdateThreadActivityMutation,
} from '@gql'
import { Draggable } from '@hello-pangea/dnd'
import { ThreadActivityDataMeetingNote } from '@rolebase/shared/model/thread_activity'
import React, { useCallback, useContext, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import ThreadItem from '../../thread/components/ThreadItem'
import { MeetingContext } from '../contexts/MeetingContext'
import { NotAllowedThread } from './MeetingThreadsDragDropContext'

export type CircleThreadWithMeetingNote = NonNullable<
  ThreadsWithMeetingNoteSubscription['thread']
>[0]

interface Props {
  thread: CircleThreadWithMeetingNote | NotAllowedThread
  index: number
  onRemove?(): void
}

export default function MeetingStepContentThreadItem({
  thread,
  index,
  onRemove,
}: Props) {
  const { t } = useTranslation()
  const editorRef = useRef<EditorHandle>(null)
  const meetingState = useContext(MeetingContext)!
  const { meeting, editable, participants } = meetingState

  const createThreadMeetingNote = useCreateThreadMeetingNote()
  const [updateThreadActivity] = useUpdateThreadActivityMutation()

  // Privacy
  const isAllowed = !('notAllowed' in thread)

  // Activity data
  const activity = isAllowed
    ? (thread.activities[0] as ThreadActivityFragment | undefined)
    : undefined
  const activityData = activity?.data as
    ThreadActivityDataMeetingNote | undefined
  const hasNotes = !!activityData?.notes

  // Participants
  const circleParticipants = useCircleParticipants(
    isAllowed ? thread.circleId : undefined
  )
  const threadParticipants = useExtraParticipants(
    circleParticipants,
    isAllowed ? thread.extra_members : undefined
  )
  const notAllowedParticipants = useMemo(
    () =>
      participants.filter(
        (p) => !threadParticipants.find((tp) => tp.member.id === p.member.id)
      ),
    [participants, threadParticipants]
  )

  // Update notes
  const handleNotesChange = useCallback(
    (notes: string) => {
      if (!meeting) return
      if (!activity) {
        createThreadMeetingNote(thread.id, meeting.id, notes)
      } else {
        updateThreadActivity({
          variables: {
            id: activity.id,
            values: { data: { notes } },
          },
        })
      }
    },
    [activity, meeting]
  )

  if (!meeting) return null

  return (
    <Draggable draggableId={thread.id} index={index}>
      {(provided, snapshot) => (
        <Box ref={provided.innerRef} {...provided.draggableProps} pb={10}>
          {isAllowed ? (
            <>
              <ThreadItem
                thread={thread}
                showIcon
                showMember
                isDragging={snapshot.isDragging}
                mb={2}
                mx={-2}
                labelProps={{
                  fontSize: 'md',
                  fontFamily: 'heading',
                  fontWeight: 'medium',
                }}
                {...provided.dragHandleProps}
              >
                {onRemove && (
                  <IconTextButton
                    aria-label={t('common.remove')}
                    size="xs"
                    variant="ghost"
                    icon={<CloseIcon />}
                    ml={2}
                    zIndex={1}
                    onClick={onRemove}
                  />
                )}
              </ThreadItem>

              {meeting.private && !thread.private && (
                <Alert status="warning" mb={2}>
                  <AlertIcon />
                  <AlertDescription>
                    {t('MeetingStepContentThreadItem.privateWarning')}
                  </AlertDescription>
                </Alert>
              )}

              {thread.private && notAllowedParticipants.length > 0 && (
                <Alert status="warning" mb={2}>
                  <AlertIcon />
                  <AlertDescription>
                    {t(
                      'MeetingStepContentThreadItem.notAllowedParticipantsWarning',
                      {
                        count: notAllowedParticipants.length,
                        participants: notAllowedParticipants
                          .map((p) => p.member.name)
                          .join(', '),
                      }
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {(editable || hasNotes) && (
                <CollabEditor
                  ref={editorRef}
                  docId={`thread-${thread.id}-meeting-${meeting.id}`}
                  value={activityData?.notes || ''}
                  placeholder={t('MeetingStepContent.notesPlaceholder')}
                  readOnly={!editable}
                  saveEvery={10000}
                  onSave={handleNotesChange}
                />
              )}
            </>
          ) : (
            <Flex align="center">
              <ThreadStatusIcon value={Thread_Status_Enum.Blocked} readOnly />
              <Text fontStyle="italic" ml={2}>
                {t('MeetingStepContentThreadItem.notAllowed')}
              </Text>
            </Flex>
          )}
        </Box>
      )}
    </Draggable>
  )
}
