import fs from 'fs'
import path from 'path'
import { brevo } from './brevo'
import { Campaign, renderEmail } from './campaign'
import { contactEmail, Lang, langs, senderId } from './config'
import { getFirstName, getRecipientLang, Recipient } from './users'

// Legal emails are transactional: Brevo campaigns force an unsubscribe link
// and skip unsubscribed contacts, while legal information reaches every user.

const firstNameVar = 'params.PRENOM'
const batchSize = 100

async function sendBatch(
  campaign: Campaign,
  lang: Lang,
  users: Recipient[],
  subjectPrefix = ''
) {
  const { subject, html } = renderEmail(campaign, lang, firstNameVar)
  await brevo('POST', '/smtp/email', {
    sender: { id: senderId },
    replyTo: { email: contactEmail },
    subject: subjectPrefix + subject,
    htmlContent: html,
    tags: [`legal-${campaign.slug}`],
    messageVersions: users.map((user) => ({
      to: [{ email: user.email, name: user.displayName || undefined }],
      params: { PRENOM: getFirstName(user) || '' },
    })),
  })
}

export async function testLegal(
  campaign: Campaign,
  user: Recipient,
  lang: Lang
) {
  await sendBatch(campaign, lang, [user], '[Test] ')
  return 'transactional email'
}

// Users already sent during a previous interrupted run (gitignored)
function getSentFile(campaign: Campaign) {
  return path.join(campaign.dir, 'sent.txt')
}

export function prepareLegal(campaign: Campaign, users: Recipient[]) {
  const sentFile = getSentFile(campaign)
  const sentIds = new Set(
    fs.existsSync(sentFile)
      ? fs.readFileSync(sentFile, 'utf8').split('\n').filter(Boolean)
      : []
  )
  const groups = Object.fromEntries(
    langs.map((lang) => [
      lang,
      users.filter((u) => !sentIds.has(u.id) && getRecipientLang(u) === lang),
    ])
  ) as Record<Lang, Recipient[]>

  return {
    counts: Object.fromEntries(
      langs.map((lang) => [lang, groups[lang].length])
    ) as Partial<Record<Lang, number>>,
    alreadySent: sentIds.size,
    send: async () => {
      for (const lang of langs) {
        const group = groups[lang]
        for (let i = 0; i < group.length; i += batchSize) {
          const batch = group.slice(i, i + batchSize)
          await sendBatch(campaign, lang, batch)
          fs.appendFileSync(sentFile, batch.map((u) => u.id + '\n').join(''))
          console.log(`${lang}: ${i + batch.length}/${group.length}`)
        }
      }
    },
  }
}
