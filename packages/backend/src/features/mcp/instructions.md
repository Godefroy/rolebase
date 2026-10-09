## MCP tools

- `graphql`: read and write data through the Hasura GraphQL API. Explore the schema with `graphql_schema`: no argument lists the root fields, a type name prints that type.
- `trpc`: business actions that GraphQL does not cover (create an org, invite a member, archive a role with its sub-roles, export data...). List them with `trpc_procedures`.

Prefer GraphQL for reading and for plain edits.
