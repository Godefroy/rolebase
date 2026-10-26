import * as yup from 'yup'
import { gql } from '../../gql'
import { adminProcedure } from '../../trpc/adminProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { getOrg } from '../deletion/utils/orgDeletion'

// Restores an archived org. Its cancelled subscription stays cancelled.
export default adminProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().uuid().required(),
    })
  )
  .mutation(async (opts): Promise<void> => {
    const { orgId } = opts.input
    const org = await getOrg(orgId)
    await adminRequest(RESTORE_ORG, { orgId })
    console.log(
      `[Admin] ${opts.ctx.userId} restored org ${org.id} (${org.name})`
    )
  })

const RESTORE_ORG = gql(`
  mutation restoreOrg($orgId: uuid!) {
    update_org_by_pk(pk_columns: { id: $orgId }, _set: { archivedAt: null }) {
      id
    }
  }
`)
