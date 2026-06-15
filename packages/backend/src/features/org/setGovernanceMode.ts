import * as yup from 'yup'
import { gql, Governance_Mode_Enum, Member_Role_Enum } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'

// Governance mode controls how the whole org chart can be edited, so only the
// org Owner may change it (Hasura can't restrict a single column to Owner while
// letting Admins edit the other org settings).
export default authedProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().required(),
      governanceMode: yup
        .mixed<Governance_Mode_Enum>()
        .oneOf(Object.values(Governance_Mode_Enum))
        .required(),
    })
  )
  .mutation(async (opts): Promise<void> => {
    const { orgId, governanceMode } = opts.input

    await guardOrg(orgId, Member_Role_Enum.Owner, opts.ctx)

    await adminRequest(SET_GOVERNANCE_MODE, { id: orgId, governanceMode })
  })

const SET_GOVERNANCE_MODE = gql(`
  mutation setGovernanceMode(
    $id: uuid!
    $governanceMode: governance_mode_enum!
  ) {
    update_org_by_pk(
      pk_columns: { id: $id }
      _set: { governanceMode: $governanceMode }
    ) {
      id
    }
  }`)
