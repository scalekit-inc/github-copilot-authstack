import { Command } from '@copilot/cli';

const EXPRESS_TEMPLATE = `// Express.js MCP Server with OAuth 2.1 via Scalekit
// Install: npm install express @scalekit-sdk/node @modelcontextprotocol/sdk dotenv cors
// Install dev: npm install -D @types/express @types/cors typescript
//
// .env file:
//   SK_ENV_URL=https://your-env.scalekit.com
//   SK_CLIENT_ID=your_client_id
//   SK_CLIENT_SECRET=your_client_secret
//   EXPECTED_AUDIENCE=https://mcp.yourapp.com/
//   PROTECTED_RESOURCE_METADATA={"authorization_servers":["https://..."],"resource":"https://mcp.yourapp.com","scopes_supported":["read","write"],"bearer_methods_supported":["header"]}
//   PORT=3002

import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { Scalekit } from '@scalekit-sdk/node';

const app = express();
const PORT = parseInt(process.env.PORT || '3002', 10);

const scalekit = new Scalekit(
  process.env.SK_ENV_URL!,
  process.env.SK_CLIENT_ID!,
  process.env.SK_CLIENT_SECRET!
);

const EXPECTED_AUDIENCE = process.env.EXPECTED_AUDIENCE!;
const METADATA_URL = \`\${EXPECTED_AUDIENCE}.well-known/oauth-protected-resource\`;

app.use(cors());
app.use(express.json());

// Public endpoints — must be registered BEFORE authMiddleware
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

app.get('/.well-known/oauth-protected-resource', (_req: Request, res: Response) => {
  const metadata = JSON.parse(process.env.PROTECTED_RESOURCE_METADATA!);
  res.json(metadata);
});

// Auth middleware — validates Bearer tokens on all other routes
async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.path.startsWith('/.well-known') || req.path === '/health') {
      return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split('Bearer ')[1]?.trim()
      : null;

    if (!token) {
      return res
        .status(401)
        .set('WWW-Authenticate', \`Bearer realm="OAuth", resource_metadata="\${METADATA_URL}"\`)
        .end();
    }

    await scalekit.validateToken(token, {
      audience: [EXPECTED_AUDIENCE]
    });

    next();
  } catch (_err) {
    return res
      .status(401)
      .set('WWW-Authenticate', \`Bearer realm="OAuth", resource_metadata="\${METADATA_URL}"\`)
      .end();
  }
}

// MCP server setup
const server = new McpServer(
  { name: 'my-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// Register your tools here
server.tool(
  'echo',
  'Echo back the input message',
  { message: { type: 'string' } },
  async ({ message }) => ({
    content: [{ type: 'text', text: \`Echo: \${message}\` }]
  })
);

app.use('/', authMiddleware);

app.all('/', async (req: Request, res: Response) => {
  const transport = new StreamableHTTPServerTransport('/message', {
    SSEWriter: (data: string) => {
      res.write(\`data: \${data}\\n\\n\`);
    }
  });

  await server.connect(transport);

  req.on('data', async (chunk: Buffer) => {
    await transport.handlePostMessage(chunk.toString(), req);
  });
});

app.listen(PORT, () => {
  console.log(\`MCP server listening on http://localhost:\${PORT}\`);
  console.log(\`Discovery: http://localhost:\${PORT}/.well-known/oauth-protected-resource\`);
});
`;

