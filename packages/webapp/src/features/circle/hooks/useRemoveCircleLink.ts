import useCreateLog from '@/log/hooks/useCreateLog'
import { useArchiveCircleLinkMutation } from '@gql'
import { EntityChangeType, LogType } from '@rolebase/shared/model/log'
import { store } from '@store/index'
import { useCallback } from 'react'

export default function useRemoveCircleLink() {
  const [archiveCircleLink] = useArchiveCircleLinkMutation()
  const createLog = useCreateLog()

  return useCallback(async (parentId: string, circleId: string) => {
    const { data, errors } = await archiveCircleLink({
      variables: { parentId, circleId },
    })
    if (errors?.length) throw errors[0]
    const circleLink = data?.update_circle_link?.returning[0]
    if (!circleLink) return

    // Log change
    const { circles } = store.getState().org
    const parentCircle = circles?.find((c) => c.id === parentId)
    const invitedCircle = circles?.find((c) => c.id === circleId)
    createLog({
      display: {
        type: LogType.CircleLinkRemove,
        id: parentId,
        name: parentCircle?.role.name || '',
        circleId,
        circleName: invitedCircle?.role.name || '',
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
