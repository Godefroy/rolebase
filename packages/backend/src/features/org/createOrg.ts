import { nameSchema } from '@rolebase/shared/schemas'
import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { gql } from '../../gql'
import settings from '../../settings'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'

export default authedProcedure
  .input(
    yup.object().shape({
      name: nameSchema.required(),
      slug: nameSchema.required(),
    })
  )
  .mutation(async (opts): Promise<string> => {
    const { name, slug } = opts.input

    // Check forbidden slugs
    if (settings.forbiddenSlugs.includes(slug)) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Conflict' })
    }

    // Get user
    const userResult = await adminRequest(GET_USER, {
      id: opts.ctx.userId!,
    })

    // Create org
    try {
      const orgResult = await adminRequest(CREATE_ORG, {
        name,
        slug,
        userId: opts.ctx.userId!,
        memberName: userResult.user!.displayName,
      })
      const orgId = orgResult.insert_org_one!.id

      // Create role
      const roleResult = await adminRequest(CREATE_ROLE, {
        orgId,
        name,
      })
      const roleId = roleResult.insert_role_one!.id

      // Create circle
      await adminRequest(CREATE_CIRCLE, {
        orgId,
        roleId,
      })

      // Base roles and meeting templates are seeded client-side during
      // onboarding (OrgSetupModal), based on the chosen organizational model.

      return orgId
    } catch (error) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Conflict' })
    }
  })

const GET_USER = gql(`
  query getUser($id: uuid!) {
    user(id: $id) {
      id
      displayName
    }
  }`)

const CREATE_ORG = gql(`
  mutation createOrg($name: String!, $slug: String!, $userId: uuid!, $memberName: String!) {
    insert_org_one(object: {
      name: $name
      slug: $slug
      members: {
        data: [
          {
            userId: $userId
            name: $memberName
            role: Owner
          }
        ]
      }
    }) {
      id
    }
  }`)

const CREATE_ROLE = gql(`
  mutation createRole($orgId: uuid!, $name: String!) {
    insert_role_one(object: {
      orgId: $orgId
      name: $name
    }) {
      id
    }
  }`)

const CREATE_CIRCLE = gql(`
  mutation createCircle($orgId: uuid!, $roleId: uuid!) {
    insert_circle_one(object: {
      orgId: $orgId
      roleId: $roleId
    }) {
      id
    }
  }`)
