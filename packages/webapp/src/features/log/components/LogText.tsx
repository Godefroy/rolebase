import CircleLink from '@/circle/components/CircleLink'
import MemberLink from '@/member/components/MemberLink'
import RoleEditLink from '@/role/components/RoleEditLink'
import { LogFragment } from '@gql'
import { LogType } from '@rolebase/shared/model/log'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

interface Props {
  log: LogFragment
}

export default function LogText({ log }: Props) {
  const { t } = useTranslation()
  const memberId = log.cancelMemberId || log.memberId
  const memberName = log.cancelMemberName || log.memberName
  const type = log.display.type
  const i18nPrefix = 'LogText'

  const author = <MemberLink id={memberId} name={memberName} />

  switch (type) {
    case LogType.CircleCreate:
    case LogType.CircleMove:
    case LogType.CircleCopy:
      return (
        <Trans
          i18nKey={`${i18nPrefix}.${type}`}
          components={{
            author,
            circle: <CircleLink id={log.display.id} name={log.display.name} />,
            parentCircle:
              log.display.parentId && log.display.parentName ? (
                <CircleLink
                  id={log.display.parentId}
                  name={log.display.parentName}
                />
              ) : (
                <>{t(`${i18nPrefix}.circleRoot`)}</>
              ),
          }}
        />
      )

    case LogType.CircleArchive:
      return (
        <Trans
          i18nKey={`${i18nPrefix}.${type}`}
          components={{
            author,
            circle: <CircleLink id={log.display.id} name={log.display.name} />,
          }}
        />
      )

    case LogType.CircleMemberAdd:
    case LogType.CircleMemberRemove:
      return (
        <Trans
          i18nKey={`${i18nPrefix}.${type}`}
          components={{
            author,
            member: (
              <MemberLink
                id={log.display.memberId}
                name={log.display.memberName}
              />
            ),
            circle: <CircleLink id={log.display.id} name={log.display.name} />,
          }}
        />
      )

    case LogType.CircleLinkAdd:
    case LogType.CircleLinkRemove:
      return (
        <Trans
          i18nKey={`${i18nPrefix}.${type}`}
          components={{
            author,
            circle: <CircleLink id={log.display.id} name={log.display.name} />,
            invitedCircle: (
              <CircleLink
                id={log.display.circleId}
                name={log.display.circleName}
              />
            ),
          }}
        />
      )

    case LogType.RoleCreate:
    case LogType.RoleUpdate:
    case LogType.RoleArchive:
      return (
        <Trans
          i18nKey={`${i18nPrefix}.${type}`}
          components={{
            author,
            role: <RoleEditLink id={log.display.id} name={log.display.name} />,
          }}
        />
      )

    default:
      console.warn(`Log type ${type} is not supported`)
      return type
  }
}
