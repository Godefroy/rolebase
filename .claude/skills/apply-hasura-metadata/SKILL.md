---
name: apply-hasura-metadata
description: Apply local Hasura metadata changes (permissions, relationships, tracked tables) from nhost/metadata to the running Hasura instance. Use after editing files under nhost/metadata/ when the change must take effect without restarting the stack, or when a GraphQL error like "field 'X' not found in type 'Y_set_input'" means the live schema is out of sync with the YAML.
user_invocable: true
arguments:
  - name: env
    description: "Target environment: local (default) or prod"
    required: false
---

# Apply Hasura metadata

Editing files under `nhost/metadata/` does **not** change the running Hasura: metadata lives in the database and is only loaded at stack startup or when explicitly applied. After editing a `nhost/metadata/**/*.yaml` file (e.g. a table permission), apply it with one of the methods below, then verify.

## Connection settings

**Local** (nhost dev stack):

```
ENDPOINT=https://local.hasura.local.nhost.run   # local.hasura.nhost.run also works
ADMIN_SECRET=nhost-admin-secret
```

**Prod / other environments**: never hardcode. Use the real endpoint and admin secret from the environment (e.g. `$HASURA_GRAPHQL_ENDPOINT`, `$HASURA_GRAPHQL_ADMIN_SECRET`) or your deploy pipeline. Prod metadata is normally applied through the deploy pipeline, not by hand. Confirm with the user before touching prod.

> The local Hasura uses a self-signed cert. With `hasura` no extra flag is needed; with `curl` pass `-k`.

## Method 1 — hasura CLI (preferred)

Applies the **entire** `nhost/metadata` directory in one shot. Must run from the `nhost/` folder so it finds `config.yaml` (`metadata_directory: metadata`, `version: 3`) and the `metadata/` dir.

```bash
cd nhost && hasura metadata apply \
  --endpoint https://local.hasura.nhost.run \
  --admin-secret nhost-admin-secret \
  --skip-update-check
```

Preview the parsed metadata without applying (sanity check):

```bash
cd nhost && hasura metadata apply --dry-run -o yaml \
  --endpoint https://local.hasura.nhost.run --admin-secret nhost-admin-secret --skip-update-check
```

## Method 2 — curl fallback (no hasura CLI)

The metadata is split across many YAML files, so a raw `replace_metadata` curl is impractical. Instead apply the change for the **single table** you edited via the metadata API. The helper script reads the table's YAML and re-applies its `*_permissions` (drop + recreate) for every role:

```bash
python3 .claude/skills/apply-hasura-metadata/scripts/apply-table-metadata.py \
  nhost/metadata/databases/default/tables/public_role.yaml \
  --endpoint https://local.hasura.local.nhost.run \
  --admin-secret nhost-admin-secret
```

It only needs `python3` (stdlib `yaml` + `urllib`) and reuses curl-equivalent HTTP calls to `${ENDPOINT}/v1/metadata`. Pass `--source` if the DB source is not `default`.

If you only need Hasura to re-read DB columns/types after a schema change (not a permission edit), reload metadata directly:

```bash
curl -sk "${ENDPOINT}/v1/metadata" \
  -H "x-hasura-admin-secret: ${ADMIN_SECRET}" \
  -H 'content-type: application/json' \
  -d '{"type":"reload_metadata","args":{"reload_remote_schemas":false,"reload_sources":true}}'
```

## Verify

Confirm the live schema matches the YAML. Introspect as the affected role (pass `x-hasura-role`), since Hasura generates a schema per role:

```bash
curl -sk "${ENDPOINT}/v1/graphql" \
  -H "x-hasura-admin-secret: ${ADMIN_SECRET}" \
  -H 'x-hasura-role: user' \
  -H 'content-type: application/json' \
  -d '{"query":"query{ __type(name:\"role_set_input\"){ inputFields{ name } } }"}'
```

Check that the expected field is present (or absent) for that role. Without the `x-hasura-role` header you get the admin schema, which always exposes every column and hides permission-scoped differences.

## Notes

- The YAML file under `nhost/metadata/` is the source of truth and must be committed. Applying to the running instance is a separate step that does not modify the repo.
- Do not commit without explicit user approval (project rule).
- A permission's `columns` list controls which fields appear in `<table>_set_input` / `<table>_insert_input` for that role. A missing column there is the usual cause of `field 'X' not found in type '<table>_set_input'`.
