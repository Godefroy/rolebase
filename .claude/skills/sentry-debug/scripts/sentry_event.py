#!/usr/bin/env python3
"""Print the latest event of a Sentry issue: in-app stacktrace frames, request
URL and key tags. This is the one thing the official `sentry-cli` cannot do
(it only lists events as summary rows) — use sentry-cli for list/resolve/mute.

Usage:
  python3 sentry_event.py <ISSUE_ID>

Auth: reads SENTRY_AUTH_TOKEN from the environment, falling back to the nearest
`.env` (the value is never printed). Standard library only.
"""
import json
import os
import sys
import urllib.error
import urllib.request

BASE = "https://sentry.lonestone.io/api/0"


def load_token() -> str:
    token = os.environ.get("SENTRY_AUTH_TOKEN")
    if token:
        return token.strip()
    d = os.getcwd()
    while True:
        env = os.path.join(d, ".env")
        if os.path.isfile(env):
            with open(env, encoding="utf-8") as f:
                for line in f:
                    if line.startswith("SENTRY_AUTH_TOKEN="):
                        return line.split("=", 1)[1].strip().strip("\"'")
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    sys.exit("SENTRY_AUTH_TOKEN not found in env or .env")


def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: sentry_event.py <ISSUE_ID>")
    issue_id = sys.argv[1]
    req = urllib.request.Request(f"{BASE}/issues/{issue_id}/events/latest/")
    req.add_header("Authorization", f"Bearer {load_token()}")
    try:
        with urllib.request.urlopen(req) as resp:
            e = json.loads(resp.read().decode())
    except urllib.error.HTTPError as err:
        sys.exit(f"HTTP {err.code}: {err.read().decode()[:300]}")

    print("TITLE:", e.get("title"))
    print("CULPRIT:", e.get("culprit"))
    for ent in e.get("entries", []):
        if ent["type"] == "exception":
            for ex in ent["data"]["values"]:
                print("EXC", ex.get("type"), ":", str(ex.get("value"))[:200])
                for f in (ex.get("stacktrace") or {}).get("frames", []):
                    if f.get("in_app"):
                        print("   @", f.get("filename"), ":", f.get("lineno"), f.get("function"))
        if ent["type"] == "request":
            print("URL:", ent["data"].get("url"), ent["data"].get("method"))
    for t in e.get("tags", []):
        if t["key"] in ("transaction", "environment", "release"):
            print("TAG", t["key"], "=", t["value"][:120])


if __name__ == "__main__":
    main()
