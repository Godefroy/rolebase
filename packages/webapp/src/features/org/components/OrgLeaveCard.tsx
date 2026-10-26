import useConfirmModal from '@/common/hooks/useConfirmModal'
import DeletionCard from '@/deletion/components/DeletionCard'
import { useAuth } from '@/user/hooks/useAuth'
import { useToast } from '@chakra-ui/react'
import { Member_Role_Enum } from '@gql'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiLogOut } from 'react-icons/fi'
import { trpc } from 'src/trpc'
import { useOrgContext } from '../contexts/OrgContext'
import useExitOrg from '../hooks/useExitOrg'

// Lets the current user leave the org, unless they are its last owner
export default function OrgLeaveCard() {
  const { t } = useTranslation()
  const toast = useToast()
  const { user } = useAuth()
  const { orgId, org, orgData } = useOrgContext()
  const exitOrg = useExitOrg()
  const { confirm, confirmElement } = useConfirmModal()
  const [isLeaving, setIsLeaving] = useState(false)

  const members = orgData?.members
  const currentMember = members?.find((member) => member.userId === user?.id)
  const isLastOwner =
    currentMember?.role === Member_Role_Enum.Owner &&
    members?.filter((member) => member.role === Member_Role_Enum.Owner)
      .length === 1

  if (!orgId || !org || !currentMember) return null

  const leave = async () => {
    setIsLeaving(true)
    try {
      await trpc.member.leaveOrg.mutate({ orgId })
      toast({
        title: t('OrgLeaveCard.done', { name: org.name }),
        status: 'success',
        duration: 4000,
      })
      exitOrg(orgId)
    } catch (error: any) {
      toast({
        title: error?.message || t('common.error'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      setIsLeaving(false)
    }
  }

  const handleClick = () =>
    confirm({
      heading: t('OrgLeaveCard.confirm.heading', { name: org.name }),
      info: t('OrgLeaveCard.confirm.info'),
      buttonLabel: t('OrgLeaveCard.button'),
      onConfirm: leave,
    })

  return (
    <>
      <DeletionCard
        title={t('OrgLeaveCard.title')}
        description={
          isLastOwner
            ? t('OrgLeaveCard.lastOwner')
            : t('OrgLeaveCard.description')
        }
        buttonLabel={t('OrgLeaveCard.button')}
        buttonIcon={FiLogOut}
        isDisabled={isLastOwner || isLeaving}
        onClick={handleClick}
      />
      {confirmElement}
    </>
  )
}
