import { CircleMemberContext } from '@/circle/contexts/CircleMemberContext'
import { getCircleMemberUrlSearch } from '@/circle/contexts/CircleMemberProvider'
import { useNormalClickHandler } from '@/common/hooks/useNormalClickHandler'
import { useCallback, useContext, useMemo } from 'react'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { usePathInOrg } from '../../org/hooks/usePathInOrg'

export default function useCircleMemberLink(
  circleId?: string,
  memberId?: string,
  parentId?: string
) {
  const { orgId } = useOrgContext()
  const circleMemberContext = useContext(CircleMemberContext)
  const path = usePathInOrg('roles')

  const goToCircle = useCallback(() => {
    circleMemberContext?.goTo(circleId, memberId, parentId)
  }, [circleId, memberId, parentId, circleMemberContext])

  const handleClick = useNormalClickHandler(goToCircle)

  return useMemo(
    () => ({
      to: `${path}${getCircleMemberUrlSearch(circleId, memberId, parentId)}`,
      onClick: handleClick,
    }),
    [circleId, memberId, parentId, orgId, handleClick]
  )
}
