#!/usr/bin/env bash

set -euo pipefail

if ! command -v copilot >/dev/null 2>&1; then
  echo "GitHub Copilot CLI is not installed or not on PATH." >&2
  echo "Install Copilot CLI first, then re-run this installer." >&2
  exit 1
fi

MARKETPLACE_SLUG="${COPILOT_AUTHSTACK_MARKETPLACE:-scalekit-inc/github-copilot-authstack}"
OLD_PLUGINS=("agent-auth" "full-stack-auth" "mcp-auth" "modular-sso" "modular-scim")

echo "Installing Scalekit Auth Stack for GitHub Copilot"
echo "Marketplace: $MARKETPLACE_SLUG"
echo

copilot plugin marketplace add "$MARKETPLACE_SLUG"

# Remove old plugin names from v1.x (now consolidated into agentkit + saaskit)
for old in "${OLD_PLUGINS[@]}"; do
  copilot plugin uninstall "${old}" 2>/dev/null || true
done

copilot plugin install agentkit
copilot plugin install saaskit

cat <<EOF

Installed Scalekit Auth Stack for GitHub Copilot.

Installed plugins:
  agentkit  — AI agent authentication (connectors, tool discovery, token vault)
  saaskit   — B2B SaaS authentication (login, SSO, SCIM, RBAC, MCP server auth)

Next steps:
1. Run \`copilot plugin list\` to verify the plugins are installed.
2. Try a skill: \`copilot agentkit integrating-agentkit\`
EOF
