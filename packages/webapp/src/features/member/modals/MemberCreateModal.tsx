import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UseModalProps,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { nameSchema } from '@rolebase/shared/schemas'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import useCreateMember from '../hooks/useCreateMember'

interface Props extends UseModalProps {
  onCreate?: (id: string) => void
}

interface Values {
  name: string
}

const resolver = yupResolver(
  yup.object().shape({
    name: nameSchema.required(),
  })
)

export default function MemberCreateModal({ onCreate, ...modalProps }: Props) {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()
  const createMember = useCreateMember()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Values>({
    resolver,
  })

  const handleCreate = async ({ name }: Values) => {
    if (!orgId) return
    const memberId = await createMember(name)
    onCreate?.(memberId)
    modalProps.onClose()
  }

  return (
    <Modal {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(handleCreate)}>
          <ModalHeader>{t('MemberCreateModal.heading')}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>{t('common.name')}</FormLabel>
              <Input {...register('name')} autoFocus autoComplete="off" />
            </FormControl>

            <Box textAlign="right" my={2}>
              <Button colorScheme="blue" type="submit">
                {t('common.create')}
              </Button>
            </Box>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  )
}
