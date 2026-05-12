<div align="center">

<img src="./images/scalekit.jpg" alt="Scalekit" height="64">

<p><strong>Scalekit Auth Stack for GitHub Copilot — AgentKit and SaaSKit plugins.</strong><br>
Add agent auth, tool calling, SSO, SCIM, MCP auth, and session management from GitHub Copilot.</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/scalekit-inc/github-copilot-authstack/pulls)

**[📖 Documentation](https://docs.scalekit.com)** · **[💬 Slack](https://join.slack.com/t/scalekit-community/shared_invite/zt-3gsxwr4hc-0tvhwT2b_qgVSIZQBQCWRw)**

</div>

---

Setting up auth for B2B and AI apps is complex. This marketplace adds the complete Scalekit auth stack to your projects — whether that's an AI agent, a B2B SaaS app, or an MCP server — directly from GitHub Copilot.

---

### Available Plugins

| Plugin | Description |
|--------|-------------|
| **AgentKit** | Authentication for AI agents. OAuth flows, token vault, 40+ connectors (Gmail, Slack, Salesforce, etc.), tool discovery, and live testing — so agents can act on behalf of users. |
| **SaaSKit** | Production-ready auth for B2B SaaS apps. Login, sessions, SSO (Okta, Azure AD, Google), SCIM provisioning, RBAC, MCP server auth, and API key management. |

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

### Repository Structure

```
.
├── plugins/
│   ├── agentkit/         # AI agent authentication (AgentKit)
│   └── saaskit/          # B2B SaaS authentication (SaaSKit)
├── images/               # Documentation images
├── AGENTS.md             # Contribution guidelines
└── LICENSE               # MIT License
```

---

### Prerequisites

- [Scalekit account](https://scalekit.com) with `client_id` and `client_secret`
- GitHub Copilot CLI installed and configured
- Project where you want to add authentication

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
