import CircleByIdButton from '@/circle/components/CircleByIdButton'
import CircleMemberLink from '@/circle/components/CircleMemberLink'
import ActionsMenu from '@/common/atoms/ActionsMenu'
import Loading from '@/common/atoms/Loading'
import Switch from '@/common/atoms/Switch'
import SwitchController from '@/common/atoms/SwitchController'
import { Title } from '@/common/atoms/Title'
import { usePreventClose } from '@/common/hooks/usePreventClose'
import Page404 from '@/common/pages/Page404'
import CollabEditor from '@/editor/components/CollabEditor'
import EditorController from '@/editor/components/EditorController'
import MemberByIdButton from '@/member/components/MemberByIdButton'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import useOrgMember from '@/member/hooks/useOrgMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { usePathInOrg } from '@/org/hooks/usePathInOrg'
import ParticipantsNumber from '@/participants/components/ParticipantsNumber'
import useCircleParticipants from '@/participants/hooks/useCircleParticipants'
import useExtraParticipants from '@/participants/hooks/useExtraParticipants'
import CircleSearchInput from '@/search/components/CircleSearchInput'
import MemberSearchInput from '@/search/components/MemberSearchInput'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  BoxProps,
  Button,
  Center,
  Collapse,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Tag,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import {
  Task_Status_Enum,
  TaskFragment,
  useTaskSubscription,
  useUpdateTaskMutation,
} from '@gql'
import { yupResolver } from '@hookform/resolvers/yup'
import { nameSchema } from '@rolebase/shared/schemas'
import { getDateTimeLocal } from '@utils/dates'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon, ChevronUpIcon, PrivacyIcon } from 'src/icons'
import settings from 'src/settings'
import * as yup from 'yup'
import useCreateTask from '../hooks/useCreateTask'
import useUpdateTaskStatus from '../hooks/useUpdateTaskStatus'
import TaskDeleteModal from '../modals/TaskDeleteModal'
import { TaskLogs } from './TaskLogs'
import TaskStatusInput from './TaskStatusInput'
import TaskStatusTag from './TaskStatusTag'

interface Props extends BoxProps {
  id?: string
  changeTitle?: boolean
  headerIcons?: React.ReactNode
  defaults?: Partial<TaskFragment>
  onClose(): void
  onCreate?(taskId: string): void
}

interface Values {
  circleId: string
  memberId: string | null
  title: string
  description: string
  dueDate: string | null
  private: boolean
}

const resolver = yupResolver(
  yup.object().shape({
    title: nameSchema.required(),
    circleId: yup.string().required(),
    description: yup.string(),
  })
)

