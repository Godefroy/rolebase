import BrandModal from '@/common/atoms/BrandModal'
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
import { nameSchema } from '@rolebase/shared/schemas'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { track } from 'src/analytics'
import { nhost } from 'src/nhost'
import * as yup from 'yup'
import { useAuth } from '../hooks/useAuth'

const schema = yup.object().shape({
  name: nameSchema.required(),
})

type Values = yup.InferType<typeof schema>

// Suggested name from the email's local part: "jean.dupont" -> "Jean Dupont"
function getNameFromEmail(email: string | undefined): string {
  const localPart = email?.split('@')[0] ?? ''
  return localPart
    .replace(/\+.*$/, '')
    .split(/[._-]+/)
    .map((word) => word.replace(/\d+/g, ''))
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export default function UserNamePage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
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
      name: getNameFromEmail(user?.email),
    },
  })

  useEffect(() => {
    track('user_name_viewed')
  }, [])

  const onSubmit = handleSubmit(async ({ name }) => {
    if (!user?.id) return
    setSaving(true)

    try {
      // Update display name
      await changeDisplayName({
        variables: { userId: user.id, displayName: name },
      })

      track('user_name_set')

      // Refresh user data: AppRoute leaves this page once the session carries
      // the new name. If the refreshed session still has the old one, reload
      // so the person is never stuck on a page that says it saved.
      await nhost.refreshSession(0)
      if (nhost.getUserSession()?.user?.displayName === user.email) {
        window.location.reload()
        return
      }

      toast({
        title: t('CurrentUserModal.toastSuccess'),
        status: 'success',
        duration: 2000,
      })
    } catch (error: any) {
      toast({
        title: error?.message || t('common.error'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setSaving(false)
    }
  })

  return (
    <>
      <Title>{t('UserNamePage.heading')}</Title>

      <BrandModal
        size="md"
        bodyProps={{ mx: 10 }}
        backButton={false}
        isOpen
        closeOnEsc={false}
        onClose={() => navigate('/')}
      >
        <form onSubmit={onSubmit}>
          <Heading as="h1" size="md" mb={7}>
            {t('UserNamePage.heading')}
          </Heading>

          <VStack spacing={5} align="stretch">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>{t('UserNamePage.name')}</FormLabel>
              <Input
                {...register('name')}
                autoFocus
                autoComplete="name"
                required
              />
            </FormControl>

            <Box textAlign="right">
              <Button colorScheme="blue" type="submit" isLoading={saving}>
                {t('UserNamePage.submit')}
              </Button>
            </Box>
          </VStack>
        </form>
      </BrandModal>
    </>
  )
}
