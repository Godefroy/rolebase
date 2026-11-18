import { AlgoliaConfig } from '@rolebase/shared/model/search'
import algoliasearch from 'algoliasearch'
import * as yup from 'yup'
import { Member_Role_Enum } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import settings from '../../settings'
import { authedProcedure } from '../../trpc/authedProcedure'

// Secured keys expire so that removed members lose search access
const KEY_VALIDITY_SECONDS = 60 * 60

export default authedProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().required(),
    })
  )
  .query(async (opts): Promise<AlgoliaConfig> => {
    const { orgId } = opts.input

    await guardOrg(orgId, Member_Role_Enum.Readonly, opts.ctx)

    const validUntil = Math.floor(Date.now() / 1000) + KEY_VALIDITY_SECONDS
    const apiKey = algoliasearch(
      settings.algolia.appId,
      settings.algolia.adminApiKey
    ).generateSecuredApiKey(settings.algolia.searchApiKey, {
      filters: `orgId:${orgId}`,
      validUntil,
      restrictIndices: settings.algolia.indexName,
    })

    return {
      appId: settings.algolia.appId,
      apiKey,
      indexName: settings.algolia.indexName,
      validUntil,
    }
  })
