import DeletionCard from '@/deletion/components/DeletionCard'
import OrgDeletionModal from '@/deletion/modals/OrgDeletionModal'
import { useDisclosure, useToast } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import useExitOrg from '../hooks/useExitOrg'
import useOrg from '../hooks/useOrg'

interface Props {
  orgId: string
}

export default function OrgDeletionCard({ orgId }: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const org = useOrg(orgId)
  const exitOrg = useExitOrg()
  const modal = useDisclosure()

  const handleDeleted = () => {
    // Orgs deleted minutes after their setup say something about onboarding
    if (org) {
      const ageMinutes = Math.round(
        (Date.now() - new Date(org.createdAt).getTime()) / 60000
      )
      track('org_archived', { ageMinutes })
    }
    toast({
      title: t('OrgDeletionCard.done'),
      status: 'success',
      duration: 4000,
    })
    exitOrg(orgId)
  }

  return (
    <>
      <DeletionCard
        title={t('OrgDeletionCard.title')}
        description={t('OrgDeletionCard.description')}
        buttonLabel={t('common.delete')}
        onClick={modal.onOpen}
      />
      {modal.isOpen && (
        <OrgDeletionModal
          orgId={orgId}
          isOpen
          onClose={modal.onClose}
          onDeleted={handleDeleted}
        />
      )}
    </>
  )
}
