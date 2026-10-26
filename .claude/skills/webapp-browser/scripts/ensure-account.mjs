// Creates (once) the local browser test account, verified, with the admin role.
// Local stack only. Usage, from the repo root:
//   node .claude/skills/webapp-browser/scripts/ensure-account.mjs
const auth = 'https://local.auth.local.nhost.run/v1'
const graphql = 'https://local.graphql.local.nhost.run/v1'
const adminSecret = 'nhost-admin-secret' // local default, see codegen.ts
export const email = 'browser-admin@skreo.net'
export const password = 'BrowserAdmin-local-2026!'

async function gql(query, variables) {
  const r = await fetch(graphql, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-hasura-admin-secret': adminSecret },
    body: JSON.stringify({ query, variables }),
  })
  const j = await r.json()
  if (j.errors) throw new Error(JSON.stringify(j.errors))
  return j.data
}

const find = () =>
  gql(`query($e: citext!) { users(where: { email: { _eq: $e } }) { id roles { role } } }`, { e: email })

let { users } = await find()
if (!users[0]) {
  const r = await fetch(`${auth}/signup/email-password`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password, options: { displayName: 'Browser Admin', locale: 'fr' } }),
  })
  if (!r.ok) throw new Error(`Signup failed: ${r.status} ${await r.text()}`)
  ;({ users } = await find())
}
const user = users[0]
await gql(`mutation($id: uuid!) { updateUser(pk_columns: { id: $id }, _set: { emailVerified: true, disabled: false }) { id } }`, { id: user.id })
if (!user.roles.some((r) => r.role === 'admin')) {
  await gql(`mutation($id: uuid!) { insertAuthUserRole(object: { userId: $id, role: "admin" }) { id } }`, { id: user.id })
}
console.log(`ready: ${email} (${user.id})`)
