# mcp-auth

Add OAuth 2.1 authorization to MCP (Model Context Protocol) servers using Scalekit. This plugin provides CLI commands to guide setup, generate ready-to-paste code, and validate live server configurations — covering Express.js, FastAPI, and FastMCP frameworks.

---

## 1. Purpose

MCP servers exposed over HTTP require OAuth 2.1 to authenticate AI hosts such as Claude Desktop, Cursor, and VS Code. Configuring OAuth correctly — discovery endpoint, token validation middleware, and WWW-Authenticate headers — involves several interdependent steps that are easy to get wrong. This plugin makes the process reliable and repeatable: one command to understand what to do, one to get the code, one to verify it works.

---

## 2. Installation

```bash
# Add the marketplace
copilot plugin marketplace add octo-org/github-copilot-authstack

# List available plugins
copilot plugin list

# Install the plugin
copilot plugin install mcp-auth
```

---

## 3. Commands reference

### `copilot mcp-auth setup [framework]`

Prints the full 6-step OAuth setup guide. Pass an optional framework name to include framework-specific steps inline.

```bash
copilot mcp-auth setup              # General guide (all frameworks)
copilot mcp-auth setup express      # Express.js-specific steps
copilot mcp-auth setup fastapi      # FastAPI + FastMCP steps
copilot mcp-auth setup fastmcp      # FastMCP 5-line OAuth steps
```

Valid framework values: `express`, `fastapi`, `fastmcp`

---

### `copilot mcp-auth generate <framework>`

Outputs a complete, ready-to-paste code template for the specified framework. The template includes environment variable documentation, all required imports, auth middleware, discovery endpoint, and MCP server wiring.

```bash
copilot mcp-auth generate express    # Express.js + Scalekit SDK (TypeScript)
copilot mcp-auth generate fastapi    # FastAPI + FastMCP + Scalekit SDK (Python)
copilot mcp-auth generate fastmcp    # FastMCP + ScalekitProvider (Python, 5-line OAuth)
```

Throws a descriptive error if the framework argument is missing or unrecognized.

---

### `copilot mcp-auth validate <url>`

Performs three HTTP checks against a live MCP server and prints a pass/fail report with next steps for failures.

```bash
copilot mcp-auth validate https://mcp.example.com
copilot mcp-auth validate http://localhost:3002
```

**Checks performed:**
1. `GET <url>/.well-known/oauth-protected-resource` — expects HTTP 200 with JSON body containing `authorization_servers`
2. `GET <url>/` (no auth) — expects HTTP 401
3. 401 response must include `WWW-Authenticate: Bearer realm="OAuth", resource_metadata=...`

Uses only Node.js built-in modules (`https`, `http`, `url`) — no external dependencies.

---

## 4. Configuration

No plugin-level configuration required. Credentials are needed in **your MCP server's** environment, not in this plugin.

### Required environment variables for your MCP server

| Variable | Description |
|---|---|
| `SK_ENV_URL` / `SCALEKIT_ENVIRONMENT_URL` | Your Scalekit environment URL (issuer) |
| `SK_CLIENT_ID` / `SCALEKIT_CLIENT_ID` | Scalekit client ID |
| `SK_CLIENT_SECRET` | Scalekit client secret (keep in secret manager) |
| `EXPECTED_AUDIENCE` | Your MCP server's public base URL (must match Scalekit dashboard) |
| `PROTECTED_RESOURCE_METADATA` | Full OAuth metadata JSON (copy from Scalekit dashboard) |

For FastMCP + ScalekitProvider:

| Variable | Description |
|---|---|
| `SCALEKIT_RESOURCE_ID` | Resource ID from Scalekit dashboard (e.g. `res_abc123`) |
| `MCP_URL` | Public base URL with trailing slash (e.g. `https://mcp.example.com/`) |

Store all secrets in environment variables or a secret manager. Never commit them to version control.

---

## 5. Usage examples

