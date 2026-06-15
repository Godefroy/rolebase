import { useOrgContext } from '@/org/contexts/OrgContext'
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  useToast,
} from '@chakra-ui/react'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { trpc } from 'src/trpc'

type CancelSubscriptionModalProps = {
  onSubscriptionCanceled: () => void
} & Omit<ModalProps, 'children'>

export default function CancelSubscriptionModal({
  onSubscriptionCanceled,
  ...modalProps
}: CancelSubscriptionModalProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const { orgId } = useOrgContext()

  const handleCancel = async () => {
    setLoading(true)

    try {
      const { cancelAt } = await trpc.orgSubscription.unsubscribeOrg.mutate({
        orgId: orgId ?? '',
      })
      toast({
        title: t('SubscriptionPlans.unsubscribeDate', {
          date: format(new Date(cancelAt), 'dd/MM/uuuu'),
        }),
        status: 'success',
      })
      onSubscriptionCanceled()
    } catch (e) {
      toast({
        title: t('common.errorRetry'),
        description: t('common.errorContact'),
        status: 'error',
        duration: 10000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal size="2xl" {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pt={7}>
          <Text>{t('SubscriptionTabs.cancelSubscriptionModal.heading')}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDir="column" ml="1rem" gap="1">
            <Text fontWeight={600}>
              - {t('SubscriptionTabs.cancelSubscriptionModal.desc1')}
            </Text>
            <Text fontWeight={600}>
              - {t('SubscriptionTabs.cancelSubscriptionModal.desc2')}
            </Text>
            <Text fontWeight={600}>
              - {t('SubscriptionTabs.cancelSubscriptionModal.desc3')}
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter mt={4} justifyContent="center" gap={2}>
          <Button variant="ghost" onClick={() => modalProps.onClose()}>
            {t('common.cancel')}
          </Button>
          <Button colorScheme="red" isLoading={loading} onClick={handleCancel}>
            {t('common.confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
