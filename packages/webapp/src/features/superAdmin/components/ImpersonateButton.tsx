import { Button, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { startImpersonation } from '../utils/impersonation'

interface Props {
  userId: string
  userName: string
}

export default function ImpersonateButton({ userId, userName }: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    try {
      setIsLoading(true)
      // Reloads the page on success
      await startImpersonation(userId, userName)
    } catch (error: any) {
      toast({
        title: error?.message || t('common.error'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      setIsLoading(false)
    }
  }

  return (
    <Button size="xs" isLoading={isLoading} onClick={handleClick}>
      {t('SuperAdmin.users.impersonate')}
    </Button>
  )
}
