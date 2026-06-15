import { OrgEditActions, useOrgContext } from '@/org/contexts/OrgContext'
import { CircleFragment, RoleFragment, RoleSummaryFragment } from '@gql'
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
  const { orgId } = useOrgContext()

  return useMemo<OrgEditActions>(() => {
    const getOrg = () => draft.orgData
    const findCircle = (id: string): CircleFragment | undefined =>
      getOrg()?.circleById.get(id)
    const roleName = (circle?: CircleFragment) =>
      (circle && getOrg()?.roleById.get(circle.roleId)?.name) || ''
    const isBaseRole = (circle: CircleFragment) =>
      getOrg()?.roleById.get(circle.roleId)?.base ?? false

    // Recursively build Create changes for a copied circle subtree
    const buildCopy = (
      circleId: string,
      newParentId: string | null,
      changes: Required<Pick<EntitiesChanges, 'circles' | 'roles'>> & {
        circlesMembers: NonNullable<EntitiesChanges['circlesMembers']>
      }
    ): string | undefined => {
      const org = getOrg()
      const circle = org?.circleById.get(circleId)
      if (!circle || !org || !orgId) return undefined

      // New role if not a base role
      let roleId = circle.roleId
      if (!isBaseRole(circle)) {
        const fullRole = draft.getData()
          ?.roles.find((r) => r.id === circle.roleId)
        const newRoleId = generateId()
        // Clone the role summary; text columns default to '' in the database
        changes.roles.push({
          type: EntityChangeType.Create,
          id: newRoleId,
          data: { ...fullRole, id: newRoleId, orgId } as RoleFragment,
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
      for (const cm of org.membersOf(circleId)) {
        const id = generateId()
        changes.circlesMembers.push({
          type: EntityChangeType.Create,
          id,
          data: {
            id,
            orgId,
            circleId: newCircleId,
            memberId: cm.member.id,
            createdAt: new Date().toISOString(),
            archived: false,
          },
        })
      }

      // Children
      for (const child of org.childrenOf(circleId)) {
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
            name: roleName(circle),
            parentId: targetCircleId,
            parentName: target ? roleName(target) : null,
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
            name: roleName(circle),
            parentId: targetCircleId,
            parentName: target ? roleName(target) : null,
          },
          changes
        )
        return newCircleId
      },

      async archiveCircle(circleId) {
        const circle = findCircle(circleId)
        const orgData = draft.orgData
        if (!circle || !orgData) return
        const children = orgData.descendantsOf(circleId)
        const circlesIds = [circleId, ...children.map((c) => c.id)]
        const rolesIds = [circle, ...children]
          .filter((c) => !isBaseRole(c))
          .map((c) => c.roleId)
        await draft.applyLog(
          { type: LogType.CircleArchive, id: circleId, name: roleName(circle) },
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
            parentName: parentCircle ? roleName(parentCircle) : null,
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
        const member = getOrg()?.memberById.get(memberId)
        if (!circle || !member || !orgId) return
        const id = generateId()
        await draft.applyLog(
          {
            type: LogType.CircleMemberAdd,
            id: circleId,
            name: roleName(circle),
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
                  orgId,
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
        const org = getOrg()
        const circle = findCircle(circleId)
        const member = org?.memberById.get(memberId)
        const circleMember = org
          ? org.membersOf(circleId).find((cm) => cm.member.id === memberId)
          : undefined
        if (!circle || !member || !circleMember) return
        await draft.applyLog(
          {
            type: LogType.CircleMemberRemove,
            id: circleId,
            name: roleName(circle),
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
        if (!parentCircle || !invitedCircle || !orgId) return
        const id = generateId()
        await draft.applyLog(
          {
            type: LogType.CircleLinkAdd,
            id: parentId,
            name: roleName(parentCircle),
            circleId,
            circleName: roleName(invitedCircle),
          },
          {
            circlesLinks: [
              {
                type: EntityChangeType.Create,
                id,
                data: {
                  id,
                  orgId,
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
        const link = draft.getData()
          ?.circleLinks.find(
            (cl) =>
              cl.parentId === parentId && cl.circleId === circleId && !cl.archived
          )
        if (!parentCircle || !invitedCircle || !link) return
        await draft.applyLog(
          {
            type: LogType.CircleLinkRemove,
            id: parentId,
            name: roleName(parentCircle),
            circleId,
            circleName: roleName(invitedCircle),
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
