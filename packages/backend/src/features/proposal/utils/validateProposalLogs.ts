import { ProposalLog } from '@rolebase/shared/model/proposal'
import { gql } from '../../../gql'
import { adminRequest } from '../../../utils/adminRequest'
import {
  collectProposalRefs,
  ProposalExistingEntities,
  sanitizeProposalLogs,
} from './sanitizeProposalLogs'

const GET_PROPOSAL_ENTITIES = gql(`
  query getProposalEntitiesForValidation(
    $rolesIds: [uuid!]!
    $circlesIds: [uuid!]!
    $circleMembersIds: [uuid!]!
    $circleLinksIds: [uuid!]!
    $membersIds: [uuid!]!
  ) {
    role(where: { id: { _in: $rolesIds } }) {
      id
      orgId
      base
      circles(limit: 1) {
        id
      }
    }
    circle(where: { id: { _in: $circlesIds } }) {
      id
      orgId
      parentId
    }
    circle_member(where: { id: { _in: $circleMembersIds } }) {
      id
      orgId
    }
    circle_link(where: { id: { _in: $circleLinksIds } }) {
      id
      orgId
    }
    member(where: { id: { _in: $membersIds } }) {
      id
      orgId
      archivedAt
    }
  }
`)

// Load the entities referenced by the proposal logs and check them against the
// proposal's org. Returns the logs rebuilt with the allowed columns only.
// Throws a ProposalValidationError when the logs are invalid.
export async function validateProposalLogs(
  logs: unknown,
  orgId: string
): Promise<ProposalLog[]> {
  const refs = collectProposalRefs(logs)
  const data = await adminRequest(GET_PROPOSAL_ENTITIES, {
    rolesIds: [...refs.roles],
    circlesIds: [...refs.circles],
    circleMembersIds: [...refs.circlesMembers],
    circleLinksIds: [...refs.circlesLinks],
    membersIds: [...refs.members],
  })

  const existing: ProposalExistingEntities = {
    roles: new Map(
      data.role.map((r) => [
        r.id,
        { orgId: r.orgId, base: r.base, hasCircle: r.circles.length > 0 },
      ])
    ),
    circles: new Map(
      data.circle.map((c) => [
        c.id,
        { orgId: c.orgId, parentId: c.parentId ?? null },
      ])
    ),
    circlesMembers: new Map(
      data.circle_member.map((cm) => [cm.id, { orgId: cm.orgId }])
    ),
    circlesLinks: new Map(
      data.circle_link.map((cl) => [cl.id, { orgId: cl.orgId }])
    ),
    members: new Map(
      data.member.map((m) => [
        m.id,
        { orgId: m.orgId, archivedAt: m.archivedAt ?? null },
      ])
    ),
  }

  return sanitizeProposalLogs(logs, orgId, existing)
}
