import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UseModalProps,
  useToast,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { emailSchema } from '@rolebase/shared/schemas'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { nhost } from 'src/nhost'
import * as yup from 'yup'
import { useAuth } from '../hooks/useAuth'

const schema = yup.object().shape({
  email: emailSchema.required(),
})

type Values = yup.InferType<typeof schema>

interface Props extends UseModalProps {
  onSuccess?(): void
}

// The address only changes once the link sent to the new one is clicked
export default function ChangeEmailModal({ onSuccess, ...modalProps }: Props) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const toast = useToast()
  const [saving, setSaving] = useState(false)

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Values>({
    resolver: yupResolver(schema),
    defaultValues: { email: user?.email || '' },
  })

  const onSubmit = handleSubmit(async ({ email }) => {
    const newEmail = email.trim()
    if (newEmail === user?.email) {
      modalProps.onClose()
      return
    }
    setSaving(true)
    try {
      await nhost.auth.changeUserEmail({ newEmail })
    } catch (error: any) {
      toast({
        title: error?.message || t('common.error'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      return
    } finally {
      setSaving(false)
    }
    toast({
      title: t('ChangeEmailModal.toastSuccess', { email: newEmail }),
      status: 'success',
      duration: 6000,
      isClosable: true,
    })
    onSuccess?.()
    modalProps.onClose()
  })

  return (
    <Modal isCentered {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={onSubmit}>
          <ModalHeader>{t('ChangeEmailModal.heading')}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>{t('ChangeEmailModal.email')}</FormLabel>
              <Input
                {...register('email')}
                type="email"
                autoComplete="email"
                autoFocus
              />
              {errors.email?.message && (
                <FormErrorMessage>{errors.email.message}</FormErrorMessage>
              )}
            </FormControl>
            <Text
              mt={3}
              fontSize="sm"
              color="gray.500"
              _dark={{ color: 'gray.400' }}
            >
              {t('ChangeEmailModal.description')}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" type="submit" isLoading={saving}>
              {t('common.save')}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
