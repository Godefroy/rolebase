import { slugSchema } from '@rolebase/shared/schemas'
import * as yup from 'yup'
import { gql } from '../../gql'
import settings from '../../settings'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'

// Lets the onboarding wizard flag a taken slug on the org name step, before
// the org is created at the end of the wizard
export default authedProcedure
  .input(
    yup.object().shape({
      slug: slugSchema.required(),
    })
  )
  .query(async (opts): Promise<boolean> => {
    const { slug } = opts.input
    if (settings.forbiddenSlugs.includes(slug)) return false

    // Archived orgs keep their slug: check them too
    const result = await adminRequest(GET_ORG_BY_SLUG, { slug })
    return result.org.length === 0
  })

const GET_ORG_BY_SLUG = gql(`
  query getOrgBySlug($slug: String!) {
    org(where: { slug: { _eq: $slug } }, limit: 1) {
      id
    }
  }`)
