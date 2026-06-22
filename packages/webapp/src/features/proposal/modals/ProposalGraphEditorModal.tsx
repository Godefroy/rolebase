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
      // Full-screen modal: the body behind is hidden, so the scroll lock is
      // unneeded. It also mis-attributes wheel scrolling between the nested
      // scroll areas (role panel vs changes list), blocking the wheel there.
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
