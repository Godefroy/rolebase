import { Button, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { CheckIcon } from 'src/icons'
import { useProposal } from '../contexts/ProposalContext'

// Vote buttons: "I consent"/"I object" for consent, otherwise
// "I approve"/"I abstain" (optional)/"I oppose". Non-voters see a hint.
export default function ProposalVoteButtons() {
  const { t } = useTranslation()
  const { activity, state, vote } = useProposal()
  const { decisionMode, allowAbstain, votersScope } = activity.data
  const isConsent = decisionMode === 'consent'
  const showAbstain = !isConsent && allowAbstain
  const userVote = state.userVote || undefined

  if (!state.isVoter) {
    return (
      <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.300' }}>
        {t(`ThreadActivityProposal.cannotVote_${votersScope}`)}
      </Text>
    )
  }

  return (
    <>
      <Button
        size="sm"
        colorScheme="green"
        variant={userVote?.vote === 'approve' ? 'solid' : 'outline'}
        leftIcon={
          userVote?.vote === 'approve' ? <CheckIcon size={16} /> : undefined
        }
        onClick={() => vote('approve')}
      >
        {isConsent
          ? t('ThreadActivityProposal.consent')
          : t('ThreadActivityProposal.approve')}
      </Button>

      {showAbstain && (
        <Button
          size="sm"
          colorScheme="gray"
          variant={userVote?.vote === 'abstain' ? 'solid' : 'outline'}
          leftIcon={
            userVote?.vote === 'abstain' ? <CheckIcon size={16} /> : undefined
          }
          onClick={() => vote('abstain')}
        >
          {t('ThreadActivityProposal.abstain')}
        </Button>
      )}

      <Button
        size="sm"
        colorScheme="red"
        variant={userVote?.vote === 'object' ? 'solid' : 'outline'}
        leftIcon={
          userVote?.vote === 'object' ? <CheckIcon size={16} /> : undefined
        }
        onClick={() => vote('object')}
      >
        {isConsent
          ? t('ThreadActivityProposal.object')
          : t('ThreadActivityProposal.oppose')}
      </Button>
    </>
  )
}
