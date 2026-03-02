import { Command } from '@copilot/cli';
import https from 'https';
import http from 'http';
import { URL } from 'url';

interface CheckResult {
  name: string;
  passed: boolean;
  detail: string;
  nextStep?: string;
}

function httpGet(urlString: string): Promise<{ statusCode: number; headers: Record<string, string>; body: string }> {
  return new Promise((resolve, reject) => {
    let parsed: URL;
    try {
      parsed = new URL(urlString);
    } catch (_err) {
      return reject(new Error(`Invalid URL: ${urlString}`));
    }

    const transport = parsed.protocol === 'https:' ? https : http;
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: { 'User-Agent': 'mcp-auth-validate/1.0' },
      timeout: 10000
    };

    const req = transport.request(options, (res) => {
      let body = '';
      res.on('data', (chunk: Buffer) => { body += chunk.toString(); });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode ?? 0,
          headers: (res.headers as Record<string, string>),
          body
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timed out after 10s: ${urlString}`));
    });

    req.on('error', (err: Error) => reject(err));
    req.end();
  });
}

async function checkDiscoveryEndpoint(baseUrl: string): Promise<CheckResult> {
  const name = 'Discovery endpoint (/.well-known/oauth-protected-resource)';
  const url = baseUrl.replace(/\/$/, '') + '/.well-known/oauth-protected-resource';

  try {
    const res = await httpGet(url);

    if (res.statusCode !== 200) {
      return {
        name,
        passed: false,
        detail: `HTTP ${res.statusCode} (expected 200)`,
        nextStep:
          'Ensure GET /.well-known/oauth-protected-resource is publicly accessible and returns 200. ' +
          'Copy the Metadata JSON from Scalekit Dashboard → MCP Servers → Your server → Metadata JSON.'
      };
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(res.body);
    } catch (_err) {
      return {
        name,
        passed: false,
        detail: 'Response is not valid JSON',
        nextStep: 'Endpoint must return a JSON object. Check Content-Type and response body.'
      };
    }

    if (!parsed['authorization_servers']) {
      return {
        name,
        passed: false,
        detail: 'JSON body is missing required field: authorization_servers',
        nextStep:
          'The response must include "authorization_servers" array with your Scalekit environment URL. ' +
          'Copy the exact Metadata JSON from your Scalekit dashboard.'
      };
    }

    return {
      name,
      passed: true,
      detail: `HTTP 200, authorization_servers present`
    };
  } catch (err) {
    return {
      name,
      passed: false,
      detail: `Request failed: ${(err as Error).message}`,
      nextStep:
        'Verify the server is running and reachable. For HTTPS, confirm your TLS certificate is valid.'
    };
  }
}

async function checkUnauthorizedResponse(baseUrl: string): Promise<CheckResult> {
  const name = 'Unauthenticated request returns 401';
  const url = baseUrl.replace(/\/$/, '') + '/';

  try {
    const res = await httpGet(url);

    if (res.statusCode !== 401) {
      return {
        name,
        passed: false,
        detail: `HTTP ${res.statusCode} (expected 401)`,
        nextStep:
          'The MCP root endpoint must reject unauthenticated requests with 401. ' +
          'Check that your auth middleware is applied to the / route. ' +
          'Make sure the middleware runs before the MCP handler.'
      };
    }

    return {
      name,
      passed: true,
      detail: `HTTP 401 as expected`
    };
  } catch (err) {
    return {
      name,
      passed: false,
      detail: `Request failed: ${(err as Error).message}`,
      nextStep:
        'Verify the server is running and reachable. For HTTPS, confirm your TLS certificate is valid.'
    };
  }
}

async function checkWwwAuthenticateHeader(baseUrl: string): Promise<CheckResult> {
  const name = 'WWW-Authenticate header present on 401';
  const url = baseUrl.replace(/\/$/, '') + '/';

  try {
    const res = await httpGet(url);

    const wwwAuth = res.headers['www-authenticate'] || '';

    if (res.statusCode !== 401) {
      return {
        name,
        passed: false,
        detail: `HTTP ${res.statusCode} (expected 401 to check header)`,
        nextStep: 'Fix the 401 check above first, then re-run validate.'
      };
    }

    if (!wwwAuth) {
      return {
        name,
        passed: false,
        detail: 'WWW-Authenticate header is missing from 401 response',
        nextStep:
          'Add the WWW-Authenticate header to all 401 responses:\n' +
          '  WWW-Authenticate: Bearer realm="OAuth", resource_metadata="https://<domain>/.well-known/oauth-protected-resource"\n' +
          'Without this header, AI hosts (Claude Desktop, Cursor, VS Code) cannot initiate the OAuth flow.'
      };
    }

    const hasBearer = wwwAuth.toLowerCase().includes('bearer');
    const hasResourceMetadata = wwwAuth.includes('resource_metadata');

    if (!hasBearer || !hasResourceMetadata) {
      return {
        name,
        passed: false,
        detail: `WWW-Authenticate header is malformed: "${wwwAuth}"`,
        nextStep:
          'Header must follow this exact format:\n' +
          '  Bearer realm="OAuth", resource_metadata="https://<domain>/.well-known/oauth-protected-resource"\n' +
          'Both realm and resource_metadata are required.'
      };
    }

    return {
      name,
      passed: true,
      detail: `Header present: ${wwwAuth.substring(0, 80)}${wwwAuth.length > 80 ? '...' : ''}`
    };
  } catch (err) {
    return {
      name,
      passed: false,
      detail: `Request failed: ${(err as Error).message}`,
      nextStep:
        'Verify the server is running and reachable. For HTTPS, confirm your TLS certificate is valid.'
    };
  }
}

function formatReport(url: string, results: CheckResult[]): string {
  const passCount = results.filter((r) => r.passed).length;
  const total = results.length;
  const allPassed = passCount === total;

  const lines: string[] = [
    `# MCP OAuth Validation Report`,
    `URL: ${url}`,
    `Result: ${passCount}/${total} checks passed`,
    ''
  ];

  for (const result of results) {
    const icon = result.passed ? '✓' : '✗';
    lines.push(`${icon} ${result.name}`);
    lines.push(`  ${result.detail}`);
    if (!result.passed && result.nextStep) {
      lines.push('');
      lines.push('  Next step:');
      for (const line of result.nextStep.split('\n')) {
        lines.push(`    ${line}`);
      }
    }
    lines.push('');
  }

  if (allPassed) {
    lines.push('All checks passed. Your MCP server is ready for OAuth-based AI hosts.');
    lines.push('Test with: Claude Desktop, Cursor, or VS Code MCP extension.');
  } else {
    lines.push('Fix the failing checks above, then re-run:');
    lines.push(`  copilot mcp-auth validate ${url}`);
    lines.push('');
    lines.push('For setup guidance run: copilot mcp-auth setup');
  }

  return lines.join('\n');
}

export const validateCommand: Command = {
  name: 'validate',
  description: 'Validate an MCP server\'s OAuth configuration. Use when testing auth setup. Requires one arg: the MCP server base URL.',
  async execute(args: string[]) {
    const rawUrl = args[0];

    if (!rawUrl) {
      throw new Error(
        'MCP server URL is required. Usage: copilot mcp-auth validate <url>\n' +
        'Example: copilot mcp-auth validate https://mcp.example.com'
      );
    }

    // Validate URL format
    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch (_err) {
      throw new Error(
        `Invalid URL: "${rawUrl}"\n` +
        'Provide a full URL with protocol, e.g. https://mcp.example.com'
      );
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error(
        `Unsupported protocol: "${parsed.protocol}". Use http:// or https://.`
      );
    }

    const baseUrl = rawUrl.replace(/\/$/, '');

    const results = await Promise.all([
      checkDiscoveryEndpoint(baseUrl),
      checkUnauthorizedResponse(baseUrl),
      checkWwwAuthenticateHeader(baseUrl)
    ]);

    return formatReport(baseUrl, results);
  }
};
