import { ThreadActivityProposalFragment } from '@rolebase/shared/model/thread_activity'
import React from 'react'
import { ProposalProvider } from '../contexts/ProposalContext'
import ProposalCard from './ProposalCard'

interface Props {
  activity: ThreadActivityProposalFragment
}

export default function ThreadActivityProposal({ activity }: Props) {
  return (
    <ProposalProvider activity={activity}>
      <ProposalCard />
    </ProposalProvider>
  )
}
