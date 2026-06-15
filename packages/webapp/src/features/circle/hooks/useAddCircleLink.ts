// Use this hook only in useDbOrgEditActions. Elsewhere, get the action from
// useOrgEditActions() so the active OrgContext implementation applies.
import useCreateLog from '@/log/hooks/useCreateLog'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useCreateCircleLinkMutation } from '@gql'
import { EntityChangeType, LogType } from '@rolebase/shared/model/log'
import { omit } from '@utils/omit'
import { useCallback } from 'react'

export default function useAddCircleLink() {
  const [createCircleLink] = useCreateCircleLinkMutation()
  const createLog = useCreateLog()
  const { getOrgData } = useOrgContext()

  return useCallback(async (parentId: string, circleId: string) => {
    const orgData = getOrgData()
    const parentCircle = orgData?.getCircle(parentId)
    const invitedCircle = orgData?.getCircle(circleId)
    const { data, errors } = await createCircleLink({
      variables: { parentId, circleId, orgId: parentCircle?.orgId! },
    })
    if (errors?.length) throw errors[0]
    const circleLink = data?.insert_circle_link_one!
    createLog({
      display: {
        type: LogType.CircleLinkAdd,
        id: parentId,
        name: orgData?.getRole(parentCircle?.roleId)?.name || '',
        circleId,
        circleName: orgData?.getRole(invitedCircle?.roleId)?.name || '',
      },
      changes: {
        circlesLinks: [
          {
            type: EntityChangeType.Create,
            id: circleLink.id,
            data: omit(circleLink, '__typename'),
          },
        ],
      },
    })
  }, [])
}
