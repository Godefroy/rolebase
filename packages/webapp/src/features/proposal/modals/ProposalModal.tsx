import EditorController from '@/editor/components/EditorController'
import SwitchController from '@/common/atoms/SwitchController'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  UseModalProps,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import {
  Thread_Activity_Type_Enum,
  Thread_Status_Enum,
  useCreateThreadActivityMutation,
  useCreateThreadMutation,
  useUpdateThreadActivityMutation,
} from '@gql'
import { yupResolver } from '@hookform/resolvers/yup'
import ParticipantsNumber from '@/participants/components/ParticipantsNumber'
import CircleFormController from '@/circle/components/CircleFormController'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import {
  ProposalDecisionMode,
  ProposalLog,
  ProposalVotersScope,
  ThreadActivityDataProposal,
} from '@rolebase/shared/model/proposal'
import { ThreadActivityProposalFragment } from '@rolebase/shared/model/thread_activity'
import { getDateTimeLocal } from '@utils/dates'
import { ThreadContext } from '@/thread/contexts/ThreadContext'
import React, { useContext, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { OrgChartIcon } from 'src/icons'
import * as yup from 'yup'
import ProposalLogsPreview from '../components/ProposalLogsPreview'
import ProposalGraphEditorModal from './ProposalGraphEditorModal'
import useProposalVoters from '../hooks/useProposalVoters'

interface Props extends UseModalProps {
  threadId?: string // To create a proposal in an existing thread
  // When there is no thread yet (e.g. opened from a role's Security menu), a
  // thread is created on the fly. This pre-fills the circle picker.
  circleId?: string
  activity?: ThreadActivityProposalFragment // To update
  defaults?: Partial<ThreadActivityDataProposal> // To prefill a new proposal
}

interface Values {
  title: string
  circleId: string
  description: string
  decisionMode: ProposalDecisionMode
  votersScope: ProposalVotersScope
  allowAbstain: boolean
  showVoters: boolean
  earlyResolution: boolean
  hasResolutionDate: boolean
  resolutionDate: string | null
}

const resolver = yupResolver(
  yup.object().shape({
    title: yup.string().required(),
  })
)

export default function ProposalModal({
  threadId,
  circleId,
  activity,
  defaults,
  ...modalProps
}: Props) {
  const { t } = useTranslation()
  const { circle } = useContext(ThreadContext) ?? {}
  const { orgId } = useOrgContext()
  const currentMember = useCurrentMember()
  const navigateOrg = useNavigateOrg()
  const [createActivity] = useCreateThreadActivityMutation()
  const [updateActivity] = useUpdateThreadActivityMutation()
  const [createThread] = useCreateThreadMutation()

  // When there is no existing thread/activity, a thread is created on submit.
  const needsThread = !activity && !threadId

  const base = activity?.data || defaults
  const [logs, setLogs] = useState<ProposalLog[]>(base?.logs || [])
  const editor = useDisclosure()

  const form = useForm<Values>({
    resolver,
    defaultValues: {
      title: base?.title || '',
      circleId: circleId || '',
      description: base?.description || '',
      decisionMode: base?.decisionMode || 'consent',
      votersScope: base?.votersScope || 'circle',
      allowAbstain: base?.allowAbstain ?? false,
      showVoters: base?.showVoters ?? true,
      earlyResolution: base?.earlyResolution ?? true,
      hasResolutionDate: !!base?.resolutionDate,
      resolutionDate: base?.resolutionDate
        ? getDateTimeLocal(new Date(base.resolutionDate))
        : null,
    },
  })
  const {
    handleSubmit,
    register,
    control,
    watch,
    setError,
    formState: { errors },
  } = form

  const hasResolutionDate = watch('hasResolutionDate')
  const votersScope = watch('votersScope')
  const decisionMode = watch('decisionMode')
  const selectedCircleId = watch('circleId')

  // Circle used by the org-chart editor and voters: the thread's circle,
  // otherwise the one picked (or pre-filled) when creating a thread on the fly.
  const editorCircleId = circle?.id || selectedCircleId || undefined
  const voters = useProposalVoters(votersScope, editorCircleId)

  const onSubmit = handleSubmit(async (values) => {
    const data = {
      title: values.title,
      description: values.description,
      decisionMode: values.decisionMode,
      votersScope: values.votersScope,
      allowAbstain: values.decisionMode === 'consent' ? false : values.allowAbstain,
      showVoters: values.showVoters,
      earlyResolution: values.earlyResolution,
      resolutionDate:
        values.hasResolutionDate && values.resolutionDate
          ? new Date(values.resolutionDate).toISOString()
          : null,
      logs,
      status: activity?.data.status || ('inProgress' as const),
      resolvedAt: activity?.data.resolvedAt || null,
      appliedDecisionId: activity?.data.appliedDecisionId || null,
    }

    if (activity) {
      await updateActivity({ variables: { id: activity.id, values: { data } } })
    } else {
      // Use the given thread, or create one named after the proposal.
      let targetThreadId = threadId
      const createdThread = !targetThreadId
      if (!targetThreadId) {
        if (!values.circleId) {
          setError('circleId', { message: t('ProposalModal.circleRequired') })
          return
        }
        if (!orgId || !currentMember) return
        const { data: threadData } = await createThread({
          variables: {
            values: {
              orgId,
              title: values.title,
              circleId: values.circleId,
              initiatorMemberId: currentMember.id,
              status: Thread_Status_Enum.Active,
            },
          },
        })
        targetThreadId = threadData?.insert_thread_one?.id
      }
      if (!targetThreadId) return
      await createActivity({
        variables: {
          values: {
            threadId: targetThreadId,
            type: Thread_Activity_Type_Enum.Proposal,
            data,
          },
        },
      })
      // When the thread was created on the fly, open its page.
      if (createdThread) {
        navigateOrg(`threads/${targetThreadId}`)
      }
    }
    modalProps.onClose()
  })

  return (
    <Modal
      size="2xl"
      {...modalProps}
      // Drop the scroll lock while the full-screen org-chart editor is open:
      // its panels are portaled outside React's #root event root, where
      // react-remove-scroll can't whitelist their wheel scrolling, so any lock
      // (this one included) blocks it. See ProposalGraphEditorModal.
      blockScrollOnMount={!editor.isOpen}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t(activity ? 'ProposalModal.headingEdit' : 'ProposalModal.headingCreate')}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormProvider {...form}>
            <form onSubmit={onSubmit}>
              <VStack spacing={5} align="stretch">
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>{t('ProposalModal.title')}</FormLabel>
                <Input
                  {...register('title')}
                  placeholder={t('ProposalModal.titlePlaceholder')}
                  autoFocus
                />
              </FormControl>

              {needsThread && <CircleFormController />}

              <FormControl>
                <FormLabel>{t('ProposalModal.description')}</FormLabel>
                <EditorController name="description" control={control} />
              </FormControl>

              <Box>
                <Flex align="center" mb={2}>
                  <Heading size="sm">{t('ProposalModal.orgChart')}</Heading>
                  <Box flex="1" />
                  <Button
                    leftIcon={<OrgChartIcon size={20} />}
                    onClick={editor.onOpen}
                  >
                    {t('ProposalModal.editOrgChart')}
                  </Button>
                </Flex>
                <Box
                  borderWidth="1px"
                  borderRadius="md"
                  px={2}
                  py={1}
                  bg="white"
                  _dark={{ bg: 'blackAlpha.300' }}
                >
                  <ProposalLogsPreview logs={logs} />
                </Box>
              </Box>

              <FormControl>
                <FormLabel>{t('ProposalModal.decisionMode')}</FormLabel>
                <Select {...register('decisionMode')}>
                  <option value="consent">
                    {t('ProposalModal.decisionMode_consent')}
                  </option>
                  <option value="unanimity">
                    {t('ProposalModal.decisionMode_unanimity')}
                  </option>
                  <option value="simpleMajority">
                    {t('ProposalModal.decisionMode_simpleMajority')}
                  </option>
                  <option value="absoluteMajority">
                    {t('ProposalModal.decisionMode_absoluteMajority')}
                  </option>
                </Select>
                {decisionMode !== 'consent' && (
                  <SwitchController
                    name="allowAbstain"
                    control={control}
                    mt={3}
                  >
                    {t('ProposalModal.allowAbstain')}
                  </SwitchController>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>{t('ProposalModal.voters')}</FormLabel>
                <Flex align="center">
                  <Select {...register('votersScope')} maxW="280px">
                    <option value="thread">
                      {t('ProposalModal.voters_thread')}
                    </option>
                    <option value="circle">
                      {t('ProposalModal.voters_circle')}
                    </option>
                  </Select>
                  <ParticipantsNumber participants={voters} ml={3} />
                </Flex>
                <SwitchController
                  name="showVoters"
                  control={control}
                  mt={3}
                >
                  {t('ProposalModal.showVoters')}
                </SwitchController>
              </FormControl>

              <FormControl>
                <FormLabel>{t('ProposalModal.resolution')}</FormLabel>
                <SwitchController name="earlyResolution" control={control}>
                  {t('ProposalModal.earlyResolution')}
                </SwitchController>
                <SwitchController
                  name="hasResolutionDate"
                  control={control}
                  mt={3}
                >
                  {t('ProposalModal.hasResolutionDate')}
                </SwitchController>
                {hasResolutionDate && (
                  <Input
                    {...register('resolutionDate')}
                    type="datetime-local"
                    mt={2}
                    maxW="250px"
                  />
                )}
              </FormControl>

              <Box textAlign="right">
                <Button colorScheme="blue" type="submit">
                  {t(activity ? 'common.save' : 'common.create')}
                </Button>
              </Box>
            </VStack>
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>

      {editor.isOpen && (
        <ProposalGraphEditorModal
          isOpen
          onClose={editor.onClose}
          logs={logs}
          circleId={editorCircleId}
          onChange={setLogs}
        />
      )}
    </Modal>
  )
}
