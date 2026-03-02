import { Command } from '@copilot/cli';

const GENERAL_GUIDE = `# MCP OAuth 2.1 Setup Guide

Secure your MCP server with production-ready OAuth 2.1 authorization using Scalekit.

## Prerequisites

⚠️  OAuth 2.1 requires HTTP-based transport (Streamable HTTP), not stdio.
    Migrate to HTTP transport before proceeding.

## Setup Checklist

- [ ] Step 1: Install Scalekit SDK
- [ ] Step 2: Register MCP server in Scalekit dashboard
- [ ] Step 3: Implement discovery endpoint (/.well-known/oauth-protected-resource)
- [ ] Step 4: Add token validation middleware
- [ ] Step 5: (Optional) Add scope-based authorization
- [ ] Step 6: Verify and deploy

---

## Step 1: Install Scalekit SDK

Node.js:
  npm install @scalekit-sdk/node@2.2.0-beta.1

Python:
  pip install scalekit-sdk-python

Get credentials from https://app.scalekit.com/ after creating an account.

---

## Step 2: Register MCP server in Scalekit dashboard

1. Go to MCP Servers → Add MCP Server
2. Enter a descriptive name (shown on consent page)
3. Set Server URL to your deployed base URL (e.g. https://mcp.yourapp.com/)
4. Enable dynamic client registration (allows automatic MCP host registration)
5. Enable Client ID Metadata Document / CIMD
6. Define scopes (e.g. read, write)
7. Click Save — note the resource_id shown after saving

Important: Restart your server after toggling DCR or CIMD settings.

---

## Step 3: Implement discovery endpoint

Create /.well-known/oauth-protected-resource that returns JSON with
authorization_servers, resource, and scopes_supported.

Copy the metadata JSON from Dashboard → MCP Servers → Your server → Metadata JSON.

---

## Step 4: Add token validation middleware

Initialize the Scalekit client using environment variables:
  SCALEKIT_ENVIRONMENT_URL
  SCALEKIT_CLIENT_ID
  SCALEKIT_CLIENT_SECRET

Middleware logic:
- Allow /.well-known/* paths without authentication
- Extract Bearer token from Authorization header
- Return 401 with WWW-Authenticate header if token is missing or invalid
- Call scalekit.validateToken(token, { audience: [RESOURCE_ID] })

The WWW-Authenticate header format:
  Bearer realm="OAuth", resource_metadata="https://<domain>/.well-known/oauth-protected-resource"

---

## Step 5: Scope-based tool authorization (optional)

After token validation, check scopes for fine-grained access control:
  scalekit.validateToken(token, { audience: [RESOURCE_ID], requiredScopes: ['read'] })

Return 403 with error: "insufficient_scope" when scope check fails.

---

## Step 6: Verify

Run these checks before testing with AI hosts:

1. Discovery endpoint returns JSON with authorization_servers:
   curl https://<your-domain>/.well-known/oauth-protected-resource

2. Unauthenticated request returns 401:
   curl -i https://<your-domain>/

3. 401 response includes WWW-Authenticate header with resource_metadata.
   Without this header, AI hosts (Claude Desktop, Cursor, VS Code) fail silently.

Run 'copilot mcp-auth validate <url>' to check all three automatically.

---

## Framework-specific guides

Run 'copilot mcp-auth setup express'  — Express.js setup steps
Run 'copilot mcp-auth setup fastapi'  — FastAPI + FastMCP setup steps
Run 'copilot mcp-auth setup fastmcp'  — FastMCP 5-line OAuth setup steps

Run 'copilot mcp-auth generate <framework>' to get ready-to-paste code.
`;

