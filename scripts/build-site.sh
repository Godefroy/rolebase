#!/usr/bin/env bash
# Builds what rolebase.io serves (wrangler.jsonc): the webapp and the website,
# merged into dist/. The website builds standalone (see CLAUDE.md), its pages
# win over the webapp's files, and the webapp answers every other navigation
# (`not_found_handling: single-page-application`), so its catch-all rewrite is
# left out of _redirects.
set -euo pipefail
cd "$(dirname "$0")/.."

npm ci
npx turbo build --filter=@rolebase/webapp...

(cd website && npm ci && npm run build)

rm -rf dist
mkdir -p dist
cp -r packages/webapp/dist/* dist/
cp -r website/dist/* dist/

# The website wrote its own _redirects and _headers; append the webapp's
# headers, and every webapp redirect but the catch-all.
grep -v '^/\*[[:space:]]' packages/webapp/dist/_redirects >> dist/_redirects || true
printf '\n' >> dist/_headers
cat packages/webapp/dist/_headers >> dist/_headers

# Paths of the website's files under /en and /fr, read by the Worker to answer
# the website's 404 for a missing page (`page.html` is served at `/page`).
(cd dist && find en fr -type f | sed -e 's#^#/#' -e 's#\.html$##' | sort -u) \
  | node -e 'process.stdout.write(JSON.stringify(require("fs").readFileSync(0, "utf8").trim().split("\n")))' \
  > worker/website-paths.generated.json

echo "dist/ ready: $(grep -vc '^#\|^$' dist/_redirects) redirect rules, $(grep -c '^/' dist/_headers) header rules"
