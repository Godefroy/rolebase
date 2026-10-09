---
name: rolebase
description: Manage the user's Rolebase account (organizations, org chart, roles, members, meetings, discussions, tasks, decisions) through the Rolebase API, with an API key read from the environment. Use when the user asks about their Rolebase organization or wants to change something in it.
---

# Rolebase

Before the first call, read [reference.md](reference.md): the working rules, the data model and ready-made queries. Follow its working rules, above all the approval before any write.

## Setup

- `ROLEBASE_API_KEY` (required): if it is empty, ask the user to create a key in Rolebase (**My account > API keys**) and to set it in the environment. Never ask for the key in the conversation, and never print it.
- `ROLEBASE_API_URL` (optional): defaults to `https://api.rolebase.io`. Set it for a self-hosted or local instance (`http://localhost:8888`).

## GraphQL

Reads and plain edits go through GraphQL. Pass the body through a heredoc to avoid quoting issues, and leave `variables` out rather than setting it to `null`:

```bash
curl -s "${ROLEBASE_API_URL:-https://api.rolebase.io}/graphql" \
  -H "x-api-key: $ROLEBASE_API_KEY" -H 'content-type: application/json' \
  --data @- <<'EOF'
{"query": "query ($orgId: uuid!) { member(where: { orgId: { _eq: $orgId } }) { id name } }",
 "variables": {"orgId": "<orgId>"}}
EOF
```

The response is `{"data": ...}`, or `{"errors": [{"message": ...}]}` with a 400 status.

Explore the schema with introspection on the same endpoint:

- root fields: `{ __schema { queryType { fields { name } } mutationType { fields { name } } } }`
- an object type: `{ __type(name: "task") { fields { name type { name kind ofType { name } } } } }`
- an input type: `{ __type(name: "task_insert_input") { inputFields { name type { name kind ofType { name } } } } }`

## tRPC

Business actions (create an org, invite a member, archive a role with its sub-roles, export data...) go through tRPC procedures:

```bash
# Query: GET with the input as a url-encoded JSON
curl -s -G "${ROLEBASE_API_URL:-https://api.rolebase.io}/org.isOrgSlugAvailable" \
  -H "x-api-key: $ROLEBASE_API_KEY" --data-urlencode 'input={"slug": "acme"}'

# Mutation: POST with the input as the JSON body
curl -s "${ROLEBASE_API_URL:-https://api.rolebase.io}/circle.archiveCircle" \
  -H "x-api-key: $ROLEBASE_API_KEY" -H 'content-type: application/json' \
  --data '{"circleId": "<circleId>"}'
```

The response is `{"result": {"data": ...}}`, or `{"error": {"message": ..., "data": {"code": ...}}}`.

The procedures, their type and input are listed in https://rolebase.io/en/developers/trpc-api.md and the router pages it links to (for instance https://rolebase.io/en/developers/trpc-api/members.md). Skip the internal procedures.

## When this skill is out of date

The online documentation follows every product change, this skill may lag behind. When a call fails in a way this skill or reference.md does not explain, or the API contradicts them:

1. Read the matching pages of the online documentation, from https://rolebase.io/llms.txt (add `.md` to a page URL for its Markdown version), and check the schema by introspection.
2. Carry on with the documented behavior.
3. At the end, tell the user what was out of date. If this skill is installed as a Claude Code plugin, suggest `/plugin marketplace update rolebase`. If it is a local copy, offer to fix SKILL.md or reference.md.
