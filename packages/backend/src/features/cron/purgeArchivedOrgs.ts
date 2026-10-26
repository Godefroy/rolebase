import { archivedOrgRetentionDays } from '@rolebase/shared/model/deletion'
import { gql } from '../../gql'
import { webhookProcedure } from '../../trpc/webhookProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { deleteOrgsForGood } from '../deletion/utils/orgDeletion'

// Time spent purging per run, below the 60s timeout of Hasura cron webhooks.
// The next daily run goes on with the remaining orgs.
const timeBudgetMs = 45 * 1000
const batchSize = 10

// Deletes for good the orgs archived for longer than the retention delay
export default webhookProcedure.mutation(async () => {
  const start = Date.now()
  const before = new Date(
    start - archivedOrgRetentionDays * 24 * 60 * 60 * 1000
  ).toISOString()
  // Skipped until the next run, so that they don't block the others
  const failedIds: string[] = []

  while (Date.now() - start < timeBudgetMs) {
    const { org } = await adminRequest(GET_EXPIRED_ARCHIVED_ORGS, {
      before,
      failedIds,
      limit: batchSize,
    })
    if (org.length === 0) return

    for (const { id, name } of org) {
      if (Date.now() - start >= timeBudgetMs) return
      try {
        const failedFiles = await deleteOrgsForGood([id])
        console.log(
          `[Deletion] Purged archived org ${id} (${name})${failedFiles ? `, ${failedFiles} files failed` : ''}`
        )
      } catch (error) {
        failedIds.push(id)
        console.error(`[Deletion] Failed to purge archived org ${id}`, error)
      }
    }
  }
})

const GET_EXPIRED_ARCHIVED_ORGS = gql(`
  query getExpiredArchivedOrgs(
    $before: timestamptz!
    $failedIds: [uuid!]!
    $limit: Int!
  ) {
    org(
      where: { archivedAt: { _lt: $before }, id: { _nin: $failedIds } }
      order_by: { archivedAt: asc }
      limit: $limit
    ) {
      id
      name
    }
  }
`)
