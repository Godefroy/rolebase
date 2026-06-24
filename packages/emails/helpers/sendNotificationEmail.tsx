import { render } from '@react-email/components'
import React from 'react'
import Notification from '../components/templates/Notification'
import settings from '../settings'
import { EmailAddress, sendEmail } from './sendEmail'

interface Params {
  recipients: EmailAddress[]
  subject: string
  title: string
  paragraphs: string[]
  ctaUrl?: string
  ctaLabel?: string
}

// Send a generic transactional notification email (see the Notification
// template). All text must be passed in already localized.
export default async function sendNotificationEmail({
  recipients,
  subject,
  title,
  paragraphs,
  ctaUrl,
  ctaLabel,
}: Params) {
  const emailHTML = render(
    <Notification
      title={title}
      paragraphs={paragraphs}
      preview={subject}
      ctaUrl={ctaUrl}
      ctaLabel={ctaLabel}
    />
  )

  await sendEmail({
    From: {
      Email: settings.sender.email,
      Name: settings.sender.name,
    },
    To: recipients,
    Subject: subject,
    HTMLPart: emailHTML,
  })
}
