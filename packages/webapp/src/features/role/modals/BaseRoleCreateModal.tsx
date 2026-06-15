import useCreateLog from '@/log/hooks/useCreateLog'
import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UseModalProps,
} from '@chakra-ui/react'
import { useCreateRoleMutation } from '@gql'
import { yupResolver } from '@hookform/resolvers/yup'
import { EntityChangeType, LogType } from '@rolebase/shared/model/log'
import { nameSchema } from '@rolebase/shared/schemas'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

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

export default function BaseRoleCreateModal({
  onCreate,
  ...modalProps
}: Props) {
  const { t } = useTranslation()
  const { orgId } = useOrgContext()
  const [createRole] = useCreateRoleMutation()
  const createLog = useCreateLog()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Values>({
    resolver,
  })

  const onSubmit = handleSubmit(async ({ name }) => {
    if (!orgId) return

    const { data } = await createRole({
      variables: {
        values: {
          orgId,
          name,
          base: true,
        },
      },
    })
    const role = data?.insert_role_one!
    onCreate?.(role.id)

    modalProps.onClose()

    // Log change
    createLog({
      display: {
        type: LogType.RoleCreate,
        id: role.id,
        name: role.name,
      },
      changes: {
        roles: [{ type: EntityChangeType.Create, id: role.id, data: role }],
      },
    })
  })

  return (
    <Modal {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={onSubmit}>
          <ModalHeader>{t('BaseRoleCreateModal.heading')}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>{t('common.name')}</FormLabel>
              <Input {...register('name')} autoFocus autoComplete="off" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" type="submit">
              {t('common.create')}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
