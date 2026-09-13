import { Title } from '@/common/atoms/Title'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  PinInput,
  PinInputField,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { emailSchema } from '@rolebase/shared/schemas'
import { getTimeZone } from '@utils/dates'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { track } from 'src/analytics'
import { nhost } from 'src/nhost'
import { trpc } from 'src/trpc'
import * as yup from 'yup'
import { clearOtpSession, readOtpSession, writeOtpSession } from '../otpSession'
import { AuthStep } from '../pages/AuthPage'
import OtpResendLink from './OtpResendLink'

interface Props {
  defaultEmail?: string
  onStepChange?: (step: AuthStep) => void
}

interface EmailValues {
  email: string
}

const emailFormSchema = yup.object().shape({
  email: emailSchema.required(),
})

export default function OtpForm({ defaultEmail, onStepChange }: Props) {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const toast = useToast()

  // Resume the code step after a reload or in another tab, unless another
  // address is expected (invitation link)
  const [savedSession] = useState(() => {
    const session = readOtpSession()
    if (defaultEmail && session?.email !== defaultEmail) return undefined
    return session
  })

  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'email' | 'code'>(
    savedSession ? 'code' : 'email'
  )
  const [email, setEmail] = useState(savedSession?.email ?? '')
  const [sentAt, setSentAt] = useState(savedSession?.sentAt ?? 0)
  const [otp, setOtp] = useState('')

  const {
    handleSubmit: handleEmailSubmit,
    register,
    setValue,
    setError,
    formState: { errors },
  } = useForm<EmailValues>({
    resolver: yupResolver(emailFormSchema),
  })

  useEffect(() => {
    if (defaultEmail) {
      setValue('email', defaultEmail)
    }
  }, [defaultEmail])

  const sendCode = async (address: string) => {
    const { body, status } = await nhost.auth.signInOTPEmail({
      email: address,
      // Set locale and timezone at signup
      options: {
        locale: language.substring(0, 2),
        metadata: {
          timezone: getTimeZone(),
        },
        // Come back to the requested page (invitation) if the email link is
        // used instead of the code
        redirectTo: window.location.href,
      },
    })

    // Check for successful response (200 status returns "OK")
    if (status !== 200 || body !== 'OK') {
      throw new Error('Failed to send OTP code')
    }

    const now = Date.now()
    setEmail(address)
    setSentAt(now)
    setOtp('')
    setStep('code')
    writeOtpSession({ email: address, sentAt: now })
  }

  const handleEmailFormSubmit = async (values: EmailValues) => {
    const address = values.email.trim()
    try {
      setIsLoading(true)

      // Catch addresses whose domain cannot receive emails before the code is
      // lost in a bounce. The check never blocks sign-in: if it fails (backend
      // unreachable or not deployed yet), the code is sent anyway.
      // Only the domain leaves the browser for this check
      const valid = await trpc.user.checkEmailDomain
        .query({ domain: address.split('@')[1] ?? '' })
        .then((result) => result.valid)
        .catch(() => true)
      if (!valid) {
        track('auth_otp_domain_invalid')
        setError('email', { message: t('OtpForm.invalidDomain') })
        return
      }

      await sendCode(address)
      track('auth_otp_requested')
    } catch (error: any) {
      toast({
        title: error?.response?.data || error?.message || t('common.error'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setIsLoading(true)
      await sendCode(email)
      track('auth_otp_resent')
      toast({
        title: t('OtpForm.resent', { email }),
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: error?.response?.data || error?.message || t('common.error'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeEmail = () => {
    clearOtpSession()
    setValue('email', email)
    setOtp('')
    setStep('email')
  }

  const handleCodeComplete = async (code: string) => {
    try {
      setIsLoading(true)
      const { body, status } = await nhost.auth.verifySignInOTPEmail({
        email,
        otp: code,
      })

      // Check for successful response (200 status returns session)
      const user = body?.session?.user
      if (status !== 200 || !user) {
        throw new Error('Invalid verification code')
      }

      clearOtpSession()
      track('auth_otp_succeeded')

      // Session is automatically stored by Nhost SDK
      // User will be redirected by the auth state change
    } catch {
      track('auth_otp_failed')
      toast({
        title: t('OtpForm.invalidCode'),
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      setOtp('')
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'code') {
    return (
      <VStack spacing={5}>
        <Title>{t('OtpForm.heading')}</Title>

        <Heading as="h1" size="md" mb={3} textAlign="center">
          {t('OtpForm.codeHeading', { email })}
        </Heading>

        <Text
          fontSize="lg"
          textAlign="center"
          color="gray.600"
          _dark={{ color: 'gray.400' }}
        >
          {t('OtpForm.codeDescription')}
        </Text>

        <FormControl>
          <HStack justify="center">
            <PinInput
              otp
              size="lg"
              value={otp}
              onChange={setOtp}
              onComplete={handleCodeComplete}
              isDisabled={isLoading}
              autoFocus
            >
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
        </FormControl>

        <Text
          fontSize="sm"
          textAlign="center"
          color="gray.500"
          _dark={{ color: 'gray.400' }}
        >
          {t('OtpForm.notReceived')}
        </Text>

        <HStack spacing={5} justify="center" flexWrap="wrap">
          <OtpResendLink
            sentAt={sentAt}
            isDisabled={isLoading}
            onResend={handleResend}
          />
          <Link
            as="button"
            type="button"
            fontSize="sm"
            textDecoration="underline"
            onClick={handleChangeEmail}
          >
            {t('OtpForm.changeEmail')}
          </Link>
        </HStack>
      </VStack>
    )
  }

  return (
    <form onSubmit={handleEmailSubmit(handleEmailFormSubmit)}>
      <Title>{t('OtpForm.heading')}</Title>

      <Heading as="h1" size="md" mb={7} style={{ textWrap: 'balance' } as any}>
        {t('OtpForm.heading')}
        <Text
          fontWeight="semibold"
          color="gray.400"
          _dark={{ color: 'gray.400' }}
        >
          {t('OtpForm.subheading')}
        </Text>
      </Heading>

      <VStack spacing={5}>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel>{t('OtpForm.email')}</FormLabel>
          <Input
            {...register('email')}
            type="email"
            required
            autoComplete="email"
            autoFocus
            placeholder={t('OtpForm.emailPlaceholder')}
          />
          {errors.email?.message && (
            <FormErrorMessage>{errors.email.message}</FormErrorMessage>
          )}
        </FormControl>

        <Button colorScheme="blue" type="submit" isLoading={isLoading}>
          {t('OtpForm.submit')}
        </Button>

        <Text
          fontSize="sm"
          color="gray.500"
          textAlign="center"
          sx={{ a: { textDecoration: 'underline' } }}
          dangerouslySetInnerHTML={{
            __html: t('OtpForm.terms', {
              termsAndPrivacy: t('common.termsAndPrivacy'),
            }),
          }}
        />

        {onStepChange && (
          <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
            <Link
              onClick={() => onStepChange('login')}
              textDecoration="underline"
              cursor="pointer"
            >
              {t('AuthPage.loginWithPassword')}
            </Link>
          </Text>
        )}
      </VStack>
    </form>
  )
}
