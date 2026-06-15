import CircleLink from '@/circle/components/CircleLink'
import MemberLink from '@/member/components/MemberLink'
import { useOrgData } from '@/org/contexts/OrgContext'
import RoleEditLink from '@/role/components/RoleEditLink'
import { LogType } from '@rolebase/shared/model/log'
import { ProposalLog } from '@rolebase/shared/model/proposal'
import React from 'react'
import { Trans } from 'react-i18next'

interface Props {
  log: ProposalLog
  // Read-only when previewed outside the org chart editor
  readOnly?: boolean
}

// Compact, author-less rendering of a prepared org-chart change.
export default function ProposalLogItem({ log, readOnly }: Props) {
  const { display } = log
  const orgData = useOrgData()
  const circles = orgData?.circles
  const i18nPrefix = 'ProposalLog'

  switch (display.type) {
    case LogType.CircleCreate:
    case LogType.CircleMove:
    case LogType.CircleCopy:
      return (
        <Trans
          i18nKey={`${i18nPrefix}.${display.type}`}
          components={{
            circle: <CircleLink id={display.id} name={display.name} />,
            parentCircle:
              display.parentId && display.parentName ? (
                <CircleLink id={display.parentId} name={display.parentName} />
              ) : (
                <></>
              ),
          }}
        />
      )

    case LogType.CircleArchive:
      return (
        <Trans
          i18nKey={`${i18nPrefix}.${display.type}`}
          components={{ circle: <CircleLink id={display.id} name={display.name} /> }}
        />
      )

    case LogType.CircleMemberAdd:
    case LogType.CircleMemberRemove:
      return (
        <Trans
          i18nKey={`${i18nPrefix}.${display.type}`}
          components={{
            member: (
              <MemberLink id={display.memberId} name={display.memberName} />
            ),
            circle: <CircleLink id={display.id} name={display.name} />,
          }}
        />
      )

    case LogType.CircleLinkAdd:
    case LogType.CircleLinkRemove:
      return (
        <Trans
          i18nKey={`${i18nPrefix}.${display.type}`}
          components={{
            circle: <CircleLink id={display.id} name={display.name} />,
            invitedCircle: (
              <CircleLink id={display.circleId} name={display.circleName} />
            ),
          }}
        />
      )

    case LogType.RoleUpdate: {
      // If a single circle uses this role, open that circle (like circle
      // changes) instead of the role edit modal.
      const circlesWithRole =
        circles?.filter((c) => c.roleId === display.id) || []
      const role =
        circlesWithRole.length === 1 ? (
          <CircleLink id={circlesWithRole[0].id} name={display.name} />
        ) : (
          <RoleEditLink
            id={display.id}
            name={display.name}
            readOnly={readOnly}
          />
        )
      return (
        <Trans i18nKey={`${i18nPrefix}.${display.type}`} components={{ role }} />
      )
    }

    default:
      return <>{display.type}</>
  }
}
