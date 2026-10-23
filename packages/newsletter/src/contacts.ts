import { brevo, brevoAll, waitProcess } from './brevo'
import { folderName, getListName, Lang, langs } from './config'
import { getFirstName, getRecipientLang, Recipient } from './users'

// Users are synced to one Brevo list per language before each send.
// Unsubscribed contacts stay blacklisted: the import never touches that status.

interface ListContact {
  email: string
  emailBlacklisted: boolean
}

function getAttributes(user: Recipient) {
  return { PRENOM: getFirstName(user) || '', EXT_ID: user.id }
}

async function getFolderId(): Promise<number> {
  const folders = await brevoAll<{ id: number; name: string }>(
    '/contacts/folders',
    'folders',
    50
  )
  const folder = folders.find((f) => f.name === folderName)
  if (folder) return folder.id
  return (await brevo('POST', '/contacts/folders', { name: folderName })).id
}

export async function getListIds(): Promise<Record<Lang, number>> {
  const lists = await brevoAll<{ id: number; name: string }>(
    '/contacts/lists',
    'lists',
    50
  )
  const ids = {} as Record<Lang, number>
  let folderId: number | undefined
  for (const lang of langs) {
    const name = getListName(lang)
    const list = lists.find((l) => l.name === name)
    if (list) {
      ids[lang] = list.id
      continue
    }
    folderId ??= await getFolderId()
    ids[lang] = (await brevo('POST', '/contacts/lists', { name, folderId })).id
  }
  return ids
}

export interface ListStats {
  listId: number
  contacts: number
  // Unsubscribed contacts, skipped by Brevo
  blacklisted: number
}

export async function syncContacts(
  users: Recipient[]
): Promise<Record<Lang, ListStats>> {
  const listIds = await getListIds()
  const stats = {} as Record<Lang, ListStats>

  for (const lang of langs) {
    const listId = listIds[lang]
    const group = users.filter((user) => getRecipientLang(user) === lang)

    // Add or update the users of this language
    if (group.length) {
      const { processId } = await brevo('POST', '/contacts/import', {
        jsonBody: group.map((user) => ({
          email: user.email.toLowerCase(),
          attributes: getAttributes(user),
        })),
        listIds: [listId],
        updateExistingContacts: true,
        emptyContactsAttributes: false,
      })
      await waitProcess(processId)
    }

    // Remove disabled users and users now in the other language
    const emails = new Set(group.map((user) => user.email.toLowerCase()))
    const contacts = await brevoAll<ListContact>(
      `/contacts/lists/${listId}/contacts`,
      'contacts',
      500
    )
    const extra = contacts.filter((c) => !emails.has(c.email.toLowerCase()))
    for (let i = 0; i < extra.length; i += 150) {
      await brevo('POST', `/contacts/lists/${listId}/contacts/remove`, {
        emails: extra.slice(i, i + 150).map((c) => c.email),
      })
    }

    const kept = contacts.filter((c) => emails.has(c.email.toLowerCase()))
    stats[lang] = {
      listId,
      contacts: kept.length,
      blacklisted: kept.filter((c) => c.emailBlacklisted).length,
    }
    console.log(
      `Synced ${getListName(lang)}: ${kept.length} contacts, ${stats[lang].blacklisted} unsubscribed, ${extra.length} removed`
    )
  }
  return stats
}

// Creates or updates the test user's contact, without adding it to a list
export async function upsertContact(user: Recipient) {
  await brevo('POST', '/contacts', {
    email: user.email.toLowerCase(),
    attributes: getAttributes(user),
    updateEnabled: true,
  })
}
