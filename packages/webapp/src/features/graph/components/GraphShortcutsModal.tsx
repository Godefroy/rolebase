import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UseModalProps,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import GraphShortcutsList, { ShortcutKey } from './GraphShortcutsList'

interface Props extends UseModalProps {
  // Narrow the list further (see GraphShortcutsList)
  only?: ShortcutKey[]
}

// Org chart shortcuts, for the charts that have no panel next to them (the
// proposal editor, the documentation illustrations). The org chart page opens
// GraphShortcutsContent as a panel instead.
export default function GraphShortcutsModal({ only, ...modalProps }: Props) {
  const { t } = useTranslation()

  return (
    <Modal isCentered size="lg" {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('GraphShortcuts.heading')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <GraphShortcutsList only={only} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
