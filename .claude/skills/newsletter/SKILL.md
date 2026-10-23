---
name: newsletter
description: Create, update, test or send a Rolebase email campaign to all users (product newsletter or legal information such as a change of terms or operator). Use when the user asks to write, edit, test or send a newsletter, a campaign or a legal email, or runs /newsletter.
user_invocable: true
---

# Newsletter

Campaigns live in `packages/newsletter/campaigns/{slug}/`, one `fr.md` and one `en.md`. The CLI renders the markdown in the layout of `src/templates.ts`. Users with another locale get the `en` version.

- Product newsletters are Brevo campaigns, one per language, to the lists `Rolebase users FR` / `EN` (folder `Rolebase`), with Brevo's mandatory unsubscribe link.
- Legal emails (`legal: true`) are transactional emails to every user, unsubscribed ones included, without unsubscribe link (Brevo campaigns force one).

## Create or update a campaign

- Slug: `YYYY-MM-DD-name` (planned send date). Only the most recent slug can be sent, so a new campaign gets a later date than every existing one.
- Frontmatter:

  ```yaml
  subject: Subject line
  preview: Text shown after the subject in the inbox
  legal: true        # legal information, sent as transactional emails. Omit for a product newsletter.
  ctaLabel: Open Rolebase   # optional button after the content
  ctaUrl: https://rolebase.io/
  ```

  `sentAt` is written by the CLI after a send. Never add or edit it by hand.
- Body: markdown (paragraphs, `##` headings, lists, links, images). `{{ firstName }}` becomes the contact's first name, removed when unknown (`Bonjour {{ firstName }},`).
- Images: next to the md files, referenced relatively (`![alt](./image.jpg)`), at most 1200 px wide. `test` and `send` upload them to the production Nhost storage (public by id) and record their URL in `images.json`.
- Write both languages, each in its own language, following the website writing rules of `CLAUDE.md`. Sign as Godefroy de Compreignac, founder of Rolebase.
- Never edit a sent campaign (`sentAt` set): create a new slug.
- Commit `images.json` and `brevo.json` (Brevo campaign ids of a product newsletter) with the campaign.

## Test

Always test before sending, in each language that changed:

```bash
npm run -s newsletter -w @rolebase/newsletter -- test {slug} --lang fr
```

It sends the email to `NEWSLETTER_TEST_USER_ID` (for a product newsletter, after creating or updating the Brevo campaign draft). Ask the user to check the email in their inbox.

## Send

Sending reaches every non-disabled user (about 2,000) and cannot be undone. Only send after the user approved the test and explicitly asked to send this campaign.

1. `npm run -s newsletter -w @rolebase/newsletter -- send {slug} --dry-run` and report the user counts and Brevo credits.
2. After explicit confirmation: same command with `--yes` instead of `--dry-run`. It syncs the users to the Brevo lists (adds and updates them, removes disabled ones, keeps unsubscribed contacts unsubscribed), refuses if the Brevo credits do not cover the send plus a reserve for the app's emails, then sends. An interrupted legal send resumes where it stopped (`sent.txt`, gitignored).
3. Commit the `sentAt` written in the md files (with user approval).

Brevo handles unsubscribes. An unsubscribe blocks the address for every campaign of the Brevo account, but never the legal emails.

## Templates

`src/templates.ts` is also pushed to Brevo as templates (layouts for campaigns made in Brevo's editor): `npm run -s newsletter -w @rolebase/newsletter -- templates`. A new template prints its id, to set in `src/config.ts`.

## Env

`packages/newsletter/.env` then the root `.env`: `BREVO_API_KEY`, `HASURA_PROD_GRAPHQL_URL`, `HASURA_PROD_ADMIN_SECRET`, `NEWSLETTER_TEST_USER_ID` (see `.env.example`). Brevo only accepts authorized IPs: on a 401, ask the user to authorize the IP shown.
