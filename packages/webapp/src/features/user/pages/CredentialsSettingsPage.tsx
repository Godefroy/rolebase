import PasswordConfirmInputDummy from '@/common/atoms/PasswordConfirmInputDummy'
import PasswordInput from '@/common/atoms/PasswordInput'
import { Title } from '@/common/atoms/Title'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useChangeDisplayNameMutation } from '@gql'
import { yupResolver } from '@hookform/resolvers/yup'
import { emailSchema, nameSchema } from '@rolebase/shared/schemas'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { nhost } from 'src/nhost'
import * as yup from 'yup'
import AccountDeletionCard from '../components/AccountDeletionCard'
import { useAuth } from '../hooks/useAuth'

const schema = yup.object().shape({
  name: nameSchema.required(),
  email: emailSchema.required(),
  ['new-password']: yup
    .string()
    .test(
      'length',
      'Password must be at least 8 characters',
      (value) => value === undefined || value.length === 0 || value.length >= 8
    ),
})

type Values = yup.InferType<typeof schema>

export default function CredentialsSettingsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const toast = useToast()
  const [saving, setSaving] = useState(false)

  // Mutations
  const [changeDisplayName] = useChangeDisplayNameMutation()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Values>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
      ['new-password']: '',
    },
  })

  const onSubmit = handleSubmit(
    async ({ name, email, 'new-password': password }) => {
      if (!user?.id) return
      setSaving(true)

      // Update display name
      if (name !== user?.displayName) {
        await changeDisplayName({
          variables: { userId: user.id, displayName: name },
        })
      }

      // Update email
      if (email !== user?.email) {
        await nhost.auth.changeUserEmail({ newEmail: email })
      }

      // Update password
      if (password) {
        await nhost.auth.changeUserPassword({ newPassword: password })
      }

      // Refresh user data
      await nhost.refreshSession(0)

      toast({
        title: t('CurrentUserModal.toastSuccess'),
        status: 'success',
        duration: 2000,
      })

      setSaving(false)
    }
  )

  if (!user) return null

  return (
    <>
      <Title>{t('CurrentUserModal.heading')}</Title>

      <form onSubmit={onSubmit}>
        <VStack spacing={10} align="stretch" maxW="xl">
          <Heading as="h1" size="lg">
            {t('CurrentUserModal.heading')}
          </Heading>

          <FormControl isInvalid={!!errors.name}>
            <FormLabel>{t('CurrentUserModal.name')}</FormLabel>
            <Input
              {...register('name')}
              autoFocus
              autoComplete="off"
              data-lpignore
              data-1p-ignore
            />
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel>{t('CurrentUserModal.email')}</FormLabel>
            <Input
              {...register('email')}
              type="email"
              placeholder={t('CurrentUserModal.emailPlaceholder')}
              autoComplete="off"
              data-lpignore
              data-1p-ignore
            />
          </FormControl>

          <FormControl isInvalid={!!errors['new-password']}>
            <FormLabel>{t('CurrentUserModal.password')}</FormLabel>
            <PasswordInput
              {...register('new-password')}
              placeholder={t('CurrentUserModal.passwordPlaceholder')}
              autoComplete="new-password"
            />
          </FormControl>

          <PasswordConfirmInputDummy />

          <Box textAlign="right">
            <Button colorScheme="blue" type="submit" isLoading={saving}>
              {t('common.save')}
            </Button>
          </Box>
        </VStack>
      </form>

      <Box maxW="xl" mt={16}>
        <AccountDeletionCard />
      </Box>
    </>
  )
}
