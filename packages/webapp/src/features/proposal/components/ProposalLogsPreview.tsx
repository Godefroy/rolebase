import CircleContent from '@/circle/components/CircleContent'
import { CircleProvider } from '@/circle/contexts/CIrcleContext'
import {
  CircleMemberContext,
  CircleMemberContextValue,
} from '@/circle/contexts/CircleMemberContext'
import { OrgDataProvider } from '@/org/contexts/OrgDataContext'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react'
import { ProposalLog } from '@rolebase/shared/model/proposal'
import React, { useMemo, useState } from 'react'
import useProposalDraft from '../hooks/useProposalDraft'
import ProposalLogList from './ProposalLogList'

interface Props {
  logs: ProposalLog[]
}

// Render the prepared changes with their links resolving against an in-memory
// draft (entities not yet applied to the DB), like the org chart editor.
// Selecting a role opens it read-only instead of navigating to the live org.
export default function ProposalLogsPreview({ logs }: Props) {
  const draft = useProposalDraft(logs)
  const [selectedCircleId, setSelectedCircleId] = useState<string>()

  const circleMemberValue = useMemo<CircleMemberContextValue>(
    () => ({
      circleId: selectedCircleId,
      memberId: undefined,
      parentId: undefined,
      canFocus: false,
      goTo: (circleId) => setSelectedCircleId(circleId),
    }),
    [selectedCircleId]
  )

  return (
    <OrgDataProvider value={draft.orgData}>
      <CircleMemberContext.Provider value={circleMemberValue}>
        <ProposalLogList logs={logs} readOnly />

        {selectedCircleId && (
          <Modal
            isOpen
            size="xl"
            onClose={() => setSelectedCircleId(undefined)}
          >
            <ModalOverlay />
            <ModalContent maxH="90vh"  borderRadius="lg" overflow="hidden">
              <ModalBody p={0} overflowY="auto">
                <CircleProvider circleId={selectedCircleId} readOnly>
                  <CircleContent
                    onlyRole
                    readOnly
                    flowHeight
                    onClose={() => setSelectedCircleId(undefined)}
                  />
                </CircleProvider>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </CircleMemberContext.Provider>
    </OrgDataProvider>
  )
}
