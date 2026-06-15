import MemberAvatar from '@/member/components/MemberAvatar'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Box, BoxProps, Flex, Icon, Tooltip } from '@chakra-ui/react'
import { CircleFragment } from '@gql'
import { ParticipantMember } from '@rolebase/shared/model/member'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CircleParentLinkIcon } from 'src/icons'
import CircleButton from './CircleButton'

interface Props extends BoxProps {
  circle: CircleFragment
  parentCircle: CircleFragment
  participants: ParticipantMember[]
  isInvited?: boolean
}

export default function CircleWithLeaderItem({
  circle,
  parentCircle,
  participants,
  isInvited,
  ...boxProps
}: Props) {
  const { t } = useTranslation()
  const { orgData } = useOrgContext()
  const role = orgData?.getRole(circle.roleId)
  const members = useMemo(
    () =>
      participants
        .filter((p) => p.circlesIds.indexOf(circle.id) !== -1)
        .map((p) => p.member),
    [circle, participants]
  )

  return (
    <Flex alignItems="center" {...boxProps}>
      <CircleButton
        circle={circle}
        parentId={isInvited ? parentCircle.id : undefined}
      />

      {members.length !== 0 && (
        <>
          <Box h="8px" w={1} bg="gray.200" _dark={{ bg: 'whiteAlpha.200' }} />

          {members.map((member) => (
            <MemberAvatar
              key={member.id}
              member={member}
              circleId={circle.id}
              size="sm"
            />
          ))}
        </>
      )}

      {role?.parentLink && (
        <Tooltip
          label={t('CircleWithLeaderItem.linkTooltip', {
            role: orgData?.getRole(parentCircle.roleId)?.name ?? '',
          })}
          placement="top"
          hasArrow
        >
          <Icon as={CircleParentLinkIcon} ml={2} />
        </Tooltip>
      )}
    </Flex>
  )
}
