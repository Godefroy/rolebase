import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useProposal } from '../contexts/ProposalContext'
import ProposalManageMenu from './ProposalManageMenu'
import ProposalVoteButtons from './ProposalVoteButtons'

// In-progress proposal: decision mode label, vote buttons, progress and the
// manage menu.
export default function ProposalVoteSection() {
  const { t } = useTranslation()
  const { activity, votes, state, canManage } = useProposal()

  return (
    <Box>
      <Text
        fontSize="sm"
        fontWeight="medium"
        color="gray.500"
        _dark={{ color: 'gray.300' }}
        mb={2}
      >
        {t(`ThreadActivityProposal.voteMode_${activity.data.decisionMode}`)}
      </Text>

      <Flex wrap="wrap" gap={3} justify="space-between" align="center">
        <HStack spacing={3}>
          <ProposalVoteButtons />
          <Text
            fontSize="sm"
            color="gray.500"
            _dark={{ color: 'gray.300' }}
            whiteSpace="nowrap"
          >
            {t('ThreadActivityProposal.voteProgress', {
              count: votes?.length || 0,
              total: state.votersCount,
            })}
          </Text>
        </HStack>

        {canManage && <ProposalManageMenu />}
      </Flex>
    </Box>
  )
}