### End-to-end: Adding OAuth to a new Express.js MCP server

```bash
# Step 1: Review the setup checklist
copilot mcp-auth setup express

# Step 2: Generate the code template
copilot mcp-auth generate express > server.ts

# Step 3: Create .env with your Scalekit credentials
#   SK_ENV_URL=https://your-env.scalekit.com
#   SK_CLIENT_ID=your_client_id
#   SK_CLIENT_SECRET=your_client_secret
#   EXPECTED_AUDIENCE=https://mcp.yourapp.com/
#   PROTECTED_RESOURCE_METADATA=<paste from Scalekit dashboard>

# Step 4: Install dependencies and start server
npm install express @scalekit-sdk/node @modelcontextprotocol/sdk dotenv cors
npx ts-node server.ts

# Step 5: Validate the running server
copilot mcp-auth validate https://mcp.yourapp.com
```

### End-to-end: FastMCP with 5-line OAuth

```bash
# Review FastMCP-specific steps
copilot mcp-auth setup fastmcp

# Generate the server template
copilot mcp-auth generate fastmcp > server.py

# Install and run
pip install "fastmcp>=2.13.0.2" python-dotenv
python server.py

# Validate
copilot mcp-auth validate http://localhost:3002
```

---

## 6. Troubleshooting

### AI host fails silently — OAuth flow never starts

**Symptom**: Adding the MCP server to Claude Desktop or Cursor shows no error, but no OAuth prompt appears.

**Cause**: The 401 response is missing the `WWW-Authenticate` header with `resource_metadata`. AI hosts require this header to discover the authorization server. A plain 401 is treated as a permanent failure.

**Fix**: Ensure every 401 response from your server includes:
```
WWW-Authenticate: Bearer realm="OAuth", resource_metadata="https://<domain>/.well-known/oauth-protected-resource"
```
Run `copilot mcp-auth validate <url>` to confirm the header is present.

---

### Token validation fails — all requests return 401 even with a valid token

**Symptom**: Server returns 401 even when the AI host sends a valid Bearer token.

**Cause**: Mismatch between `EXPECTED_AUDIENCE` / `SCALEKIT_RESOURCE_ID` in your `.env` and the Server URL configured in the Scalekit dashboard.

**Fix**:
1. Open Scalekit dashboard → MCP Servers → your server
2. Copy the exact Server URL shown there
3. Set that value as `EXPECTED_AUDIENCE` (include trailing slash if present)
4. Restart your MCP server

---

### Discovery endpoint returns 404 or 500

**Symptom**: `copilot mcp-auth validate` reports the discovery check failed.

**Cause**: Either the `/.well-known/oauth-protected-resource` route is not registered, or `PROTECTED_RESOURCE_METADATA` is not set/malformed.

**Fix**:
1. Verify the route is registered **before** the auth middleware in your server
2. Confirm `PROTECTED_RESOURCE_METADATA` contains valid JSON (copy from Scalekit dashboard)
3. Test the endpoint directly: `curl https://<domain>/.well-known/oauth-protected-resource`

---

## 7. Security

### Credentials required

- **Scalekit client secret** (`SK_CLIENT_SECRET`): Used by your MCP server to authenticate with Scalekit when validating tokens. Treat this like a database password.
- **Scalekit client ID** (`SK_CLIENT_ID`) and **environment URL** (`SK_ENV_URL`): These identify your Scalekit environment and are needed by the SDK.

### How to store credentials safely

- **Development**: Use a `.env` file (add `.env` to `.gitignore`) and load with `dotenv`
- **Production**: Use a secret manager such as AWS Secrets Manager, HashiCorp Vault, or GCP Secret Manager. Inject values as environment variables at runtime.
- **Never** hardcode credentials in source files or check them into version control

### This plugin does not handle credentials

`copilot mcp-auth` generates code templates and performs read-only HTTP validation checks. It never reads, stores, or transmits any Scalekit credentials. All credential handling is in the MCP server code you deploy.
