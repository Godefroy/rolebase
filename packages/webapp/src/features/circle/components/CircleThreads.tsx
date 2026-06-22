import Loading from '@/common/atoms/Loading'
import TextErrors from '@/common/atoms/TextErrors'
import useOrgMember from '@/member/hooks/useOrgMember'
import ThreadsList from '@/thread/components/ThreadsList'
import useThreads from '@/thread/hooks/useThreads'
import ThreadEditModal from '@/thread/modals/ThreadEditModal'
import { Button, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { CreateIcon } from 'src/icons'
import useOrgAdmin from '@/member/hooks/useOrgAdmin'
import OnboardingVideo, {
  OnboardingVideoType,
} from '@/onboarding/components/OnboardingVideo'

interface Props {
  circleId: string
}

export default function CircleThreads({ circleId }: Props) {
  const { t } = useTranslation()
  const isMember = useOrgMember()
  const isAdmin = useOrgAdmin()

  // Subscribe to threads
  const { threads, loading, error } = useThreads({ circleId })

  // Thread create modal
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure()

  return (
    <>
      {isMember && (
        <Button
          size="sm"
          mb={4}
          colorScheme="blue"
          leftIcon={<CreateIcon size={20} />}
          onClick={onCreateOpen}
        >
          {t('CircleThreads.create')}
        </Button>
      )}

      {loading && <Loading active size="md" />}
      <TextErrors errors={[error]} />

      {threads && <ThreadsList threads={threads} showIcon showMember />}

      {isAdmin && threads?.length === 0 && (
        <OnboardingVideo type={OnboardingVideoType.ThreadsAndTasks} mt={10} />
      )}

      {isCreateOpen && (
        <ThreadEditModal
          defaults={{
            circleId,
          }}
          isOpen
          onClose={onCreateClose}
        />
      )}
    </>
  )
}
