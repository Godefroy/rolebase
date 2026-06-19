# Rolebase.io

**[Rolebase](https://rolebase.io)** is the online headquarter for [liberated companies](https://en.wikipedia.org/wiki/Liberated_company).

It's an open source SaaS that helps various organizations implement Holacracy, Sociocracy and other forms of governance.

## Install

### NPM dependencies

Install npm dependencies in all packages:

```
npm install -g turbo
npm i
```

### Nhost

Rolebase's backend is built with [Nhost](https://nhost.io). Follow these steps to set it up (MacOS, Linux):

1.  Create an account on nhost.io : https://app.nhost.io.

2.  Install Nhost CLI (https://docs.nhost.io/getting-started/quickstart/cli)

```
sudo curl -L https://raw.githubusercontent.com/nhost/cli/main/get.sh | bash
```

3.  If you don't have them already, install [Docker](https://www.docker.com/get-started) and [Git](https://git-scm.com/downloads)

4.  Log in to Nhost

Set up for Windows users :

1.  Download Ubuntu from Microsoft store or anywhere else where you can find it.

2.  Upgrade for WSL 2.

3.  On Ubuntu install git, nvm, npm and node (https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl).

4.  Clone project on Ubuntu environment and open project from Ubuntu terminal to VSCode.

5.  If Docker permissions got denied, follow this step to add new user : https://stackoverflow.com/questions/47854463/docker-got-permission-denied-while-trying-to-connect-to-the-docker-daemon-socke , also verify in docker desktop > settings > resources > WSL integration > Enable Ubuntu for wsl distro and apply.

```
nhost login
```

## Start dev environment

1.  Launch Nhost:

```
nhost up
```

2.  Run webapp + backend with watch:

```
npm run dev
```

3.  Open in browser: http://localhost:5175

### Storybook

You can preview and test some components in Storybook.

```
cd packages/webapp
npm run storybook
```

## External services

### Mailjet

Rolebase uses [Mailjet](https://www.mailjet.com/) to send some of its mail.

1. Create a Mailjet account : https://app.mailjet.com/signup
2. Add your account API keys in your environment variables

   - `MAILJET_PUBIC_KEY` : API Key displayed by Mailjet upon account creation or when resetting secret tokens
   - `MAILJET_PRIVATE_KEY` : Secret Key displayed by Mailjet upon account creation or when resetting secret tokens

-> dans .secrets ? ou dans .env ?

ajouter aussi (sinon erreurs dans Hasura)

BACKEND_URL="http://host.docker.internal:8888"
WEBAPP_URL="http://localhost:5175"

### Algolia

To use the search engine across an organization, you need to configure an [Algolia](https://www.algolia.com/) index.

1. Create an Algolia application

2. Create an index and import config:

   - Click "Manage index"
   - Click "Import Configuration"
   - Use `algolia-docs.json` present in this repo
   - Set env variables (see below)

### Stripe

Rolebase also uses [Stripe](https://stripe.com/) for it's subscription feature.
You'll need to [install the cli](https://stripe.com/docs/stripe-cli#install) first.

Once done, run the following command:

```bash
stripe listen --forward-to https://local.functions.nhost.run/routes/subscriptions/stripeWebhook
```

It'll should output your [Stripe webhook endpoint secret](https://dashboard.stripe.com/test/webhooks).

## Configuration

### Secrets

Write Nhost secrets in the file `.secrets`:

```conf
# Nhost config
NHOST_WEBHOOK_SECRET = nhost-admin-secret
HASURA_GRAPHQL_ADMIN_SECRET = nhost-admin-secret
HASURA_GRAPHQL_JWT_SECRET = # Generate a password
GRAFANA_ADMIN_PASSWORD = # Generate a password
MAILJET_SMTP_PASSWORD = # MailJet private key

# Env variables injected in nhost.toml
BACKEND_URL = # URL of your nhost instance, with the path to call the functions
WEBAPP_URL = # URL of your webapp
MAILJET_PUBIC_KEY = # MailJet public key. You can find it here: https://app.mailjet.com/account/api_keys
MAILJET_PRIVATE_KEY = # MailJet private key
SECURITY_INVITATION_TOKEN = # Secret token used to validate invitations. You can generate a token with Lastpass for example
ALGOLIA_APP_ID = # Algolia application ID
ALGOLIA_SEARCH_API_KEY = # Algolia search API key
ALGOLIA_ADMIN_API_KEY = # Algolia admin API key
STRIPE_STARTUP_PLAN_PRICE_ID = # Price id of the startup plan inside stripe
STRIPE_ENDPOINT_SECRET = # Stripe webhook endpoint secret: https://dashboard.stripe.com/test/webhooks
STRIPE_PRIVATE_KEY = # Stripe API private key: https://stripe.com/docs/keys#obtain-api-keys
OPENAI_API_KEY = # OpenAI API key
APPS_OFFICE365_CLIENT_ID = # Office 365 client ID
APPS_OFFICE365_CLIENT_SECRET = # Office 365 client secret
APPS_GOOGLECALENDAR_CLIENT_ID = # Google Calendar client ID
APPS_GOOGLECALENDAR_CLIENT_SECRET = # Google Calendar client secret
```

### Webapp config

Webapp configuration can be written in `settings.ts`:

- url: URL on which the webapp will be served
- websiteUrl: URL to redirect user to if they are not logged in
- nhost.subdomain: Subdomain of your nhost server
- nhost.region: Region of your nhost server
- functionsUrl: URL of your nhost instance, with the path to call the functions
- memberPicture.maxSize: Size (in px) in which your team's members icons will be displayed
- stripe.publicKey: [Stripe API public key](https://stripe.com/docs/keys#obtain-api-keys)

**Note:** This file also specifies configuration for local environment. You should not edit those (unless you know what you're doing).

### Server config

The server config is localized in `packages/backend/src/settings.ts`. You can edit in it:

- url: URL of the webapp
- mail.sender: Name and address to use in send mail

**Note:** Like previous configuration, do avoid editing values for local environment. You should also not edit configurations using environment variables those are to be configured in `.env`).

## Test webhooks by exposing backend port

You can forward the port with VSCode or ngrok.

With VSCode:

- Open "Port" panel (next to "Terminal")
- Add 8888 port
- Click right, "Port visibility" > "Public"

Set resulting URL in `.secrets` (only locally):

```
BACKEND_URL = 'https://XXXXX.devtunnels.ms'
```

Finally, restart local server (`yarn dev`).

## Email templates

### Preview

All email templates are React components using `react-emails` in the folder `packages/emails`

To preview emails:

```
cd packages/emails
npm run dev
```

Then open `http://localhost:8090/`

### Nhost emails

Email templates for Nhost are defined in `nhost/emails` folder.

Check the [documentation](https://docs.nhost.io/authentication/email-templates) to learn more about it.

We generate them with the template `packages/emails/components/templates/NhostLinkEmail.tsx`

Translations are in `packages/emails/i18n/locales`

To build `body.html` and `subject.txt` files, run:

```
cd packages/emails
npm run build
```

### Fonts

Fonts used in emails are included here as static files to be loaded in emails by `packages/emails/components/common/Layout.tsx`

### Icons

Icons we're using in emails are compiled in PNG at build time by `packages/webapp/src/buildEmailsIcons.js` script.

This script contains the list of icons to include.

To test in dev mode, you can update icons with:

```
cd packages/webapp
npm run build-emails-icons
```

## Production env

[Render.com](https://render.com)

- Front (static)
- Storybook (static)
- Collab (Node + y-websocket)

[Nhost.io](https://nhost.io)

- Auth
- Database
- GraphQL API
- Storage
- Run: @rolebase/backend (docker)

## Upgrade Nhost

1.  First, stop Nhost:

```
nhost down
```

2.  Upgrade Nhost CLI:

```
sudo nhost sw upgrade
```

3.  Upgrade package `@nhost/nhost-js`.

## Contributions

Any pull request is welcome to be submitted on this Github project!

Before committing, please:

- Check diff to avoid superfluous changes: `git diff`
- Check typing: `npm run tsc`
- Check linting: `npm run lint`
- Check Migrations:
  - Keep migrations simple and safe, always test them
  - Squash migrations: https://hasura.io/docs/latest/hasura-cli/commands/hasura_migrate_squash/
  - Don't edit a commited migration

Before sending your pull request, please:

- Rebase: `git fetch origin main:main && git rebase main`
- Explain what you're doing and why

## Help & issues

If you're having an issue with Rolebase, feel free to [contact us](https://rolebase.io/contact) or to open an issue on this Github project.

## License

This repository uses two licenses:

- The Rolebase application (everything outside `website/`) is licensed under the [MIT License](./LICENSE).
- The `website/` directory is proprietary and governed by [`website/LICENSE`](./website/LICENSE). Its source is publicly visible but not licensed for reuse.
