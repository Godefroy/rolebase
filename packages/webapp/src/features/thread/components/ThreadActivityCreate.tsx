import DecisionEditModal from '@/decision/modals/DecisionEditModal'
import { EditorHandle } from '@/editor'
import SimpleEditor from '@/editor/components/SimpleEditor'
import MeetingEditModal from '@/meeting/modals/MeetingEditModal'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import TaskModal from '@/task/modals/TaskModal'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  BoxProps,
  Button,
  Flex,
  HStack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import {
  ThreadFragment,
  Thread_Activity_Insert_Input,
  Thread_Activity_Type_Enum,
  useCreateThreadActivityMutation,
} from '@gql'
import { cmdOrCtrlKey } from '@utils/env'
import { UserLocalStorageKeys } from '@utils/localStorage'
import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import useCanEditDecisions from '@/decision/hooks/useCanEditDecisions'
import ProposalModal from '@/proposal/modals/ProposalModal'
import {
  CreateIcon,
  DecisionIcon,
  MeetingIcon,
  OrgChartIcon,
  PollIcon,
  SendIcon,
  TaskIcon,
  ThreadIcon,
} from 'src/icons'
import ActivityPollModal from '../modals/ActivityPollModal'
import ThreadEditModal from '../modals/ThreadEditModal'

interface Props extends BoxProps {
  thread: ThreadFragment
}

