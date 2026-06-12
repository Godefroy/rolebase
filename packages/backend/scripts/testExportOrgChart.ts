// Smoke test of the org chart PNG export pipeline (no auth, fake data):
//   npx tsx scripts/testExportOrgChart.ts
import { renderStaticGraphPage } from '@rolebase/graph/server'
import { CirclesGraphViews } from '@rolebase/shared/model/graph'
import fs from 'fs'
import path from 'path'
import { screenshotHtml } from '../src/utils/screenshotHtml'

function buildCircles(breadth: number, depth: number, members: number) {
  const circles: any[] = []
  let memberIndex = 0

  const makeCircle = (parentId: string | null, level: number, i: number) => {
    const id = parentId ? `${parentId}-${i}` : 'c0'
    circles.push({
      id,
      orgId: 'org1',
      roleId: `role-${id}`,
      parentId,
      archived: false,
      role: {
        id: `role-${id}`,
        base: false,
        name: `Role ${id}`,
        singleMember: false,
        parentLink: false,
        colorHue: (level * 60) % 360,
      },
      members: Array.from({ length: members }, () => {
        const mid = `m${memberIndex++}`
        return {
          id: `cm-${mid}`,
          member: {
            id: mid,
            userId: null,
            name: `Member ${mid} Lastname`,
            picture: null,
          },
        }
      }),
      invitedCircleLinks: [],
    })
    if (level < depth) {
      for (let j = 0; j < breadth; j++) {
        makeCircle(id, level + 1, j)
      }
    }
  }

  makeCircle(null, 0, 0)
  return circles
}

async function main() {
  const circles = buildCircles(3, 3, 2)
  console.log(`Rendering ${circles.length} circles...`)

  const width = 800
  const html = renderStaticGraphPage({
    view: CirclesGraphViews.AllCircles,
    circles,
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
