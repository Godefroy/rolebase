import PasswordInput from '@/common/atoms/PasswordInput'
import { Title } from '@/common/atoms/Title'
import {
  Box,
  Button,
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
import { emailSchema } from '@rolebase/shared/schemas'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link as ReachLink } from 'react-router'
import { track } from 'src/analytics'
import { nhost } from 'src/nhost'
import * as yup from 'yup'
import { AuthStep } from '../pages/AuthPage'

interface Props {
  defaultEmail?: string
  onStepChange?: (step: AuthStep) => void
}

export interface Values {
  email: string
  ['current-password']: string
}

const schema = yup.object().shape({
  email: emailSchema.required(),
  ['current-password']: yup.string().required(),
})

export default function LoginForm({ defaultEmail, onStepChange }: Props) {
  const { t } = useTranslation()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (values: Values) => {
    try {
      setIsLoading(true)
      await nhost.auth.signInEmailPassword({
        email: values.email,
        password: values['current-password'],
      })
      track('auth_login_succeeded')
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
    watch,
    formState: { errors },
  } = useForm<Values>({
    resolver: yupResolver(schema),
  })

  const email = watch('email')

  useEffect(() => {
    if (defaultEmail) {
      setValue('email', defaultEmail)
    }
  }, [defaultEmail])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Title>{t('LoginForm.heading')}</Title>

      <Heading as="h1" size="md" mb={7}>
        {t('LoginForm.heading')}
      </Heading>

      <VStack spacing={5}>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel>{t('LoginForm.email')}</FormLabel>
          <Input
            {...register('email')}
            type="email"
            required
            autoComplete="email"
            autoFocus
          />
        </FormControl>

        <FormControl isInvalid={!!errors['current-password']}>
          <FormLabel>{t('LoginForm.password')}</FormLabel>
          <PasswordInput
            {...register('current-password')}
            required
            autoComplete="current-password"
          />
          <Link
            to={`/reset-password${email ? `?email=${email}` : ''}`}
            as={ReachLink}
            fontSize="sm"
            color="gray.500"
            _dark={{ color: 'gray.300' }}
          >
            {t('LoginForm.resetPassword')}
          </Link>
        </FormControl>

        <Button colorScheme="blue" type="submit" isLoading={isLoading}>
          {t('LoginForm.submit')}
        </Button>

        {onStepChange && (
          <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
            <Link
              onClick={() => onStepChange('otp')}
              textDecoration="underline"
              cursor="pointer"
            >
              {t('AuthPage.loginWithOtp')}
            </Link>
            <Box as="span" mx={2}>
              •
            </Box>
            <Link
              onClick={() => onStepChange('signup')}
              textDecoration="underline"
              cursor="pointer"
            >
              {t('AuthPage.createAccount')}
            </Link>
          </Text>
        )}
      </VStack>
    </form>
  )
}
