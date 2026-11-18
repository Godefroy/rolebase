import { createTransport } from 'nodemailer'
import settings from '../settings'
import { EmailMessage } from './sendEmail'

export async function sendSmtpEmail(...messages: EmailMessage[]) {
  const transporter = createTransport({
    host: settings.smtp.host,
    port: settings.smtp.port,
    secure: settings.smtp.port === 465,
    auth: {
      user: settings.smtp.user,
      pass: settings.smtp.password,
    },
  })

  for (const message of messages) {
    await transporter.sendMail({
      // Address objects: nodemailer quotes and encodes the names itself,
      // so a name can't inject extra recipients
      from: { name: message.From.Name, address: message.From.Email },
      to: message.To.map((r) => ({ name: r.Name, address: r.Email })),
      subject: message.Subject,
      html: message.HTMLPart,
      headers: {
        'Auto-Submitted': 'auto-generated',
      },
    })
  }
}
