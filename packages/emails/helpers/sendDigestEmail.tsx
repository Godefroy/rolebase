import { render } from 'react-email'
import React from 'react'
import Digest, { OrgDigest } from '../components/templates/Digest'
import i18n from '../i18n'
import settings from '../settings'
import { EmailAddress, sendEmail } from './sendEmail'

interface Params {
  recipient: EmailAddress
  lang: string
  timezone: string
  orgDigests: OrgDigest[]
}

export default async function sendDigestEmail({
  recipient,
  lang,
  timezone,
  orgDigests,
}: Params) {
  const subject = i18n.t('emails:Digest.subject', { lng: lang })

  // Render email to HTML
  const emailHTML = await render(
    <Digest lang={lang} timezone={timezone} orgDigests={orgDigests} />
  )

  try {
    await sendEmail({
      From: {
        Email: settings.sender.email,
        Name: settings.sender.name,
      },
      To: [recipient],
      Subject: subject,
      HTMLPart: emailHTML,
    })
  } catch (error) {
    console.error('Error sending invitation email', error)
  }
}
