import { CircleSummaryFragment, OrgFragment } from '@gql'
import { createModel } from '../../../store/generic'

export type OrgWithCircle = OrgFragment & {
  circles: CircleSummaryFragment[]
}

export default createModel<OrgWithCircle>()
