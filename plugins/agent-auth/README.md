# agent-auth

## Purpose

This plugin implements Scalekit Agent Auth, enabling AI agents to act in third-party applications (Gmail, Slack, Google Calendar, Notion, and others) on behalf of users. It handles OAuth flows, connected account management, token storage, and automatic refresh so agents can make authenticated API calls without user intervention.

## Installation

```bash
# Add the marketplace
copilot plugin marketplace add scalekit-inc/github-copilot-authstack

# Install this plugin
copilot plugin install agent-auth
```

## Components Reference

### Agents

| Agent | Purpose |
|---|---|
| `setup-scalekit` | Sets up Scalekit env vars, installs and initializes the SDK, and verifies credentials |

### Skills

| Skill | Purpose |
|---|---|
| `agent-auth` | Integrates Scalekit Agent Auth: OAuth flows, token storage, and automatic refresh for third-party services |
| `building-agent-mcp-server` | Guides through creating a Scalekit MCP server with authenticated tool access |
| `production-readiness-scalekit` | Structured production readiness checklist for Scalekit agent authentication implementations |

### MCP Server

Configured in `.mcp.json` — connects to the Scalekit MCP server at `https://mcp.scalekit.com` via `mcp-remote`.

### References

The `references/` directory contains connector guides for 30+ services (Gmail, Slack, Notion, HubSpot, Salesforce, Google Calendar, and more) and conceptual documentation on connected accounts, OAuth flows, and BYOC (bring your own credentials) patterns.

## Configuration

Required environment variables:

```bash
SCALEKIT_ENVIRONMENT_URL=https://your-env.scalekit.com
SCALEKIT_CLIENT_ID=your_client_id
SCALEKIT_CLIENT_SECRET=your_client_secret
```

Use the `setup-scalekit` agent to configure these automatically:

```bash
copilot setup-scalekit "Set up Scalekit for my AI agent project"
```

## Usage Examples

### Connect an agent to Gmail

```
copilot "I need my AI agent to read and send Gmail on behalf of users"
```

The `agent-auth` skill activates and guides through registering a Gmail connector, initiating the OAuth authorization flow, storing tokens, and making authenticated Gmail API calls.

### Build an authenticated MCP server

```
copilot "Help me build an MCP server with Scalekit authentication"
```

The `building-agent-mcp-server` skill guides through creating the MCP server, configuring Scalekit as the auth provider, and exposing authenticated tools.

## Troubleshooting

**OAuth flow not completing**: Verify the redirect URL registered in the Scalekit dashboard matches your application's callback endpoint exactly. Check `references/redirects.md` for URI validation requirements.

**Token refresh failing**: Confirm the refresh token was stored correctly during the initial OAuth exchange. The `agent-auth` skill covers secure token storage patterns per framework.

**Connected account not found**: Ensure the user completed the full OAuth consent flow. Connected accounts appear in the Scalekit dashboard under the relevant organization once authorization is complete.

## Security

**Required credentials:**
- `SCALEKIT_ENVIRONMENT_URL` — your Scalekit environment URL
- `SCALEKIT_CLIENT_ID` — OAuth client ID
- `SCALEKIT_CLIENT_SECRET` — OAuth client secret (treat as a password)

**Storage:**
- Store secrets in environment variables or a secrets manager
- Never commit secrets to source control
- Third-party OAuth tokens (access/refresh) must be stored encrypted at rest

The plugin itself contains no hardcoded credentials. All MCP server config uses `${ENV_VAR}` placeholders.
