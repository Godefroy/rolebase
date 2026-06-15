import NumberInputController from '@/common/atoms/NumberInputController'
import EditorController from '@/editor/components/EditorController'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  UseModalProps,
  VStack,
} from '@chakra-ui/react'
import {
  Thread_Activity_Type_Enum,
  useCreateThreadActivityMutation,
  useDeleteThreadPollAnswersMutation,
  useThreadPollAnswersSubscription,
  useUpdateThreadActivityMutation,
} from '@gql'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  PollChoice,
  ThreadActivityPollFragment,
} from '@rolebase/shared/model/thread_activity'
import { getDateTimeLocal } from '@utils/dates'
import React, { useEffect, useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'
import { CreateIcon, InfoTooltipIcon } from 'src/icons'
import * as yup from 'yup'

interface Props extends UseModalProps {
  threadId?: string // To create
  activity?: ThreadActivityPollFragment // To update
}

interface Values {
  question: string
  choices: PollChoice[] // Possible answers. Indexes are used as ids
  multiple: boolean
  minAnswers: number | null
  maxAnswers: number | null
  pointsPerUser: number | null
  randomize: boolean
  anonymous: boolean
  hideUntilEnd: boolean
  canAddChoice: boolean
  endDate: string | null
  endWhenAllVoted: boolean
}

const defaultValues: Values = {
  question: '#### ', // Prepare with a h4 heading
  choices: [{ title: '' }, { title: '' }],
  multiple: false,
  minAnswers: null,
  maxAnswers: null,
  pointsPerUser: null,
  randomize: false,
  anonymous: false,
  hideUntilEnd: false,
  canAddChoice: false,
  endDate: null,
  endWhenAllVoted: false,
}

const resolver = yupResolver(
  yup.object().shape({
    question: yup.string().required(),
    choices: yup.array().of(
      yup.object().shape({
        title: yup.string().required(),
      })
    ),
  })
)

export default function ActivityPollModal({
  threadId,
  activity,
  ...modalProps
}: Props) {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()
  const [updateActivity] = useUpdateThreadActivityMutation()
  const [createActivity] = useCreateThreadActivityMutation()
  const [deletePollAnswers] = useDeleteThreadPollAnswersMutation()

  // Answers
  const [acceptErasingAnswers, setAcceptErasingAnswers] = useState(false)
  const { data } = useThreadPollAnswersSubscription({
    skip: !activity,
    variables: { activityId: activity?.id! },
  })
  const answers = data?.thread_poll_answer

  const hasAnswers = (answers?.length || 0) > 0
  const shouldAcceptErasingAnswers = !acceptErasingAnswers && hasAnswers

  const defaultEndDate = useMemo(
    () =>
      getDateTimeLocal(
        activity?.data.endDate ? new Date(activity.data.endDate) : new Date()
      ),
    [activity]
  )

  const {
    handleSubmit,
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    resolver,
    defaultValues: activity
      ? {
          question: activity.data.question,
          choices: activity.data.choices,
          multiple: activity.data.multiple,
          minAnswers: activity.data.minAnswers,
          maxAnswers: activity.data.maxAnswers,
          pointsPerUser: activity.data.pointsPerUser,
          randomize: activity.data.randomize,
          anonymous: activity.data.anonymous,
          hideUntilEnd: activity.data.hideUntilEnd,
          canAddChoice: activity.data.canAddChoice,
          endDate: activity.data.endDate
            ? getDateTimeLocal(new Date(activity.data.endDate))
            : null,
          endWhenAllVoted: activity.data.endWhenAllVoted,
        }
      : defaultValues,
  })

  // Choices
  const {
    fields: choicesFields,
    append: appendChoice,
    remove: removeChoice,
  } = useFieldArray({
    control,
    name: 'choices',
  })

  // Multiple choices
  const multiple = watch('multiple')
  const minAnswers = watch('minAnswers')
  const maxAnswers = watch('maxAnswers')
  const pointsPerUser = watch('pointsPerUser')
  useEffect(() => {
    if (!multiple) {
      setValue('minAnswers', null)
      setValue('maxAnswers', null)
      setValue('canAddChoice', false)
      setValue('pointsPerUser', null)
    }
  }, [multiple])

  const endDate = watch('endDate')

  const onSubmit = handleSubmit(async ({ endDate, ...data }) => {
    if (!orgId) return

    try {
      const activityData = {
        endDate: endDate ? new Date(endDate).toISOString() : null,
        ...data,
      }
      if (activity) {
        // Erase answers
        await deletePollAnswers({ variables: { activityId: activity.id } })

        // Update poll
        await updateActivity({
          variables: { id: activity.id, values: { data: activityData } },
        })
      } else if (threadId) {
        await createActivity({
          variables: {
            values: {
              threadId,
              type: Thread_Activity_Type_Enum.Poll,
              data: activityData,
            },
          },
        })
      }
      modalProps.onClose()
    } catch (error) {
      console.error(error)
    }
  })

  return (
    <Modal size="2xl" {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex alignItems="center">
            {t(
              activity
                ? 'ActivityPollModal.headingEdit'
                : 'ActivityPollModal.headingCreate'
            )}

            {!activity && (
              <Tooltip hasArrow p={3} label={t('ActivityPollModal.help')}>
                <Box ml={3}>
                  <InfoTooltipIcon />
                </Box>
              </Tooltip>
            )}
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <form onSubmit={onSubmit}>
            <VStack spacing={5} align="stretch">
              {hasAnswers && (
                <>
                  <Alert status="warning">
                    <AlertIcon />
                    {t('ActivityPollModal.resetNeeded')}
                  </Alert>
                  <Checkbox
                    isChecked={acceptErasingAnswers}
                    onChange={() =>
                      setAcceptErasingAnswers(!acceptErasingAnswers)
                    }
                  >
                    {t('ActivityPollModal.resetBtn')}
                  </Checkbox>
                </>
              )}

              <FormControl isInvalid={!!errors.question}>
                <FormLabel>{t('ActivityPollModal.question')}</FormLabel>
                <EditorController
                  name="question"
                  placeholder={t('ActivityPollModal.questionPlaceholder')}
                  autoFocus
                  control={control}
                />
              </FormControl>

              <Box>
                <FormLabel>{t('ActivityPollModal.choices')}</FormLabel>
                <Stack spacing={2}>
                  {choicesFields.map((field, index) => (
                    <FormControl
                      isInvalid={!!errors.choices?.[index]}
                      key={field.id}
                    >
                      <InputGroup>
                        <Input
                          {...register(`choices.${index}.title`)}
                          placeholder={t('ActivityPollModal.choicePlacholder', {
                            n: index + 1,
                          })}
                        />
                        {choicesFields.length > 2 ? (
                          <InputRightElement>
                            <IconButton
                              aria-label={t('common.remove')}
                              variant="ghost"
                              icon={<FiX />}
                              onClick={() => removeChoice(index)}
                            />
                          </InputRightElement>
                        ) : null}
                      </InputGroup>
                    </FormControl>
                  ))}
                  <Button
                    leftIcon={<CreateIcon size={20} />}
                    onClick={() => appendChoice({ title: '' })}
                  >
                    {t('ActivityPollModal.addChoice')}
                  </Button>
                </Stack>
              </Box>

              <Accordion allowToggle>
                <AccordionItem>
                  <AccordionButton>
                    <Text textAlign="left">
                      {t('ActivityPollModal.options')}
                    </Text>
                    <AccordionIcon ml={2} />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <Stack spacing={1}>
                      <Checkbox {...register('multiple')}>
                        {t('ActivityPollModal.multiple')}
                      </Checkbox>
                      {multiple && (
                        <Stack spacing={1} pl={6}>
                          <Stack direction="row">
                            <Checkbox
                              isChecked={!!minAnswers}
                              onChange={() =>
                                setValue('minAnswers', minAnswers ? null : 2)
                              }
                            >
                              {t('ActivityPollModal.minAnswers')}
                            </Checkbox>
                            {minAnswers && (
                              <NumberInputController
                                name="minAnswers"
                                control={control}
                                size="xs"
                                maxW={16}
                                min={2}
                                max={choicesFields.length}
                              />
                            )}
                          </Stack>

                          <Stack direction="row">
                            <Checkbox
                              isChecked={!!maxAnswers}
                              onChange={() =>
                                setValue(
                                  'maxAnswers',
                                  maxAnswers ? null : choicesFields.length
                                )
                              }
                            >
                              {t('ActivityPollModal.maxAnswers')}
                            </Checkbox>
                            {maxAnswers && (
                              <NumberInputController
                                name="maxAnswers"
                                control={control}
                                size="xs"
                                maxW={16}
                                min={2}
                                max={choicesFields.length}
                              />
                            )}
                          </Stack>

                          <Stack direction="row">
                            <Checkbox
                              isChecked={!!pointsPerUser}
                              onChange={() =>
                                setValue(
                                  'pointsPerUser',
                                  pointsPerUser === null ? 2 : null
                                )
                              }
                            >
                              {t('ActivityPollModal.points')}
                            </Checkbox>
                            {pointsPerUser && (
                              <NumberInputController
                                name="pointsPerUser"
                                control={control}
                                size="xs"
                                maxW={16}
                                min={2}
                              />
                            )}
                          </Stack>
                        </Stack>
                      )}

                      {/*
                      <Checkbox {...register('canAddChoice')}>
                        {t('ActivityPollModal.canAddChoices')}
                      </Checkbox>
                      */}
                      <Checkbox {...register('anonymous')}>
                        {t('ActivityPollModal.anonymous')}
                      </Checkbox>
                      <Checkbox {...register('randomize')}>
                        {t('ActivityPollModal.randomize')}
                      </Checkbox>
                      <Checkbox {...register('hideUntilEnd')}>
                        {t('ActivityPollModal.hideUntilEnd')}
                      </Checkbox>

                      <Checkbox {...register('endWhenAllVoted')}>
                        {t('ActivityPollModal.endWhenAllVoted')}
                      </Checkbox>
                      <Checkbox
                        isChecked={!!endDate}
                        onChange={() =>
                          setValue('endDate', endDate ? null : defaultEndDate)
                        }
                      >
                        {t('ActivityPollModal.endDate')}
                      </Checkbox>
                      {endDate ? (
                        <Box pl={6}>
                          <Input
                            {...register('endDate')}
                            type="datetime-local"
                            size="sm"
                            maxW="250px"
                          />
                        </Box>
                      ) : null}
                    </Stack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              <Box textAlign="right">
                <Button
                  colorScheme="blue"
                  type="submit"
                  isDisabled={shouldAcceptErasingAnswers}
                >
                  {t(activity ? 'common.save' : 'common.create')}
                </Button>
              </Box>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
