import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import { ProposalLog } from '@rolebase/shared/model/proposal'
import React from 'react'
import ProposalGraphEditor from '../components/ProposalGraphEditor'

interface Props {
  isOpen: boolean
  onClose(): void
  logs: ProposalLog[]
  circleId?: string
  readOnly?: boolean
  onChange?(logs: ProposalLog[]): void
}

// Full-screen modal hosting the proposal org chart editor (yellow border).
export default function ProposalGraphEditorModal({
  isOpen,
  onClose,
  logs,
  circleId,
  readOnly,
  onChange,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      closeOnOverlayClick={false}
      // No scroll lock: react-remove-scroll whitelists a modal's own scroll
      // areas through React's synthetic onWheelCapture, but Chakra portals the
      // modal to document.body, outside React's #root event root, so that
      // handler never fires here and the lock would block the wheel inside the
      // panels (role/changes lists). The full-screen modal hides the body
      // anyway, so the lock is unneeded. ProposalModal also drops its own lock
      // while this is open (see blockScrollOnMount there).
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent
        m={0}
        h="100dvh"
        maxH="100dvh"
        borderRadius={0}
        borderWidth="8px"
        borderColor="yellow.400"
        // Clip horizontally, but let the content scroll vertically so that
        // below lg (panel stacked under the graph) the modal extends instead
        // of clipping the role panel and changes list.
        overflowX="hidden"
        overflowY="auto"
        bg="white"
        _dark={{ bg: 'gray.900', borderColor: 'yellow.500' }}
      >
        {isOpen && (
          <ProposalGraphEditor
            logs={logs}
            circleId={circleId}
            readOnly={readOnly}
            onChange={onChange}
            onClose={onClose}
          />
        )}
      </ModalContent>
    </Modal>
  )
}
