// Trick settings.ts to consider we are in production
process.env.NHOST_ADMIN_SECRET = '1'

import fs from 'fs'
import path from 'path'
import { createElement } from 'react'
import { render } from 'react-email'
import NhostLinkEmail from './components/templates/NhostLinkEmail'
import i18n from './i18n'
import NhostOtpEmail from 'components/templates/NhostOtpEmail'

const emailsFolder = path.join(__dirname, '../../nhost/emails')

const types = [
  'email-confirm-change',
  'email-verify',
  'password-reset',
  'signin-passwordless',
  'signin-otp',
]

const langs = ['fr', 'en']

async function build() {
  for (const lang of langs) {
    for (const type of types) {
      const folder = path.join(emailsFolder, lang, type)

      // Prepare content icon to SVG string
      const Component = type === 'signin-otp' ? NhostOtpEmail : NhostLinkEmail
      const body = await render(createElement(Component, { type, lang }))
      const subject = i18n.t(`emails:NhostEmail.${type}.subject`, { lng: lang })

      // Write files
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
      }
      fs.writeFileSync(path.join(folder, 'body.html'), body, 'utf8')
      fs.writeFileSync(path.join(folder, 'subject.txt'), subject, 'utf8')
    }
  }
}

build().catch((error) => {
  console.error(error)
  process.exit(1)
})
