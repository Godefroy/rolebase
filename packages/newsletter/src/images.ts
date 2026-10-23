import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { storageUrl } from './config'
import { getEnv } from './env'
import { Campaign } from './campaign'

// Images sit next to the markdown (`![alt](./image.png)`). Email clients only
// show hosted images, so they are uploaded to the production Nhost storage,
// whose files are public by id. `images.json` keeps their URL and content
// hash, so an image is uploaded again only when it changes.

interface UploadedImage {
  hash: string
  url: string
}

const imageRegex = /!\[([^\]]*)\]\((?!https?:\/\/)([^)\s]+)(\s+"[^"]*")?\)/g

async function upload(file: string): Promise<string> {
  const form = new FormData()
  form.append('bucket-id', 'default')
  form.append(
    'file[]',
    new Blob([fs.readFileSync(file)]),
    `campaign-${path.basename(path.dirname(file))}-${path.basename(file)}`
  )
  const response = await fetch(`${storageUrl}/files`, {
    method: 'POST',
    headers: { 'x-hasura-admin-secret': getEnv('HASURA_PROD_ADMIN_SECRET') },
    body: form,
  })
  const json = await response.json()
  const id = json.processedFiles?.[0]?.id
  if (!response.ok || !id) {
    throw new Error(`Upload of ${file} failed: ${JSON.stringify(json)}`)
  }
  return `${storageUrl}/files/${id}`
}

// Replaces relative image paths in every version by their hosted URL
export async function resolveImages(campaign: Campaign) {
  const cacheFile = path.join(campaign.dir, 'images.json')
  const cache: Record<string, UploadedImage> = fs.existsSync(cacheFile)
    ? JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
    : {}

  const urls = new Map<string, string>()
  for (const version of Object.values(campaign.versions)) {
    for (const [, , src] of version.markdown.matchAll(imageRegex)) {
      const name = path.normalize(src).replace(/^\.\//, '')
      if (urls.has(src)) continue
      const file = path.join(campaign.dir, name)
      if (!fs.existsSync(file)) throw new Error(`Image not found: ${file}`)

      const hash = crypto
        .createHash('sha256')
        .update(fs.readFileSync(file))
        .digest('hex')
      if (cache[name]?.hash !== hash) {
        cache[name] = { hash, url: await upload(file) }
        console.log(`Uploaded ${name}`)
      }
      urls.set(src, cache[name].url)
    }
  }

  if (urls.size === 0) return
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2) + '\n', 'utf8')
  for (const version of Object.values(campaign.versions)) {
    version.markdown = version.markdown.replace(
      imageRegex,
      (match, alt, src, title = '') =>
        urls.has(src) ? `![${alt}](${urls.get(src)}${title})` : match
    )
  }
}
