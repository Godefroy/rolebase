import BrandModal from '@/common/atoms/BrandModal'
import ThemeSwitch from '@/common/atoms/ThemeSwitch'
import useQueryParams from '@/common/hooks/useQueryParams'
import { useMemberInvitationInfo } from '@/member/hooks/useMemberInvitationInfo'
import { Alert, AlertIcon, Box, Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { track } from 'src/analytics'
import LangSelect from '../components/LangSelect'
import LoginForm from '../components/LoginForm'
import OtpForm from '../components/OtpForm'
import SignupForm from '../components/SignupForm'

export type AuthStep = 'otp' | 'login' | 'signup'

type Params = {
  email: string
  mode?: AuthStep
  memberId?: string
  token?: string
}

export default function AuthPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const queryParams = useQueryParams<Params>()
  const [mode, setMode] = useState<AuthStep>(queryParams.mode || 'otp')

  const isInvitationPage = location.pathname.includes('/invitation')

  // Funnel step between landing on /login and creating an account: the modal
  // was actually rendered, in the mode the visitor is looking at.
  useEffect(() => {
    track('auth_viewed', { mode, invitation: isInvitationPage })
  }, [mode, isInvitationPage])

  // Get invitation info if this is an invitation page
  const { data: invitationData } = useMemberInvitationInfo({
    memberId: isInvitationPage ? queryParams.memberId : undefined,
    token: isInvitationPage ? queryParams.token : undefined,
  })

  // Use email from invitation data if available, otherwise use query param
  const defaultEmail = invitationData?.email || queryParams.email

  return (
    <>
      <Flex
        position="absolute"
        zIndex={2000}
        top={4}
        right={4}
        gap={2}
        align="center"
      >
        <LangSelect />
        <ThemeSwitch />
      </Flex>

      <BrandModal
        size="lg"
        backButton={false}
        isOpen
        trapFocus={false /* Allow password managers to work */}
        closeOnEsc={false}
        onClose={() => history.back()}
      >
        {isInvitationPage && (
          <Alert status="info" mb={10} borderRadius="md">
            <AlertIcon />
            {t('AuthPage.invitationInfo', { orgName: invitationData?.orgName })}
          </Alert>
        )}

        <Box mx={10}>
          {mode === 'otp' && (
            <OtpForm defaultEmail={defaultEmail} onStepChange={setMode} />
          )}
          {mode === 'login' && (
            <LoginForm defaultEmail={defaultEmail} onStepChange={setMode} />
          )}
          {mode === 'signup' && (
            <SignupForm defaultEmail={defaultEmail} onStepChange={setMode} />
          )}
        </Box>
      </BrandModal>
    </>
  )
}
