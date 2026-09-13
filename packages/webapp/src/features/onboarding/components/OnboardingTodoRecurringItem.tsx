import MeetingRecurringEditModal from '@/meeting/modals/MeetingRecurringEditModal'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import OnboardingTodoItem from './OnboardingTodoItem'

interface Props {
  done: boolean
}

// Todo line opening the recurring meeting form on the root role, where the
// meeting templates created during the setup are ready to pick
export default function OnboardingTodoRecurringItem({ done }: Props) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()
  const recurringModal = useDisclosure()
  const rootCircleId = orgData?.circles.find((c) => !c.parentId)?.id

  return (
    <>
      <OnboardingTodoItem
        done={done}
        label={t('OnboardingTodo.items.recurringMeeting')}
        onClick={recurringModal.onOpen}
      />
      {recurringModal.isOpen && (
        <MeetingRecurringEditModal
          isOpen
          defaultCircleId={rootCircleId}
          onClose={recurringModal.onClose}
        />
      )}
    </>
  )
}
