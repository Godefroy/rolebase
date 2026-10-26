---
name: webapp-browser
description: Test anything in the local Rolebase webapp with the Playwright browser, signed in as a local test admin, with few tokens. Use to check a UI change, open a page or modal, take a screenshot, or test a flow end to end in the webapp (including /admin).
---

# Webapp browser tests

Local stack only: webapp `http://localhost:5175`, backend `http://localhost:8888/healthz`, Hasura `https://local.graphql.local.nhost.run/v1` (admin secret `nhost-admin-secret`), Mailhog `https://local.mailhog.local.nhost.run`. If the webapp or backend does not answer, ask the user to start the dev server.

## Sign in (one call)

1. Once per machine, create the test account (`browser-admin@skreo.net`, verified, admin role). The script is idempotent:
   `node .claude/skills/webapp-browser/scripts/ensure-account.mjs`
2. Open any webapp page with `browser_navigate`, then sign in with `browser_evaluate`. No email code needed:

```js
async () => {
  const r = await fetch('https://local.auth.local.nhost.run/v1/signin/email-password', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'browser-admin@skreo.net', password: 'BrowserAdmin-local-2026!' }) })
  const { session } = await r.json()
  const p = JSON.parse(atob(session.accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
  localStorage.setItem('nhostSession', JSON.stringify({ ...session, decodedToken: { ...p, iat: p.iat * 1000, exp: p.exp * 1000 } }))
  location.reload()
  return session.user.email
}
```

To test as a regular user, create another `@skreo.net` account the same way, without the admin role. "Log in as" in `/admin/users` also works.

## Save tokens

- `browser_navigate` and `browser_click` save the snapshot to `.playwright-mcp/*.yml`. Find refs with `grep -n "Label" <file>`, or `grep -n "Label" -A12 <file> | grep button`, instead of reading the snapshot.
- Read a part of the page with `browser_snapshot` and `target` (e.g. `[role=dialog]`) plus `depth`.
- Check a value with `browser_evaluate` returning a short string, not with a snapshot.
- Screenshots go in `.playwright-mcp/` (other paths are refused). Use `browser_resize` (e.g. 1280×1400) to fit a whole modal in a single screenshot.
- Batch independent calls in one message.

## Test data

- Seed through the admin GraphQL API with a `tsx` script outside the repo, run from `packages/backend` (`npx tsx /tmp/x/seed.ts`). Import `nhost` from `packages/backend/src/utils/nhost` and call `nhost.graphql.request({ query, variables })`. Throw if `nhost.graphql.url` does not contain `local`.
- Only `@skreo.net` emails. Use a recognizable prefix in emails and slugs so the cleanup can find them.
- Clean up at the end with `deleteOrgs` and `eraseUserAccount` from `packages/backend/src/features/superAdmin/utils/`, then check that nothing with the prefix remains. Keep the `browser-admin` account.
- Sign-in codes and other emails: Mailhog API at `https://local.mailhog.local.nhost.run/api/v2/messages?limit=1`.
