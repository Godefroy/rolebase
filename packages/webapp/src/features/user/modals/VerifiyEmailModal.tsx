import BottomFixedModal from '@/common/atoms/BottomFixedModal'
import { useAuth } from '../hooks/useAuth'
import {
  Button,
  CloseButton,
  Flex,
  Heading,
  Spacer,
  Text,
  Wrap,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import { nhost } from 'src/nhost'

export default function VerifyEmailModal() {
  const { user } = useAuth()

  const [closed, setClosed] = useState(false)
  const { t } = useTranslation()

  const handleResendEmail = async () => {
    await nhost.auth.sendVerificationEmail({
      email: user?.email!,
    })
    track('auth_verification_resent')
    setClosed(true)
  }

  // Show modal only if the user email is not verified
  const showModal = user ? !user.emailVerified && !closed : false

  return (
    <BottomFixedModal isOpen={showModal} width={600}>
      <Flex justifyContent="space-between" alignItems="baseline">
        <Heading as="h2" fontSize="lg" mb={3}>
          {t('VerifyEmailModal.heading')}
        </Heading>
        <Spacer />
        <CloseButton onClick={() => setClosed(true)} />
      </Flex>

      <Text mb={3}>{t('VerifyEmailModal.text')}</Text>
      <Wrap>
        <Button variant="solid" onClick={handleResendEmail}>
          {t('VerifyEmailModal.resend')}
        </Button>
      </Wrap>
    </BottomFixedModal>
  )
}
