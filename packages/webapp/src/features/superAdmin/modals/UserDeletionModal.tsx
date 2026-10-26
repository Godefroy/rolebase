import Loading from '@/common/atoms/Loading'
import TextError from '@/common/atoms/TextError'
import { useApolloClient } from '@apollo/client'
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
import DeletionOrgList from '../components/DeletionOrgList'
import DeletionSection from '../components/DeletionSection'
import useDeletionPreview from '../hooks/useDeletionPreview'

interface Props extends Omit<ModalProps, 'children'> {
  userId: string
}

export default function UserDeletionModal({ userId, ...modalProps }: Props) {
  const { t } = useTranslation()
  const toast = useToast()
  const apolloClient = useApolloClient()
  const [confirmation, setConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { preview, error } = useDeletionPreview(() =>
    trpc.superAdmin.getUserDeletionPreview.query({ userId })
  )
  const expected = preview?.user.email || preview?.user.displayName || ''

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const { failedFiles } = await trpc.superAdmin.deleteUser.mutate({
        userId,
      })
      toast({
        title: failedFiles
          ? t('SuperAdmin.deletion.doneWithFailedFiles', { count: failedFiles })
          : t('SuperAdmin.deletion.done'),
        status: failedFiles ? 'warning' : 'success',
        duration: 4000,
        isClosable: true,
      })
      await apolloClient.refetchQueries({ include: ['AdminUsers'] })
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
    <Modal size="2xl" scrollBehavior="inside" {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <DeletionModalHeader
            title={t('SuperAdmin.deletion.user.heading')}
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
                {t('SuperAdmin.deletion.user.warning')}
              </Alert>

              <DeletionSection
                tone={preview.accountDeleted ? 'delete' : 'anonymize'}
                icon={preview.accountDeleted ? FiUserX : FiUser}
                title={
                  preview.accountDeleted
                    ? t('SuperAdmin.deletion.user.accountDeleted')
                    : t('SuperAdmin.deletion.user.accountAnonymized')
                }
                description={
                  preview.accountDeleted
                    ? t('SuperAdmin.deletion.user.accountDeletedInfo')
                    : t('SuperAdmin.deletion.user.accountAnonymizedInfo')
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

              {preview.deletedOrgs.length > 0 && (
                <DeletionSection
                  tone="delete"
                  icon={FiTrash2}
                  title={t('SuperAdmin.deletion.user.deletedOrgs', {
                    count: preview.deletedOrgs.length,
                  })}
                  description={t('SuperAdmin.deletion.user.deletedOrgsInfo')}
                >
                  <Stack spacing={3}>
                    <DeletionOrgList orgs={preview.deletedOrgs} />
                    <DeletionCounts counts={preview.deletedOrgsCounts} />
                    {preview.cancelledSubscriptions > 0 && (
                      <Text fontSize="sm" color="gray.500">
                        {t('SuperAdmin.deletion.user.cancelledSubscriptions', {
                          count: preview.cancelledSubscriptions,
                        })}{' '}
                        {t('SuperAdmin.deletion.stripeKept')}
                      </Text>
                    )}
                  </Stack>
                </DeletionSection>
              )}

              {(preview.sharedOrgs.length > 0 || !preview.accountDeleted) && (
                <DeletionSection
                  tone="keep"
                  icon={FiLink2}
                  title={t('SuperAdmin.deletion.user.sharedOrgs', {
                    count: preview.sharedOrgs.length,
                  })}
                  description={t('SuperAdmin.deletion.user.sharedOrgsInfo')}
                >
                  <Stack spacing={3}>
                    {preview.sharedOrgs.length > 0 && (
                      <DeletionOrgList
                        orgs={preview.sharedOrgs.map((org) => ({
                          id: org.id,
                          name: org.name,
                          detail: org.memberName,
                        }))}
                      />
                    )}
                    {!preview.accountDeleted && (
                      <>
                        <Text fontSize="sm" fontWeight="medium">
                          {t('SuperAdmin.deletion.user.sharedContent')}
                        </Text>
                        <DeletionCounts counts={preview.sharedContent} />
                      </>
                    )}
                  </Stack>
                </DeletionSection>
              )}

              <DeletionSection
                tone="todo"
                icon={FiCheckSquare}
                title={t('SuperAdmin.deletion.user.manual')}
              >
                <List spacing={1} fontSize="sm">
                  <ListItem>
                    <ListIcon as={FiSquare} color="gray.400" />
                    {t('SuperAdmin.deletion.user.manualCrisp')}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FiSquare} color="gray.400" />
                    {t('SuperAdmin.deletion.user.manualBrevo')}
                  </ListItem>
                </List>
              </DeletionSection>

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
            isDisabled={!preview || confirmation !== expected}
            onClick={handleDelete}
          >
            {t('SuperAdmin.deletion.submit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
