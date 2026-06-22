import { OrgEditActions, useOrgContext } from '@/org/contexts/OrgContext'
import { CircleFragment, RoleFragment, RoleSummaryFragment } from '@gql'
import { generateId } from '@rolebase/shared/helpers/generateId'
import { getEntityChanges } from '@rolebase/shared/helpers/log/getEntityChanges'
import {
  EntitiesChanges,
  EntityChangeType,
  LogType,
} from '@rolebase/shared/model/log'
import { ProposalLog } from '@rolebase/shared/model/proposal'
import { useMemo } from 'react'
import { ProposalDraft } from './useProposalDraft'

// Whether an entity was created (not merely edited) within the proposal logs
function isCreated(
  logs: ProposalLog[],
  type: keyof EntitiesChanges,
  id: string
): boolean {
  return logs.some((log) =>
    log.changes[type]?.some(
      (change) => change.type === EntityChangeType.Create && change.id === id
    )
  )
}

// In-memory implementation of OrgEditActions for the proposal editor.
// Each operation builds the same LogDisplay + EntitiesChanges as the DB hooks,
// applies them to the draft, and appends a log. Nothing hits the database.
export default function useDraftOrgEditActions(
  draft: ProposalDraft
): OrgEditActions {
  const { orgId } = useOrgContext()

  return useMemo<OrgEditActions>(() => {
    // Always read the live indexed view (not the render snapshot) so chained
    // edits within one tick — and edits triggered from stale closures such as
    // the graph's captured handlers — operate on up-to-date data.
    const getOrg = () => draft.getOrgData()
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
        data: { id: newCircleId, orgId, roleId, parentId: newParentId, archivedAt: null },
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
            archivedAt: null,
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
        const orgData = draft.getOrgData()
        if (!circle || !orgData) return
        const children = orgData.descendantsOf(circleId)
        const circlesIds = [circleId, ...children.map((c) => c.id)]
        const rolesIds = [circle, ...children]
          .filter((c) => !isBaseRole(c))
          .map((c) => c.roleId)

        // Circles/roles of the subtree created within this proposal: their
        // creation is cancelled (logs removed) instead of being archived.
        const logs = draft.getLogs()
        const created = new Set(
          circlesIds.filter((id) => isCreated(logs, 'circles', id))
        )
        const createdRoles = new Set(
          rolesIds.filter((id) => isCreated(logs, 'roles', id))
        )
        // Non-base roles of the subtree: their pending edits become pointless
        const roleIds = new Set(rolesIds)

        // Remove the logs that created those entities (and the members/links
        // attached to a cancelled circle), as well as pending updates of the
        // archived roles.
        for (const log of logs) {
          const concerned =
            (log.display.type === LogType.RoleUpdate &&
              roleIds.has(log.display.id)) ||
            log.changes.circles?.some(
              (c) => c.type === EntityChangeType.Create && created.has(c.id)
            ) ||
            log.changes.roles?.some(
              (c) => c.type === EntityChangeType.Create && createdRoles.has(c.id)
            ) ||
            log.changes.circlesMembers?.some(
              (c) =>
                c.type === EntityChangeType.Create && created.has(c.data.circleId)
            ) ||
            log.changes.circlesLinks?.some(
              (c) =>
                c.type === EntityChangeType.Create &&
                (created.has(c.data.circleId) || created.has(c.data.parentId))
            )
          if (concerned) await draft.removeLog(log.id)
        }

        // Archive whatever pre-existed
        const archiveCircleIds = circlesIds.filter((id) => !created.has(id))
        const archiveRoleIds = rolesIds.filter((id) => !createdRoles.has(id))
        if (archiveCircleIds.length || archiveRoleIds.length) {
          await draft.applyLog(
            { type: LogType.CircleArchive, id: circleId, name: roleName(circle) },
            {
              circles: archiveCircleIds.map((id) => ({
                type: EntityChangeType.Update,
                id,
                prevData: { archivedAt: null },
                newData: { archivedAt: new Date().toISOString() },
              })),
              roles: archiveRoleIds.map((id) => ({
                type: EntityChangeType.Update,
                id,
                prevData: { archivedAt: null },
                newData: { archivedAt: new Date().toISOString() },
              })),
            }
          )
        }
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
            archivedAt: null,
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
            data: { id: newCircleId, orgId, roleId: role.id, parentId, archivedAt: null },
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
        let { prevData, newData } = getEntityChanges(role, values)
        if (Object.keys(prevData).length === 0 && Object.keys(newData).length === 0) {
          return
        }

        // Role created within this proposal: fold the edit into its creation
        // log so the role stays described by a single log.
        const logs = draft.getLogs()
        const createLog = logs.find((log) =>
          log.changes.roles?.some(
            (c) => c.type === EntityChangeType.Create && c.id === role.id
          )
        )
        if (createLog) {
          await draft.replaceLog(createLog.id, {
            ...createLog.changes,
            roles: (createLog.changes.roles ?? []).map((c) =>
              c.type === EntityChangeType.Create && c.id === role.id
                ? { ...c, data: { ...c.data, ...newData } }
                : c
            ),
          })
          return
        }

        // Otherwise keep a single RoleUpdate log: merge with an existing one
        // (original prevData, latest newData) and move it to the end.
        const updateLog = logs.find(
          (l) => l.display.type === LogType.RoleUpdate && l.display.id === role.id
        )
        if (updateLog) {
          const existing = updateLog.changes.roles?.find(
            (c) => c.type === EntityChangeType.Update && c.id === role.id
          )
          if (existing?.type === EntityChangeType.Update) {
            prevData = { ...prevData, ...existing.prevData }
            newData = { ...existing.newData, ...newData }
            // Drop fields edited back to their original value
            for (const key of Object.keys(newData) as (keyof RoleFragment)[]) {
              if (prevData[key] === newData[key]) {
                delete prevData[key]
                delete newData[key]
              }
            }
          }
          await draft.removeLog(updateLog.id)
        }

        // Nothing left (a full revert): the removal above is the whole change
        if (Object.keys(newData).length === 0) return

        await draft.applyLog(
          { type: LogType.RoleUpdate, id: role.id, name: role.name },
          {
            roles: [
              { type: EntityChangeType.Update, id: role.id, prevData, newData },
            ],
          }
        )
      },

      // Members are readonly in a proposal draft: a proposal changes the org
      // chart, not member profiles.
      async updateMember() {},
      async createMember() {
        return undefined
      },
      async archiveMember() {},
      async restoreMember() {},

      async addCircleMember(circleId, memberId) {
        const org = getOrg()
        const circle = findCircle(circleId)
        const member = org?.memberById.get(memberId)
        if (!org || !circle || !member || !orgId) return
        // Already a member of this circle: nothing to do (avoid duplicates).
        if (org.membersOf(circleId).some((cm) => cm.member.id === memberId))
          return
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
                  archivedAt: null,
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

        // Added within this proposal: drop the log that created it
        const createLog = draft.getLogs().find((log) =>
          log.changes.circlesMembers?.some(
            (c) => c.type === EntityChangeType.Create && c.id === circleMember.id
          )
        )
        if (createLog) {
          await draft.removeLog(createLog.id)
          return
        }

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
                prevData: { archivedAt: null },
                newData: { archivedAt: new Date().toISOString() },
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
                  archivedAt: null,
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
              cl.parentId === parentId &&
              cl.circleId === circleId &&
              cl.archivedAt == null
          )
        if (!parentCircle || !invitedCircle || !link) return

        // Added within this proposal: drop the log that created it
        const createLog = draft.getLogs().find((log) =>
          log.changes.circlesLinks?.some(
            (c) => c.type === EntityChangeType.Create && c.id === link.id
          )
        )
        if (createLog) {
          await draft.removeLog(createLog.id)
          return
        }

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
                prevData: { archivedAt: null },
                newData: { archivedAt: new Date().toISOString() },
              },
            ],
          }
        )
      },
    }
  }, [draft, orgId])
}
