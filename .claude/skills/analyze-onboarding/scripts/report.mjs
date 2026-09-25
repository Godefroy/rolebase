// Onboarding report: read-only SQL on the production database (Hasura run_sql)
// and Umami events. Prints email domains, never full addresses.
// Usage, from the repo root:
//   node --env-file=.env .claude/skills/analyze-onboarding/scripts/report.mjs [days=7]
const env = process.env
const DAYS = Number(process.argv[2] || 7)
const now = Date.now()
const day = 24 * 3600 * 1000
const from = new Date(now - DAYS * day).toISOString()
const prevFrom = new Date(now - 2 * DAYS * day).toISOString()

const hasura = env.HASURA_PROD_GRAPHQL_URL.replace(/\/v1\/graphql\/?$/, '')
async function sql(q) {
  const r = await fetch(hasura + '/v2/query', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': env.HASURA_PROD_ADMIN_SECRET,
    },
    body: JSON.stringify({
      type: 'run_sql',
      args: { source: 'default', sql: q, read_only: true },
    }),
  })
  const j = await r.json()
  if (!r.ok || j.error) throw new Error(JSON.stringify(j).slice(0, 500))
  return j.result
}
const show = (title, rows) => {
  console.log('\n== ' + title)
  for (const row of rows) console.log(row.join(' | '))
}

console.log(
  `Window: last ${DAYS} days (since ${from.slice(0, 16)}), previous window since ${prevFrom.slice(0, 16)}`
)

// Self-serve = not joining an org that existed before the account
const JOINED = `exists(select 1 from member m join org o on o.id=m."orgId" where m."userId"=u.id and o."createdAt" < u.created_at - interval '5 minutes')`

show(
  'Weekly signup cohorts (7-day metrics are incomplete for the last week)',
  await sql(`
with u as (select * from auth.users u where not is_anonymous and created_at >= now() - interval '12 weeks'),
owned as (
  select distinct on (m."userId") m."userId", o.id org_id, o."createdAt" org_created, o."archivedAt"
  from member m join org o on o.id=m."orgId" join u on u.id=m."userId"
  where m.role='Owner' and o."createdAt" >= u.created_at - interval '5 minutes'
  order by m."userId", o."createdAt"
), s as (
  select u.id, u.created_at, u.email_verified, u.last_seen, ${JOINED} joined, ow.*,
    exists(select 1 from role r where r."orgId"=ow.org_id and r.base) setup,
    exists(select 1 from member m where m."orgId"=ow.org_id and m."inviteDate" < ow.org_created + interval '7 days') invited7,
    (select count(*) from member m where m."orgId"=ow.org_id and m."userId" is not null and m."createdAt" < ow.org_created + interval '7 days') accounts7,
    exists(select 1 from meeting x where x."orgId"=ow.org_id and x.ended and x."createdAt" < ow.org_created + interval '7 days')
      or exists(select 1 from thread x where x."orgId"=ow.org_id and x."createdAt" < ow.org_created + interval '7 days')
      or exists(select 1 from decision x where x."orgId"=ow.org_id and x."createdAt" < ow.org_created + interval '7 days') collab7
  from u left join owned ow on ow."userId"=u.id
)
select to_char(date_trunc('week', created_at), 'YYYY-MM-DD') week,
  count(*) signups, count(*) filter (where joined) joined_team,
  count(*) filter (where not joined) self_serve,
  count(*) filter (where not joined and email_verified) verified,
  count(*) filter (where org_id is not null) org_created,
  count(*) filter (where setup) setup_done,
  count(*) filter (where org_id is not null and not setup) setup_abandoned,
  count(*) filter (where "archivedAt" is not null) archived,
  count(*) filter (where invited7) invited7,
  count(*) filter (where accounts7 >= 2) two_accounts7,
  count(*) filter (where collab7) collab7,
  count(*) filter (where accounts7 >= 2 and collab7) activated7,
  count(*) filter (where org_id is not null and last_seen > org_created + interval '1 day') came_back
from s group by 1 order by 1`)
)

