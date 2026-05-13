#!/usr/bin/env bash

set -euo pipefail

if ! command -v copilot >/dev/null 2>&1; then
  echo "GitHub Copilot CLI is not installed or not on PATH." >&2
  echo "Install Copilot CLI first, then re-run this installer." >&2
  exit 1
fi

MARKETPLACE_SLUG="${COPILOT_AUTHSTACK_MARKETPLACE:-scalekit-inc/github-copilot-authstack}"
MARKETPLACE_NAME="${MARKETPLACE_SLUG##*/}"
OLD_PLUGINS=("agent-auth" "full-stack-auth" "mcp-auth" "modular-sso" "modular-scim")

echo "Installing Scalekit Auth Stack for GitHub Copilot"
echo "Marketplace: $MARKETPLACE_SLUG"
echo

# Remove and re-add marketplace to ensure the latest version is fetched
copilot plugin marketplace remove "$MARKETPLACE_NAME" 2>/dev/null || true
copilot plugin marketplace add "$MARKETPLACE_SLUG"

# Remove old plugin names from v1.x (now consolidated into agentkit + saaskit)
for old in "${OLD_PLUGINS[@]}"; do
  copilot plugin uninstall "${old}" 2>/dev/null || true
done

copilot plugin install "agentkit@${MARKETPLACE_NAME}"
copilot plugin install "saaskit@${MARKETPLACE_NAME}"

cat <<EOF

Installed Scalekit Auth Stack for GitHub Copilot.

Installed plugins:
  agentkit  — AI agent authentication (connectors, tool discovery, token vault)
  saaskit   — B2B SaaS authentication (login, SSO, SCIM, RBAC, MCP server auth)

What to do next in GitHub Copilot:
- Look for "agentkit" and "saaskit" in your plugin settings.
- Make sure both are installed and enabled.
- Set the update policy to auto-update so you always have the latest skills.

To verify it works:
  Ask Copilot to "help me integrate agentkit" or "test my auth setup".
EOF