const FASTAPI_TEMPLATE = `# FastAPI + FastMCP MCP Server with OAuth 2.1 via Scalekit
# Install: pip install fastapi fastmcp uvicorn scalekit-sdk-python python-dotenv
#
# .env file:
#   SK_ENV_URL=https://your-env.scalekit.com
#   SK_CLIENT_ID=your_client_id
#   SK_CLIENT_SECRET=your_client_secret
#   EXPECTED_AUDIENCE=https://mcp.yourapp.com/
#   PROTECTED_RESOURCE_METADATA={"authorization_servers":["https://..."],"resource":"https://mcp.yourapp.com","scopes_supported":["read","write"],"bearer_methods_supported":["header"]}
#   PORT=3002
#
# Run: uvicorn main:app --host 0.0.0.0 --port 3002

import json
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastmcp import FastMCP
from starlette.requests import Request
from scalekit import ScalekitClient
from scalekit.common.scalekit import TokenValidationOptions

load_dotenv()

SK_ENV_URL = os.getenv("SK_ENV_URL", "")
SK_CLIENT_ID = os.getenv("SK_CLIENT_ID", "")
SK_CLIENT_SECRET = os.getenv("SK_CLIENT_SECRET", "")
EXPECTED_AUDIENCE = os.getenv("EXPECTED_AUDIENCE", "")
PROTECTED_RESOURCE_METADATA = os.getenv("PROTECTED_RESOURCE_METADATA", "")

RESOURCE_METADATA_URL = f"{EXPECTED_AUDIENCE}.well-known/oauth-protected-resource"
WWW_AUTHENTICATE = f'Bearer realm="OAuth", resource_metadata="{RESOURCE_METADATA_URL}"'

scalekit_client = ScalekitClient(
    env_url=SK_ENV_URL,
    client_id=SK_CLIENT_ID,
    client_secret=SK_CLIENT_SECRET
)

# FastMCP tool definitions
mcp = FastMCP("my-mcp-server")

@mcp.tool(name="greet", description="Greet a user by name.")
async def greet(name: str) -> dict:
    return {"content": [{"type": "text", "text": f"Hello, {name}!"}]}

# Build FastAPI app around FastMCP
mcp_app = mcp.http_app(path="/")
app = FastAPI(lifespan=mcp_app.lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    # Allow public endpoints
    if request.url.path in {"/health", "/.well-known/oauth-protected-resource"}:
        return await call_next(request)

    auth_header = request.headers.get("authorization", "")
    if not auth_header.startswith("Bearer "):
        return Response(
            '{"error": "Missing Bearer token"}',
            status_code=401,
            headers={"WWW-Authenticate": WWW_AUTHENTICATE},
            media_type="application/json"
        )

    token = auth_header.split("Bearer ", 1)[1].strip()

    try:
        options = TokenValidationOptions(
            issuer=SK_ENV_URL,
            audience=[EXPECTED_AUDIENCE]
        )
        is_valid = scalekit_client.validate_access_token(token, options=options)
        if not is_valid:
            raise ValueError("Invalid token")
    except Exception:
        return Response(
            '{"error": "Token validation failed"}',
            status_code=401,
            headers={"WWW-Authenticate": WWW_AUTHENTICATE},
            media_type="application/json"
        )

    return await call_next(request)

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/.well-known/oauth-protected-resource")
async def oauth_metadata():
    if not PROTECTED_RESOURCE_METADATA:
        return Response(
            '{"error": "PROTECTED_RESOURCE_METADATA not configured"}',
            status_code=500,
            media_type="application/json"
        )
    metadata = json.loads(PROTECTED_RESOURCE_METADATA)
    return Response(json.dumps(metadata, indent=2), media_type="application/json")

# Mount FastMCP last
app.mount("/", mcp_app)
`;

const FASTMCP_TEMPLATE = `# FastMCP Server with OAuth 2.1 via Scalekit Provider (5-line setup)
# Install: pip install "fastmcp>=2.13.0.2" python-dotenv
#
# .env file:
#   PORT=3002
#   SCALEKIT_ENVIRONMENT_URL=https://your-env.scalekit.com
#   SCALEKIT_CLIENT_ID=your_client_id
#   SCALEKIT_RESOURCE_ID=res_your_resource_id
#   MCP_URL=http://localhost:3002/
#
# Important: Server URL in Scalekit dashboard must match MCP_URL exactly
# (include trailing slash). FastMCP appends /mcp automatically.
#
# Run: python server.py

import os
import uuid
from dotenv import load_dotenv
from fastmcp import FastMCP
from fastmcp.server.auth.providers.scalekit import ScalekitProvider
from fastmcp.server.dependencies import AccessToken, get_access_token

load_dotenv()

# 5-line OAuth setup — Scalekit provider handles everything automatically
mcp = FastMCP(
    "My MCP Server",
    stateless_http=True,
    auth=ScalekitProvider(
        environment_url=os.getenv("SCALEKIT_ENVIRONMENT_URL"),
        client_id=os.getenv("SCALEKIT_CLIENT_ID"),
        resource_id=os.getenv("SCALEKIT_RESOURCE_ID"),
        mcp_url=os.getenv("MCP_URL"),
    ),
)


def _require_scope(scope: str) -> str | None:
    """Return error string if token is missing the required scope, else None."""
    token: AccessToken = get_access_token()
    if scope not in token.scopes:
        return f"Insufficient permissions: '{scope}' scope required."
    return None


@mcp.tool
def list_items() -> dict:
    """List all items. Requires read scope."""
    err = _require_scope("read")
    if err:
        return {"error": err}
    # Replace with your actual data retrieval logic
    return {"items": []}


@mcp.tool
def create_item(title: str, description: str = "") -> dict:
    """Create a new item. Requires write scope."""
    err = _require_scope("write")
    if err:
        return {"error": err}
    # Replace with your actual creation logic
    item_id = str(uuid.uuid4())
    return {"id": item_id, "title": title, "description": description}


if __name__ == "__main__":
    mcp.run(transport="http", port=int(os.getenv("PORT", "3002")))
`;

const TEMPLATES: Record<string, string> = {
  express: EXPRESS_TEMPLATE,
  fastapi: FASTAPI_TEMPLATE,
  fastmcp: FASTMCP_TEMPLATE
};

export const generateCommand: Command = {
  name: 'generate',
  description: 'Generate OAuth middleware code for a framework. Use when writing auth code. Requires one arg: express | fastapi | fastmcp.',
  async execute(args: string[]) {
    const framework = args[0]?.toLowerCase();

    if (!framework) {
      throw new Error(
        'Framework argument is required. Usage: copilot mcp-auth generate <framework>\n' +
        'Valid frameworks: express, fastapi, fastmcp'
      );
    }

    if (!TEMPLATES[framework]) {
      throw new Error(
        `Unknown framework: "${framework}". Valid options are: express, fastapi, fastmcp\n` +
        'Run "copilot mcp-auth setup" to see an overview of all frameworks.'
      );
    }

    return TEMPLATES[framework];
  }
};