show(
  `Self-serve signups of the window, one line each`,
  await sql(`
select to_char(u.created_at,'MM-DD HH24:MI') created, split_part(u.email,'@',2) domain, u.locale, u.email_verified verified,
  u.password_hash is not null password,
  to_char((u.metadata->>'onboardingStartedAt')::timestamptz - u.created_at, 'HH24:MI:SS') wizard_after,
  u.metadata->'onboardingReminders' reminders, to_char(u.last_seen,'MM-DD HH24:MI') last_seen,
  (select string_agg(concat(to_char(o."createdAt",'MM-DD HH24:MI'), ' type=', o."onboardingOrgType", ' todo=', coalesce(o."onboardingTodo",'open'),
     ' circles=', (select count(*) from circle c where c."orgId"=o.id and c."archivedAt" is null),
     ' base=', (select count(*) from role r where r."orgId"=o.id and r.base),
     ' members=', (select count(*) from member mm where mm."orgId"=o.id and mm."archivedAt" is null),
     ' invites=', (select count(*) from member mm where mm."orgId"=o.id and mm."inviteDate" is not null),
     ' accounts=', (select count(*) from member mm where mm."orgId"=o.id and mm."userId" is not null),
     ' meetings=', (select count(*) from meeting t where t."orgId"=o.id),
     ' threads=', (select count(*) from thread t where t."orgId"=o.id),
     ' logs=', (select count(*) from log l where l."orgId"=o.id),
     ' archived=', o."archivedAt" is not null), ' ; ')
   from member m join org o on o.id=m."orgId" where m."userId"=u.id and m.role='Owner') owned_orgs
from auth.users u
where not u.is_anonymous and u.created_at >= '${from}' and not ${JOINED}
order by u.created_at`)
)

show(
  'Accounts of the window that joined a team (by org)',
  await sql(`
select to_char(o."createdAt",'YYYY-MM') org_created, count(distinct u.id) accounts,
  count(distinct u.id) filter (where u.metadata->>'onboardingStartedAt' is not null) saw_wizard
from auth.users u join member m on m."userId"=u.id join org o on o.id=m."orgId"
where not u.is_anonymous and u.created_at >= '${from}' and o."createdAt" < u.created_at - interval '5 minutes'
group by o.id, 1 order by 2 desc`)
)

show(
  'Invited people who went through the wizard first (window)',
  await sql(`
select split_part(u.email,'@',2) domain, to_char((u.metadata->>'onboardingStartedAt')::timestamptz,'MM-DD HH24:MI') wizard,
  to_char(m."inviteDate",'MM-DD HH24:MI') invited, m.role
from auth.users u join member m on m."userId"=u.id
where (u.metadata->>'onboardingStartedAt')::timestamptz >= '${from}' and m.role <> 'Owner'`)
)

show(
  'Reminders sent (window) and what happened after',
  await sql(`
with r as (
  select u.id, k type, (v #>> '{}')::timestamptz sent_at
  from auth.users u, jsonb_each(coalesce(u.metadata->'onboardingReminders','{}'::jsonb)) as e(k, v)
  where (v #>> '{}')::timestamptz >= '${from}'
)
select type, count(*) sent,
  count(*) filter (where exists(select 1 from auth.users u where u.id=r.id and u.last_seen > r.sent_at)) came_back,
  count(*) filter (where type='noOrg' and exists(select 1 from member m join org o on o.id=m."orgId" where m."userId"=r.id and o."createdAt" > r.sent_at)) created_org,
  count(*) filter (where type='noSetup' and exists(select 1 from member m join role ro on ro."orgId"=m."orgId" where m."userId"=r.id and m.role='Owner' and ro.base and ro."createdAt" > r.sent_at)) finished_setup,
  count(*) filter (where type='noInvite' and exists(select 1 from member m join member i on i."orgId"=m."orgId" where m."userId"=r.id and m.role='Owner' and i."inviteDate" > r.sent_at)) invited
from r group by 1 order by 1`)
)

