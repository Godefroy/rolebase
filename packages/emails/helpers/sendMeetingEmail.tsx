import { render } from 'react-email'
import React from 'react'
import Meeting, { MeetingEmailProps } from '../components/templates/Meeting'
import i18n from '../i18n'
import settings from '../settings'
import { EmailAddress, sendEmail } from './sendEmail'

export default async function sendMeetingEmail(
  emailProps: MeetingEmailProps,
  recipients: EmailAddress[]
) {
  const subject = i18n.t(`emails:Meeting.subject`, {
    lng: emailProps.lang,
    replace: {
      title: emailProps.title,
      role: emailProps.role,
    },
  })

  // Render email to HTML
  const emailHTML = await render(<Meeting {...emailProps} />)

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
