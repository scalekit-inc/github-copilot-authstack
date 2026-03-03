# modular-sso

## Purpose

This plugin implements modular SSO flows using Scalekit for applications that already have their own user management. It adds enterprise SSO (SAML, OIDC) on top of existing auth systems, handles IdP-initiated login, and provides self-serve customer onboarding via an embedded admin portal — without requiring a full auth migration.

## Installation

```bash
# Add the marketplace
copilot plugin marketplace add scalekit-inc/github-copilot-authstack

# Install this plugin
copilot plugin install modular-sso
```

## Components Reference

### Agents

| Agent | Purpose |
|---|---|
| `setup-scalekit` | Sets up Scalekit env vars, installs and initializes the SDK, and verifies credentials |

### Skills

| Skill | Purpose |
|---|---|
| `modular-sso` | Implements SSO and authentication flows: modular SSO, IdP-initiated login, session management, enterprise onboarding |
| `implementing-admin-portal` | Embeds Scalekit's admin portal for customer self-serve SSO configuration |
| `production-readiness-scalekit` | Structured production readiness checklist for Scalekit SSO implementations |

### MCP Server

Configured in `.mcp.json` — connects to the Scalekit MCP server at `https://mcp.scalekit.com` via `mcp-remote`.

### Commands

- `dryrun` — runs a Scalekit SSO dry-run to validate configuration before going live

## Configuration

Required environment variables:

```bash
SCALEKIT_ENVIRONMENT_URL=https://your-env.scalekit.com
SCALEKIT_CLIENT_ID=your_client_id
SCALEKIT_CLIENT_SECRET=your_client_secret
```

Use the `setup-scalekit` agent to configure these automatically:

```bash
copilot setup-scalekit "Set up Scalekit for my SSO integration"
```

## Usage Examples

### Add enterprise SSO to an existing app

```
copilot "Add SAML SSO to my app that already has username/password login"
```

The `modular-sso` skill activates and guides through installing the Scalekit SDK, initiating the SSO authorization URL, handling the callback, validating the token, and linking SSO identity to an existing user record.

### Let customers configure their own SSO

```
copilot "Add a self-serve SSO configuration page for my enterprise customers"
```

The `implementing-admin-portal` skill generates a server-side portal link and embeds it as an iframe in your settings UI.

## Troubleshooting

**IdP-initiated login failing**: Ensure the Initiate Login URL is registered in your Scalekit dashboard. See `references/redirects.md` for the correct URL format. This endpoint must redirect users to Scalekit's `/authorize` endpoint.

**SSO callback returning errors**: Verify that the redirect URL in your dashboard exactly matches the callback URL in your code. Query parameters are not allowed in registered redirect URIs.

**Admin portal not loading**: Confirm the portal link was generated server-side using valid credentials and has not expired. Portal links are single-use and time-limited.

## Security

**Required credentials:**
- `SCALEKIT_ENVIRONMENT_URL` — your Scalekit environment URL
- `SCALEKIT_CLIENT_ID` — OAuth client ID
- `SCALEKIT_CLIENT_SECRET` — OAuth client secret (treat as a password)

**Storage:**
- Store secrets in environment variables or a secrets manager
- Never commit secrets to source control
- Validate the `state` parameter in all OAuth callbacks to prevent CSRF attacks

The plugin itself contains no hardcoded credentials. All MCP server config uses `${ENV_VAR}` placeholders.
