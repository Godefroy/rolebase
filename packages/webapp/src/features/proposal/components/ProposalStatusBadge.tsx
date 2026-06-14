import { Badge } from '@chakra-ui/react'
import { ProposalStatus } from '@rolebase/shared/model/proposal'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  status: ProposalStatus
}

const colorScheme: Record<ProposalStatus, string> = {
  inProgress: 'blue',
  approved: 'green',
  refused: 'red',
  canceled: 'gray',
}

export default function ProposalStatusBadge({ status }: Props) {
  const { t } = useTranslation()
  return (
    <Badge colorScheme={colorScheme[status]}>
      {t(`ThreadActivityProposal.status_${status}`)}
    </Badge>
  )
}
