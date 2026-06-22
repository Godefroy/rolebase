import { renderStaticGraphPage } from '@rolebase/graph/server'
import { OrgData } from '@rolebase/shared/model/OrgData'
import { CirclesGraphViews } from '@rolebase/shared/model/graph'
import * as yup from 'yup'
import { Member_Role_Enum } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import { authedProcedure } from '../../trpc/authedProcedure'
import { screenshotHtml } from '../../utils/screenshotHtml'
import { loadOrgFlatData } from './loadOrgData'

export default authedProcedure
  .input(
    yup.object().shape({
      orgId: yup.string().required(),
      // Export a circle and its children only (default: whole org)
      circleId: yup.string(),
      view: yup
        .mixed<CirclesGraphViews>()
        .oneOf(Object.values(CirclesGraphViews))
        .required(),
      width: yup.number().integer().min(100).max(3000).required(),
      colorMode: yup.mixed<'light' | 'dark'>().oneOf(['light', 'dark']),
      // Show members and deep circles regardless of the zoom scale
      showAllNodes: yup.boolean(),
    })
  )
  .mutation(async (opts) => {
    const { orgId, circleId, view, width, colorMode, showAllNodes } = opts.input

    await guardOrg(orgId, Member_Role_Enum.Readonly, opts.ctx)

    // Get flat org data
    const flat = await loadOrgFlatData(orgId)
    if (flat.circles.length === 0) {
      throw new Error('Org circles not found')
    }
    let orgData = new OrgData(flat)

    // Restrict to the selected circle (as root) and its descendants. OrgData
    // ignores circle members/links whose circle isn't kept, so no extra filter.
    if (circleId) {
      const circle = orgData.getCircle(circleId)
      if (!circle) {
        throw new Error('Circle not found')
      }
      const circles = [
        { ...circle, parentId: null },
        ...orgData.descendantsOf(circleId),
      ]
      orgData = new OrgData({ ...flat, circles })
    }

    // Render the org chart in a headless browser
    // and screenshot it as a transparent PNG
    const html = renderStaticGraphPage({
      view,
      org: orgData,
      width,
      height: width,
      colorMode: colorMode || 'light',
      showAllNodes,
    })
    const png = await screenshotHtml(html, width, width)

    return {
      data: png.toString('base64'),
      contentType: 'image/png',
      filename: 'rolebase.png',
    }
  })
