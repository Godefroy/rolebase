import CircleMemberLink from '@/circle/components/CircleMemberLink'
import DashboardMyInfosItem from '@/dashboard/components/DashboardMyInfosItem'
import MemberButton from '@/member/components/MemberButton'
import MemberRoles from '@/member/components/MemberRoles'
import useCurrentMember from '@/member/hooks/useCurrentMember'
import { useStoreState } from '@store/hooks'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function DashboardMyRoles() {
  const { t } = useTranslation()
  const member = useCurrentMember()
  const circles = useStoreState((state) => state.org.circles)

  if (!member || circles?.length === 1) return null

  return (
    <DashboardMyInfosItem
      title={t('DashboardMyRoles.title')}
      actions={
        <CircleMemberLink memberId={member.id} tabIndex={-1}>
          <MemberButton member={member} size="sm" variant="outline" />
        </CircleMemberLink>
      }
    >
      <MemberRoles member={member} hideActions mx={1} mt={4} />
    </DashboardMyInfosItem>
  )
}
