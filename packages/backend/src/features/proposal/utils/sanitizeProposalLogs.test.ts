import { EntityChangeType, LogType } from '@rolebase/shared/model/log'
import { describe, expect, it } from 'vitest'
import {
  ProposalExistingEntities,
  ProposalValidationError,
  collectProposalRefs,
  sanitizeProposalLogs,
} from './sanitizeProposalLogs'

const orgId = '00000000-0000-4000-8000-000000000001'
const otherOrgId = '00000000-0000-4000-8000-000000000002'
const rootId = '10000000-0000-4000-8000-000000000001'
const circleId = '10000000-0000-4000-8000-000000000002'
const foreignCircleId = '10000000-0000-4000-8000-000000000003'
const roleId = '20000000-0000-4000-8000-000000000001'
const baseRoleId = '20000000-0000-4000-8000-000000000002'
const foreignRoleId = '20000000-0000-4000-8000-000000000003'
const memberId = '30000000-0000-4000-8000-000000000001'
const newRoleId = '40000000-0000-4000-8000-000000000001'
const newCircleId = '40000000-0000-4000-8000-000000000002'
const newCircleMemberId = '40000000-0000-4000-8000-000000000003'

const existing: ProposalExistingEntities = {
  roles: new Map([
    [roleId, { orgId, base: false, hasCircle: true }],
    [baseRoleId, { orgId, base: true, hasCircle: true }],
    [foreignRoleId, { orgId: otherOrgId, base: false, hasCircle: true }],
  ]),
  circles: new Map([
    [rootId, { orgId, parentId: null }],
    [circleId, { orgId, parentId: rootId }],
    [foreignCircleId, { orgId: otherOrgId, parentId: null }],
  ]),
  circlesMembers: new Map(),
  circlesLinks: new Map(),
  members: new Map([[memberId, { orgId, archivedAt: null }]]),
}

const display = { type: LogType.RoleUpdate, id: roleId, name: 'Role' }

function log(changes: any, logDisplay: any = display) {
  return [{ id: 'log', display: logDisplay, changes }]
}

function sanitize(logs: unknown) {
  return sanitizeProposalLogs(logs, orgId, existing)
}

