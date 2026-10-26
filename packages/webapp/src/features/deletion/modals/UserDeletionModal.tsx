import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FiCheckSquare,
  FiLink2,
  FiSquare,
  FiTrash2,
  FiUser,
  FiUserX,
} from 'react-icons/fi'
import { trpc } from 'src/trpc'
import DeletionConfirmInput from '../components/DeletionConfirmInput'
import DeletionCounts from '../components/DeletionCounts'
import DeletionModalHeader from '../components/DeletionModalHeader'
import DeletionOrgCheckboxList from '../components/DeletionOrgCheckboxList'
import DeletionOrgList from '../components/DeletionOrgList'
import DeletionSection from '../components/DeletionSection'
import useDeletionPreview from '../hooks/useDeletionPreview'

interface Props extends Omit<ModalProps, 'children'> {
  // Super admin: deletes this user, with the selected co-owned orgs.
  // Otherwise the current user deletes their own account.
  userId?: string
  onDeleted(): void
}

export default function UserDeletionModal({
  userId,
  onDeleted,
  ...modalProps
}: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const [confirmation, setConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [orgIds, setOrgIds] = useState<string[]>([])
  const { preview, error, loading } = useDeletionPreview(
    () =>
      userId
        ? trpc.superAdmin.getUserDeletionPreview.query({ userId, orgIds })
        : trpc.user.getDeletionPreview.query(),
    [orgIds]
  )
  const expected = preview?.user.email || preview?.user.displayName || ''
  const deletedOrgs = preview?.orgs.filter((org) => org.deleted) ?? []
  const selectableOrgs =
    preview?.orgs.filter((org) => org.choice !== 'kept') ?? []

  const handleToggleOrg = (orgId: string) =>
    setOrgIds((ids) =>
      ids.includes(orgId) ? ids.filter((id) => id !== orgId) : [...ids, orgId]
    )

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      if (userId) {
        const { failedFiles } = await trpc.superAdmin.deleteUser.mutate({
          userId,
          orgIds,
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
        await trpc.user.deleteAccount.mutate()
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
    <Modal size="2xl" scrollBehavior="inside" {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <DeletionModalHeader
            title={
              userId
                ? t('Deletion.user.heading')
                : t('Deletion.user.ownHeading')
            }
            subtitle={
              preview &&
              [preview.user.displayName, preview.user.email]
                .filter(Boolean)
                .join(' · ')
            }
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
                {userId
                  ? t('Deletion.user.warning')
                  : t('Deletion.user.ownWarning')}
              </Alert>

              <DeletionSection
                tone={preview.accountDeleted ? 'delete' : 'anonymize'}
                icon={preview.accountDeleted ? FiUserX : FiUser}
                title={
                  preview.accountDeleted
                    ? t('Deletion.user.accountDeleted')
                    : t('Deletion.user.accountAnonymized')
                }
                description={
                  preview.accountDeleted
                    ? t('Deletion.user.accountDeletedInfo')
                    : t('Deletion.user.accountAnonymizedInfo')
                }
              >
                {preview.apiKeys + preview.apps + preview.files > 0 && (
                  <DeletionCounts
                    counts={{
                      apiKeys: preview.apiKeys,
                      apps: preview.apps,
                      files: preview.files,
                    }}
                  />
                )}
              </DeletionSection>

              {(userId ? selectableOrgs : deletedOrgs).length > 0 && (
                <DeletionSection
                  tone="delete"
                  icon={FiTrash2}
                  title={t('Deletion.user.deletedOrgs', {
                    count: deletedOrgs.length,
                  })}
                  description={
                    userId
                      ? t('Deletion.user.deletedOrgsInfo')
                      : t('Deletion.user.ownDeletedOrgsInfo')
                  }
                >
                  <Stack spacing={3}>
                    {userId ? (
                      <DeletionOrgCheckboxList
                        orgs={selectableOrgs}
                        onToggle={handleToggleOrg}
                      />
                    ) : (
                      <DeletionOrgList orgs={deletedOrgs} />
                    )}
                    {deletedOrgs.length > 0 && (
                      <DeletionCounts counts={preview.deletedOrgsCounts} />
                    )}
                    {preview.cancelledSubscriptions > 0 && (
                      <Text fontSize="sm" color="gray.500">
                        {t('Deletion.user.cancelledSubscriptions', {
                          count: preview.cancelledSubscriptions,
                        })}{' '}
                        {t('Deletion.stripeKept')}
                      </Text>
                    )}
                  </Stack>
                </DeletionSection>
              )}

              {(preview.sharedOrgs.length > 0 || !preview.accountDeleted) && (
                <DeletionSection
                  tone="keep"
                  icon={FiLink2}
                  title={t('Deletion.user.sharedOrgs', {
                    count: preview.sharedOrgs.length,
                  })}
                  description={t('Deletion.user.sharedOrgsInfo')}
                >
                  <Stack spacing={3}>
                    {preview.sharedOrgs.length > 0 && (
                      <DeletionOrgList
                        orgs={preview.sharedOrgs.map((org) => ({
                          id: org.id,
                          name: org.name,
                          slug: org.slug,
                          archived: org.archived,
                          detail: org.memberName,
                        }))}
                      />
                    )}
                    {!preview.accountDeleted && (
                      <>
                        <Text fontSize="sm" fontWeight="medium">
                          {t('Deletion.user.sharedContent')}
                        </Text>
                        <DeletionCounts counts={preview.sharedContent} />
                      </>
                    )}
                  </Stack>
                </DeletionSection>
              )}

              {userId && (
                <DeletionSection
                  tone="todo"
                  icon={FiCheckSquare}
                  title={t('Deletion.user.manual')}
                >
                  <List spacing={1} fontSize="sm">
                    <ListItem>
                      <ListIcon as={FiSquare} color="gray.400" />
                      {t('Deletion.user.manualCrisp')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiSquare} color="gray.400" />
                      {t('Deletion.user.manualBrevo')}
                    </ListItem>
                  </List>
                </DeletionSection>
              )}

              <DeletionConfirmInput
                expected={expected}
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
            isDisabled={!preview || loading || confirmation !== expected}
            onClick={handleDelete}
          >
            {userId ? t('Deletion.submit') : t('Deletion.user.ownSubmit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