export default function TaskContent({
  id,
  changeTitle,
  defaults,
  headerIcons,
  onClose,
  onCreate,
  ...boxProps
}: Props) {
  const { t } = useTranslation()
  const { orgId, orgData } = useOrgContext()
  const isMember = useOrgMember()
  const currentMember = useCurrentMember()
  const updateTaskStatus = useUpdateTaskStatus()
  const createTask = useCreateTask()
  const [updateTask] = useUpdateTaskMutation()
  const showLogs = useDisclosure()
  const { preventClose, allowClose } = usePreventClose()

  const { data, loading, error } = useTaskSubscription({
    skip: !id,
    variables: {
      id: id!,
    },
  })
  const task = data?.task_by_pk
  const path = usePathInOrg(`tasks/${id}`)

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<Values>({
    resolver,
    defaultValues: {
      circleId: defaults?.circleId || '',
      memberId: defaults?.memberId || null,
      title: defaults?.title || '',
      description: defaults?.description || '',
      dueDate: null,
      private: defaults?.private || false,
    },
  })

  // Reset form when task changes
  useEffect(() => {
    if (!task) return
    reset({
      circleId: task.circleId,
      memberId: task.memberId || null,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? getDateTimeLocal(new Date(task.dueDate)) : null,
      private: task.private,
    })
  }, [task])

  const dueDate = watch('dueDate')

  const onSubmit = handleSubmit(async ({ dueDate, memberId, ...data }) => {
    if (!orgId || !currentMember) return
    const taskUpdate = {
      ...data,
      memberId: memberId ?? null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    }
    if (id) {
      // Update task
      await updateTask({
        variables: { id, values: taskUpdate },
      })
      allowClose()
    } else {
      // Create task
      const newTask = await createTask({
        orgId,
        status: defaults?.status || Task_Status_Enum.Open,
        ...taskUpdate,
      })
      if (!newTask) return

      onCreate?.(newTask.id)
      onClose()
    }
  })

  // Save after X seconds
  const watchedData = watch()
  const onSubmitDebounced = useMemo(
    () => debounce(onSubmit, 1000),
    [id, orgId, currentMember]
  )
  useEffect(() => {
    if (!id || !isDirty || !isPrivateAllowed) return
    preventClose()
    onSubmitDebounced()
  }, [id, isDirty, ...Object.values(watchedData)])

  // Get circle and participants
  const circle = orgData?.getCircle(watchedData.circleId)
  const circleParticipants = useCircleParticipants(circle)
  const allParticipants = useExtraParticipants(
    circleParticipants,
    watchedData.memberId ? [watchedData.memberId] : []
  )
  const isPrivateAllowed =
    !watchedData.private ||
    allParticipants.some((p) => p.member.id === currentMember?.id)

  // Toggle due date
  const handleToggleDueDate = useCallback(() => {
    if (dueDate) {
      setValue('dueDate', null, { shouldDirty: true })
    } else {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      date.setHours(12, 0, 0, 0)
      setValue('dueDate', getDateTimeLocal(date), { shouldDirty: true })
    }
  }, [dueDate])

  // Change task status
  const handleChangeStatus = useCallback(
    (status: Task_Status_Enum) => {
      if (!task) return
      updateTaskStatus(task, status)
    },
    [task, updateTaskStatus]
  )

  // Change description
  const handleDescriptionChange = useCallback(
    async (description: string) => {
      setValue('description', description, { shouldDirty: true })
    },
    [task]
  )

  // Task deletion modal
  const deleteModal = useDisclosure()

  if (error || (id && !task && !loading)) {
    console.error(error || new Error('Task not found'))
    return <Page404 />
  }

  return (
    <Box {...boxProps}>
      {changeTitle && <Title>{task?.title || '…'}</Title>}

      <Flex align="center" mb={5}>
        <Heading as="h1" size="md">
          {t(id ? 'TaskContent.headingEdit' : 'TaskContent.headingCreate')}
        </Heading>

        {task &&
          (isMember ? (
            <TaskStatusInput
              value={task.status}
              onChange={handleChangeStatus}
              ml={5}
              size="lg"
            />
          ) : (
            <TaskStatusTag status={task.status} ml={5} size="lg" />
          ))}

        {id && loading && <Loading active size="sm" ml={5} />}

        {task?.archived && <Tag ml={2}>{t('common.archived')}</Tag>}

        <Spacer />

        {task?.private && (
          <Tooltip
            label={t('TaskContent.privateTooltip', {
              role: orgData?.getRole(circle?.roleId)?.name,
            })}
            hasArrow
          >
            <Center mr={2}>
              <PrivacyIcon size={20} />
            </Center>
          </Tooltip>
        )}

        <Flex mr={headerIcons ? -3 : 0}>
          {id && isMember && (
            <ActionsMenu
              ml={3}
              copyLinkUrl={`${settings.url}${path}`}
              onDelete={deleteModal.onOpen}
            />
          )}

          {headerIcons}
        </Flex>
      </Flex>

      <VStack spacing={10} alignItems="start" mb={3}>
        <FormControl isInvalid={!!errors.title}>
          <Input
            {...register('title')}
            size="lg"
            placeholder={t('TaskContent.titlePlaceholder')}
            autoFocus
            readOnly={!isMember}
          />
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel>{t('TaskContent.description')}</FormLabel>
          {task ? (
            <CollabEditor
              docId={`task-${id}-description`}
              value={task.description}
              placeholder={t('TaskContent.notes')}
              minH="80px"
              saveEvery={10000}
              readOnly={!isMember}
              onSave={handleDescriptionChange}
            />
          ) : (
            <EditorController
              name="description"
              placeholder={t('TaskContent.notes')}
              control={control}
            />
          )}
        </FormControl>

        <Flex flexWrap="wrap">
          <FormControl isInvalid={!!errors.circleId} w="auto" mr={5}>
            <FormLabel>{t('TaskContent.circle')}</FormLabel>
            <Controller
              name="circleId"
              control={control}
              render={({ field }) =>
                isMember ? (
                  <CircleSearchInput
                    value={field.value}
                    onChange={field.onChange}
                  />
                ) : (
                  <CircleByIdButton id={field.value} />
                )
              }
            />
          </FormControl>

          <FormControl isInvalid={!!errors.memberId} w="auto">
            <FormLabel>{t('TaskContent.memberId')}</FormLabel>
            <Controller
              name="memberId"
              control={control}
              render={({ field }) =>
                isMember ? (
                  <MemberSearchInput
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    onClear={() => field.onChange(null)}
                  />
                ) : field.value ? (
                  <CircleMemberLink memberId={field.value}>
                    <MemberByIdButton id={field.value} size="sm" />
                  </CircleMemberLink>
                ) : (
                  <></>
                )
              }
            />
          </FormControl>
        </Flex>

        <VStack spacing={3} align="start">
          <FormControl>
            <Switch
              isChecked={!!dueDate}
              isReadOnly={!isMember}
              onChange={handleToggleDueDate}
            >
              {t('TaskContent.dueDate')}
            </Switch>
            <Collapse in={!!dueDate}>
              <Box mt={4} mb={2} pl={10}>
                <Input
                  {...register('dueDate')}
                  type="datetime-local"
                  w="250px"
                  readOnly={!isMember}
                />
              </Box>
            </Collapse>
          </FormControl>

          <FormControl>
            <SwitchController
              name="private"
              control={control}
              isReadOnly={!isMember}
            >
              {t('TaskContent.private')}
              <ParticipantsNumber
                participants={allParticipants}
                opacity={watchedData.private ? 1 : 0.4}
                ml={2}
              />
            </SwitchController>
            <Collapse in={watchedData.private}>
              <FormHelperText ml="40px" mb={2}>
                {t('TaskContent.privateHelp', {
                  role: orgData?.getRole(circle?.roleId)?.name,
                })}
              </FormHelperText>
            </Collapse>
          </FormControl>
        </VStack>

        <Collapse in={!isPrivateAllowed}>
          <Alert status="warning">
            <AlertIcon />
            <AlertDescription>
              {t('TaskContent.privateNotAllowed', {
                role: orgData?.getRole(circle?.roleId)?.name,
              })}
            </AlertDescription>
          </Alert>
        </Collapse>

        {id && (
          <Box>
            <Button
              variant="link"
              leftIcon={
                showLogs.isOpen ? (
                  <ChevronUpIcon size="1em" />
                ) : (
                  <ChevronDownIcon size="1em" />
                )
              }
              onClick={showLogs.onToggle}
            >
              {showLogs.isOpen ? (
                <Heading as="h2" size="md">
                  {t('TaskContent.logs')}
                </Heading>
              ) : (
                t('TaskContent.logs')
              )}
            </Button>
            {showLogs.isOpen && <TaskLogs taskId={id} mt={2} />}
          </Box>
        )}

        {!id && isMember && (
          <Box w="100%" textAlign="right">
            <Button
              colorScheme="blue"
              isDisabled={!isPrivateAllowed}
              onClick={onSubmit}
            >
              {t('common.create')}
            </Button>
          </Box>
        )}
      </VStack>

      {deleteModal.isOpen && task && (
        <TaskDeleteModal
          task={task}
          isOpen
          onClose={deleteModal.onClose}
          onDelete={onClose}
        />
      )}
    </Box>
  )
}
