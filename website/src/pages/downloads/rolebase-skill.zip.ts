import type { APIRoute } from 'astro'
import { strToU8, zipSync } from 'fflate'
import reference from '../../../../plugins/rolebase/skills/rolebase/reference.md?raw'
import skill from '../../../../plugins/rolebase/skills/rolebase/SKILL.md?raw'

// The Rolebase skill as a zip, built from the plugin's files so the download
// never drifts from them. The folder inside is named after the skill.
export const GET: APIRoute = () => {
  const zip = zipSync({
    'rolebase/SKILL.md': strToU8(skill),
    'rolebase/reference.md': strToU8(reference),
  })
  return new Response(zip, {
    headers: { 'Content-Type': 'application/zip' },
  })
}
