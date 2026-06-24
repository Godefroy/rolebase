---
name: sentry-debug
description: Fetch, triage and resolve production errors from the self-hosted Sentry (sentry.lonestone.io). Use when the user asks to "look at Sentry", "récupérer/traiter les erreurs Sentry", debug a production error, or mark Sentry issues as resolved.
user_invocable: true
arguments:
  - name: project
    description: "Which project: webapp, backend, or both (default both)"
    required: false
---

# Debug with Sentry

Rolebase uses a **self-hosted Sentry** at `sentry.lonestone.io`.

| | Org | Project slug | Project id |
|---|---|---|---|
| Webapp (front) | `lonestone` | `rolebase-webapp` | 5 |
| Backend (API) | `lonestone` | `rolebase-backend` | 4 |

The webapp DSN is in `packages/webapp/src/settings.ts`, the backend one in `packages/backend/src/settings.ts`.

## Auth token

`SENTRY_AUTH_TOKEN` lives in the project root `.env`. **Never read or print `.env` yourself.** Load it into the shell env once, without echoing the value — both the official CLI and the helper script then pick it up automatically:

```bash
export SENTRY_AUTH_TOKEN="$(grep '^SENTRY_AUTH_TOKEN=' .env | head -1 | cut -d= -f2- | tr -d '"'"'"'')"
export SENTRY_URL=https://sentry.lonestone.io
echo "token: ${#SENTRY_AUTH_TOKEN} chars"   # length only
```

The token is org-scoped (`/organizations/` may return 403 — harmless; everything below is project-scoped).

## List and resolve — official `sentry-cli`

Use the maintained official CLI (`npx @sentry/cli`, no install needed) for everything except event detail:

```bash
# List unresolved issues (newest first); swap project to rolebase-webapp
npx @sentry/cli issues list -o lonestone -p rolebase-backend --query "is:unresolved" --max-rows 15

# Resolve / mute one or more issues by numeric Issue ID
npx @sentry/cli issues resolve -o lonestone -p rolebase-backend -i <ID>
npx @sentry/cli issues mute    -o lonestone -p rolebase-backend -i <ID>
```

`--query` accepts the full Sentry search syntax (`is:unresolved`, `is:unresolved level:fatal`, etc.). Projects: `rolebase-webapp`, `rolebase-backend`.

## Inspect one event — `scripts/sentry_event.py`

`sentry-cli` cannot dump a single event's stacktrace, so use this small stdlib script (it auto-loads the token from env or `.env`, never printing it). Pass the numeric **Issue ID** from the list:

```bash
python3 .claude/skills/sentry-debug/scripts/sentry_event.py <ID>
```

It prints the title, culprit, in-app stacktrace frames, request URL and key tags (`transaction`, `environment`, `release`).

## Triage methodology

Sort each issue into one of four buckets before fixing anything:

1. **Already fixed in current code** — the error message points to a symbol/file; grep `packages/` to confirm the bug no longer exists (old build still reporting). → mark **resolved** in Sentry, no code change.
2. **Deploy / migration timing** — e.g. `field 'X' not found in type 'Y_bool_exp'` or a uniqueness violation on an **old** constraint name. The code is ahead of the prod DB/metadata. → identify the migration under `nhost/migrations/`, confirm via `lastSeen` whether it is applied in prod yet; resolution is operational (apply migration + `hasura metadata reload`), not a code fix.
3. **Real code bug** — reproduce from the stacktrace/culprit and fix in `packages/`. Front-end frames are minified unless sourcemaps are uploaded (see below).
4. **Expected noise / transient** — `JWTExpired`, `NetworkError`, CSS preload after deploy, OAuth `invalid_grant` once handled. → ignore, or handle gracefully so it stops being captured (e.g. `captureError` guards).

Prioritize by `events`/`userCount` and `lastSeen`. Verify a fix actually targets the live error before resolving.

## Frontend sourcemaps

Already wired: `@sentry/vite-plugin` (v4, Debug IDs) in `packages/webapp/vite.config.ts`, `build.sourcemap: true`. Uploads happen during the **Netlify** build only when `SENTRY_AUTH_TOKEN`, `SENTRY_URL=https://sentry.lonestone.io`, `SENTRY_ORG=lonestone`, `SENTRY_PROJECT=rolebase-webapp` are set in the Netlify build env. If front-end stacks are still minified, those env vars are missing on the failing release.

## Don'ts

- Never read or echo `.env` contents.
- Don't resolve an issue whose root cause ships only in an undeployed fix; it will reopen.
- Don't run codegen by hand (a `.gql`/`gql()` change regenerates via the dev server).
