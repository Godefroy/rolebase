import DecisionModal from '@/decision/modals/DecisionModal'
import { ThreadContext } from '@/thread/contexts/ThreadContext'
import ThreadActivityLayout from '@/thread/components/ThreadActivityLayout'
import { scrollAndHighlightActivity } from '@/thread/utils/scrollAndHighlightActivity'
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { ThreadActivityDataProposal } from '@rolebase/shared/model/proposal'
import { ThreadActivityProposalEventFragment } from '@rolebase/shared/model/thread_activity'
import React, { useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { DecisionsIcon } from 'src/icons'
import ProposalVotersModal from '../modals/ProposalVotersModal'
import ProposalRecreateButton from './ProposalRecreateButton'
import VoteCountBadge from './VoteCountBadge'

interface Props {
  activity: ThreadActivityProposalEventFragment
}

export default function ThreadActivityProposalEvent({ activity }: Props) {
  const { t } = useTranslation()
  const { activities } = useContext(ThreadContext)!
  const {
    event,
    proposalActivityId,
    status,
    decisionMode,
    votes,
    showVoters,
    decisionId,
  } = activity.data

  const votersModal = useDisclosure()
  const decisionModal = useDisclosure()
  const [votersTab, setVotersTab] = useState(0)

  const openVoters = (tab: number) => {
    setVotersTab(tab)
    votersModal.onOpen()
  }

  // Linked proposal (to scroll + highlight it, and recreate it)
  const proposalActivity = activities?.find((a) => a.id === proposalActivityId)
  const proposalData = proposalActivity?.data as
    | ThreadActivityDataProposal
    | undefined
  const proposalTitle = proposalData?.title

  // Non-resolution events (reminder, edit, cancellation): a single muted line
  // with a link to the proposal. Can be deleted by its author or an admin.
  if (event !== 'resolution') {
    return (
      <ThreadActivityLayout activity={activity} allowDelete>
        <Text color="gray.500" _dark={{ color: 'gray.300' }}>
          <Trans
            i18nKey={`ThreadActivityProposalEvent.${event}`}
            values={{ title: proposalTitle || '' }}
            components={{
              proposal: (
                <Link
                  textDecoration="underline"
                  onClick={() => scrollAndHighlightActivity(proposalActivityId)}
                />
              ),
            }}
          />
        </Text>
      </ThreadActivityLayout>
    )
  }

  const approveCount = votes?.filter((v) => v.vote === 'approve').length || 0
  const objectCount = votes?.filter((v) => v.vote === 'object').length || 0
  const abstainCount = votes?.filter((v) => v.vote === 'abstain').length || 0

  return (
    <ThreadActivityLayout activity={activity}>
      {status && (
        <Text color="gray.500" _dark={{ color: 'gray.300' }}>
          <Trans
            i18nKey={`ThreadActivityProposalEvent.result_${status}`}
            values={{ title: proposalTitle || '' }}
            components={{
              proposal: (
                <Link
                  textDecoration="underline"
                  onClick={() => scrollAndHighlightActivity(proposalActivityId)}
                />
              ),
            }}
          />
        </Text>
      )}

      <Card mt={2} variant="activity">
        <CardBody>
          <Flex align="center" gap={2} mb={3}>
            <Heading size="sm" flex="1" lineHeight="short">
              {proposalTitle || t('ThreadActivityProposalEvent.proposal')}
            </Heading>
            {status && (
              <Badge colorScheme={status === 'approved' ? 'green' : 'red'}>
                {t(`ThreadActivityProposal.status_${status}`)}
              </Badge>
            )}
          </Flex>

          {decisionMode && (
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="gray.500"
              _dark={{ color: 'gray.300' }}
              mt={3}
              mb={2}
            >
              {t(`ThreadActivityProposal.voteMode_${decisionMode}`)} :
            </Text>
          )}

          {votes && votes.length > 0 && (
            <HStack spacing={2}>
              <VoteCountBadge
                colorScheme="green"
                count={approveCount}
                label={t('ThreadActivityProposalEvent.yes')}
                onClick={showVoters ? () => openVoters(1) : undefined}
              />
              {abstainCount > 0 && (
                <VoteCountBadge
                  colorScheme="gray"
                  count={abstainCount}
                  label={t('ThreadActivityProposalEvent.abstain')}
                  onClick={showVoters ? () => openVoters(3) : undefined}
                />
              )}
              <VoteCountBadge
                colorScheme="red"
                count={objectCount}
                label={t('ThreadActivityProposalEvent.no')}
                onClick={showVoters ? () => openVoters(2) : undefined}
              />
            </HStack>
          )}

          {decisionId && (
            <Box mt={3}>
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

          {status === 'refused' && proposalData && (
            <Flex justify="flex-end" mt={4}>
              <ProposalRecreateButton
                threadId={activity.threadId}
                data={proposalData}
              />
            </Flex>
          )}
        </CardBody>
      </Card>

      {votersModal.isOpen && (
        <ProposalVotersModal
          isOpen
          votes={votes || []}
          initialTab={votersTab}
          onClose={votersModal.onClose}
        />
      )}

      {decisionModal.isOpen && decisionId && (
        <DecisionModal
          id={decisionId}
          isOpen
          onClose={decisionModal.onClose}
        />
      )}
    </ThreadActivityLayout>
  )
}