describe('sanitizeProposalLogs', () => {
  it('keeps a legitimate role update', () => {
    const result = sanitize(
      log({
        roles: [
          {
            type: EntityChangeType.Update,
            id: roleId,
            prevData: { purpose: '' },
            newData: { purpose: 'New purpose' },
          },
        ],
      })
    )
    expect(result[0].changes.roles).toEqual([
      {
        type: EntityChangeType.Update,
        id: roleId,
        prevData: { purpose: '' },
        newData: { purpose: 'New purpose' },
      },
    ])
  })

  it('strips columns a proposal cannot change', () => {
    const result = sanitize(
      log({
        roles: [
          {
            type: EntityChangeType.Update,
            id: roleId,
            prevData: {},
            newData: { name: 'Renamed', base: true, foo: 'bar' },
          },
        ],
      })
    )
    expect(result[0].changes.roles?.[0]).toMatchObject({
      newData: { name: 'Renamed' },
    })
  })

  it('refuses an update of another org entity', () => {
    expect(() =>
      sanitize(
        log({
          roles: [
            {
              type: EntityChangeType.Update,
              id: foreignRoleId,
              prevData: {},
              newData: { purpose: 'x' },
            },
          ],
        })
      )
    ).toThrow(ProposalValidationError)
  })

  it('refuses an archive of another org circle', () => {
    expect(() =>
      sanitize(
        log({
          circles: [
            { type: EntityChangeType.Delete, id: foreignCircleId, data: {} },
          ],
        })
      )
    ).toThrow(ProposalValidationError)
    expect(() =>
      sanitize(
        log({}, { type: LogType.CircleArchive, id: foreignCircleId, name: 'x' })
      )
    ).toThrow(ProposalValidationError)
  })

  it('refuses to move a role to another org', () => {
    expect(() =>
      sanitize(
        log({
          roles: [
            {
              type: EntityChangeType.Update,
              id: roleId,
              prevData: {},
              newData: { orgId: otherOrgId },
            },
          ],
        })
      )
    ).toThrow(ProposalValidationError)
  })

  it('refuses to reparent under another org circle', () => {
    expect(() =>
      sanitize(
        log({
          circles: [
            {
              type: EntityChangeType.Update,
              id: circleId,
              prevData: { parentId: rootId },
              newData: { parentId: foreignCircleId },
            },
          ],
        })
      )
    ).toThrow(ProposalValidationError)
  })

  it('refuses to archive the root circle', () => {
    expect(() =>
      sanitize(
        log({
          circles: [{ type: EntityChangeType.Delete, id: rootId, data: {} }],
        })
      )
    ).toThrow(ProposalValidationError)
  })

  it('forces the org on created entities and checks their references', () => {
    const result = sanitize(
      log({
        roles: [
          {
            type: EntityChangeType.Create,
            id: newRoleId,
            data: { id: newRoleId, orgId, name: 'New', base: true },
          },
        ],
        circles: [
          {
            type: EntityChangeType.Create,
            id: newCircleId,
            data: {
              id: newCircleId,
              orgId,
              roleId: newRoleId,
              parentId: circleId,
              archivedAt: null,
            },
          },
        ],
        circlesMembers: [
          {
            type: EntityChangeType.Create,
            id: newCircleMemberId,
            data: {
              id: newCircleMemberId,
              orgId,
              circleId: newCircleId,
              memberId,
            },
          },
        ],
      })
    )
    expect(result[0].changes.roles?.[0]).toMatchObject({
      data: { id: newRoleId, orgId, name: 'New', base: false },
    })
    expect(result[0].changes.circles?.[0]).toMatchObject({
      data: { orgId, roleId: newRoleId, parentId: circleId },
    })
  })

  it('refuses a created entity in another org', () => {
    expect(() =>
      sanitize(
        log({
          roles: [
            {
              type: EntityChangeType.Create,
              id: newRoleId,
              data: { id: newRoleId, orgId: otherOrgId, name: 'New' },
            },
          ],
        })
      )
    ).toThrow(ProposalValidationError)
  })

  it('refuses a created circle with a role used elsewhere or foreign', () => {
    for (const badRoleId of [roleId, foreignRoleId]) {
      expect(() =>
        sanitize(
          log({
            circles: [
              {
                type: EntityChangeType.Create,
                id: newCircleId,
                data: { id: newCircleId, roleId: badRoleId, parentId: rootId },
              },
            ],
          })
        )
      ).toThrow(ProposalValidationError)
    }
    // A base role can be reused
    expect(() =>
      sanitize(
        log({
          circles: [
            {
              type: EntityChangeType.Create,
              id: newCircleId,
              data: { id: newCircleId, roleId: baseRoleId, parentId: rootId },
            },
          ],
        })
      )
    ).not.toThrow()
  })

  it('refuses a member of another org', () => {
    expect(() =>
      sanitizeProposalLogs(
        log({
          circlesMembers: [
            {
              type: EntityChangeType.Create,
              id: newCircleMemberId,
              data: { circleId, memberId },
            },
          ],
        }),
        orgId,
        {
          ...existing,
          members: new Map([
            [memberId, { orgId: otherOrgId, archivedAt: null }],
          ]),
        }
      )
    ).toThrow(ProposalValidationError)
  })

  it('refuses malformed logs', () => {
    expect(() => collectProposalRefs('nope')).toThrow(ProposalValidationError)
    expect(() =>
      collectProposalRefs(
        log({
          roles: [
            { type: EntityChangeType.Delete, id: 'not-a-uuid', data: {} },
          ],
        })
      )
    ).toThrow(ProposalValidationError)
    expect(() => collectProposalRefs(log({ members: [] }))).toThrow(
      ProposalValidationError
    )
  })
})
