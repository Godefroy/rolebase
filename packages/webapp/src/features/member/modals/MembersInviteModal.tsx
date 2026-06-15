import { CircleMemberContext } from '@/circle/contexts/CircleMemberContext'
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UseModalProps,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { Member_Role_Enum } from '@gql'
import { nanoid } from 'nanoid'
import React, { useContext, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'
import { AddIcon, EmailIcon } from 'src/icons'
import { trpc } from 'src/trpc'
import MemberButton from '../components/MemberButton'
import useCreateMember from '../hooks/useCreateMember'
import useSubscriptionData from '@/orgSubscription/hooks/useSubscriptionData'
import SubscriptionLimitsAlert from '@/orgSubscription/components/SubscriptionLimitsAlert'
import { useOrgContext } from '@/org/contexts/OrgContext'

interface MemberFormData {
  id: string
  name: string
  email: string
  create?: boolean
}

interface FormValues {
  members: MemberFormData[]
}

export default function MembersInviteModal(modalProps: UseModalProps) {
  const { t } = useTranslation()
  const toast = useToast()
  const members = useOrgContext().orgData?.members
  const circleMemberContext = useContext(CircleMemberContext)
  const createMember = useCreateMember()
  const { availableSeats, subscriptionSeats } = useSubscriptionData()

  const { control, register, handleSubmit, formState, watch } =
    useForm<FormValues>({
      defaultValues: {
        members: [],
      },
    })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
    keyName: 'key', // Preserve the original 'id' field
  })

  const watchedMembers = watch('members')

  // Initialize form with existing non-invited members
  useEffect(() => {
    if (fields.length > 0) return
    const notInvitedMembers = members?.filter((m) => !m.userId && !m.inviteDate)
    if (!notInvitedMembers?.length) {
      handleAddMember()
    } else {
      notInvitedMembers.forEach((member) => {
        append({
          id: member.id,
          name: member.name,
          email: '',
          create: false,
        })
      })
    }
  }, [members])

  const handleMemberClick = (memberId: string) => {
    circleMemberContext?.goTo(undefined, memberId)
  }

  const handleAddMember = () => {
    append({
      id: nanoid(),
      name: '',
      email: '',
      create: true,
    })
  }

  const onSubmit = async (data: FormValues) => {
    try {
      let invitedCount = 0
      for (let i = data.members.length - 1; i >= 0; i--) {
        const member = data.members[i]
        if (!member.email.trim()) continue

        let memberId = member.id

        // Create member if needed
        if (member.create && member.name.trim()) {
          memberId = await createMember(member.name.trim())
        }

        // Invite member
        await trpc.member.inviteMember.mutate({
          memberId,
          role: Member_Role_Enum.Member,
          email: member.email.trim(),
        })
        invitedCount++

        // Remove the invited member from the form
        remove(i)
      }
      toast({
        title: t('MembersInviteModal.toastSuccess', {
          count: invitedCount,
        }),
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : '',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }

  const emailCount = watchedMembers?.filter((m) => m?.email?.trim()).length || 0
  const hasEnoughSeats = availableSeats >= (emailCount || 1)

  return (
    <>
      <Modal {...modalProps} size="xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>{t('MembersInviteModal.heading')}</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <VStack spacing={2} align="stretch" mb={5}>
                {fields.map((field, index) => (
                  <Flex key={field.key} gap={2} alignItems="center">
                    <Flex flex={1}>
                      {field.create ? (
                        <>
                          <IconButton
                            aria-label={t('common.delete')}
                            icon={<FiX />}
                            onClick={() => remove(index)}
                            variant="ghost"
                          />
                          <Input
                            placeholder={t('common.name')}
                            {...register(`members.${index}.name`)}
                          />
                        </>
                      ) : (
                        <MemberButton
                          member={{ name: field.name, picture: '' }}
                          variant="ghost"
                          flex={1}
                          justifyContent="start"
                          onClick={() => handleMemberClick(field.id)}
                        />
                      )}
                    </Flex>
                    <Box flex={1}>
                      <Input
                        type="email"
                        placeholder={t('MembersInviteModal.emailPlaceholder')}
                        {...register(`members.${index}.email`)}
                      />
                    </Box>
                  </Flex>
                ))}
              </VStack>

              <Flex justify="space-between" align="center">
                <Button
                  leftIcon={<AddIcon size={20} />}
                  size="sm"
                  variant="outline"
                  onClick={handleAddMember}
                >
                  Ajouter un membre
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={formState.isSubmitting}
                  isDisabled={emailCount === 0 || !hasEnoughSeats}
                  leftIcon={<EmailIcon size={20} />}
                >
                  {t('MembersInviteModal.invite', {
                    count: emailCount,
                  })}
                </Button>
              </Flex>

              {!hasEnoughSeats && (
                <SubscriptionLimitsAlert
                  subscriptionSeats={subscriptionSeats}
                  my={4}
                />
              )}
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
