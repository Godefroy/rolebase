import * as yup from 'yup'
import { Member_Role_Enum } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import { authedProcedure } from '../../trpc/authedProcedure'
import {
  getOrgDeletionPreview,
  OrgDeletionPreview,
} from '../deletion/utils/orgDeletion'

// Lists what deleting the org would delete. Reserved to its owners.
export default authedProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().uuid().required(),
    })
  )
  .query(async (opts): Promise<OrgDeletionPreview> => {
    const { orgId } = opts.input
    await guardOrg(orgId, Member_Role_Enum.Owner, opts.ctx)
    return getOrgDeletionPreview(orgId)
  })
