import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({
  // Load Nhost secrets in local development
  path: path.join(__dirname + '/../../../.secrets'),
})

export default {
  port: 8888,
  url: process.env.WEBAPP_URL || 'http://localhost:5175',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:8888',

  defaultTimezone: 'Europe/Paris',

  forbiddenSlugs: [
    'admin',
    'signup',
    'signin',
    'login',
    'logout',
    'profile',
    'settings',
    'reset-password',
    'www',
    'backoffice',
    'orgs',
    'members',
    'threads',
    'meetings',
    'meetings-recurring',
    'subscription',
    'meetings',
    'tasks',
    'decisions',
    'logs',
    'import',
  ],

  nhost: {
    subdomain: process.env.NHOST_SUBDOMAIN || 'local',
    region: process.env.NHOST_REGION || '',
    adminSecret: process.env.NHOST_ADMIN_SECRET || 'nhost-admin-secret',
  },

  jwtSecret:
    process.env.NHOST_JWT_SECRET ||
    (process.env.HASURA_GRAPHQL_JWT_SECRET
      ? `{"key":"${process.env.HASURA_GRAPHQL_JWT_SECRET}","type":"HS256"}`
      : ''),

  webhookSecret: process.env.NHOST_WEBHOOK_SECRET,

  mail: {
    sender: {
      name: 'Rolebase.io',
      email: 'noreply@rolebase.io',
    },
    contact: 'contact@rolebase.io',
  },

  sentry: {
    dsn: 'https://20336fa427da0be7bc9da97586db14e4@sentry.lonestone.io/4',
  },

  mailjet: {
    public: process.env.MAILJET_PUBIC_KEY || '',
    private: process.env.MAILJET_PRIVATE_KEY || '',
  },

  security: {
    invitation_token: process.env.SECURITY_INVITATION_TOKEN || '',
  },

  stripe: {
    privateKey: process.env.STRIPE_PRIVATE_KEY || '',
    endpointSecret: process.env.STRIPE_ENDPOINT_SECRET || '',
    startupPlanPriceId: process.env.STRIPE_STARTUP_PLAN_PRICE_ID || '',
  },

  // Search with Algolia
  algolia: {
    appId: process.env.ALGOLIA_APP_ID || '',
    searchApiKey: process.env.ALGOLIA_SEARCH_API_KEY || '',
    adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY || '',
    indexName: 'docs',
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },

  apps: {
    office365: {
      clientId: process.env.APPS_OFFICE365_CLIENT_ID || '',
      clientSecret: process.env.APPS_OFFICE365_CLIENT_SECRET || '',
    },
    googlecalendar: {
      clientId: process.env.APPS_GOOGLECALENDAR_CLIENT_ID || '',
      clientSecret: process.env.APPS_GOOGLECALENDAR_CLIENT_SECRET || '',
    },
  },
}
