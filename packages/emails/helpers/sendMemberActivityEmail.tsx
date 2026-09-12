import { render } from 'react-email'
import React from 'react'
import MemberActiviy from '../components/templates/MemberActivity'
import i18n from '../i18n'
import settings from '../settings'
import { EmailAddress, sendEmail } from './sendEmail'

interface Params {
  recipients: EmailAddress[]
  type: string
  lang: string
  replace: Record<string, string>
  picture: string
  ctaUrl: string
}

export default async function sendMemberActivityEmail({
  recipients,
  type,
  lang,
  replace,
  picture,
  ctaUrl,
}: Params) {
  const subject = i18n.t(`emails:MemberActivity.${type}.subject`, {
    lng: lang,
    replace,
  })

  // Render email to HTML
  const emailHTML = await render(
    <MemberActiviy
      type={type}
      lang={lang}
      picture={picture}
      ctaUrl={ctaUrl}
      replace={replace}
    />
  )

  try {
    await sendEmail({
      From: {
        Email: settings.sender.email,
        Name: settings.sender.name,
      },
      To: recipients,
      Subject: subject,
      HTMLPart: emailHTML,
    })
  } catch (error) {
    console.error('Error sending invitation email', error)
  }
}
