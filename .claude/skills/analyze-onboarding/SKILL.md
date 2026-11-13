---
name: analyze-onboarding
description: Weekly analysis of the signup and onboarding funnel from production data (database + Umami), compared with previous weeks, ending with ranked improvement proposals. Use when the user asks to analyze onboarding, activation or signups, or runs /analyze-onboarding.
---

# Analyze onboarding

Say how the week's signups went through onboarding, what moved compared with previous weeks, and what to improve, with evidence.

## 1. Collect

From the repo root:

```bash
node --env-file=.env .claude/skills/analyze-onboarding/scripts/report.mjs [days=7]
```

It prints weekly cohorts, one line per self-serve signup of the window, invitees who hit the wizard, reminder outcomes, todo statuses, Umami unique sessions (window vs previous window), abandonment steps and per-session event sequences.

- Everything is read-only: Hasura `run_sql` with `read_only: true`, Umami API. Never write to production.
- Print email domains, never full addresses.
- For a question the report doesn't answer, write an ad-hoc script in `/tmp` reusing the report's `sql()` / `umami()` helpers, run with `node --env-file=.env`.
- Optional: onboarding errors in Sentry through the `sentry-debug` skill, read-only (resolve nothing).
- Sign-in code delivery, every week: `node --dns-result-order=ipv4first --env-file=.env .claude/skills/analyze-onboarding/scripts/brevo-delivery.mjs [days]`. It prints the delay of each new account's first code email (a delay over 5 minutes means codes weren't sent) and the Brevo events of accounts that never entered their code (bounced, blocked...). Brevo only accepts the authorized IPs: on a 401, ask the user to authorize the IP shown.

## 2. Funnel map

| Step | Code (`packages/webapp/src/features/`) | Data |
|---|---|---|
| Sign-in code, name | `user/components/OtpForm.tsx`, `user/pages/UserNamePage.tsx` | `auth_otp_*` (`auth_otp_bounced`: the code bounced, shown on the code step), `user_name_*`. The account exists from the code request: `email_verified = false` means the code was never entered; the account is deleted when its code bounces (`user/brevoWebhook.ts`) |
| Join instead of create | `org/pages/OrgsPage.tsx`, `member/hooks/usePendingInvitations.ts` | invitations matched on the email |
| Wizard (org name, role, objective, source), org created at the end | `onboarding/wizard/` | `onboarding_*`, `metadata.onboardingStartedAt`, `onboardingRole/Objective/Source` |
| Setup (Model, Members, Invite), seeded when the members are validated | `onboarding/modals/OrgSetupModal.tsx` | `org_setup_*` (`org_setup_resumed` = reload, with the step reached), `invite_step_skipped`. An org with no `role.base` never validated its members |
| Org chart tour (open the org, create a role, open it, give it a member, place everyone), then optionally leader, representative, participants. Restarted at each opening while the org chart is empty | `onboarding/hooks/useOrgChartTour.ts`, `onboarding/components/OrgChartTourTrigger.tsx` | `org_tour_*` (`org_tour_more_started` for the optional chapter, `org_tour_started` with `relaunched` when an empty org chart restarts it on opening), `metadata.orgChartTours[orgId]`: `started`, `replay` (replayed from the todo), `more`, `completed`, `skipped` |
| Getting started todo | `onboarding/hooks/useOnboardingTodo.ts` | `onboarding_todo_item_clicked` (`item`, `done`), `onboarding_todo_toggled`, `org.onboardingTodo`: null = open, `completed`, `dismissed` |
| Reminder emails | `packages/backend/src/features/cron/sendOnboardingReminders.ts` | `metadata.onboardingReminders.{noOrg,noSetup,noInvite}` |
| Return, activation | `org/hooks/useOrgLifecycleTracking.ts` | `org_returned`, `activation_reached`: within 7 days, 2 accounts and a held meeting, thread or decision |

## 3. Read with care

- Give counts next to percentages. Below about 10 people per group, describe a trend to watch, never a conclusion. Compare with the 4 previous weeks.
- The last week's 7-day metrics are still incomplete.
- Umami: count unique sessions. A session is per device and per day, so one person can span several. Abandonment events fire on `pagehide` (close or reload), once per browser and step. A later `onboarding_resumed` in the same browser means a reload or a return, not a loss. Each session line names the org opened (Umami gets its `orgId`, never the user id) and its owner, the last org of the day on that device; a session that opened no org stays `?`.
- Self-serve = signups minus `joined_team` (invitees).
- Leave out internal accounts (lonestone domains) and obvious tests.
- Low invitation and activation rates are expected: most people test the product alone before inviting anyone. The invite step mainly shows that Rolebase is collaborative; don't push to make it more prominent.
- When numbers look odd, rebuild individual journeys by matching database timestamps with Umami sequences.

## 4. Report, in French

1. Verdict in 2 or 3 lines: healthy or not, what moved.
2. Funnel table, week vs previous weeks: self-serve, verified, org created, setup done, invited, 2 accounts, activated, came back. Then reminders and todo.
3. Individual journeys worth attention: stuck people, loops, real prospects to contact personally (domain only).
4. Improvements ranked by expected impact, each with its evidence, the files to change and the effort. Check the code before proposing. Include tracking gaps.

- Change no code and contact nobody without the user's go.
- Ask decisions and propose options with `AskUserQuestion`.
- Offer to draft emails to the prospects. Drafts go in the mailbox through a paseo agent in `../perso`.
