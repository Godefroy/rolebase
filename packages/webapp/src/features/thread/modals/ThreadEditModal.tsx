import CircleFormController from '@/circle/components/CircleFormController'
import SwitchController from '@/common/atoms/SwitchController'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useNavigateOrg } from '@/org/hooks/useNavigateOrg'
import ParticipantsCircleExtraMembers from '@/participants/components/ParticipantsCircleExtraMembers'
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
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UseModalProps,
  VStack,
} from '@chakra-ui/react'
import {
  ThreadFragment,
  Thread_Status_Enum,
  useCreateThreadExtraMemberMutation,
  useCreateThreadMutation,
  useDeleteThreadExtraMemberMutation,
  useUpdateThreadMutation,
} from '@gql'
import { yupResolver } from '@hookform/resolvers/yup'
import { nameSchema } from '@rolebase/shared/schemas'
import React, { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { ThreadStatusMenu } from '../components/ThreadStatusMenu'

interface Props extends UseModalProps {
  defaults?: Partial<ThreadFragment>
  thread?: ThreadFragment
  onCreate?(threadId: string): void
}

interface Values {
  title: string
  circleId: string
  status: Thread_Status_Enum
  private: boolean
}

const resolver = yupResolver(
  yup.object().shape({
    title: nameSchema.required(),
    circleId: yup.string().required(),
  })
)

export default function ThreadEditModal({
  defaults,
  thread,
  onCreate,
  ...modalProps
}: Props) {
  const { t } = useTranslation()
  const navigateOrg = useNavigateOrg()
  const { orgId, orgData } = useOrgContext()
  const currentMember = useCurrentMember()
  const [updateThread] = useUpdateThreadMutation()
  const [createThread] = useCreateThreadMutation()
  const [createThreadExtraMember] = useCreateThreadExtraMemberMutation()
  const [deleteThreadExtraMember] = useDeleteThreadExtraMemberMutation()

  const formMethods = useForm<Values>({
    resolver,
    defaultValues: thread
      ? {
          title: thread.title,
          circleId: thread.circleId,
          status: thread.status,
          private: thread.private,
        }
      : {
          title: '',
          circleId: defaults?.circleId || '',
          status: Thread_Status_Enum.Active,
          private: defaults?.private || false,
        },
  })

  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = formMethods

  // Watch selected circle
  const circleId = watch('circleId')
  const circle = orgData?.getCircle(circleId)

  // Extra members ids
  const [extraMembersIds, setExtraMembersIds] = useState<string[]>(
    () => thread?.extra_members.map((em) => em.memberId) || []
  )

  // Participants
  const circleParticipants = useCircleParticipants(circle)
  const allParticipants = useExtraParticipants(
    circleParticipants,
    extraMembersIds
  )

  // Privacy
  const isPrivate = watch('private')
  const isPrivateAllowed =
    !isPrivate || allParticipants.some((p) => p.member.id === currentMember?.id)

  const onSubmit = handleSubmit(async (values) => {
    if (!orgId || !currentMember) return
    if (thread) {
      // Update thread
      await updateThread({
        variables: { id: thread.id, values: values },
      })

      // Update extra members
      for (const memberId of extraMembersIds) {
        if (thread.extra_members.some((m) => m.memberId === memberId)) continue
        // Create extra member if added
        await createThreadExtraMember({
          variables: {
            values: { threadId: thread.id, memberId },
          },
        })
      }
      for (const member of thread.extra_members) {
        if (extraMembersIds.includes(member.memberId)) continue
        // Delete extra member if removed
        await deleteThreadExtraMember({
          variables: { id: member.id },
        })
      }
    } else {
      // Create thread
      const { data } = await createThread({
        variables: {
          values: {
            orgId,
            initiatorMemberId: currentMember.id,
            ...values,
            // Add extra members
            extra_members: {
              data: extraMembersIds.map((id) => ({
                memberId: id,
              })),
            },
          },
        },
      })
      const createdThreadId = data?.insert_thread_one?.id
      if (!createdThreadId) return

      if (onCreate) {
        onCreate(createdThreadId)
      } else {
        // Go to thread page
        navigateOrg(`threads/${createdThreadId}`)
      }
    }
    modalProps.onClose()
  })

  return (
    <FormProvider {...formMethods}>
      <Modal size="xl" {...modalProps}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={onSubmit}>
            <ModalHeader>
              {t(
                thread
                  ? 'ThreadEditModal.headingEdit'
                  : 'ThreadEditModal.headingCreate'
              )}
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <VStack spacing={10} align="stretch">
                <FormControl isInvalid={!!errors.title}>
                  <FormLabel>{t('ThreadEditModal.title')}</FormLabel>
                  <Input
                    {...register('title')}
                    placeholder={t('ThreadEditModal.titlePlaceholder')}
                    autoFocus
                  />
                </FormControl>

                <CircleFormController />

                <Collapse in={!!circleId}>
                  <ParticipantsCircleExtraMembers
                    circleId={circleId}
                    membersIds={extraMembersIds}
                    onMembersIdsChange={setExtraMembersIds}
                  />
                </Collapse>

                {!thread && (
                  <FormControl>
                    <FormLabel>{t('ThreadEditModal.status')}</FormLabel>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <ThreadStatusMenu
                          size="md"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </FormControl>
                )}

                <FormControl>
                  <SwitchController name="private" control={control}>
                    {t('ThreadEditModal.private')}
                    <ParticipantsNumber
                      participants={allParticipants}
                      opacity={isPrivate ? 1 : 0.4}
                      ml={2}
                    />
                  </SwitchController>
                  <Collapse in={isPrivate}>
                    <FormHelperText ml="40px" mb={2}>
                      {t('ThreadEditModal.privateHelp', {
                        role: orgData?.getRole(circle?.roleId)?.name,
                      })}
                    </FormHelperText>
                  </Collapse>
                </FormControl>

                <Collapse in={!isPrivateAllowed}>
                  <Alert status="warning">
                    <AlertIcon />
                    <AlertDescription>
                      {t('ThreadEditModal.privateNotAllowed', {
                        role: orgData?.getRole(circle?.roleId)?.name,
                      })}
                    </AlertDescription>
                  </Alert>
                </Collapse>

                <Box textAlign="right" mt={2}>
                  <Button
                    colorScheme="blue"
                    type="submit"
                    isDisabled={!isPrivateAllowed}
                  >
                    {t(thread ? 'common.save' : 'common.create')}
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
