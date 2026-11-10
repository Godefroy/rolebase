import * as dotenv from 'dotenv'
dotenv.config()

export default {
  sender: {
    name: 'Rolebase.io',
    email: 'noreply@rolebase.io',
  },

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
  },
}
