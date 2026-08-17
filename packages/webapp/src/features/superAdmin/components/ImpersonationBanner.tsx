import { Button, HStack, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { getImpersonation, stopImpersonation } from '../utils/impersonation'

export default function ImpersonationBanner() {
  const { t } = useTranslation()

  // Only changes on page reload, since starting and stopping impersonation
  // both reload the app
  const impersonation = getImpersonation()
  if (!impersonation) return null

  return (
    <HStack
      position="fixed"
      bottom={4}
      left="50%"
      transform="translateX(-50%)"
      zIndex={2000}
      spacing={4}
      py={2}
      px={4}
      bg="orange.500"
      color="white"
      borderRadius="md"
      boxShadow="lg"
    >
      <Text fontSize="sm">
        {t('SuperAdmin.impersonation.banner', {
          name: impersonation.userName,
        })}
      </Text>
      <Button size="xs" onClick={stopImpersonation}>
        {t('SuperAdmin.impersonation.stop')}
      </Button>
    </HStack>
  )
}
