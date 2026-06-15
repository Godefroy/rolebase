// Use this hook only in useDbOrgEditActions. Elsewhere, get the action from
// useOrgEditActions() so the active OrgContext implementation applies.
import useCreateLog from '@/log/hooks/useCreateLog'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { useCreateCircleMemberMutation } from '@gql'
import { EntityChangeType, LogType } from '@rolebase/shared/model/log'
import { omit } from '@utils/omit'
import { useCallback } from 'react'

export default function useAddCircleMember() {
  const [createCircleMember] = useCreateCircleMemberMutation()
  const createLog = useCreateLog()
  const { getOrgData } = useOrgContext()

  return useCallback(async (circleId: string, memberId: string) => {
    const orgId = getOrgData()?.getCircle(circleId)?.orgId
    const { data, errors } = await createCircleMember({
      variables: { memberId, circleId, orgId: orgId! },
    })
    if (errors?.length) throw errors[0]
    const circleMember = data?.insert_circle_member_one!

    // Log change
    createLog({
      display: {
        type: LogType.CircleMemberAdd,
        id: circleMember.circleId,
        name: circleMember.circle.role.name,
        memberId: circleMember.member.id,
        memberName: circleMember.member.name,
      },
      changes: {
        circlesMembers: [
          {
            type: EntityChangeType.Create,
            id: circleMember.id,
            data: omit(circleMember, 'circle', 'member'),
          },
        ],
      },
    })
  }, [])
}
