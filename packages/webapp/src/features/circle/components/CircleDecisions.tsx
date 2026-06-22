import Loading from '@/common/atoms/Loading'
import TextErrors from '@/common/atoms/TextErrors'
import DecisionEditModal from '@/decision/modals/DecisionEditModal'
import DecisionModal from '@/decision/modals/DecisionModal'
import useOrgMember from '@/member/hooks/useOrgMember'
import { Button, Text, useDisclosure } from '@chakra-ui/react'
import { useCircleDecisionsSubscription } from '@gql'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CreateIcon } from 'src/icons'
import DecisionItem from '../../decision/components/DecisionItem'

interface Props {
  circleId: string
}

export default function CircleDecisions({ circleId }: Props) {
  const { t } = useTranslation()
  const isMember = useOrgMember()

  // Subscribe to decisions
  const { data, error, loading } = useCircleDecisionsSubscription({
    variables: { circleId, active: true },
  })
  const decisions = data?.decision

  // Modals
  const [createdId, setCreatedId] = useState<string | undefined>()
  const showModal = useDisclosure()
  const editModal = useDisclosure()

  const handleOpen = (id: string) => {
    setCreatedId(id)
    showModal.onOpen()
  }

  return (
    <>
      {isMember && (
        <Button
          size="sm"
          mb={4}
          colorScheme="blue"
          leftIcon={<CreateIcon size={20} />}
          onClick={editModal.onOpen}
        >
          {t('CircleDecisions.create')}
        </Button>
      )}

      {loading && <Loading active size="md" />}
      <TextErrors errors={[error]} />

      {decisions?.length === 0 && (
        <Text fontStyle="italic">{t('CircleDecisions.empty')}</Text>
      )}

      {decisions?.map((decision) => (
        <DecisionItem key={decision.id} decision={decision} />
      ))}

      {editModal.isOpen && (
        <DecisionEditModal
          defaults={{
            circleId,
          }}
          isOpen
          onClose={editModal.onClose}
          onCreate={handleOpen}
        />
      )}

      {showModal.isOpen && createdId && (
        <DecisionModal id={createdId} isOpen onClose={showModal.onClose} />
      )}
    </>
  )
}
