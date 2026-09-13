import MembersInviteModal from '@/member/modals/MembersInviteModal'
import { useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import OnboardingTodoItem from './OnboardingTodoItem'

interface Props {
  done: boolean
}

// Todo line opening the invite modal, pre-filled with the members who have no
// account yet
export default function OnboardingTodoInviteItem({ done }: Props) {
  const { t } = useTranslation()
  const inviteModal = useDisclosure()

  return (
    <>
      <OnboardingTodoItem
        done={done}
        label={t('OnboardingTodo.items.invite')}
        onClick={inviteModal.onOpen}
      />
      {inviteModal.isOpen && (
        <MembersInviteModal isOpen onClose={inviteModal.onClose} />
      )}
    </>
  )
}
