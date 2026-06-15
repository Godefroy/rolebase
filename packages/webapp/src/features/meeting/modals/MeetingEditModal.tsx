import CircleFormController from '@/circle/components/CircleFormController'
import NumberInputController from '@/common/atoms/NumberInputController'
import SwitchController from '@/common/atoms/SwitchController'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import ParticipantScopeInput from '@/participants/components/ParticipantScopeInput'
import ParticipantsNumber from '@/participants/components/ParticipantsNumber'
import useCircleParticipants from '@/participants/hooks/useCircleParticipants'
import useExtraParticipants from '@/participants/hooks/useExtraParticipants'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Collapse,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  UseModalProps,
  useToast,
  VStack,
} from '@chakra-ui/react'
import {
  Meeting_Set_Input,
  Meeting_Step_Type_Enum,
  MeetingFragment,
  MeetingTemplateFragment,
  useUpdateMeetingMutation,
} from '@gql'
import { yupResolver } from '@hookform/resolvers/yup'
import { VideoConf, VideoConfTypes } from '@rolebase/shared/model/meeting'
import {
  defaultParticipantsScope,
  ParticipantsScope,
} from '@rolebase/shared/model/participants'
import { nameSchema, stepsConfigSchema } from '@rolebase/shared/schemas'
import { getDateTimeLocal } from '@utils/dates'
import { nanoid } from 'nanoid'
import React, { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { ChevronDownIcon } from 'src/icons'
import * as yup from 'yup'
import MeetingStepsConfigController, {
  StepsValues,
} from '../components/MeetingStepsConfigController'
import MeetingTemplateMenu from '../components/MeetingTemplateMenu'
import VideoConfFormControl, {
  videoConfSchema,
  VideoConfValues,
} from '../components/VideoConfFormControl'
import useCreateMeeting from '../hooks/useCreateMeeting'

interface Props extends UseModalProps {
  meeting?: MeetingFragment // If provided, the meeting will be updated
  duplicate?: boolean // If true and meeting provided, the meeting will be duplicated
  defaultCircleId?: string
  defaultStartDate?: Date
  defaultDuration?: number
  defaultPrivate?: boolean
  onCreate?(meetingId: string): void
  onRecurring?(): void
}

interface Values extends StepsValues, VideoConfValues {
  title: string
  circleId: string
  startDate: string
  duration: number // In minutes
  private: boolean
  invitedReadonly: boolean
}

const resolver = yupResolver(
  yup
    .object()
    .shape({
      title: nameSchema.required(),
      circleId: yup.string().required(),
      startDate: yup.string().required(),
      duration: yup.number().required(),
      stepsConfig: stepsConfigSchema,
    })
    .concat(videoConfSchema)
)

export default function MeetingEditModal({
  meeting,
  duplicate,
  defaultCircleId,
  defaultStartDate,
  defaultDuration,
  defaultPrivate,
  onCreate,
  onRecurring,
  ...modalProps
}: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const { orgId, orgData } = useOrgContext()
  const currentMember = useCurrentMember()
  const navigate = useNavigate()
  const createMeeting = useCreateMeeting()
  const [updateMeeting] = useUpdateMeetingMutation()

  const defaultValues: Values = useMemo(
    () => ({
      title: meeting?.title ?? '',
      circleId: meeting?.circleId ?? (defaultCircleId || ''),
      startDate: getDateTimeLocal(
        duplicate || !meeting
          ? defaultStartDate || getRoundedDate()
          : new Date(meeting.startDate)
      ),
      duration: meeting
        ? Math.round(
            (new Date(meeting.endDate).getTime() -
              new Date(meeting.startDate).getTime()) /
              60000
          )
        : defaultDuration || 30,
      private: meeting ? meeting.private : defaultPrivate || false,
      invitedReadonly: meeting?.invitedReadonly ?? false,
      stepsConfig: meeting?.stepsConfig ?? [
        {
          id: nanoid(8),
          type: Meeting_Step_Type_Enum.Threads,
          title: 'Ordre du jour',
        },
      ],
      videoConfType: meeting?.videoConf?.type ?? null,
      videoConfUrl:
        meeting?.videoConf?.type === VideoConfTypes.Url
          ? meeting.videoConf.url
          : '',
    }),
    [defaultCircleId, defaultStartDate, meeting]
  )

  const formMethods = useForm<Values>({
    resolver,
    defaultValues,
  })
  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = formMethods

  // Watch selected circle
  const circleId = watch('circleId')
  const circle = orgData?.getCircle(circleId)

  // Watch privacy fields
  const isPrivate = watch('private')
  const invitedReadonly = watch('invitedReadonly')

  // Template change
  const handleTemplateSelect = (template: MeetingTemplateFragment) => {
    setValue('title', template.title)
    setValue('stepsConfig', template.stepsConfig)
  }

  // Submit
  const onSubmit = handleSubmit(
    async ({ startDate, duration, videoConfType, videoConfUrl, ...data }) => {
      if (!orgId || !currentMember || !circle) return
      const startDateDate = new Date(startDate)

      const videoConf: VideoConf | null =
        videoConfType === VideoConfTypes.Url
          ? {
              type: VideoConfTypes.Url,
              url: videoConfUrl,
            }
          : videoConfType
          ? {
              type: videoConfType,
            }
          : null

      const meetingUpdate: Meeting_Set_Input = {
        ...data,
        startDate: startDateDate.toISOString(),
        endDate: new Date(
          startDateDate.getTime() + duration * 60 * 1000
        ).toISOString(),
        videoConf,
      }

      if (meeting && !duplicate) {
        // Reset meeting when date is in the future
        if (startDateDate > new Date()) {
          meetingUpdate.ended = false
          meetingUpdate.currentStepId = null
        }

        // Update meeting
        await updateMeeting({
          variables: {
            id: meeting.id,
            values: meetingUpdate,
          },
        })

        toast({
          title: t('MeetingEditModal.toastUpdated'),
          status: 'success',
          duration: 4000,
          isClosable: true,
        })
      } else {
        // Create meeting
        const result = await createMeeting(
          {
            orgId,
            ...meetingUpdate,
            // Create attendees
            meeting_attendees: {
              data: invitedMembersIds.map((memberId) => ({ memberId })),
            },
          },
          meeting && duplicate ? meeting.id : undefined
        )
        if (!result) return

        if (onCreate) {
          onCreate(result.id)
        } else {
          navigate(result.path)
        }

        toast({
          title: t('MeetingEditModal.toastCreated'),
          status: 'success',
          duration: 4000,
          isClosable: true,
        })
      }

      modalProps.onClose()
    }
  )

  // Invited members
  const [participantsScope, setParticipantsScope] = useState<ParticipantsScope>(
    defaultParticipantsScope
  )
  const [invitedMembersIds, setInvitedMembersIds] = useState<string[]>(
    () => meeting?.meeting_attendees.map((a) => a.memberId) || []
  )
  const circleParticipants = useCircleParticipants(circle)
  const allParticipants = useExtraParticipants(
    circleParticipants,
    invitedMembersIds
  )
  const extraParticipants = useMemo(
    () => allParticipants.filter((p) => !circleParticipants.includes(p)),
    [allParticipants, circleParticipants]
  )
  const canEditParticipantsScope = (!meeting || duplicate) && !!circleId
  const isPrivateAllowed =
    !isPrivate ||
    circleParticipants.some((p) => p.member.id === currentMember?.id)

  // Update participants scope when circleId changes
  useEffect(() => {
    setParticipantsScope((scope) =>
      scope.circles.some((c) => c.id === circleId)
        ? scope
        : {
            ...scope,
            circles: [
              ...scope.circles,
              { id: circleId, children: false, excludeMembers: [] },
            ],
          }
    )
    return () => {
      setParticipantsScope((scope) => ({
        ...scope,
        circles: scope.circles.filter((c) => c.id !== circleId),
      }))
    }
  }, [circleId])

  return (
    <FormProvider {...formMethods}>
      <Modal size="xl" blockScrollOnMount={false} {...modalProps}>
        <ModalOverlay />
        <ModalContent>
          <form>
            <ModalHeader>
              {t(
                meeting && !duplicate
                  ? 'MeetingEditModal.headingEdit'
                  : 'MeetingEditModal.headingCreate'
              )}
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <VStack spacing={10} align="stretch">
                {duplicate && (
                  <Alert status="info">
                    <AlertIcon />
                    {t('MeetingEditModal.duplicateInfo')}
                  </Alert>
                )}

                <FormControl isInvalid={!!errors.title}>
                  <FormLabel>
                    <Flex>
                      {t('MeetingEditModal.title')}
                      <Spacer />
                      {!meeting && (
                        <MeetingTemplateMenu onSelect={handleTemplateSelect} />
                      )}
                    </Flex>
                  </FormLabel>
                  <InputGroup>
                    <InputLeftAddon pointerEvents="none">
                      {t('MeetingEditModal.titlePrefix')}
                    </InputLeftAddon>
                    <Input
                      {...register('title')}
                      placeholder={t('MeetingEditModal.titlePlaceholder')}
                      autoFocus
                    />
                  </InputGroup>
                </FormControl>

                <Box>
                  <Flex>
                    <FormControl isInvalid={!!errors.startDate} maxW="50%">
                      <FormLabel>{t('MeetingEditModal.start')}</FormLabel>
                      <Input
                        {...register('startDate')}
                        type="datetime-local"
                        w="250px"
                        maxW="100%"
                      />
                    </FormControl>

                    <FormControl isInvalid={!!errors.duration} ml={5}>
                      <FormLabel display="flex">
                        {t('MeetingEditModal.duration')}
                        <Spacer />
                        {onRecurring && (
                          <Button
                            variant="link"
                            size="sm"
                            rightIcon={<ChevronDownIcon size="1em" />}
                            onClick={onRecurring}
                          >
                            {t('MeetingEditModal.recurrence')}
                          </Button>
                        )}
                      </FormLabel>
                      <InputGroup>
                        <NumberInputController
                          name="duration"
                          control={control}
                          w="80px"
                          min={10}
                          max={600}
                          step={10}
                        />
                        <InputRightAddon>
                          {t('MeetingEditModal.durationSuffix')}
                        </InputRightAddon>
                      </InputGroup>
                    </FormControl>
                  </Flex>
                </Box>

                <CircleFormController />

                <Collapse in={canEditParticipantsScope}>
                  <FormControl>
                    <FormLabel>{t('MeetingEditModal.participants')}</FormLabel>
                    <ParticipantScopeInput
                      participantsScope={participantsScope}
                      onParticipantsScopeChange={setParticipantsScope}
                      onInvitedMembersChange={
                        canEditParticipantsScope
                          ? setInvitedMembersIds
                          : undefined
                      }
                    />
                  </FormControl>
                </Collapse>

                <FormControl>
                  <FormLabel>{t('MeetingEditModal.steps')}</FormLabel>
                  <MeetingStepsConfigController
                    control={control as any}
                    errors={errors}
                  />
                </FormControl>

                <VStack spacing={2} align="start">
                  <FormControl>
                    <SwitchController name="private" control={control}>
                      {t('MeetingEditModal.private')}
                      <ParticipantsNumber
                        participants={allParticipants}
                        opacity={isPrivate ? 1 : 0.4}
                        ml={2}
                      />
                    </SwitchController>
                    <Collapse in={isPrivate}>
                      <FormHelperText ml="40px" mb={2}>
                        {t('MeetingEditModal.privateHelp', {
                          role: orgData?.getRole(circle?.roleId)?.name,
                        })}
                      </FormHelperText>
                    </Collapse>
                  </FormControl>

                  <Collapse in={!isPrivate || extraParticipants.length !== 0}>
                    <FormControl>
                      <SwitchController
                        name="invitedReadonly"
                        control={control}
                      >
                        {t('MeetingEditModal.invitedReadonly')}
                        {isPrivate && (
                          <ParticipantsNumber
                            participants={extraParticipants}
                            opacity={invitedReadonly ? 1 : 0.4}
                            ml={2}
                          />
                        )}
                      </SwitchController>
                      <Collapse in={invitedReadonly}>
                        <FormHelperText ml="40px" mb={2}>
                          {t('MeetingEditModal.invitedReadonlyHelp', {
                            role: orgData?.getRole(circle?.roleId)?.name,
                          })}
                        </FormHelperText>
                      </Collapse>
                    </FormControl>
                  </Collapse>

                  <VideoConfFormControl mt={1} />
                </VStack>

                <Collapse in={!isPrivateAllowed}>
                  <Alert status="warning">
                    <AlertIcon />
                    <AlertDescription>
                      {t('MeetingEditModal.privateNotAllowed', {
                        role: orgData?.getRole(circle?.roleId)?.name,
                      })}
                    </AlertDescription>
                  </Alert>
                </Collapse>

                <Box textAlign="right" mt={2}>
                  <Button
                    colorScheme="blue"
                    isDisabled={!isPrivateAllowed}
                    onClick={onSubmit}
                  >
                    {t(meeting ? 'common.save' : 'common.create')}
                  </Button>
                </Box>
              </VStack>
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>
    </FormProvider>
  )
}

// Returns current date with hour rounded up to the quarter hour
function getRoundedDate(): Date {
  const date = new Date()
  const rounded = date.getHours() * 4 + Math.round(date.getMinutes() / 15)
  date.setHours(Math.floor(rounded / 4), (rounded % 4) * 15, 0, 0)
  return date
}
