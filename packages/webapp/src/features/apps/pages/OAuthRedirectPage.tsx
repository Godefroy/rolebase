import Loading from '@/common/atoms/Loading'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react'
import { App_Type_Enum } from '@gql'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'
import { track } from 'src/analytics'
import { BackIcon } from 'src/icons'
import appsParams from '../appsParams'
import { consumeOAuthFlow } from '../oauthFlow'

interface Props {
  type: App_Type_Enum
}

export default function OAuthRedirectPage({ type }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const appParams = appsParams[type]

  // State
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<Error>()

  // Run once, even if the effect is replayed (the flow can be used only once)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const code = params.get('code')
    if (!code) {
      setError(new Error('No code in URL'))
      return
    }

    // Accept only a callback of a flow started in this browser
    const codeVerifier = consumeOAuthFlow(type, params.get('state'))
    if (!codeVerifier) {
      setError(new Error('Invalid OAuth state'))
      return
    }

    // Register app
    appParams
      .redirectFunction({ code, codeVerifier })
      .then(() => {
        track('app_connected', { type })
        setSuccess(true)
      })
      .catch((error) => setError(error))
  }, [])

  if (success) {
    return (
      <Alert status="success" maxW="400px" mx="auto" my={20}>
        <AlertIcon />
        <AlertDescription>
          {t(`OAuthRedirectPage.${type}.success`)}
        </AlertDescription>
      </Alert>
    )
  }

  if (error) {
    console.error(error)
    return (
      <VStack spacing={5} my={20}>
        <Text fontWeight="bold">{t('OAuthRedirectPage.error')}</Text>
        <Button
          leftIcon={<BackIcon />}
          variant="outline"
          onClick={() => navigate('/apps')}
        >
          {t('OAuthRedirectPage.back')}
        </Button>
      </VStack>
    )
  }

  return <Loading active center />
}
