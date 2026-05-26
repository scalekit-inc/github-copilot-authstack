# SaaSKit for GitHub Copilot

Production-ready auth for B2B SaaS apps. This plugin brings Scalekit SaaSKit into GitHub Copilot to build production-ready B2B authentication. It covers login, sessions, SSO, SCIM provisioning, MCP server auth, API keys, and more.

## Installation

Add the marketplace and install this plugin:

```bash
copilot plugin marketplace add scalekit-inc/github-copilot-authstack
copilot plugin install saaskit@github-copilot-authstack
```

Or use the one-command bootstrap from the [root README](../../README.md).

## Skills

- `/saaskit:setup`
  New to SaaSKit? Start here — answers 3 questions and routes you to the right skill.
- `implementing-saaskit` — Core auth flow: login, signup, callback, token exchange, session management, logout. Framework references for Go, Spring Boot, Laravel.
- `implementing-saaskit-nextjs` — Auth for Next.js App Router.
- `implementing-saaskit-python` — Auth for Django, FastAPI, or Flask. Framework references included.
- `implementing-modular-sso` — Enterprise SSO (SAML/OIDC) with 20+ IdPs, admin portal, JIT provisioning.
- `implementing-scim-provisioning` — SCIM 2.0 webhooks, user/group lifecycle, directory API.
- `adding-mcp-oauth` — OAuth 2.1 for MCP servers (FastMCP, Express, FastAPI).
- `implementing-access-control` — RBAC and permission checks.
- `managing-saaskit-sessions` — Secure session storage, token refresh, session revocation.
- `migrating-to-saaskit` — Migration planning from Auth0, Firebase, Cognito, or custom auth.
- `adding-api-auth` — API keys (org/user scoped) and OAuth 2.0 client credentials.
- `production-readiness-saaskit` — Unified production checklist across all SaaSKit domains.
- `/saaskit:testing-auth-setup` — Validates auth configuration end-to-end using the Scalekit dryrun CLI.
- `/saaskit:scalekit-code-doctor` — Diagnoses SDK usage issues, import errors, and common mistakes across AgentKit and SaaSKit.

## Configuration

Required environment variables:

- `SCALEKIT_ENVIRONMENT_URL`
- `SCALEKIT_CLIENT_ID`
- `SCALEKIT_CLIENT_SECRET`

## Links

- [Full-stack auth quickstart](https://docs.scalekit.com/authenticate/fsa/quickstart/)
- [Modular SSO guide](https://docs.scalekit.com/authenticate/sso/add-modular-sso/)
- [SCIM directory sync](https://docs.scalekit.com/directory/scim/quickstart/)
- [MCP Auth quickstart](https://docs.scalekit.com/authenticate/mcp/quickstart/)
