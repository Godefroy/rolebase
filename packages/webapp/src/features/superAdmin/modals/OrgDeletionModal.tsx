import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import { useApolloClient } from '@apollo/client'
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  useToast,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiCreditCard, FiShield, FiTrash2 } from 'react-icons/fi'
import { trpc } from 'src/trpc'
import DeletionConfirmInput from '../components/DeletionConfirmInput'
import DeletionCounts from '../components/DeletionCounts'
import DeletionModalHeader from '../components/DeletionModalHeader'
import DeletionSection from '../components/DeletionSection'
import useDeletionPreview from '../hooks/useDeletionPreview'

interface Props extends Omit<ModalProps, 'children'> {
  orgId: string
}

export default function OrgDeletionModal({ orgId, ...modalProps }: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const apolloClient = useApolloClient()
  const [confirmation, setConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { preview, error } = useDeletionPreview(() =>
    trpc.superAdmin.getOrgDeletionPreview.query({ orgId })
  )

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const { failedFiles } = await trpc.superAdmin.deleteOrg.mutate({ orgId })
      toast({
        title: failedFiles
          ? t('SuperAdmin.deletion.doneWithFailedFiles', { count: failedFiles })
          : t('SuperAdmin.deletion.done'),
        status: failedFiles ? 'warning' : 'success',
        duration: 4000,
        isClosable: true,
      })
      await apolloClient.refetchQueries({ include: ['AdminOrgs'] })
      modalProps.onClose()
    } catch (error: any) {
      toast({
        title: error?.message || t('common.error'),
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      setIsDeleting(false)
    }
  }

  return (
    <Modal size="xl" scrollBehavior="inside" {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <DeletionModalHeader
            title={t('SuperAdmin.deletion.org.heading')}
            subtitle={preview?.org.name}
          />
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {error && <TextError error={error} />}
          {!preview && !error && (
            <Box minH="200px">
              <Loading active center />
            </Box>
          )}

          {preview && (
            <Stack spacing={4}>
              <Alert status="error" variant="subtle" borderRadius="md">
                <AlertIcon />
                {t('SuperAdmin.deletion.org.warning')}
              </Alert>

              <DeletionSection
                tone="delete"
                icon={FiTrash2}
                title={t('SuperAdmin.deletion.org.deleted')}
              >
                <DeletionCounts
                  counts={{ ...preview.counts, files: preview.files }}
                />
              </DeletionSection>

              {preview.subscription?.active && (
                <DeletionSection
                  tone="anonymize"
                  icon={FiCreditCard}
                  title={t('SuperAdmin.deletion.org.subscription', {
                    type: preview.subscription.type ?? '',
                  })}
                  description={`${t(
                    'SuperAdmin.deletion.org.subscriptionInfo'
                  )} ${t('SuperAdmin.deletion.stripeKept')}`}
                />
              )}

              <DeletionSection
                tone="keep"
                icon={FiShield}
                title={t('SuperAdmin.deletion.org.kept')}
                description={t('SuperAdmin.deletion.org.keptInfo')}
              />

              <DeletionConfirmInput
                expected={preview.org.name}
                value={confirmation}
                onChange={setConfirmation}
              />
            </Stack>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={modalProps.onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            colorScheme="red"
            leftIcon={<FiTrash2 />}
            isLoading={isDeleting}
            isDisabled={!preview || confirmation !== preview.org.name}
            onClick={handleDelete}
          >
            {t('SuperAdmin.deletion.submit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
