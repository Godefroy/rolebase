import fs from 'fs'
import path from 'path'
import { brevo } from './brevo'
import { Campaign, renderEmail } from './campaign'
import { contactEmail, Lang, langs, senderId } from './config'
import { ListStats, upsertContact } from './contacts'
import { Recipient } from './users'

// Product newsletters are Brevo campaigns, one per language list, with
// Brevo's mandatory unsubscribe link.

const firstNameVar = 'contact.PRENOM'

// Brevo campaign ids of each language, kept in brevo.json (to commit)
function getIdsFile(campaign: Campaign) {
  return path.join(campaign.dir, 'brevo.json')
}

function readIds(campaign: Campaign): Partial<Record<Lang, number>> {
  const file = getIdsFile(campaign)
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {}
}

// Creates or updates the Brevo campaign of a language from the markdown.
// Recipients are set at send time, after the sync (Brevo rejects empty lists).
async function upsertCampaign(
  campaign: Campaign,
  lang: Lang,
  listId?: number
): Promise<number> {
  const { subject, preview, html } = renderEmail(campaign, lang, firstNameVar)
  const body = {
    name: `Rolebase · ${campaign.slug} · ${lang.toUpperCase()}`,
    subject,
    previewText: preview,
    sender: { id: senderId },
    replyTo: contactEmail,
    htmlContent: html,
    ...(listId && { recipients: { listIds: [listId] } }),
  }

  const ids = readIds(campaign)
  const id = ids[lang]
  if (id) {
    await brevo('PUT', `/emailCampaigns/${id}`, body)
    return id
  }
  const created = await brevo<{ id: number }>('POST', '/emailCampaigns', body)
  ids[lang] = created.id
  fs.writeFileSync(getIdsFile(campaign), JSON.stringify(ids, null, 2) + '\n')
  return created.id
}

export async function testProduct(
  campaign: Campaign,
  user: Recipient,
  lang: Lang
) {
  await upsertContact(user)
  const id = await upsertCampaign(campaign, lang)
  await brevo('POST', `/emailCampaigns/${id}/sendTest`, {
    emailTo: [user.email.toLowerCase()],
  })
  return `campaign ${id}`
}

// Prepares the campaigns, returns their count and the function sending them
export async function prepareProduct(
  campaign: Campaign,
  stats: Record<Lang, ListStats>
) {
  const sendable = langs.filter(
    (lang) => stats[lang].contacts - stats[lang].blacklisted > 0
  )
  const ids = {} as Record<Lang, number>
  for (const lang of sendable) {
    ids[lang] = await upsertCampaign(campaign, lang, stats[lang].listId)
  }

  return {
    counts: Object.fromEntries(
      sendable.map((l) => [l, stats[l].contacts - stats[l].blacklisted])
    ) as Partial<Record<Lang, number>>,
    send: async () => {
      for (const lang of sendable) {
        await brevo('POST', `/emailCampaigns/${ids[lang]}/sendNow`)
        console.log(`Sent campaign ${ids[lang]} (${lang})`)
      }
    },
  }
}
