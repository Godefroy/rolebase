import { router } from '../../trpc'
import archiveOrg from './archiveOrg'
import createOrg from './createOrg'
import exportOrg from './exportOrg'
import exportOrgChart from './exportOrgChart'
import getDeletionPreview from './getDeletionPreview'
import getPublicData from './getPublicData'
import importOrg from './importOrg'
import isOrgSlugAvailable from './isOrgSlugAvailable'
import setGovernanceMode from './setGovernanceMode'
import updateOrgSlug from './updateOrgSlug'

export default router({
  archiveOrg,
  createOrg,
  exportOrg,
  exportOrgChart,
  getDeletionPreview,
  getPublicData,
  importOrg,
  isOrgSlugAvailable,
  setGovernanceMode,
  updateOrgSlug,
})
