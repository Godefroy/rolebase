import { Title } from '@/common/atoms/Title'
import {
  Button,
  FormControl,
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
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { nhost } from 'src/nhost'
import * as yup from 'yup'
import { AuthStep } from '../pages/AuthPage'
import { getTimeZone } from '@utils/dates'

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

  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')

  const {
    handleSubmit: handleEmailSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<EmailValues>({
    resolver: yupResolver(emailFormSchema),
  })

  useEffect(() => {
    if (defaultEmail) {
      setValue('email', defaultEmail)
    }
  }, [defaultEmail])

  const onEmailSubmit = async (values: EmailValues) => {
    try {
      setIsLoading(true)
      const { body, status } = await nhost.auth.signInOTPEmail({
        email: values.email,
        // Set locale and timezone at signup
        options: {
          locale: language.substring(0, 2),
          metadata: {
            timezone: getTimeZone(),
          },
        },
      })

      // Check for successful response (200 status returns "OK")
      if (status !== 200 || body !== 'OK') {
        throw new Error('Failed to send OTP code')
      }

      setEmail(values.email)
      setStep('code')
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

  const onCodeComplete = async (code: string) => {
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

      // Session is automatically stored by Nhost SDK
      // User will be redirected by the auth state change
    } catch (error: any) {
      toast({
        title: error?.response?.data || error?.message || t('common.error'),
        status: 'error',
        duration: 4000,
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

        <Heading as="h1" size="md" mb={3}>
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
              onComplete={onCodeComplete}
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
      </VStack>
    )
  }

  return (
    <form onSubmit={handleEmailSubmit(onEmailSubmit)}>
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
