// Smoke test of the org chart PNG export pipeline (no auth, fake data):
//   npx tsx scripts/testExportOrgChart.ts
import { renderStaticGraphPage } from '@rolebase/graph/server'
import { CirclesGraphViews } from '@rolebase/shared/model/graph'
import { Governance_Mode_Enum } from '@rolebase/shared/gql'
import { OrgData } from '@rolebase/shared/model/OrgData'
import fs from 'fs'
import path from 'path'
import { screenshotHtml } from '../src/utils/screenshotHtml'

function buildOrg(breadth: number, depth: number, membersPerCircle: number): OrgData {
  const circles: any[] = []
  const roles: any[] = []
  const members: any[] = []
  const circleMembers: any[] = []
  let memberIndex = 0

  const makeCircle = (parentId: string | null, level: number, i: number) => {
    const id = parentId ? `${parentId}-${i}` : 'c0'
    const roleId = `role-${id}`
    circles.push({ id, orgId: 'org1', roleId, parentId, archived: false })
    roles.push({
      id: roleId,
      base: false,
      name: `Role ${id}`,
      singleMember: false,
      parentLink: false,
      colorHue: (level * 60) % 360,
    })
    for (let k = 0; k < membersPerCircle; k++) {
      const mid = `m${memberIndex++}`
      members.push({ id: mid, orgId: 'org1', archived: false, name: `Member ${mid} Lastname`, description: '' })
      circleMembers.push({
        id: `cm-${id}-${mid}`,
        orgId: 'org1',
        circleId: id,
        memberId: mid,
        createdAt: '',
        archived: false,
      })
    }
    if (level < depth) {
      for (let j = 0; j < breadth; j++) {
        makeCircle(id, level + 1, j)
      }
    }
  }

  makeCircle(null, 0, 0)
  return new OrgData({ circles, circleMembers, circleLinks: [], roles, members, governanceMode: Governance_Mode_Enum.Strict })
}

async function main() {
  const org = buildOrg(3, 3, 2)
  console.log(`Rendering ${org.circles.length} circles...`)

  const width = 800
  const html = renderStaticGraphPage({
    view: CirclesGraphViews.AllCircles,
    org,
    width,
    height: width,
    colorMode: 'light',
  })

  const htmlPath = path.join(__dirname, 'testExportOrgChart.html')
  fs.writeFileSync(htmlPath, html)
  console.log(`HTML written to ${htmlPath} (${html.length} bytes)`)

  const png = await screenshotHtml(html, width, width)
  const pngPath = path.join(__dirname, 'testExportOrgChart.png')
  fs.writeFileSync(pngPath, png)
  console.log(`PNG written to ${pngPath} (${png.length} bytes)`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