show(
  'Onboarding todo of orgs created in the last 8 weeks',
  await sql(`
select coalesce("onboardingTodo",'open') status, count(*) orgs, count(*) filter (where "archivedAt" is not null) archived
from org where "createdAt" >= now() - interval '8 weeks' group by 1 order by 1`)
)

// Umami
const umamiApi =
  env.UMAMI_BASE_URL.replace(/\/$/, '') +
  (env.UMAMI_BASE_URL.includes('/api') ? '' : '/api')
const WEBSITE = 'b551cd9c-5426-410a-83ed-94d46b6a7865' // webapp tracker (data-tag "app"), see packages/webapp/index.html
async function umami(path) {
  const r = await fetch(umamiApi + path, {
    headers: {
      authorization: 'Bearer ' + env.UMAMI_API_KEY,
      accept: 'application/json',
    },
  })
  const t = await r.text()
  if (!r.ok) throw new Error(`${r.status} ${path} ${t.slice(0, 200)}`)
  return JSON.parse(t)
}
async function events(start, end) {
  const all = []
  for (let page = 1; page < 100; page++) {
    const r = await umami(
      `/websites/${WEBSITE}/events?startAt=${start}&endAt=${end}&page=${page}&pageSize=200`
    )
    all.push(...r.data)
    if (all.length >= r.count || !r.data.length) break
  }
  return all
}
const FUNNEL =
  /^(auth_|user_name|onboarding_|org_setup|invite_step|member_invit|org_archived|org_returned|activation_reached|book_demo)/
const uniqueSessions = (evs) => {
  const sets = {}
  for (const e of evs)
    if (FUNNEL.test(e.eventName))
      (sets[e.eventName] ||= new Set()).add(e.sessionId)
  return Object.fromEntries(Object.entries(sets).map(([k, v]) => [k, v.size]))
}
const cur = await events(Date.parse(from), now)
const prev = await events(Date.parse(prevFrom), Date.parse(from))
const curU = uniqueSessions(cur),
  prevU = uniqueSessions(prev)
show(
  'Umami: unique sessions per event (window | previous window)',
  [...new Set([...Object.keys(curU), ...Object.keys(prevU)])]
    .sort((a, b) => (curU[b] || 0) - (curU[a] || 0))
    .map((k) => [k, curU[k] || 0, prevU[k] || 0])
)

for (const [event, prop] of [
  ['onboarding_abandoned', 'step'],
  ['org_setup_abandoned', 'step'],
  ['org_setup_completed', 'orgType'],
  ['org_setup_failed', 'reason'],
  ['org_archived', 'ageMinutes'],
  ['onboarding_todo_dismissed', 'doneCount'],
]) {
  const values = await umami(
    `/websites/${WEBSITE}/event-data/values?startAt=${Date.parse(from)}&endAt=${now}&event=${event}&propertyName=${prop}`
  ).catch(() => [])
  if (values.length)
    show(
      `Umami: ${event} by ${prop}`,
      values.map((v) => [v.value, v.total])
    )
}

const bySession = {}
for (const e of cur
  .filter((e) => FUNNEL.test(e.eventName))
  .sort((a, b) => a.createdAt.localeCompare(b.createdAt)))
  (bySession[e.sessionId] ||= []).push(e)
console.log(
  '\n== Umami: sessions of the window touching onboarding (ob = onboarding_, setup = org_setup_)'
)
for (const [session, evs] of Object.entries(bySession)) {
  if (!evs.some((e) => /^(onboarding_|org_setup)/.test(e.eventName))) continue
  const seq = []
  for (const e of evs) {
    const n = e.eventName
      .replace(/^onboarding_/, 'ob:')
      .replace(/^org_setup_/, 'setup:')
    if (seq.at(-1)?.n === n) seq.at(-1).c++
    else seq.push({ n, c: 1 })
  }
  console.log(
    evs[0].createdAt.slice(5, 16),
    session.slice(0, 6),
    evs[0].country || '',
    seq.map((x) => (x.c > 1 ? `${x.n}x${x.c}` : x.n)).join(' > ')
  )
}
