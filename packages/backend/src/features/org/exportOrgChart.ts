import { renderStaticGraphPage } from '@rolebase/graph/server'
import { getCircleChildren } from '@rolebase/shared/helpers/getCircleChildren'
import { CirclesGraphViews } from '@rolebase/shared/model/graph'
import * as yup from 'yup'
import { Member_Role_Enum, gql } from '../../gql'
import { guardOrg } from '../../guards/guardOrg'
import { authedProcedure } from '../../trpc/authedProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { screenshotHtml } from '../../utils/screenshotHtml'

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

    // Get circles of the org
    const result = await adminRequest(GET_ORG_CIRCLES, { orgId })
    let circles = result.org_by_pk?.circles
    if (!circles || circles.length === 0) {
      throw new Error('Org circles not found')
    }

    // Keep selected circle (as root) and its children
    if (circleId) {
      const circle = circles.find((c) => c.id === circleId)
      if (!circle) {
        throw new Error('Circle not found')
      }
      circles = [
        { ...circle, parentId: null },
        ...getCircleChildren(circles, circleId),
      ]
    }

    // Render the org chart in a headless browser
    // and screenshot it as a transparent PNG
    const html = renderStaticGraphPage({
      view,
      circles,
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

const GET_ORG_CIRCLES = gql(`
  query getOrgCirclesForChartExport($orgId: uuid!) {
    org_by_pk(id: $orgId) {
      circles(where: { archived: { _eq: false } }) {
        ...CircleFull
      }
    }
  }`)
