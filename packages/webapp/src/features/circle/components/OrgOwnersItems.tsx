import MemberMenuItem from '@/member/components/MemberMenuItem'
import { Button, Collapse, useDisclosure } from '@chakra-ui/react'
import { MemberFragment } from '@gql'
import { ParticipantMember } from '@rolebase/shared/model/member'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon, ChevronUpIcon } from 'src/icons'
import CircleMemberLink from './CircleMemberLink'

interface Props {
  members?: MemberFragment[]
  excludeParticipants?: ParticipantMember[]
}

// Collapsible list of the organization's owners, who can act on any circle.
// Owners already shown as participants are excluded to avoid duplicates.
export default function OrgOwnersItems({ members, excludeParticipants }: Props) {
  const { t } = useTranslation()
  const expand = useDisclosure()

  const owners = useMemo(
    () =>
      members?.filter(
        (m) => !excludeParticipants?.find((p) => m.id === p.member.id)
      ),
    [members, excludeParticipants]
  )
  if (!owners?.length) return null

  return (
    <>
      <Button
        rightIcon={
          expand.isOpen ? (
            <ChevronUpIcon size="1em" />
          ) : (
            <ChevronDownIcon size="1em" />
          )
        }
        size="sm"
        variant="ghost"
        w="100%"
        fontWeight="normal"
        onClick={expand.onToggle}
      >
        {t('CirclePrivacy.ownersShowMore', { count: owners.length })}
      </Button>
      <Collapse in={expand.isOpen} animateOpacity>
        {owners?.map((member) => (
          <CircleMemberLink key={member.id} memberId={member.id}>
            <MemberMenuItem
              member={member}
              description={t('CirclePrivacy.roleOwner')}
            />
          </CircleMemberLink>
        ))}
      </Collapse>
    </>
  )
}
