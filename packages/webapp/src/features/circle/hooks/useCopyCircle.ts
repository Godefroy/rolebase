// Use this hook only in useDbOrgEditActions. Elsewhere, get the action from
// useOrgEditActions() so the active OrgContext implementation applies.
import useCreateLog from '@/log/hooks/useCreateLog'
import { useOrgContext } from '@/org/contexts/OrgContext'
import { Circle_Insert_Input, useCreateCirclesMutation } from '@gql'
import { OrgData } from '@rolebase/shared/model/OrgData'
import {
  EntitiesChanges,
  EntityChangeType,
  LogType,
} from '@rolebase/shared/model/log'
import { omit } from '@utils/omit'
import { useCallback } from 'react'

function getCircleAndChildren(
  org: OrgData,
  circleId: string
): Circle_Insert_Input | undefined {
  const circle = org.circleById.get(circleId)
  if (!circle) return
  const role = org.roleById.get(circle.roleId)

  // New circle
  const input: Circle_Insert_Input = { orgId: circle.orgId }

  if (role?.base) {
    input.roleId = circle.roleId
  } else if (role) {
    // New role
    input.role = {
      data: {
        name: role.name,
        singleMember: role.singleMember,
        parentLink: role.parentLink,
        colorHue: role.colorHue,
        orgId: circle.orgId,
      },
    }
  }

  // Add children
  const children = org
    .childrenOf(circleId)
    .map((c) => getCircleAndChildren(org, c.id))
    .filter(Boolean) as Circle_Insert_Input[]

  if (children.length) {
    input.children = {
      data: children,
    }
  }

  // Add members
  const members = org.membersOf(circleId)
  if (members.length) {
    input.members = {
      data: members.map((cm) => ({
        memberId: cm.member.id,
        orgId: circle.orgId,
      })),
    }
  }
  return input
}

export default function useCopyCircle() {
  const [createCircles] = useCreateCirclesMutation()
  const createLog = useCreateLog()
  const { getOrgData } = useOrgContext()

  return useCallback(
    async (circleId: string, targetCircleId: string | null) => {
      const orgData = getOrgData()
      if (!orgData) return

      // Prepare data for circles, roles and circle_members insertion
      const circlesInput = getCircleAndChildren(orgData, circleId)
      if (!circlesInput) return
      circlesInput.parentId = targetCircleId

      // Create new circles
      const { data, errors } = await createCircles({
        variables: {
          circles: circlesInput,
        },
      })
      const newCircles = data?.insert_circle?.returning
      if (errors || !newCircles) throw errors?.[0]

      // Log changes
      const copiedCircle = orgData.circleById.get(circleId)
      const targetCircle = targetCircleId
        ? orgData.circleById.get(targetCircleId)
        : undefined
      if (!copiedCircle) return

      // Build changes
      const changes: EntitiesChanges = { circles: [], roles: [] }

      for (const circle of newCircles) {
        changes.circles?.push({
          type: EntityChangeType.Create,
          id: circle.id,
          data: { ...omit(circle, '__typename', 'role') },
        })
        if (!circle.role.base) {
          changes.roles?.push({
            type: EntityChangeType.Create,
            id: circle.role.id,
            data: omit(circle.role, '__typename'),
          })
        }
      }

      createLog({
        display: {
          type: LogType.CircleCreate,
          id: newCircles[0].id,
          name: newCircles[0].role.name,
          parentId: targetCircleId,
          parentName: targetCircle
            ? orgData.roleById.get(targetCircle.roleId)?.name || null
            : null,
        },
        changes,
      })

      return newCircles[0].id
    },
    [getOrgData, createCircles, createLog]
  )
}