export default function ThreadActivityCreate({ thread, ...boxProps }: Props) {
  const { t } = useTranslation()
  const currentMember = useCurrentMember()
  const { org } = useOrgContext()
  const canAddDecision = useCanEditDecisions(thread.circleId)
  const [createThreadActivity] = useCreateThreadActivityMutation()
  const editorRef = useRef<EditorHandle>(null)

  // White editor, with action buttons slightly lighter than the footer
  const editorBg = useColorModeValue('white', 'gray.900')
  const buttonBg = useColorModeValue('whiteAlpha.600', 'whiteAlpha.100')
  const actionButtonProps = {
    size: 'sm',
    variant: 'outline',
    flexShrink: 0,
    bg: buttonBg,
  } as const

  // Save message draft
  const draftKey = UserLocalStorageKeys.ThreadDrafts.replace('{id}', thread.id)
  const handleSaveDraft = useCallback(
    (value: string) => {
      localStorage.setItem(draftKey, value)
    },
    [draftKey]
  )

  // Restore message draft
  useEffect(() => {
    const draft = localStorage.getItem(draftKey)
    if (!draft) return
    // Discard legacy Lexical JSON drafts (markdown only)
    if (draft[0] === '{') {
      localStorage.removeItem(draftKey)
      return
    }
    setTimeout(() => {
      editorRef.current?.setValue(draft)
      editorRef.current?.editor?.commands.focus()
    }, 100)
  }, [draftKey])

  // Create a new activity
  const handleCreateActivity = useCallback(
    async (activity: Thread_Activity_Insert_Input) => {
      if (!org) return

      // Create activity
      await createThreadActivity({
        variables: {
          values: {
            threadId: thread.id,
            data: {},
            ...activity,
          },
        },
      })
    },
    [org?.id, thread]
  )

  // Send message
  const handleSubmit = useCallback(async () => {
    if (!editorRef.current || editorRef.current?.isEmpty()) {
      return
    }

    // Get value
    const value = editorRef.current.getValue()

    // Clear editor
    editorRef.current?.clear()
    localStorage.setItem(draftKey, '')

    // Create message activity
    try {
      await handleCreateActivity({
        type: Thread_Activity_Type_Enum.Message,
        data: {
          message: value,
        },
      })
    } catch (error) {
      console.error(error)
      editorRef.current?.setValue(value)
      localStorage.setItem(draftKey, value)
    }
  }, [handleCreateActivity])

  // Poll
  const pollModal = useDisclosure()

  // Proposal
  const proposalModal = useDisclosure()

  // Thread
  const [entityType, setEntityType] = useState<
    | Thread_Activity_Type_Enum.Thread
    | Thread_Activity_Type_Enum.Meeting
    | Thread_Activity_Type_Enum.Task
    | Thread_Activity_Type_Enum.Decision
  >(Thread_Activity_Type_Enum.Thread)
  const entityModal = useDisclosure()

  const handleEntityOpen = useCallback(
    (event: MouseEvent<HTMLButtonElement> | Thread_Activity_Type_Enum) => {
      const type =
        typeof event === 'string'
          ? event
          : event.currentTarget.getAttribute('data-type')
      if (!type) return
      setEntityType(type as typeof entityType)
      entityModal.onOpen()
    },
    []
  )

  const handleEntityCreated = useCallback(
    (id: string) => {
      const refField = `ref${entityType}Id`
      handleCreateActivity({ type: entityType, [refField]: id })
    },
    [handleCreateActivity, entityType]
  )

  if (thread.archivedAt) {
    return (
      <Box {...boxProps}>
        <Alert status="info" maxW="500px" m="0 auto">
          <AlertIcon />
          <AlertDescription>
            {t('ThreadActivityCreate.archived')}
          </AlertDescription>
        </Alert>
      </Box>
    )
  }

  return (
    <Box {...boxProps}>
      <SimpleEditor
        ref={editorRef}
        placeholder={t('ThreadActivityCreate.placeholder')}
        value=""
        autoFocus
        maxH="50vh"
        bg={editorBg}
        onChange={handleSaveDraft}
        onSubmit={handleSubmit}
      />

      <HStack spacing={2} mt={2} align="center">
        <Flex gap={2} overflowX="auto" flex="1" py={1}>
          <Button
            {...actionButtonProps}
            leftIcon={<OrgChartIcon size={20} />}
            onClick={proposalModal.onOpen}
          >
            {t(`ThreadActivityCreate.proposal`)}
          </Button>
          {canAddDecision && (
            <Button
              {...actionButtonProps}
              leftIcon={<DecisionIcon size={20} />}
              onClick={() =>
                handleEntityOpen(Thread_Activity_Type_Enum.Decision)
              }
            >
              {t(`common.createDecision`)}
            </Button>
          )}
          <Button
            {...actionButtonProps}
            leftIcon={<PollIcon size={20} />}
            onClick={pollModal.onOpen}
          >
            {t(`ThreadActivityCreate.poll`)}
          </Button>
          <Button
            {...actionButtonProps}
            leftIcon={<TaskIcon size={20} />}
            onClick={() => handleEntityOpen(Thread_Activity_Type_Enum.Task)}
          >
            {t(`common.createTask`)}
          </Button>
          <Button
            {...actionButtonProps}
            leftIcon={<MeetingIcon size={20} />}
            onClick={() => handleEntityOpen(Thread_Activity_Type_Enum.Meeting)}
          >
            {t(`common.createMeeting`)}
          </Button>
          <Button
            {...actionButtonProps}
            leftIcon={<ThreadIcon size={20} />}
            onClick={() => handleEntityOpen(Thread_Activity_Type_Enum.Thread)}
          >
            {t(`common.createThread`)}
          </Button>
        </Flex>

        <Button
          colorScheme="blue"
          size="sm"
          flexShrink={0}
          rightIcon={<SendIcon variant="Bold" />}
          onClick={() => handleSubmit()}
        >
          {t(`common.send`)}
        </Button>
      </HStack>

      {pollModal.isOpen && (
        <ActivityPollModal
          threadId={thread.id}
          isOpen
          onClose={pollModal.onClose}
        />
      )}

      {proposalModal.isOpen && (
        <ProposalModal
          threadId={thread.id}
          isOpen
          onClose={proposalModal.onClose}
        />
      )}

      {entityModal.isOpen && (
        <>
          {entityType === Thread_Activity_Type_Enum.Thread && (
            <ThreadEditModal
              defaults={{
                circleId: thread.circleId,
                private: thread.private,
              }}
              isOpen
              onCreate={handleEntityCreated}
              onClose={entityModal.onClose}
            />
          )}

          {entityType === Thread_Activity_Type_Enum.Meeting && (
            <MeetingEditModal
              defaultCircleId={thread.circleId}
              defaultPrivate={thread.private}
              isOpen
              onCreate={handleEntityCreated}
              onClose={entityModal.onClose}
            />
          )}

          {entityType === Thread_Activity_Type_Enum.Task && (
            <TaskModal
              defaults={{
                circleId: thread.circleId,
                memberId: currentMember?.id,
                title: thread.title,
                private: thread.private,
              }}
              isOpen
              onCreate={handleEntityCreated}
              onClose={entityModal.onClose}
            />
          )}

          {entityType === Thread_Activity_Type_Enum.Decision && (
            <DecisionEditModal
              defaults={{
                circleId: thread.circleId,
                title: thread.title,
                private: thread.private,
              }}
              isOpen
              onCreate={handleEntityCreated}
              onClose={entityModal.onClose}
            />
          )}
        </>
      )}
    </Box>
  )
}
