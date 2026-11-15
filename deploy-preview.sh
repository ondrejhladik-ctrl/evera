#!/usr/bin/env bash
# Sestaví náhled pro GitHub Pages (podsložka /evera-web/) a nahraje ho do větve gh-pages.
# Použití: bash deploy-preview.sh
set -euo pipefail
cd "$(dirname "$0")"
REMOTE=$(git remote get-url origin)
OWNER=$(echo "$REMOTE" | sed -E 's#.*github.com[:/]([^/]+)/.*#\1#')
REPO=$(basename -s .git "$REMOTE")
BASE_PATH="$REPO" SITE_URL="https://$OWNER.github.io" npx astro build
OUT=dist
rm -rf .deploy && cp -r "$OUT" .deploy
touch .deploy/.nojekyll
cd .deploy
git init -q -b gh-pages
git add -A
git commit -q -m "Náhled webu $(date '+%Y-%m-%d %H:%M')"
git push -f "$REMOTE" gh-pages
cd .. && rm -rf .deploy
echo "Hotovo: https://$OWNER.github.io/$REPO/"
