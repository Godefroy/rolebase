import MembersInviteModal from '@/member/modals/MembersInviteModal'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import OnboardingTodoItem from './OnboardingTodoItem'

interface Props {
  done: boolean
}

// Todo line opening the invite modal, pre-filled with the members who have no
// account yet. Counting them shows the team already built in the org chart is
// still out of the app.
export default function OnboardingTodoInviteItem({ done }: Props) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()
  const inviteModal = useDisclosure()

  const withoutAccess =
    orgData?.members.filter((m) => !m.userId && !m.inviteEmail).length ?? 0

  return (
    <>
      <OnboardingTodoItem
        done={done}
        label={
          !done && withoutAccess > 0
            ? t('OnboardingTodo.items.inviteMembers', { count: withoutAccess })
            : t('OnboardingTodo.items.invite')
        }
        onClick={inviteModal.onOpen}
      />
      {inviteModal.isOpen && (
        <MembersInviteModal isOpen onClose={inviteModal.onClose} />
      )}
    </>
  )
}
