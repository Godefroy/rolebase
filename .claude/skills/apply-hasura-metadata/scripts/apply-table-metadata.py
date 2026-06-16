#!/usr/bin/env python3
"""Apply a single table's permissions from its nhost/metadata YAML to a running
Hasura instance, via the metadata API. Curl fallback for `hasura metadata apply`
when the hasura CLI is unavailable.

For each role found in the table's *_permissions, the existing permission is
dropped and recreated from the YAML, so the live schema matches the file.

Usage:
  apply-table-metadata.py <table_yaml_path> \
    --endpoint https://local.hasura.local.nhost.run \
    --admin-secret nhost-admin-secret [--source default]
"""
import argparse
import json
import ssl
import sys
import urllib.error
import urllib.request

import yaml

PERMS = {
    "select_permissions": ("pg_create_select_permission", "pg_drop_select_permission"),
    "insert_permissions": ("pg_create_insert_permission", "pg_drop_insert_permission"),
    "update_permissions": ("pg_create_update_permission", "pg_drop_update_permission"),
    "delete_permissions": ("pg_create_delete_permission", "pg_drop_delete_permission"),
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("table_yaml", help="Path to nhost/metadata/.../tables/<table>.yaml")
    parser.add_argument("--endpoint", required=True, help="Hasura base URL (no trailing /v1/metadata)")
    parser.add_argument("--admin-secret", required=True)
    parser.add_argument("--source", default="default", help="DB source name (default: default)")
    parser.add_argument("--insecure", action="store_true", default=True,
                        help="Skip TLS verification (local self-signed cert)")
    args = parser.parse_args()

    with open(args.table_yaml) as f:
        meta = yaml.safe_load(f)

    table = meta["table"]  # {name, schema}
    url = args.endpoint.rstrip("/") + "/v1/metadata"
    ctx = ssl.create_default_context()
    if args.insecure:
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

    def call(payload, ignore_errors=False):
        req = urllib.request.Request(
            url, data=json.dumps(payload).encode(),
            headers={
                "content-type": "application/json",
                "x-hasura-admin-secret": args.admin_secret,
            },
        )
        try:
            with urllib.request.urlopen(req, context=ctx) as r:
                return r.status, r.read().decode()
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            if not ignore_errors:
                return e.code, body
            return e.code, body

    applied = 0
    for key, (create_type, drop_type) in PERMS.items():
        for entry in meta.get(key, []) or []:
            role = entry["role"]
            permission = entry["permission"]
            # Drop is best-effort: it may not exist yet.
            s, b = call({"type": drop_type, "args": {
                "source": args.source, "table": table, "role": role,
            }}, ignore_errors=True)
            s, b = call({"type": create_type, "args": {
                "source": args.source, "table": table, "role": role,
                "permission": permission,
            }})
            status = "ok" if s == 200 else f"FAIL({s})"
            print(f"{key}/{role}: {status}{'' if s == 200 else ' ' + b}")
            if s != 200:
                sys.exit(1)
            applied += 1

    if applied == 0:
        print("No permissions found in YAML — nothing to apply.")
    else:
        print(f"Applied {applied} permission(s) for table "
              f"{table['schema']}.{table['name']}.")


if __name__ == "__main__":
    main()
