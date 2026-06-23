import { ExpandableText } from '@/common/atoms/ExpandableText'
import Markdown from '@/common/atoms/Markdown'
import DecisionItem from '@/decision/components/DecisionItem'
import { LinkBoxProps } from '@chakra-ui/react'
import { DecisionFragment } from '@gql'
import React from 'react'
import NewsItemLayout from './NewsItemLayout'

interface Props extends LinkBoxProps {
  decision: DecisionFragment
}

export default function NewsDecision({ decision }: Props) {
  return (
    <NewsItemLayout
      i18nKey="DashboardNewsDecision.action"
      date={decision.createdAt}
      memberId={decision.memberId}
      circleId={decision.circleId}
    >
      <DecisionItem
        decision={decision}
        openButton
        showIcon
        fontWeight="medium"
        my={3}
      />

      {decision?.description && (
        <ExpandableText p={2} pt={0} noOfLines={4}>
          <Markdown>{decision?.description || ''}</Markdown>
        </ExpandableText>
      )}
    </NewsItemLayout>
  )
}
