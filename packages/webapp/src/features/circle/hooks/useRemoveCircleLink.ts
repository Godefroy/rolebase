// Use this hook only in useDbOrgEditActions. Elsewhere, get the action from
// useOrgEditActions() so the active OrgContext implementation applies.
import useCreateLog from '@/log/hooks/useCreateLog'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useArchiveCircleLinkMutation } from '@gql'
import { EntityChangeType, LogType } from '@rolebase/shared/model/log'
import { useCallback } from 'react'

export default function useRemoveCircleLink() {
  const [archiveCircleLink] = useArchiveCircleLinkMutation()
  const createLog = useCreateLog()
  const { getOrgData } = useOrgContext()

  return useCallback(async (parentId: string, circleId: string) => {
    const { data, errors } = await archiveCircleLink({
      variables: { parentId, circleId },
    })
    if (errors?.length) throw errors[0]
    const circleLink = data?.update_circle_link?.returning[0]
    if (!circleLink) return

    // Log change
    const orgData = getOrgData()
    const parentCircle = orgData?.getCircle(parentId)
    const invitedCircle = orgData?.getCircle(circleId)
    createLog({
      display: {
        type: LogType.CircleLinkRemove,
        id: parentId,
        name: orgData?.getRole(parentCircle?.roleId)?.name || '',
        circleId,
        circleName: orgData?.getRole(invitedCircle?.roleId)?.name || '',
      },
      changes: {
        circlesLinks: [
          {
            type: EntityChangeType.Update,
            id: circleLink.id,
            prevData: { archived: false },
            newData: { archived: true },
          },
        ],
      },
    })
  }, [])
}
