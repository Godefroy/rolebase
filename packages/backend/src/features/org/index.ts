import { router } from '../../trpc'
import archiveOrg from './archiveOrg'
import createOrg from './createOrg'
import exportOrg from './exportOrg'
import exportOrgChart from './exportOrgChart'
import getPublicData from './getPublicData'
import importOrg from './importOrg'
import setGovernanceMode from './setGovernanceMode'
import updateOrgSlug from './updateOrgSlug'

export default router({
  archiveOrg,
  createOrg,
  exportOrg,
  exportOrgChart,
  getPublicData,
  importOrg,
  setGovernanceMode,
  updateOrgSlug,
})
