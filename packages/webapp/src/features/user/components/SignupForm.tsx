import PasswordConfirmInputDummy from '@/common/atoms/PasswordConfirmInputDummy'
import PasswordInput from '@/common/atoms/PasswordInput'
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from '@rolebase/shared/schemas'
import { getTimeZone } from '@utils/dates'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'
import { nhost } from 'src/nhost'

import * as yup from 'yup'
import { AuthStep } from '../pages/AuthPage'

interface Props {
  defaultEmail?: string
  onStepChange?: (step: AuthStep) => void
}

const schema = yup.object().shape({
  name: nameSchema.required(),
  email: emailSchema.required(),
  ['new-password']: passwordSchema.required(),
})

type Values = yup.InferType<typeof schema>

export default function SignupForm({ defaultEmail, onStepChange }: Props) {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async ({
    name,
    email,
    'new-password': password,
  }: Values) => {
    // Sign up
    try {
      setIsLoading(true)
      const { body } = await nhost.auth.signUpEmailPassword({
        email,
        password,
        options: {
          displayName: name,
          locale: language.substring(0, 2),
          metadata: {
            timezone: getTimeZone(),
          },
        },
      })
      if (!body.session?.user) return
      const { user } = body.session

      if (user.email && !user.emailVerified) {
        await nhost.auth.sendVerificationEmail({ email: user.email })
      }

      // When signing up from an invitation link, stay on the invitation page so
      // the user joins the org (and skips onboarding) instead of landing on "/".
      if (location.pathname.includes('/invitation')) {
        navigate(location.pathname + location.search)
      } else {
        navigate('/')
      }
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

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (defaultEmail) {
      setValue('email', defaultEmail)
    }
  }, [defaultEmail])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading as="h1" size="md" mb={7}>
        {t('SignupForm.heading')}
      </Heading>

      <VStack spacing={5}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>{t('SignupForm.name')}</FormLabel>
          <Input
            {...register('name')}
            type="name"
            required
            autoComplete="name"
            autoFocus
          />
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>{t('SignupForm.email')}</FormLabel>
          <Input
            {...register('email')}
            type="email"
            required
            autoComplete="email"
          />
        </FormControl>

        <FormControl isInvalid={!!errors['new-password']}>
          <FormLabel>{t('SignupForm.password')}</FormLabel>
          <PasswordInput
            {...register('new-password')}
            required
            autoComplete="new-password"
          />
        </FormControl>

        <FormControl>
          <Checkbox
            name="terms"
            required
            sx={{ a: { textDecoration: 'underline' } }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: t('SignupForm.terms', {
                  termsAndPrivacy: t('common.termsAndPrivacy'),
                }),
              }}
            />
          </Checkbox>
        </FormControl>

        <PasswordConfirmInputDummy />
        <Button colorScheme="blue" type="submit" isLoading={isLoading}>
          {t('SignupForm.submit')}
        </Button>

        {onStepChange && (
          <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
            <Link
              onClick={() => onStepChange('otp')}
              textDecoration="underline"
              cursor="pointer"
            >
              {t('AuthPage.haveAccount')}
            </Link>
          </Text>
        )}
      </VStack>
    </form>
  )
}
