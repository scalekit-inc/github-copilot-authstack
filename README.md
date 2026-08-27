# Archived

This repository is archived.

Scalekit auth plugins now live in one repo: **[scalekit-inc/authstack](https://github.com/scalekit-inc/authstack)**.

Portable skills (no plugin wrapper) live in **[scalekit-inc/skills](https://github.com/scalekit-inc/skills)**.

## Install

```bash
npx @scalekit-inc/cli setup copilot
```

Or:

```bash
copilot plugin marketplace add scalekit-inc/authstack
copilot plugin install agentkit@authstack
copilot plugin install saaskit@authstack
```

Two kits replace the old five plugins:

| Kit | Replaces |
|-----|----------|
| **AgentKit** | `agent-auth` |
| **SaaSKit** | `full-stack-auth`, `mcp-auth`, `modular-sso`, `modular-scim` |

Do not add this marketplace. Use `scalekit-inc/authstack`.
