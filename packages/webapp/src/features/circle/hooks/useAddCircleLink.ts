import useCreateLog from '@/log/hooks/useCreateLog'
import { useCreateCircleLinkMutation } from '@gql'
import { EntityChangeType, LogType } from '@rolebase/shared/model/log'
import { store } from '@store/index'
import { omit } from '@utils/omit'
import { useCallback } from 'react'

export default function useAddCircleLink() {
  const [createCircleLink] = useCreateCircleLinkMutation()
  const createLog = useCreateLog()

  return useCallback(async (parentId: string, circleId: string) => {
    const { data, errors } = await createCircleLink({
      variables: { parentId, circleId },
    })
    if (errors?.length) throw errors[0]
    const circleLink = data?.insert_circle_link_one!

    // Log change
    const { circles } = store.getState().org
    const parentCircle = circles?.find((c) => c.id === parentId)
    const invitedCircle = circles?.find((c) => c.id === circleId)
    createLog({
      display: {
        type: LogType.CircleLinkAdd,
        id: parentId,
        name: parentCircle?.role.name || '',
        circleId,
        circleName: invitedCircle?.role.name || '',
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
