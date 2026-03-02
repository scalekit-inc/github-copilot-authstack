# github-copilot-authstack

A GitHub Copilot CLI plugin marketplace for adding authentication and authorization to MCP (Model Context Protocol) servers using [Scalekit](https://scalekit.com).

## Plugins

### mcp-auth

Guides and implementation patterns for securing MCP servers with OAuth 2.1. Covers multiple frameworks so you can pick the right approach for your stack.

**Skills**

| Skill | Description |
|---|---|
| `mcp-auth` | Comprehensive guide — HTTP transport, token validation, scope-based auth |
| `add-auth-fastmcp` | Simplest path: FastMCP + Scalekit provider in ~5 lines |
| `express-mcp-server` | Express.js with custom middleware and fine-grained token control |
| `fastapi-fastmcp` | FastAPI + FastMCP for Python apps needing advanced authorization |

**Agents**

| Agent | Description |
|---|---|
| `setup-scalekit` | Sets up Scalekit env vars, installs the SDK, and verifies credentials |
| `scalekit-mcp-auth-troubleshooter` | Diagnoses MCP auth issues (handshake, CORS, cached clients, port limits) |

## Usage

Add this marketplace to your Copilot CLI:

```bash
copilot plugin marketplace add https://github.com/scalekit-inc/github-copilot-authstack
```

```sh
/plugin install scalekit-inc/claude-code-authstack:plugins/mcp-auth
```

List available plugins

```bash
copilot plugin list
```

Run a skill:

```bash
copilot mcp-auth add-auth-fastmcp
```

## Repository layout

```
.github/plugin/marketplace.json   Marketplace manifest
plugins/
  mcp-auth/
    agents/                        Copilot agents
    skills/                        Copilot skills
    .github/plugin/plugin.json     Plugin manifest
    .mcp.json                      MCP server config
AGENTS.md                          Non-negotiable rules for contributors
```

## Contributing

Read `AGENTS.md` before making any changes — it is the source of truth for manifest structure, naming conventions, and security rules.

## License

MIT
