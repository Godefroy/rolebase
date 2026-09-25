// Delivery of the sign-in code emails, from Brevo. Read-only. Prints email
// domains, never full addresses.
// 1. Delay between each new account (created on its first code request) and
//    its first code email: a delay means codes weren't sent (outage).
// 2. Brevo events of the accounts that never entered their code: delivered,
//    bounced, blocked...
// Usage, from the repo root (IPv4: the IPv4 address is the one authorized in
// Brevo, and macOS rotates its IPv6 addresses):
//   node --dns-result-order=ipv4first --env-file=.env .claude/skills/analyze-onboarding/scripts/brevo-delivery.mjs [days=7]
const env = process.env
const DAYS = Number(process.argv[2] || 7)
const from = new Date(Date.now() - DAYS * 24 * 3600 * 1000)
const startDate = from.toISOString().slice(0, 10)
const endDate = new Date().toISOString().slice(0, 10)
const hasura = env.HASURA_PROD_GRAPHQL_URL.replace(/\/v1\/graphql\/?$/, '')
const CODE_SUBJECT = /code/i // "Votre code de connexion Rolebase", "Your Rolebase sign-in code"

async function sql(q) {
  const r = await fetch(hasura + '/v2/query', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': env.HASURA_PROD_ADMIN_SECRET,
    },
    body: JSON.stringify({
      type: 'run_sql',
      args: { source: 'default', read_only: true, sql: q },
    }),
  })
  const j = await r.json()
  if (!r.ok || j.error) throw new Error(JSON.stringify(j).slice(0, 500))
  return j.result.slice(1)
}

async function brevo(path) {
  const r = await fetch('https://api.brevo.com/v3' + path, {
    headers: { 'api-key': env.BREVO_API_KEY, accept: 'application/json' },
  })
  const body = await r.json()
  if (!r.ok) {
    // e.g. 401 when this IP isn't in Brevo's authorized IPs
    console.error(`Brevo error ${r.status}: ${body.message}`)
    process.exit(1)
  }
  return body.events || []
}

// 1. Delay of the first code email
const requests = []
for (let offset = 0; ; offset += 2500) {
  const events = await brevo(
    `/smtp/statistics/events?startDate=${startDate}&endDate=${endDate}&event=requests&limit=2500&offset=${offset}&sort=asc`
  )
  requests.push(...events)
  if (events.length < 2500) break
}
const codeTimes = {}
for (const e of requests.filter((e) => CODE_SUBJECT.test(e.subject || ''))) {
  ;(codeTimes[e.email.toLowerCase()] ||= []).push(Date.parse(e.date))
}
const users = await sql(
  `select lower(email), extract(epoch from created_at) * 1000, email_verified from auth.users where not is_anonymous and created_at >= '${from.toISOString()}' order by created_at`
)
console.log(
  '== Delay of the first code email after account creation (> 5 min is abnormal)'
)
let late = 0
for (const [email, createdMs, verified] of users) {
  const created = Number(createdMs)
  const first = (codeTimes[email] || [])
    .filter((t) => t >= created - 60000)
    .sort()[0]
  const delay =
    first === undefined ? undefined : Math.round((first - created) / 60000)
  if (delay === undefined || delay > 5) late++
  console.log(
    `${new Date(created).toISOString().slice(5, 16)} ${email.split('@')[1]} verified=${verified} ${delay === undefined ? 'NO CODE EMAIL' : delay + ' min'}`
  )
}
console.log(
  `${late} of ${users.length} accounts without a code email within 5 minutes`
)

// 2. Accounts that never entered their code
console.log('\n== Brevo events of accounts that never entered their code')
for (const [email, createdMs, verified] of users) {
  if (verified === 't') continue
  const events = await brevo(
    `/smtp/statistics/events?email=${encodeURIComponent(email)}&startDate=${startDate}&endDate=${endDate}&limit=50&sort=asc`
  )
  console.log(
    `\n${email.split('@')[1]} (account ${new Date(Number(createdMs)).toISOString().slice(5, 16)})`
  )
  if (!events.length) console.log('  no Brevo event')
  for (const e of events) {
    // The code is in the subject: mask it
    const subject = (e.subject || '').replace(/\d{6}/g, '######').slice(0, 50)
    console.log(
      `  ${e.date.slice(5, 16)} ${e.event}${e.reason ? ` (${e.reason.slice(0, 100)})` : ''} «${subject}»`
    )
  }
}
