import * as yup from 'yup'
import { adminProcedure } from '../../trpc/adminProcedure'
import { deleteOrgsForGood, getOrg } from '../deletion/utils/orgDeletion'

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
    const failedFiles = await deleteOrgsForGood([orgId])

    console.log(
      `[Deletion] ${opts.ctx.userId} deleted org ${org.id} (${org.name})`
    )
    return { failedFiles }
  })
