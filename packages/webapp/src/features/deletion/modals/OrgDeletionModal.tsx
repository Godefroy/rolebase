import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
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
import DeletionOrgLink from '../components/DeletionOrgLink'
import DeletionSection from '../components/DeletionSection'
import useDeletionPreview from '../hooks/useDeletionPreview'

interface Props extends Omit<ModalProps, 'children'> {
  orgId: string
  // Super admin: deletes for good right away. Otherwise the org is archived
  // and deleted for good after 30 days.
  immediate?: boolean
  onDeleted(): void
}

export default function OrgDeletionModal({
  orgId,
  immediate,
  onDeleted,
  ...modalProps
}: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const [confirmation, setConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { preview, error } = useDeletionPreview(() =>
    trpc.org.getDeletionPreview.query({ orgId })
  )

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      if (immediate) {
        const { failedFiles } = await trpc.superAdmin.deleteOrg.mutate({
          orgId,
        })
        toast({
          title: failedFiles
            ? t('Deletion.doneWithFailedFiles', { count: failedFiles })
            : t('Deletion.done'),
          status: failedFiles ? 'warning' : 'success',
          duration: 4000,
          isClosable: true,
        })
      } else {
        await trpc.org.archiveOrg.mutate({ orgId })
      }
      modalProps.onClose()
      onDeleted()
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
            title={t('Deletion.org.heading')}
            subtitle={preview && <DeletionOrgLink org={preview.org} />}
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
                {immediate
                  ? t('Deletion.org.warning')
                  : t('Deletion.org.warningDelayed')}
              </Alert>

              <DeletionSection
                tone="delete"
                icon={FiTrash2}
                title={
                  immediate
                    ? t('Deletion.org.deleted')
                    : t('Deletion.org.deletedDelayed')
                }
              >
                <DeletionCounts
                  counts={{ ...preview.counts, files: preview.files }}
                />
              </DeletionSection>

              {preview.subscription?.active && (
                <DeletionSection
                  tone="anonymize"
                  icon={FiCreditCard}
                  title={t('Deletion.org.subscription', {
                    type: preview.subscription.type ?? '',
                  })}
                  description={`${t('Deletion.org.subscriptionInfo')} ${t(
                    'Deletion.stripeKept'
                  )}`}
                />
              )}

              <DeletionSection
                tone="keep"
                icon={FiShield}
                title={t('Deletion.org.kept')}
                description={t('Deletion.org.keptInfo')}
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
            {immediate ? t('Deletion.submit') : t('common.delete')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
