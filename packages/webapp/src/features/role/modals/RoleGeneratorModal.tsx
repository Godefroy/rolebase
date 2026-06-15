import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import EditorController from '@/editor/components/EditorController'
import { useOrgEditActions } from '@/org/contexts/OrgContext'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UseModalProps,
  VStack,
} from '@chakra-ui/react'
import { RoleFragment } from '@gql'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { MagicIcon } from 'src/icons'
import { trpc } from 'src/trpc'

interface Props extends UseModalProps {
  role: RoleFragment
}

const fields = [
  'purpose',
  'domain',
  'accountabilities',
  'checklist',
  'indicators',
  'notes',
] as const

type Values = Record<(typeof fields)[number], string>

export default function RoleGeneratorModal({ id, role, ...modalProps }: Props) {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const { updateRole } = useOrgEditActions()

  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<Error>()

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Values>()

  // Generate properties for the role
  useEffect(() => {
    setLoading(true)
    setError(undefined)

    trpc.ai.generateRole
      .query({
        name: role.name,
        lang: language,
      })
      .then((roleProps) => {
        // Update form
        for (const field of fields) {
          let value = roleProps[field]
          if (!value) continue
          setValue(field, value)
        }
        setLoaded(true)
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false))
  }, [role.name])

  // Save role properties
  const onSubmit = handleSubmit(async (values) => {
    if (!role) return
    modalProps.onClose()
    await updateRole(role, values)
  })

  return (
    <Modal {...modalProps} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display="flex" alignItems="center">
          <Icon as={MagicIcon} mr={3} />
          {t('RoleGeneratorModal.heading', { role: role.name })}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {error && <TextError error={error} />}
          {loading && (
            <>
              <Flex>
                <Loading active size="md" mr={5} />
                {t('RoleGeneratorModal.loading')}
              </Flex>
              <Text color="gray" mt={10} mb={3}>
                {t('RoleGeneratorModal.waitInfo')}
              </Text>
            </>
          )}

          {loaded && (
            <VStack spacing={6}>
              <Alert status="info">
                <AlertIcon />
                <AlertDescription>
                  {t('RoleGeneratorModal.info')}
                </AlertDescription>
              </Alert>

              {fields.map((field) => (
                <FormControl key={field} isInvalid={!!errors.purpose}>
                  <FormLabel>{t(`CircleRole.${field}`)}</FormLabel>
                  <EditorController
                    control={control}
                    name={field}
                    placeholder={t(`CircleRole.${field}Placeholder`)}
                  />
                </FormControl>
              ))}
            </VStack>
          )}
        </ModalBody>

        {loaded && (
          <ModalFooter alignItems="end">
            <Button colorScheme="blue" onClick={onSubmit}>
              {t('common.save')}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}
