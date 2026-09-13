import i18n from '@rolebase/emails/i18n'
import sendNotificationEmail from '@rolebase/emails/helpers/sendNotificationEmail'
import { getOrgPath } from '@rolebase/shared/helpers/getOrgPath'
import { UserMetadata } from '@rolebase/shared/model/user'
import { gql } from '../../gql'
import settings from '../../settings'
import { webhookProcedure } from '../../trpc/webhookProcedure'
import { adminRequest } from '../../utils/adminRequest'
import { updateUserMetadata } from '../user/utils/updateUserMetadata'

const hour = 60 * 60 * 1000

// Onboarding reminders, one email each, sent once per user:
// - noOrg: signed in (code validated) 1 to 48 hours ago, still no organization
// - noInvite: organization set up 24 to 72 hours ago, nobody invited yet
// The windows only catch recent signups, so older users never receive them.
export default webhookProcedure.mutation(async () => {
  const now = Date.now()
  const at = (hoursAgo: number) => new Date(now - hoursAgo * hour).toISOString()

  const { users } = await adminRequest(GET_USERS_WITHOUT_ORG, {
    from: at(48),
    to: at(1),
  })
  for (const user of users) {
    const metadata: UserMetadata = user.metadata || {}
    if (!user.email || metadata.onboardingReminders?.noOrg) continue

    await sendReminder({
      type: 'noOrg',
      email: user.email,
      lang: user.locale,
      replace: { name: user.displayName },
      ctaUrl: `${settings.url}/`,
    })
    await markSent(user.id, metadata, 'noOrg')
  }

  const { org: orgs } = await adminRequest(GET_ORGS_WITHOUT_INVITE, {
    from: at(72),
    to: at(24),
  })
  for (const org of orgs) {
    const user = org.members[0]?.user
    if (!user?.email) continue
    const metadata: UserMetadata = user.metadata || {}
    if (metadata.onboardingReminders?.noInvite) continue

    await sendReminder({
      type: 'noInvite',
      email: user.email,
      lang: user.locale,
      replace: { name: user.displayName, org: org.name },
      ctaUrl: `${settings.url}${getOrgPath(org)}/news`,
    })
    await markSent(user.id, metadata, 'noInvite')
  }
})

interface ReminderParams {
  type: 'noOrg' | 'noInvite'
  email: string
  lang: string
  replace: Record<string, string>
  ctaUrl: string
}

async function sendReminder({
  type,
  email,
  lang,
  replace,
  ctaUrl,
}: ReminderParams) {
  const t = (key: string) =>
    i18n.t(`emails:OnboardingReminder.${type}.${key}`, { lng: lang, replace })
  const paragraphs = ['paragraph1', 'paragraph2', 'paragraph3']
    .map((key) => t(key))
    // Missing keys come back as the key path itself
    .filter((text) => !text.includes('OnboardingReminder.'))

  try {
    await sendNotificationEmail({
      recipients: [{ Email: email, Name: replace.name }],
      subject: t('subject'),
      title: t('title'),
      paragraphs,
      ctaUrl,
      ctaLabel: t('cta'),
    })
  } catch (error) {
    console.error(`Error sending ${type} onboarding reminder`, error)
  }
}

// Marked even when sending failed, so a broken address is not retried hourly
async function markSent(
  userId: string,
  metadata: UserMetadata,
  type: 'noOrg' | 'noInvite'
) {
  await updateUserMetadata(userId, {
    ...metadata,
    onboardingReminders: {
      ...metadata.onboardingReminders,
      [type]: new Date().toISOString(),
    },
  })
}

const GET_USERS_WITHOUT_ORG = gql(`
  query getUsersWithoutOrg($from: timestamptz!, $to: timestamptz!) {
    users(
      where: {
        createdAt: { _gte: $from, _lte: $to }
        disabled: { _eq: false }
        emailVerified: { _eq: true }
        _not: { members: {} }
      }
    ) {
      id
      email
      displayName
      locale
      metadata
    }
  }
`)

const GET_ORGS_WITHOUT_INVITE = gql(`
  query getOrgsWithoutInvite($from: timestamptz!, $to: timestamptz!) {
    org(
      where: {
        createdAt: { _gte: $from, _lte: $to }
        archivedAt: { _is_null: true }
        onboardingTodo: { _is_null: true }
        roles: { base: { _eq: true } }
        _not: { members: { inviteDate: { _is_null: false } } }
      }
    ) {
      id
      name
      slug
      members(
        where: { role: { _eq: Owner }, userId: { _is_null: false } }
        limit: 1
      ) {
        user {
          id
          email
          displayName
          locale
          metadata
        }
      }
    }
  }
`)
