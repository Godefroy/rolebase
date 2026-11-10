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
      from: `"${message.From.Name}" <${message.From.Email}>`,
      to: message.To.map((r) => `"${r.Name}" <${r.Email}>`).join(', '),
      subject: message.Subject,
      html: message.HTMLPart,
      headers: {
        'Auto-Submitted': 'auto-generated',
      },
    })
  }
}
