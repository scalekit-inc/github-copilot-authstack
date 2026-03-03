# modular-scim

## Purpose

This plugin implements SCIM user provisioning using Scalekit's Directory API and webhooks. It enables real-time user and group lifecycle management — automatic provisioning, deprovisioning, and attribute sync — when enterprise customers connect their identity provider's directory sync.

## Installation

```bash
# Add the marketplace
copilot plugin marketplace add scalekit-inc/github-copilot-authstack

# Install this plugin
copilot plugin install modular-scim
```

## Components Reference

### Agents

| Agent | Purpose |
|---|---|
| `setup-scalekit` | Sets up Scalekit env vars, installs and initializes the SDK, and verifies credentials |

### Skills

| Skill | Purpose |
|---|---|
| `modular-scim` | Implements SCIM provisioning via Scalekit's Directory API and webhooks for user/group lifecycle events |
| `implementing-admin-portal` | Embeds Scalekit's admin portal for customer self-serve SCIM configuration |
| `production-readiness-scalekit` | Structured production readiness checklist for Scalekit SCIM provisioning implementations |

### MCP Server

Configured in `.mcp.json` — connects to the Scalekit MCP server at `https://mcp.scalekit.com` via `mcp-remote`.

## Configuration

Required environment variables:

```bash
SCALEKIT_ENVIRONMENT_URL=https://your-env.scalekit.com
SCALEKIT_CLIENT_ID=your_client_id
SCALEKIT_CLIENT_SECRET=your_client_secret
```

Use the `setup-scalekit` agent to configure these automatically:

```bash
copilot setup-scalekit "Set up Scalekit for my SCIM integration"
```

## Usage Examples

### Add SCIM provisioning to an existing app

```
copilot "Add SCIM directory sync so enterprise customers can auto-provision users from Okta"
```

The `modular-scim` skill activates and guides through registering webhook endpoints, handling SCIM events (user.created, user.updated, user.deleted, group.created, group.updated), and syncing user state with your application database.

### Let customers configure their own SCIM connection

```
copilot "Add a self-serve SCIM setup page for enterprise customers"
```

The `implementing-admin-portal` skill generates a server-side portal link and embeds it as an iframe in your settings UI, allowing customers to configure their own directory sync connection.

## Troubleshooting

**Webhook events not arriving**: Verify your webhook endpoint is publicly accessible and returns HTTP 200 within the required timeout. Check the Scalekit dashboard under Directory Sync > Webhooks for delivery status and retry history.

**User not being provisioned**: Confirm the SCIM event handler maps the incoming user attributes to your data model correctly. The `modular-scim` skill includes attribute mapping examples for common identity providers.

**Admin portal not loading**: Confirm the portal link was generated server-side using valid credentials and has not expired. Portal links are single-use and time-limited.

## Security

**Required credentials:**
- `SCALEKIT_ENVIRONMENT_URL` — your Scalekit environment URL
- `SCALEKIT_CLIENT_ID` — OAuth client ID
- `SCALEKIT_CLIENT_SECRET` — OAuth client secret (treat as a password)

**Storage:**
- Store secrets in environment variables or a secrets manager
- Never commit secrets to source control
- Validate webhook signatures to confirm events originate from Scalekit

The plugin itself contains no hardcoded credentials. All MCP server config uses `${ENV_VAR}` placeholders.
