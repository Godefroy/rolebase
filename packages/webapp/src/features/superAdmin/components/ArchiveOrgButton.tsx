import useConfirmModal from '@/common/hooks/useConfirmModal'
import { useApolloClient } from '@apollo/client'
import { Button, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiArchive, FiRotateCcw } from 'react-icons/fi'
import { trpc } from 'src/trpc'

interface Props {
  orgId: string
  orgName: string
  isArchived: boolean
}

export default function ArchiveOrgButton({
  orgId,
  orgName,
  isArchived,
}: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const apolloClient = useApolloClient()
  const { confirm, confirmElement } = useConfirmModal()
  const [isLoading, setIsLoading] = useState(false)

  const setArchived = async (archived: boolean) => {
    setIsLoading(true)
    try {
      if (archived) {
        await trpc.org.archiveOrg.mutate({ orgId })
      } else {
        await trpc.superAdmin.restoreOrg.mutate({ orgId })
      }
      await apolloClient.refetchQueries({
        include: ['AdminOrgs', 'AdminOrg', 'AdminUser'],
      })
    } catch (error: any) {
      toast({
        title: error?.message || t('common.error'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
    setIsLoading(false)
  }

  const handleClick = () => {
    if (isArchived) {
      setArchived(false)
      return
    }
    confirm({
      heading: t('SuperAdmin.orgs.archiveConfirm.heading', { name: orgName }),
      info: t('SuperAdmin.orgs.archiveConfirm.info'),
      buttonLabel: t('common.archive'),
      buttonColor: 'orange',
      onConfirm: () => setArchived(true),
    })
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        colorScheme={isArchived ? 'gray' : 'orange'}
        leftIcon={isArchived ? <FiRotateCcw /> : <FiArchive />}
        isLoading={isLoading}
        onClick={handleClick}
      >
        {isArchived ? t('common.unarchive') : t('common.archive')}
      </Button>
      {confirmElement}
    </>
  )
}
