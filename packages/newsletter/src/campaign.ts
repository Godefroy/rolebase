import fs from 'fs'
import { marked } from 'marked'
import path from 'path'
import YAML from 'yaml'
import { defaultLang, Kind, Lang, langs } from './config'
import { renderTemplate } from './templates'

export interface Frontmatter {
  subject: string
  // Preview text shown after the subject in the inbox
  preview?: string
  // Legal information (terms, operator...): sent to every user as transactional
  // emails, without unsubscribe link. Otherwise a Brevo campaign.
  legal?: boolean
  // Optional button after the content
  ctaLabel?: string
  ctaUrl?: string
  // Set by `send` once the campaign is sent to everyone
  sentAt?: string
}

export interface CampaignVersion {
  lang: Lang
  file: string
  frontmatter: Frontmatter
  markdown: string
}

export interface Campaign {
  slug: string
  dir: string
  kind: Kind
  versions: Partial<Record<Lang, CampaignVersion>>
}

export const campaignsDir = path.join(__dirname, '../campaigns')

// Slugs start with their date, so the most recent one sorts last
const slugRegex = /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/

export function getLatestSlug() {
  return fs
    .readdirSync(campaignsDir)
    .filter((name) => slugRegex.test(name))
    .sort()
    .at(-1)
}

const frontmatterRegex = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/

export function loadCampaign(slug: string): Campaign {
  if (!slugRegex.test(slug)) {
    throw new Error(`Invalid slug "${slug}", expected YYYY-MM-DD-name`)
  }
  const dir = path.join(campaignsDir, slug)
  if (!fs.existsSync(dir)) throw new Error(`Campaign not found: ${dir}`)

  const versions: Campaign['versions'] = {}
  for (const lang of langs) {
    const file = path.join(dir, `${lang}.md`)
    if (!fs.existsSync(file)) continue
    const match = fs.readFileSync(file, 'utf8').match(frontmatterRegex)
    if (!match) throw new Error(`Missing frontmatter in ${file}`)
    const frontmatter: Frontmatter = YAML.parse(match[1])
    if (!frontmatter?.subject) throw new Error(`Missing subject in ${file}`)
    versions[lang] = { lang, file, frontmatter, markdown: match[2].trim() }
  }

  const list = Object.values(versions)
  if (list.length === 0) throw new Error(`No fr.md or en.md in ${dir}`)
  const legal = !!list[0].frontmatter.legal
  if (list.some((v) => !!v.frontmatter.legal !== legal)) {
    throw new Error('All languages must have the same `legal` value')
  }

  return { slug, dir, kind: legal ? 'legal' : 'product', versions }
}

// Marks the campaign as sent in each language file
export function setSentAt(campaign: Campaign, date: Date) {
  for (const version of Object.values(campaign.versions)) {
    const content = fs.readFileSync(version.file, 'utf8')
    const match = content.match(frontmatterRegex)!
    const frontmatter = YAML.parse(match[1])
    frontmatter.sentAt = date.toISOString()
    fs.writeFileSync(
      version.file,
      `---\n${YAML.stringify(frontmatter)}---\n${match[2]}`,
      'utf8'
    )
  }
}

const textColor = '#29241f'
const styles: Record<string, string> = {
  p: 'margin:0 0 16px;font-size:16px;line-height:26px;',
  h1: 'margin:0 0 16px;font-size:24px;line-height:32px;font-weight:600;',
  h2: 'margin:24px 0 12px;font-size:20px;line-height:28px;font-weight:600;',
  h3: 'margin:20px 0 8px;font-size:17px;line-height:26px;font-weight:600;',
  ul: 'margin:0 0 16px;padding-left:24px;font-size:16px;line-height:26px;',
  ol: 'margin:0 0 16px;padding-left:24px;font-size:16px;line-height:26px;',
  li: 'margin:0 0 6px;',
  a: `color:${textColor};text-decoration:underline;`,
  img: 'display:block;max-width:100%;height:auto;border:0;border-radius:8px;margin:0 0 16px;',
  blockquote:
    'margin:0 0 16px;padding:0 0 0 16px;border-left:3px solid #e8e0d8;color:#5c534b;',
  hr: 'border:0;border-top:1px solid #e8e0d8;margin:24px 0;',
}

// Email clients ignore most <style> rules: inline them on each tag
function inlineStyles(html: string) {
  return html.replace(
    /<(p|h1|h2|h3|ul|ol|li|a|img|blockquote|hr)(\s|>|\/>)/g,
    (_, tag, end) => `<${tag} style="${styles[tag]}"${end}`
  )
}

function renderCta(label: string, url: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 16px;"><tr><td style="background-color:#faa68c;border-radius:8px;"><a href="${url}" style="display:inline-block;padding:12px 20px;color:${textColor};font-weight:600;text-decoration:none;font-size:16px;">${label}</a></td></tr></table>`
}

// HTML content of a version. `{{ firstName }}` becomes the Brevo variable
// holding the first name (`contact.PRENOM` in campaigns, `params.PRENOM` in
// transactional emails), removed with its leading space when empty.
export function renderContent(version: CampaignVersion, firstNameVar: string) {
  const markdown = version.markdown.replace(
    /\s*\{\{\s*firstName\s*\}\}/g,
    `{% if ${firstNameVar} %} {{ ${firstNameVar} }}{% endif %}`
  )
  const { ctaLabel, ctaUrl } = version.frontmatter
  const html = inlineStyles(marked.parse(markdown, { async: false }))
  return ctaLabel && ctaUrl ? html + renderCta(ctaLabel, ctaUrl) : html
}

// Version sent to a language, falling back to the default language
export function getVersion(campaign: Campaign, lang: Lang): CampaignVersion {
  return (campaign.versions[lang] ||
    campaign.versions[defaultLang] ||
    Object.values(campaign.versions)[0])!
}

// Full email of a language: layout of the campaign kind with its content
export function renderEmail(
  campaign: Campaign,
  lang: Lang,
  firstNameVar: string
) {
  const version = getVersion(campaign, lang)
  const { subject, preview } = version.frontmatter
  const html = renderTemplate(campaign.kind, version.lang, {
    subject,
    preview,
    html: renderContent(version, firstNameVar),
  })
  return { subject, preview: preview || '', html }
}
