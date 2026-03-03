# full-stack-auth

## Purpose

This plugin implements production-ready authentication flows — sign-up, login, logout, and secure session management — using Scalekit's full-stack auth SDK. It covers common application stacks (Next.js, Django, Go, Spring Boot, Laravel) and enterprise concerns such as SSO, SCIM, API key auth, OAuth2 for APIs, access control, and user migration.

## Installation

```bash
# Add the marketplace
copilot plugin marketplace add scalekit-inc/github-copilot-authstack

# Install this plugin
copilot plugin install full-stack-auth
```

## Components Reference

### Agents

| Agent | Purpose |
|---|---|
| `setup-scalekit` | Sets up Scalekit env vars, installs and initializes the SDK, and verifies credentials |
| `session-management-reviewer` | Reviews existing session management implementation and suggests improvements using Scalekit |
| `sdk-version-advisor` | Determines the current tech stack and recommends the correct Scalekit SDK version |
| `scalekit-mcp-helper` | Helps configure Scalekit MCP client settings for Claude Desktop, Cursor, Windsurf, and VS Code |

### Skills

| Skill | Purpose |
|---|---|
| `full-stack-auth` | Implements full-stack authentication: sign-up, login, logout, OAuth callback, token refresh |
| `implementing-scalekit-nextjs-auth` | Adds Scalekit auth to Next.js App Router projects |
| `implementing-scalekit-django-auth` | Adds Scalekit auth to Django projects |
| `implementing-scalekit-go-auth` | Adds Scalekit auth to Go/Gin projects |
| `adding-api-key-auth` | Creates and validates long-lived opaque API keys using Scalekit |
| `adding-oauth2-to-apis` | Implements OAuth 2.0 client-credentials auth on API endpoints |
| `manage-user-sessions` | Manages Scalekit-backed user sessions with secure cookie storage and token refresh |
| `implementing-access-control` | Implements server-side RBAC and permission checks using Scalekit tokens |
| `implementing-admin-portal` | Embeds Scalekit's admin portal for customer self-serve SSO/SCIM configuration |
| `implement-logout` | Implements complete logout flow clearing application cookies and Scalekit sessions |
| `migrating-to-scalekit-auth` | Plans and executes incremental migration from any existing auth system to Scalekit |
| `production-readiness-scalekit` | Structured production readiness checklist for Scalekit auth implementations |

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
copilot setup-scalekit "Set up Scalekit for my Next.js app"
```

## Usage Examples

### Add authentication to a Next.js app

```
copilot "Add Scalekit authentication to my Next.js App Router project"
```

The `implementing-scalekit-nextjs-auth` skill activates and guides through login routes, OAuth callback, session storage, middleware protection, and logout.

### Review session management

```
copilot session-management-reviewer "Review my session handling code"
```

The agent analyzes existing session middleware and suggests Scalekit-backed improvements.

### Protect an API with OAuth2

```
copilot "Add OAuth2 client credentials auth to my REST API"
```

The `adding-oauth2-to-apis` skill guides through registering API clients, issuing bearer tokens, validating JWTs via JWKS, and enforcing scopes in middleware.

## Troubleshooting

**Skill not triggering**: Ensure `SKILL.md` frontmatter includes the correct `name` field. Reinstall the plugin if needed with `copilot plugin update full-stack-auth`.

**Token validation failures**: Verify `SCALEKIT_ENVIRONMENT_URL` matches the environment issuer. Check that your redirect URLs are registered in the Scalekit dashboard under Authentication > Redirects.

**Session not persisting**: Confirm session cookies use `httpOnly`, `secure`, and `sameSite` flags. The `manage-user-sessions` skill covers correct cookie configuration for each framework.

## Security

**Required credentials:**
- `SCALEKIT_ENVIRONMENT_URL` — your Scalekit environment URL
- `SCALEKIT_CLIENT_ID` — OAuth client ID
- `SCALEKIT_CLIENT_SECRET` — OAuth client secret (treat as a password)

**Storage:**
- Store secrets in environment variables or a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.)
- Never commit secrets to source control
- Use `.env` files locally and inject secrets via CI/CD in production

The plugin itself contains no hardcoded credentials. All MCP server config uses `${ENV_VAR}` placeholders.
