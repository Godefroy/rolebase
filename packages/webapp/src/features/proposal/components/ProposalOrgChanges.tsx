import { ThreadContext } from '@/thread/contexts/ThreadContext'
import { Box, Button, Text, useDisclosure } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { OrgChartIcon } from 'src/icons'
import { useProposal } from '../contexts/ProposalContext'
import ProposalGraphEditorModal from '../modals/ProposalGraphEditorModal'
import ProposalLogsPreview from './ProposalLogsPreview'

// Prepared org chart changes, shown as a right column on large screens, with a
// button to visualize the modified org chart.
export default function ProposalOrgChanges() {
  const { t } = useTranslation()
  const { activity, state } = useProposal()
  const { circle } = useContext(ThreadContext) ?? {}
  const viewModal = useDisclosure()

  return (
    <Box w={{ base: 'full', lg: '320px' }} flexShrink={0}>
      <Text
        fontSize="xs"
        fontWeight="bold"
        textTransform="uppercase"
        letterSpacing="wide"
        color="gray.500"
        _dark={{ color: 'gray.400' }}
        mb={2}
      >
        {t('ProposalGraphEditor.changes')}
      </Text>
      <Box
        borderWidth="1px"
        borderRadius="md"
        px={2}
        py={1}
        bg="white"
        _dark={{ bg: 'blackAlpha.300' }}
      >
        <ProposalLogsPreview logs={activity.data.logs} />
      </Box>
      {/* The preview replays the prepared changes; once resolved they are
          already applied, so only offer it while the proposal is in progress. */}
      {state.inProgress && (
        <Button
          mt={2}
          size="sm"
          variant="outline"
          leftIcon={<OrgChartIcon size={18} />}
          onClick={viewModal.onOpen}
        >
          {t('ThreadActivityProposal.viewOrgChart')}
        </Button>
      )}

      {viewModal.isOpen && (
        <ProposalGraphEditorModal
          isOpen
          readOnly
          logs={activity.data.logs}
          circleId={circle?.id}
          onClose={viewModal.onClose}
        />
      )}
    </Box>
  )
}
