import readline from 'readline/promises'
import { brevo, getBlockedEmails, getCredits } from './brevo'
import { getLatestSlug, loadCampaign, setSentAt } from './campaign'
import {
  contactEmail,
  Kind,
  Lang,
  langs,
  senderId,
  templateIds,
} from './config'
import { syncContacts } from './contacts'
import { resolveImages } from './images'
import { prepareLegal, testLegal } from './legal'
import { prepareProduct, testProduct } from './product'
import { getTemplateName, renderTemplate } from './templates'
import { getRecipientLang, getRecipients, getTestRecipient } from './users'

const usage = `Usage: npm run newsletter -w @rolebase/newsletter -- <command>

  test <slug> [--lang fr|en]   Send a test to the test user (NEWSLETTER_TEST_USER_ID)
  send <slug> [--dry-run]      Sync the users to Brevo and send the campaign
                               (only the most recent one, asks for confirmation).
                               Legal: transactional emails, product: Brevo campaign
       [--yes]                 Skip the confirmation
       [--force]               Send again a campaign already sent
       [--created-before <date>]  Legal only: users created before this date
  templates                    Create or update the Brevo templates`

// Emails kept for the app's own emails (sign-in codes...) after a send
const creditsReserve = 500

async function main() {
  const [command, ...rest] = process.argv.slice(2)
  const flags = new Set(rest.filter((a) => a.startsWith('--')))
  const args = rest.filter((a) => !a.startsWith('--'))
  // Removes an option and its value from the args
  const getOption = (name: string) => {
    const index = rest.indexOf(name)
    const value = index >= 0 ? rest[index + 1] : undefined
    if (value) args.splice(args.indexOf(value), 1)
    return value
  }
  const lang = getOption('--lang') as Lang | undefined
  const createdBefore = getOption('--created-before')

  switch (command) {
    case 'templates':
      return syncTemplates()
    case 'test':
      return test(requireSlug(args), lang)
    case 'send':
      return send(requireSlug(args), flags, createdBefore)
    default:
      console.log(usage)
      process.exit(command ? 1 : 0)
  }
}

function requireSlug(args: string[]) {
  if (!args[0]) {
    console.log(usage)
    process.exit(1)
  }
  return args[0]
}

async function syncTemplates() {
  for (const kind of Object.keys(templateIds) as Kind[]) {
    for (const lang of langs) {
      const body = {
        templateName: getTemplateName(kind, lang),
        tag: kind === 'legal' ? 'legal' : 'newsletter',
        subject: getTemplateName(kind, lang),
        sender: { id: senderId },
        replyTo: contactEmail,
        htmlContent: renderTemplate(kind, lang),
        isActive: true,
      }
      const id = templateIds[kind][lang]
      if (id) {
        await brevo('PUT', `/smtp/templates/${id}`, body)
        console.log(`Updated template ${id}: ${body.templateName}`)
      } else {
        const created = await brevo<{ id: number }>(
          'POST',
          '/smtp/templates',
          body
        )
        console.log(
          `Created template ${created.id}: ${body.templateName}. Set templateIds.${kind}.${lang} = ${created.id} in src/config.ts`
        )
      }
    }
  }
}

async function test(slug: string, lang?: Lang) {
  const campaign = loadCampaign(slug)
  await resolveImages(campaign)
  const user = await getTestRecipient()
  const recipientLang = lang || getRecipientLang(user)
  const test = campaign.kind === 'legal' ? testLegal : testProduct
  const sent = await test(campaign, user, recipientLang)
  console.log(
    `Sent test ${sent} (${slug}, ${campaign.kind}, ${recipientLang}) to ${user.email}`
  )
}

async function send(slug: string, flags: Set<string>, createdBefore?: string) {
  const campaign = loadCampaign(slug)
  const createdBeforeDate = createdBefore ? new Date(createdBefore) : undefined
  if (createdBeforeDate && isNaN(createdBeforeDate.getTime())) {
    throw new Error(`Invalid date: ${createdBefore}`)
  }
  if (createdBeforeDate && campaign.kind !== 'legal') {
    throw new Error('--created-before only applies to legal emails')
  }
  const latestSlug = getLatestSlug()
  if (slug !== latestSlug) {
    throw new Error(`Only the most recent campaign can be sent (${latestSlug})`)
  }
  const sentAt = Object.values(campaign.versions).find(
    (v) => v.frontmatter.sentAt
  )?.frontmatter.sentAt
  if (sentAt && !flags.has('--force')) {
    throw new Error(`${slug} was already sent at ${sentAt} (--force to resend)`)
  }

  // Addresses Brevo blocks are left out of the lists and the counts
  const blocked = await getBlockedEmails()
  const allUsers = await getRecipients()
  const users = allUsers.filter((u) => !blocked.has(u.email.toLowerCase()))
  console.log(`${allUsers.length - users.length} users blocked by Brevo`)
  const recipients = createdBeforeDate
    ? users.filter((u) => new Date(u.createdAt) < createdBeforeDate)
    : users
  const credits = await getCredits()
  if (flags.has('--dry-run')) {
    const counts = langs.map(
      (l) =>
        `${l}: ${recipients.filter((u) => getRecipientLang(u) === l).length}`
    )
    console.log(
      `${slug} (${campaign.kind}) to ${recipients.length} users (${counts.join(', ')})` +
        (createdBeforeDate
          ? `, created before ${createdBeforeDate.toISOString()}`
          : '') +
        (campaign.kind === 'product' ? ', before unsubscribes' : '') +
        `. Brevo credits: ${credits}`
    )
    return
  }

  await resolveImages(campaign)
  const stats = await syncContacts(users)
  const prepared =
    campaign.kind === 'legal'
      ? prepareLegal(campaign, recipients)
      : await prepareProduct(campaign, stats)

  const counts = Object.entries(prepared.counts)
  const total = counts.reduce((sum, [, count]) => sum + (count || 0), 0)
  if (credits < total + creditsReserve) {
    throw new Error(
      `Not enough Brevo credits: ${credits} for ${total} emails + ${creditsReserve} kept for the app`
    )
  }
  console.log(
    `${slug} (${campaign.kind}) ready for ${total} recipients (${counts
      .map(([l, c]) => `${l}: ${c}`)
      .join(', ')}). Brevo credits: ${credits}`
  )
  if (total === 0) return

  if (!flags.has('--yes')) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    const answer = await rl.question(`Type "${slug}" to send: `)
    rl.close()
    if (answer.trim() !== slug) return console.log('Cancelled')
  }

  await prepared.send()
  setSentAt(campaign, new Date())
  console.log(`sentAt written in ${slug}/*.md`)
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
