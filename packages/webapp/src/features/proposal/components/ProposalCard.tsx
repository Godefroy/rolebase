import Markdown from '@/common/atoms/Markdown'
import DecisionModal from '@/decision/modals/DecisionModal'
import ThreadActivityLayout from '@/thread/components/ThreadActivityLayout'
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DecisionsIcon } from 'src/icons'
import { useProposal } from '../contexts/ProposalContext'
import ProposalModal from '../modals/ProposalModal'
import ProposalOrgChanges from './ProposalOrgChanges'
import ProposalRecreateButton from './ProposalRecreateButton'
import ProposalStatusBadge from './ProposalStatusBadge'
import ProposalVoteSection from './ProposalVoteSection'

export default function ProposalCard() {
  const { t } = useTranslation()
  const { activity, state, canEdit, canDelete, editModal } = useProposal()
  const { title, status, appliedDecisionId } = activity.data
  const decisionModal = useDisclosure()

  return (
    <ThreadActivityLayout
      activity={activity}
      allowDelete={canDelete}
      onEdit={canEdit ? editModal.onOpen : undefined}
    >
      <Text color="gray.500" _dark={{ color: 'gray.300' }}>
        {t('ThreadActivityProposal.intro')}
      </Text>

      <Card mt={2} variant="activity">
        <CardBody>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={5} mb={3} align="stretch">
            <VStack spacing={4} align="stretch" flex="1" minW={0}>
              <Flex align="center" gap={2}>
                <Heading size="sm" lineHeight="short" flex="1">
                  {title}
                </Heading>
                {!state.inProgress && <ProposalStatusBadge status={status} />}
              </Flex>

              {/* Hide an empty description (default value is an empty heading) */}
              {/[\p{L}\p{N}]/u.test(activity.data.description) && (
                <Markdown>{activity.data.description}</Markdown>
              )}
            </VStack>

            {activity.data.logs.length > 0 && <ProposalOrgChanges />}
          </Flex>

          {state.inProgress && <ProposalVoteSection />}

          {!state.inProgress && appliedDecisionId && (
            <Box>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<DecisionsIcon size={18} />}
                onClick={decisionModal.onOpen}
              >
                {t('ThreadActivityProposal.viewDecision')}
              </Button>
            </Box>
          )}

          {(status === 'refused' || status === 'canceled') && (
            <Flex justify="flex-end" mt={4}>
              <ProposalRecreateButton
                threadId={activity.threadId}
                data={activity.data}
              />
            </Flex>
          )}
        </CardBody>
      </Card>

      {editModal.isOpen && (
        <ProposalModal
          isOpen
          threadId={activity.threadId}
          activity={activity}
          onClose={editModal.onClose}
        />
      )}

      {decisionModal.isOpen && appliedDecisionId && (
        <DecisionModal
          id={appliedDecisionId}
          isOpen
          onClose={decisionModal.onClose}
        />
      )}
    </ThreadActivityLayout>
  )
}
