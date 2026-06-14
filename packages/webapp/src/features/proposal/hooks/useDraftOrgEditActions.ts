import { OrgEditActions } from '@/org/contexts/OrgEditContext'
import { useOrgId } from '@/org/hooks/useOrgId'
import { CircleFullFragment, RoleFragment, RoleSummaryFragment } from '@gql'
import { getCircleChildren } from '@rolebase/shared/helpers/getCircleChildren'
import { generateId } from '@rolebase/shared/helpers/generateId'
import { getEntityChanges } from '@rolebase/shared/helpers/log/getEntityChanges'
import {
  EntitiesChanges,
  EntityChangeType,
  LogType,
} from '@rolebase/shared/model/log'
import { useMemo } from 'react'
import { ProposalDraft } from './useProposalDraft'

// In-memory implementation of OrgEditActions for the proposal editor.
// Each operation builds the same LogDisplay + EntitiesChanges as the DB hooks,
// applies them to the draft, and appends a log. Nothing hits the database.
export default function useDraftOrgEditActions(
  draft: ProposalDraft
): OrgEditActions {
  const orgId = useOrgId()

  return useMemo<OrgEditActions>(() => {
    const circlesOf = () => draft.orgData.circles || []
    const findCircle = (id: string): CircleFullFragment | undefined =>
      circlesOf().find((c) => c.id === id)

    // Recursively build Create changes for a copied circle subtree
    const buildCopy = (
      circleId: string,
      newParentId: string | null,
      changes: Required<Pick<EntitiesChanges, 'circles' | 'roles'>> & {
        circlesMembers: NonNullable<EntitiesChanges['circlesMembers']>
      }
    ): string | undefined => {
      const circle = findCircle(circleId)
      if (!circle || !orgId) return undefined

      // New role if not a base role
      let roleId = circle.roleId
      if (!circle.role.base) {
        const fullRole = draft
          .getFlat()
          ?.roles.find((r) => r.id === circle.roleId)
        const newRoleId = generateId()
        changes.roles.push({
          type: EntityChangeType.Create,
          id: newRoleId,
          data: { ...(fullRole as RoleFragment), id: newRoleId },
        })
        roleId = newRoleId
      }

      // New circle
      const newCircleId = generateId()
      changes.circles.push({
        type: EntityChangeType.Create,
        id: newCircleId,
        data: { id: newCircleId, orgId, roleId, parentId: newParentId, archived: false },
      })

      // Members
      for (const cm of circle.members) {
        const id = generateId()
        changes.circlesMembers.push({
          type: EntityChangeType.Create,
          id,
          data: {
            id,
            circleId: newCircleId,
            memberId: cm.member.id,
            createdAt: new Date().toISOString(),
            archived: false,
          },
        })
      }

      // Children
      for (const child of circlesOf().filter((c) => c.parentId === circleId)) {
        buildCopy(child.id, newCircleId, changes)
      }

      return newCircleId
    }

    return {
      async moveCircle(circleId, targetCircleId) {
        const circle = findCircle(circleId)
        if (!circle) return
        const target = targetCircleId ? findCircle(targetCircleId) : null
        await draft.applyLog(
          {
            type: LogType.CircleMove,
            id: circleId,
            name: circle.role.name,
            parentId: targetCircleId,
            parentName: target?.role.name || null,
          },
          {
            circles: [
              {
                type: EntityChangeType.Update,
                id: circleId,
                prevData: { parentId: circle.parentId },
                newData: { parentId: targetCircleId },
              },
            ],
          }
        )
      },

      async copyCircle(circleId, targetCircleId) {
        const circle = findCircle(circleId)
        if (!circle) return undefined
        const changes = {
          circles: [],
          roles: [],
          circlesMembers: [],
        } as Required<Pick<EntitiesChanges, 'circles' | 'roles'>> & {
          circlesMembers: NonNullable<EntitiesChanges['circlesMembers']>
        }
        const newCircleId = buildCopy(circleId, targetCircleId, changes)
        if (!newCircleId) return undefined
        const target = targetCircleId ? findCircle(targetCircleId) : null
        await draft.applyLog(
          {
            type: LogType.CircleCreate,
            id: newCircleId,
            name: circle.role.name,
            parentId: targetCircleId,
            parentName: target?.role.name || null,
          },
          changes
        )
        return newCircleId
      },

      async archiveCircle(circleId) {
        const circle = findCircle(circleId)
        if (!circle) return
        const children = getCircleChildren(circlesOf(), circleId)
        const circlesIds = [circleId, ...children.map((c) => c.id)]
        const rolesIds = [circle, ...children]
          .filter((c) => !c.role.base)
          .map((c) => c.role.id)
        await draft.applyLog(
          { type: LogType.CircleArchive, id: circleId, name: circle.role.name },
          {
            circles: circlesIds.map((id) => ({
              type: EntityChangeType.Update,
              id,
              prevData: { archived: false },
              newData: { archived: true },
            })),
            roles: rolesIds.map((id) => ({
              type: EntityChangeType.Update,
              id,
              prevData: { archived: false },
              newData: { archived: true },
            })),
          }
        )
      },

      async createCircle(parentId, roleOrName) {
        if (!orgId) return undefined
        const changes: EntitiesChanges = {}

        // Create role if a name is given
        let role: RoleFragment | RoleSummaryFragment
        if (typeof roleOrName === 'string') {
          const newRole: RoleFragment = {
            id: generateId(),
            orgId,
            archived: false,
            base: false,
            name: roleOrName,
            purpose: '',
            domain: '',
            accountabilities: '',
            checklist: '',
            indicators: '',
            notes: '',
            singleMember: false,
            parentLink: false,
            colorHue: null,
          }
          role = newRole
          changes.roles = [
            { type: EntityChangeType.Create, id: newRole.id, data: newRole },
          ]
        } else {
          role = roleOrName
        }

        const newCircleId = generateId()
        changes.circles = [
          {
            type: EntityChangeType.Create,
            id: newCircleId,
            data: { id: newCircleId, orgId, roleId: role.id, parentId, archived: false },
          },
        ]

        const parentCircle = findCircle(parentId)
        await draft.applyLog(
          {
            type: LogType.CircleCreate,
            id: newCircleId,
            name: role.name,
            parentId,
            parentName: parentCircle?.role.name || null,
          },
          changes
        )
        return newCircleId
      },

      async updateRole(role, values) {
        const { prevData, newData } = getEntityChanges(role, values)
        await draft.applyLog(
          { type: LogType.RoleUpdate, id: role.id, name: role.name },
          {
            roles: [
              { type: EntityChangeType.Update, id: role.id, prevData, newData },
            ],
          }
        )
      },

      async addCircleMember(circleId, memberId) {
        const circle = findCircle(circleId)
        const member = draft.orgData.members?.find((m) => m.id === memberId)
        if (!circle || !member) return
        const id = generateId()
        await draft.applyLog(
          {
            type: LogType.CircleMemberAdd,
            id: circleId,
            name: circle.role.name,
            memberId,
            memberName: member.name,
          },
          {
            circlesMembers: [
              {
                type: EntityChangeType.Create,
                id,
                data: {
                  id,
                  circleId,
                  memberId,
                  createdAt: new Date().toISOString(),
                  archived: false,
                },
              },
            ],
          }
        )
      },

      async removeCircleMember(circleId, memberId) {
        const circle = findCircle(circleId)
        const member = draft.orgData.members?.find((m) => m.id === memberId)
        const circleMember = circle?.members.find(
          (cm) => cm.member.id === memberId
        )
        if (!circle || !member || !circleMember) return
        await draft.applyLog(
          {
            type: LogType.CircleMemberRemove,
            id: circleId,
            name: circle.role.name,
            memberId,
            memberName: member.name,
          },
          {
            circlesMembers: [
              {
                type: EntityChangeType.Update,
                id: circleMember.id,
                prevData: { archived: false },
                newData: { archived: true },
              },
            ],
          }
        )
      },

      async addCircleLink(parentId, circleId) {
        const parentCircle = findCircle(parentId)
        const invitedCircle = findCircle(circleId)
        if (!parentCircle || !invitedCircle) return
        const id = generateId()
        await draft.applyLog(
          {
            type: LogType.CircleLinkAdd,
            id: parentId,
            name: parentCircle.role.name,
            circleId,
            circleName: invitedCircle.role.name,
          },
          {
            circlesLinks: [
              {
                type: EntityChangeType.Create,
                id,
                data: {
                  id,
                  parentId,
                  circleId,
                  createdAt: new Date().toISOString(),
                  archived: false,
                },
              },
            ],
          }
        )
      },

      async removeCircleLink(parentId, circleId) {
        const parentCircle = findCircle(parentId)
        const invitedCircle = findCircle(circleId)
        const link = draft
          .getFlat()
          ?.circleLinks.find(
            (cl) =>
              cl.parentId === parentId && cl.circleId === circleId && !cl.archived
          )
        if (!parentCircle || !invitedCircle || !link) return
        await draft.applyLog(
          {
            type: LogType.CircleLinkRemove,
            id: parentId,
            name: parentCircle.role.name,
            circleId,
            circleName: invitedCircle.role.name,
          },
          {
            circlesLinks: [
              {
                type: EntityChangeType.Update,
                id: link.id,
                prevData: { archived: false },
                newData: { archived: true },
              },
            ],
          }
        )
      },
    }
  }, [draft, orgId])
}
