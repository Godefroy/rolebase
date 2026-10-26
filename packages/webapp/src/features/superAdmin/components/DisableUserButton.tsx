import useConfirmModal from '@/common/hooks/useConfirmModal'
import { useApolloClient } from '@apollo/client'
import { Button, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiUserCheck, FiUserX } from 'react-icons/fi'
import { trpc } from 'src/trpc'

interface Props {
  userId: string
  userName: string
  isDisabled: boolean
}

export default function DisableUserButton({
  userId,
  userName,
  isDisabled,
}: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const apolloClient = useApolloClient()
  const { confirm, confirmElement } = useConfirmModal()
  const [isLoading, setIsLoading] = useState(false)

  const setDisabled = async (disabled: boolean) => {
    setIsLoading(true)
    try {
      await trpc.superAdmin.setUserDisabled.mutate({ userId, disabled })
      await apolloClient.refetchQueries({
        include: ['AdminUsers', 'AdminUser'],
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
    if (isDisabled) {
      setDisabled(false)
      return
    }
    confirm({
      heading: t('SuperAdmin.users.disableConfirm.heading', { name: userName }),
      info: t('SuperAdmin.users.disableConfirm.info'),
      buttonLabel: t('SuperAdmin.users.disable'),
      buttonColor: 'orange',
      onConfirm: () => setDisabled(true),
    })
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        colorScheme={isDisabled ? 'gray' : 'orange'}
        leftIcon={isDisabled ? <FiUserCheck /> : <FiUserX />}
        isLoading={isLoading}
        onClick={handleClick}
      >
        {isDisabled
          ? t('SuperAdmin.users.enable')
          : t('SuperAdmin.users.disable')}
      </Button>
      {confirmElement}
    </>
  )
}
