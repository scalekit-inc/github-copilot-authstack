# CLAUDE.md (Repo guide for agents)

This repository is a monorepo of GitHub Copilot CLI plugins for marketplace distribution.
Always work inside one plugin directory at a time.

Read AGENTS.md first — it is the source of truth for all rules.

## Repo structure

```
.github/plugin/marketplace.json    Marketplace manifest
plugins/agentkit/                  AgentKit plugin (OAuth, token vault, connectors)
plugins/saaskit/                   SaaSKit plugin (SSO, SCIM, sessions, MCP auth)
plugins/agent-auth -> agentkit     Backwards-compat symlink
plugins/mcp-auth -> saaskit        Backwards-compat symlink
plugins/full-stack-auth -> saaskit Backwards-compat symlink
plugins/modular-sso -> saaskit     Backwards-compat symlink
plugins/modular-scim -> saaskit    Backwards-compat symlink
AGENTS.md                          Non-negotiable rules
README.md                          Repo overview
scripts/install.sh                 Installation script
```

Each plugin contains:
```
plugins/<plugin-name>/
  .github/plugin/plugin.json      Plugin manifest (required)
  agents/*.agent.md                Agent definitions
  skills/<skill-name>/SKILL.md     Skill entrypoints
  references/                      Deep docs loaded on demand
  hooks/hooks.json                 Lifecycle hooks (optional)
  .mcp.json                        MCP server config (optional)
  README.md                        Required docs
```

## Before coding

1. Read AGENTS.md for all rules
2. Read .github/plugin/marketplace.json for plugin registry
3. Read the target plugin's plugin.json and README.md

## Local testing

```bash
copilot plugin marketplace add ./github-copilot-authstack
copilot plugin list
copilot plugin install agentkit@github-copilot-authstack
```

## Golden rules

- One plugin at a time unless explicitly asked otherwise.
- Never add secrets, tokens, or credentials.
- Prefer minimal changes for correctness, safety, and clarity.
- Forward slashes in all paths.
- Update README.md when behavior changes.
