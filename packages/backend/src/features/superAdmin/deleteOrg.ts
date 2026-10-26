import * as yup from 'yup'
import { adminProcedure } from '../../trpc/adminProcedure'
import { getOrg } from './getOrgDeletionPreview'
import {
  cancelOrgSubscriptions,
  deleteFiles,
  deleteOrgs,
  getOrgFileIds,
} from './utils/orgDeletion'

// Deletes an org and all its content for good. User accounts of its members
// are kept.
export default adminProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().uuid().required(),
    })
  )
  .mutation(async (opts): Promise<{ failedFiles: number }> => {
    const { orgId } = opts.input
    const org = await getOrg(orgId)

    // Files are listed before their references disappear
    const fileIds = await getOrgFileIds([orgId])
    await cancelOrgSubscriptions([orgId])
    await deleteOrgs([orgId])
    const failedFiles = await deleteFiles(fileIds)

    console.log(
      `[Deletion] ${opts.ctx.userId} deleted org ${org.id} (${org.name})`
    )
    return { failedFiles }
  })
