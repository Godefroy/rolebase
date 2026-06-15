import { CirclesGraphViews } from '../model/graph'
import { Governance_Mode_Enum, OrgFragment } from '../gql'

export const org: OrgFragment = {
  id: 'org-1',
  name: 'SuperOrga',
  archived: false,
  createdAt: new Date().toISOString(),
  shareOrg: false,
  shareMembers: false,
  governanceMode: Governance_Mode_Enum.Free,
  defaultGraphView: CirclesGraphViews.AllCircles,
}