const EXPRESS_ADDENDUM = `
---

## Express.js — Framework-specific steps

### Install dependencies

  npm install express @scalekit-sdk/node @modelcontextprotocol/sdk dotenv cors
  npm install -D @types/express @types/cors typescript

### Environment variables (.env)

  SK_ENV_URL=https://your-env.scalekit.com
  SK_CLIENT_ID=your_client_id
  SK_CLIENT_SECRET=your_client_secret
  EXPECTED_AUDIENCE=https://mcp.yourapp.com/
  PROTECTED_RESOURCE_METADATA={"authorization_servers":["..."],"resource":"...","scopes_supported":["read","write"]}

### Key implementation steps

1. Create authMiddleware that reads Authorization header and calls scalekit.validateToken()
2. Mount authMiddleware with app.use('/', authMiddleware) before MCP routes
3. Add app.get('/.well-known/oauth-protected-resource', ...) BEFORE middleware
4. Use StreamableHTTPServerTransport from @modelcontextprotocol/sdk

Run 'copilot mcp-auth generate express' for complete ready-to-paste code.
`;

const FASTAPI_ADDENDUM = `
---

## FastAPI + FastMCP — Framework-specific steps

### Install dependencies

  pip install fastapi fastmcp uvicorn scalekit-sdk-python python-dotenv

### Environment variables (.env)

  SK_ENV_URL=https://your-env.scalekit.com
  SK_CLIENT_ID=your_client_id
  SK_CLIENT_SECRET=your_client_secret
  EXPECTED_AUDIENCE=https://mcp.yourapp.com/
  PROTECTED_RESOURCE_METADATA={"authorization_servers":["..."],"resource":"...","scopes_supported":["read","write"]}

### Key implementation steps

1. Create FastAPI app with @app.middleware("http") auth middleware
2. Exempt /.well-known/* and /health paths from authentication
3. Mount FastMCP HTTP app at root: app.mount("/", mcp.http_app(path="/"))
4. Add GET /.well-known/oauth-protected-resource endpoint BEFORE mount
5. Run with: uvicorn main:app --host 0.0.0.0 --port 3002

Layering order matters: middleware → custom endpoints → mount FastMCP last.

Run 'copilot mcp-auth generate fastapi' for complete ready-to-paste code.
`;

const FASTMCP_ADDENDUM = `
---

## FastMCP — Framework-specific steps (5-line OAuth)

### Install dependencies

  pip install "fastmcp>=2.13.0.2" python-dotenv

### Environment variables (.env)

  PORT=3002
  SCALEKIT_ENVIRONMENT_URL=https://your-env.scalekit.com
  SCALEKIT_CLIENT_ID=your_client_id
  SCALEKIT_RESOURCE_ID=res_your_resource_id
  MCP_URL=http://localhost:3002/

Note: Set Server URL in Scalekit dashboard to base URL with trailing slash,
e.g. http://localhost:3002/ — FastMCP appends /mcp automatically.

### Key implementation steps

1. Import ScalekitProvider from fastmcp.server.auth.providers.scalekit
2. Pass auth=ScalekitProvider(...) when constructing FastMCP
3. Scalekit provider handles all OAuth automatically — no custom middleware needed
4. Use get_access_token() dependency for scope-based tool authorization
5. Run with: python server.py

FastMCP + Scalekit provider: ~5 lines vs ~30 lines for manual middleware.

Run 'copilot mcp-auth generate fastmcp' for complete ready-to-paste code.
`;

export const setupCommand: Command = {
  name: 'setup',
  description: 'Print the MCP OAuth setup checklist. Use when starting to add OAuth 2.1 to an MCP server. Accepts optional framework arg: express | fastapi | fastmcp.',
  async execute(args: string[]) {
    const framework = args[0]?.toLowerCase();

    const validFrameworks = ['express', 'fastapi', 'fastmcp'];
    if (framework && !validFrameworks.includes(framework)) {
      throw new Error(
        `Unknown framework: "${framework}". Valid options are: express, fastapi, fastmcp`
      );
    }

    let output = GENERAL_GUIDE;

    if (framework === 'express') {
      output += EXPRESS_ADDENDUM;
    } else if (framework === 'fastapi') {
      output += FASTAPI_ADDENDUM;
    } else if (framework === 'fastmcp') {
      output += FASTMCP_ADDENDUM;
    }

    return output;
  }
};
