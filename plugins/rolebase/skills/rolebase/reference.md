# Rolebase guide

Rolebase is an org chart and governance tool for self-managed organizations (Holacracy, Sociocracy, agile teams). The API acts with the permissions of the user who owns the API key, across all their organizations.

## Working rules

1. Find the org first: list the user's orgs, and ask which one when there are several.
2. Read before writing: load what you will change in one query, and reuse the ids it returns.
3. Before any write (GraphQL mutation or tRPC mutation), list the planned changes and wait for the user's go. Take extra care with archiving, invitations (they send an email), members' org roles, the governance mode and anything under `orgSubscription` (billing).
4. Use a tRPC procedure when one exists for the action (archive a role with `circle.archiveCircle`, invite with `member.inviteMember`), GraphQL otherwise.
5. Talk like the app: "role" and "org chart", never "circle" or "graph".
6. On a permission error, check the org's governance mode and the member's org role before trying another way.
7. When the API contradicts this guide (unknown field, type or procedure, changed values), the API is right. Check the schema, then the online documentation, kept up to date with the product: start from https://rolebase.io/llms.txt, which lists every page, and read the Markdown version of a page by adding `.md` to its URL (for instance https://rolebase.io/en/developers/graphql-api/task.md). Carry on with what you learned.

## Hasura conventions

- Tables are queried as `task(where: ..., order_by: ..., limit: ...)` and `task_by_pk(id: ...)`.
- Mutations: `insert_task_one(object: ...)`, `update_task_by_pk(pk_columns: { id: ... }, _set: ...)`.
- Rows are archived, never deleted: set `archivedAt` to the current timestamp, and filter lists with `archivedAt: { _is_null: true }`.

## Data model

- `org`: almost every row has an `orgId`. `users { id displayName }` returns the current user.
- `member`: a person in an org, linked to an account through `userId` once invited. Their `role` in the org is Owner, Admin, Member or Readonly. The current user's member is the one whose `userId` is theirs.
- `role`: what a role is about (name, purpose, domain, accountabilities, checklist, indicators, notes). A `base` role is a shared definition reused in several places.
- `circle`: a place of a role in the org chart, with `roleId` and `parentId` (null at the top). Users only talk about "roles": a circle is a role that contains other roles. To add a role to the org chart, insert the `role`, then a `circle` pointing to it.
- `circle_member`: a member assigned to a circle. `circle_leader` gives the leaders of each circle, `circle_participant` everyone taking part in it.
- `thread` and `thread_activity`: discussions in a circle, including proposals and polls. `meeting` and `meeting_step`: meetings and their agenda. `task`: tasks, with a `status` among Open, InProgress, InReview, Blocked and Done. `decision`: recorded decisions.
- Text fields hold markdown. Mentions are written `[@Name](rolebase://member/<memberId>)`.

## Governance

`org.governanceMode` sets who may change the org chart: Free (all members), Agile (leaders of each role) or Strict (only through proposals). A permission error on a structure change usually comes from this mode or from the member's org role.

## Recipes

Orgs of the current user:

```graphql
{ org(where: { archivedAt: { _is_null: true } }) { id name } }
```

Org chart, with the role and members of each circle:

```graphql
query ($orgId: uuid!) {
  circle(where: { orgId: { _eq: $orgId }, archivedAt: { _is_null: true } }) {
    id
    parentId
    role { id name purpose }
    members(where: { archivedAt: { _is_null: true } }) { member { id name } }
  }
}
```

Open tasks, soonest first:

```graphql
query ($orgId: uuid!) {
  task(
    where: { orgId: { _eq: $orgId }, archivedAt: { _is_null: true }, status: { _neq: Done } }
    order_by: { dueDate: asc_nulls_last }
  ) { id title status dueDate member { name } }
}
```

Recent meetings:

```graphql
query ($orgId: uuid!) {
  meeting(
    where: { orgId: { _eq: $orgId }, archivedAt: { _is_null: true } }
    order_by: { startDate: desc }
    limit: 10
  ) { id title startDate ended circle { role { name } } }
}
```

Add a role under a circle: `insert_role_one(object: { orgId, name, purpose })`, then `insert_circle_one(object: { orgId, roleId, parentId })`.

Assign a member to a circle: `insert_circle_member_one(object: { orgId, circleId, memberId })`.
