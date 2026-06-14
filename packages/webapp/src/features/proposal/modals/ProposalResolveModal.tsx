import {
  Badge,
  Button,
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
import { ProposalDecisionMode } from '@rolebase/shared/model/proposal'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props extends UseModalProps {
  decisionMode: ProposalDecisionMode
  approveCount: number
  objectCount: number
  votersCount: number
  willBeApproved: boolean
  hasOrgChanges: boolean
  onConfirm(): void
}

export default function ProposalResolveModal({
  decisionMode,
  approveCount,
  objectCount,
  votersCount,
  willBeApproved,
  hasOrgChanges,
  onConfirm,
  ...modalProps
}: Props) {
  const { t } = useTranslation()

  const handleConfirm = () => {
    onConfirm()
    modalProps.onClose()
  }

  return (
    <Modal {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('ProposalResolveModal.heading')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={3}>
            <Text>
              {t('ProposalResolveModal.mode')}{' '}
              <Badge colorScheme="purple">
                {t(`ProposalModal.decisionMode_${decisionMode}`)}
              </Badge>
            </Text>

            <Text>
              {t('ProposalResolveModal.votes', {
                approve: approveCount,
                object: objectCount,
                total: votersCount,
              })}
            </Text>

            <Text fontWeight="bold">
              {t(
                willBeApproved
                  ? 'ProposalResolveModal.outcomeApproved'
                  : 'ProposalResolveModal.outcomeRefused'
              )}
            </Text>

            {willBeApproved && hasOrgChanges && (
              <Text color="gray.500" _dark={{ color: 'gray.300' }}>
                {t('ProposalResolveModal.applyNote')}
              </Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={modalProps.onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            colorScheme={willBeApproved ? 'green' : 'red'}
            onClick={handleConfirm}
          >
            {t('ProposalResolveModal.confirm')} ·{' '}
            {t(
              willBeApproved
                ? 'ThreadActivityProposal.status_approved'
                : 'ThreadActivityProposal.status_refused'
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
