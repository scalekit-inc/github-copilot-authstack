<div align="center">

<img src="./images/scalekit.jpg" alt="Scalekit" height="64">

<p><strong>Scalekit Auth Plugins for GitHub Copilot CLI — the auth stack for agents.</strong><br>
Add MCP Auth and tool-calling to your MCP servers from GitHub Copilot CLI.</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/scalekit-inc/github-copilot-authstack/pulls)

**[📖 Documentation](https://docs.scalekit.com)** · **[💬 Slack](https://join.slack.com/t/scalekit-community/shared_invite/zt-3gsxwr4hc-0tvhwT2b_qgVSIZQBQCWRw)**

</div>

---

A GitHub Copilot CLI plugin marketplace for adding OAuth 2.1 authorization and tool-calling to MCP (Model Context Protocol) servers using [Scalekit](https://scalekit.com).

---

### Plugins

#### mcp-auth

Guides and implementation patterns for securing MCP servers with OAuth 2.1. Covers multiple frameworks so you can pick the right approach for your stack.

**Skills:**

| Skill | Description |
|-------|-------------|
| `mcp-auth` | Comprehensive guide — HTTP transport, token validation, scope-based auth |
| `add-auth-fastmcp` | Simplest path: FastMCP + Scalekit provider in ~5 lines |
| `express-mcp-server` | Express.js with custom middleware and fine-grained token control |
| `fastapi-fastmcp` | FastAPI + FastMCP for Python apps needing advanced authorization |

**Agents:**

| Agent | Description |
|-------|-------------|
| `setup-scalekit` | Sets up Scalekit env vars, installs the SDK, and verifies credentials |
| `scalekit-mcp-auth-troubleshooter` | Diagnoses MCP auth issues (handshake, CORS, cached clients, port limits) |

---

### Installation

Add this marketplace to your Copilot CLI:

```bash
copilot plugin marketplace add https://github.com/scalekit-inc/github-copilot-authstack
```

Install a plugin:

```bash
copilot plugin install scalekit-inc/github-copilot-authstack:plugins/mcp-auth
```

List available plugins:

```bash
copilot plugin list
```

Run a skill:

```bash
copilot mcp-auth add-auth-fastmcp
```

---

### Repository Layout

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

---

### Prerequisites

- [Scalekit account](https://scalekit.com) with `client_id` and `client_secret`
- GitHub Copilot CLI installed and configured
- Project where you want to add MCP authentication

---

### Helpful Links

#### Documentation

- [Scalekit Documentation](https://docs.scalekit.com) — Complete guides and API reference
- [MCP Auth Guide](https://docs.scalekit.com/mcp-auth/quickstart/) — Secure MCP servers
- [Agent Auth Guide](https://docs.scalekit.com/agent-auth/quickstart/) — Authentication for AI agents

#### Resources

- [Admin Portal](https://app.scalekit.com) — Manage your Scalekit account
- [API Reference](https://docs.scalekit.com/apis) — Complete API documentation
- [Code Examples](https://docs.scalekit.com/directory/code-examples/) — Ready-to-use snippets

---

### Contributing

Contributions are welcome! Please see [AGENTS.md](AGENTS.md) for contribution guidelines.

1. Fork this repository
2. Create a branch — `git checkout -b feature/my-plugin`
3. Make your changes following the plugin structure in AGENTS.md
4. Test locally
5. Open a Pull Request

---

### License

This project is licensed under the **MIT license**. See the [LICENSE](LICENSE) file for more information.
