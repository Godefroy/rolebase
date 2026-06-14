import LogEntityChanges from '@/log/components/LogEntityChanges'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UseModalProps,
  VStack,
} from '@chakra-ui/react'
import { EntitiesChanges, EntityChange } from '@rolebase/shared/model/log'
import { ProposalLog } from '@rolebase/shared/model/proposal'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props extends UseModalProps {
  log: ProposalLog
}

// Show the before/after diff of a prepared change (e.g. a role update).
export default function ProposalLogDiffModal({ log, ...modalProps }: Props) {
  const { t } = useTranslation()

  return (
    <Modal isCentered size="lg" {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('ProposalLogDiffModal.heading')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={3} align="stretch" wordBreak="break-word">
            {Object.keys(log.changes).flatMap((entityType) =>
              (
                log.changes[entityType as keyof EntitiesChanges] || []
              ).map((entityChange) => (
                <LogEntityChanges
                  key={entityChange.id}
                  type={entityType}
                  entityChange={entityChange as EntityChange<any>}
                />
              ))
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
