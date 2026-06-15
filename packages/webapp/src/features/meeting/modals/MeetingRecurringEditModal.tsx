import CircleFormController from '@/circle/components/CircleFormController'
import NumberInputController from '@/common/atoms/NumberInputController'
import SwitchController from '@/common/atoms/SwitchController'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import ParticipantScopeInput from '@/participants/components/ParticipantScopeInput'
import ParticipantsNumber from '@/participants/components/ParticipantsNumber'
import useCircleParticipants from '@/participants/hooks/useCircleParticipants'
import useExtraParticipants from '@/participants/hooks/useExtraParticipants'
import RRuleEditorController from '@/rrule/components/RRuleEditorController'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  UseModalProps,
  useToast,
  VStack,
} from '@chakra-ui/react'
import {
  MeetingRecurringFragment,
  useCreateMeetingRecurringMutation,
  useUpdateMeetingRecurringMutation,
} from '@gql'
import { yupResolver } from '@hookform/resolvers/yup'
import { VideoConf, VideoConfTypes } from '@rolebase/shared/model/meeting'
import {
  defaultParticipantsScope,
  ParticipantsScope,
} from '@rolebase/shared/model/participants'
import React, { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import MeetingTemplateIdFormControl from '../components/MeetingTemplateIdFormControl'
import VideoConfFormControl, {
  videoConfSchema,
  VideoConfValues,
} from '../components/VideoConfFormControl'
import MeetingRecurringDeleteModal from './MeetingRecurringDeleteModal'

interface Props extends UseModalProps {
  meetingRecurring?: MeetingRecurringFragment // If provided, the recurring meeting will be updated
  defaultCircleId?: string
  onCreate?(meetingRecurringId: string): void
}

interface Values extends VideoConfValues {
  circleId: string
  templateId: string
  rrule: string | undefined
  duration: number // In minutes
  private: boolean
  invitedReadonly: boolean
}

const resolver = yupResolver(
  yup
    .object()
    .shape({
      circleId: yup.string().required(),
      templateId: yup.string().required(),
      rrule: yup.string().required(),
      duration: yup.number().required(),
    })
    .concat(videoConfSchema)
)

export default function MeetingRecurringEditModal({
  meetingRecurring,
  defaultCircleId,
  onCreate,
  ...modalProps
}: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const { orgId, orgData } = useOrgContext()
  const currentMember = useCurrentMember()
  const [createMeetingRecurring] = useCreateMeetingRecurringMutation()
  const [updateMeetingRecurring] = useUpdateMeetingRecurringMutation()

  const [participantsScope, setParticipantsScope] = useState<ParticipantsScope>(
    meetingRecurring?.scope || defaultParticipantsScope
  )
  const defaultValues: Values = useMemo(
    () => ({
      circleId: meetingRecurring?.circleId ?? (defaultCircleId || ''),
      scope: meetingRecurring?.scope ?? defaultParticipantsScope,
      templateId: meetingRecurring?.templateId ?? '',
      rrule: meetingRecurring?.rrule,
      duration: meetingRecurring?.duration ?? 30,
      private: meetingRecurring?.private ?? false,
      invitedReadonly: meetingRecurring?.invitedReadonly ?? false,
      videoConfType: meetingRecurring?.videoConf?.type ?? null,
      videoConfUrl:
        meetingRecurring?.videoConf?.type === VideoConfTypes.Url
          ? meetingRecurring.videoConf.url
          : 'https://',
    }),
    [defaultCircleId, meetingRecurring]
  )

  const formMethods = useForm<Values>({
    resolver,
    defaultValues,
  })
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = formMethods

  const circleId = watch('circleId')
  const circle = orgData?.getCircle(circleId)

  // Watch privacy fields
  const isPrivate = watch('private')
  const invitedReadonly = watch('invitedReadonly')

  // Invited members
  const [invitedMembersIds, setInvitedMembersIds] = useState<string[]>([])
  const circleParticipants = useCircleParticipants(circle)
  const allParticipants = useExtraParticipants(
    circleParticipants,
    invitedMembersIds
  )
  const extraParticipants = useMemo(
    () => allParticipants.filter((p) => !circleParticipants.includes(p)),
    [allParticipants, circleParticipants]
  )
  const isPrivateAllowed =
    !isPrivate ||
    circleParticipants.some((p) => p.member.id === currentMember?.id)

  // Submit
  const onSubmit = handleSubmit(
    async ({ videoConfType, videoConfUrl, ...data }) => {
      if (!orgId || !currentMember) return

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

      const meetingUpdate = {
        ...data,
        scope: participantsScope,
        videoConf,
      }

      if (meetingRecurring) {
        // Update recurring meeting
        await updateMeetingRecurring({
          variables: {
            id: meetingRecurring.id,
            values: meetingUpdate,
          },
        })

        toast({
          title: t('MeetingRecurringEditModal.toastUpdated'),
          status: 'success',
          duration: 4000,
          isClosable: true,
        })
      } else {
        // Create recurring meeting
        const { data, errors } = await createMeetingRecurring({
          variables: {
            values: {
              orgId,
              ...meetingUpdate,
            },
          },
        })
        const newRecurringMeeting = data?.insert_meeting_recurring_one
        if (!newRecurringMeeting) return console.error(errors)

        onCreate?.(newRecurringMeeting.id)

        toast({
          title: t('MeetingRecurringEditModal.toastCreated'),
          status: 'success',
          duration: 4000,
          isClosable: true,
        })
      }

      modalProps.onClose()
    }
  )

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

  // Delete modal
  const deleteModal = useDisclosure()

  return (
    <FormProvider {...formMethods}>
      <Modal size="xl" blockScrollOnMount={false} {...modalProps}>
        <ModalOverlay />
        <ModalContent>
          <form>
            <ModalHeader>
              {t(
                meetingRecurring
                  ? 'MeetingRecurringEditModal.headingEdit'
                  : 'MeetingRecurringEditModal.headingCreate'
              )}
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <VStack spacing={10} align="stretch">
                <MeetingTemplateIdFormControl />

                <FormControl isInvalid={!!errors.rrule}>
                  <FormLabel>
                    {t('MeetingRecurringEditModal.recurrence')}
                  </FormLabel>
                  <Box p={3} borderWidth="1px" borderRadius="md">
                    <RRuleEditorController name="rrule" control={control} />
                  </Box>
                </FormControl>

                <FormControl isInvalid={!!errors.duration}>
                  <FormLabel>{t('MeetingEditModal.duration')}</FormLabel>
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

                <CircleFormController />

                <Collapse in={!!circleId}>
                  <FormControl>
                    <FormLabel>{t('MeetingEditModal.participants')}</FormLabel>
                    <ParticipantScopeInput
                      participantsScope={participantsScope}
                      onParticipantsScopeChange={setParticipantsScope}
                      onInvitedMembersChange={setInvitedMembersIds}
                    />
                  </FormControl>
                </Collapse>

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

                  <VideoConfFormControl />
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
              </VStack>
            </ModalBody>

            <ModalFooter>
              {meetingRecurring && (
                <Button
                  colorScheme="red"
                  variant="ghost"
                  mr={2}
                  onClick={deleteModal.onOpen}
                >
                  {t('common.delete')}
                </Button>
              )}
              <Button
                colorScheme="blue"
                isDisabled={!isPrivateAllowed}
                onClick={onSubmit}
              >
                {t(meetingRecurring ? 'common.save' : 'common.create')}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {deleteModal.isOpen && meetingRecurring && (
        <MeetingRecurringDeleteModal
          meetingRecurring={meetingRecurring}
          isOpen
          onDelete={modalProps.onClose}
          onClose={deleteModal.onClose}
        />
      )}
    </FormProvider>
  )
}
