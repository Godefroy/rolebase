import { getEmailDomainIconUrl } from '@rolebase/shared/helpers/getEmailDomainIconUrl'
import { nameSchema } from '@rolebase/shared/schemas'
import { TRPCError } from '@trpc/server'
import * as yup from 'yup'
import { gql } from '../../gql'
import settings from '../../settings'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { isConstraintViolation } from '../../utils/isConstraintViolation'
import { nhost } from '../../utils/nhost'

export default authedProcedure
  .input(
    yup.object().shape({
      name: nameSchema.required(),
      slug: nameSchema.required(),
      // Use the icon of the website behind the user's company email domain
      withEmailDomainIcon: yup.boolean(),
    })
  )
  .mutation(async (opts): Promise<string> => {
    const { name, slug, withEmailDomainIcon } = opts.input

    // Check forbidden slugs
    if (settings.forbiddenSlugs.includes(slug)) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Conflict' })
    }

    // Get user
    const userResult = await adminRequest(GET_USER, {
      id: opts.ctx.userId!,
    })

    // Create org. The unique slug is the only expected constraint: any other
    // failure is a real error, reported as such.
    let orgId: string
    try {
      const orgResult = await adminRequest(CREATE_ORG, {
        name,
        slug,
        userId: opts.ctx.userId!,
        memberName: userResult.user!.displayName,
      })
      orgId = orgResult.insert_org_one!.id
    } catch (error) {
      if (!isConstraintViolation(error)) throw error
      throw new TRPCError({ code: 'CONFLICT', message: 'Conflict' })
    }

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

    // A missing icon never fails the creation
    if (withEmailDomainIcon) {
      await saveEmailDomainIcon(orgId, userResult.user!.email).catch(
        console.error
      )
    }

    return orgId
  })

// Store the icon of the email domain's website as the org icon. Based on the
// user's own email: the server never fetches a URL chosen by the client.
async function saveEmailDomainIcon(orgId: string, email?: string | null) {
  const iconUrl = getEmailDomainIconUrl(email ?? undefined)
  if (!iconUrl) return

  const response = await fetch(iconUrl, { signal: AbortSignal.timeout(5000) })
  const contentType = response.headers.get('content-type') || ''
  if (!response.ok || !contentType.startsWith('image/')) return

  const { body } = await nhost.storage.uploadFiles({
    'file[]': [new Blob([await response.arrayBuffer()], { type: contentType })],
    'metadata[]': [{ name: `orgs/${orgId}/icon` }],
  })
  const fileId = body.processedFiles[0].id
  await adminRequest(UPDATE_ORG_ICON, {
    id: orgId,
    icon: `${nhost.storage.baseURL}/files/${fileId}`,
    iconFileId: fileId,
  })
}

const GET_USER = gql(`
  query getUser($id: uuid!) {
    user(id: $id) {
      id
      displayName
      email
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

const UPDATE_ORG_ICON = gql(`
  mutation updateOrgIcon($id: uuid!, $icon: String!, $iconFileId: uuid!) {
    update_org_by_pk(
      pk_columns: { id: $id }
      _set: { icon: $icon, iconFileId: $iconFileId }
    ) {
      id
    }
  }`)
