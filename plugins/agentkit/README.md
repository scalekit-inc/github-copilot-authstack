# AgentKit for GitHub Copilot

Authentication for AI agents. This plugin brings Scalekit AgentKit into Codex so agents can connect users to third-party apps, discover the right tools, and execute authenticated tool calls on their behalf.

AgentKit handles the full OAuth lifecycle — authorization, token vault, and automatic refresh — across 40+ connectors (Gmail, Slack, Salesforce, Notion, and more).

The plugin treats live AgentKit metadata as the source of truth for tool names, `input_schema`, and `output_schema`. For per-connector details, see the [AgentKit connectors catalog](https://docs.scalekit.com/agentkit/connectors/).

## Skills

- `integrating-agentkit` — Core integration: SDK setup, connected accounts, OAuth flows, token fetching, downstream API calls, and agent framework examples.
- `discovering-connector-tools` — Uses live AgentKit metadata to find tools, inspect schemas, and narrow the tool set.
- `exposing-agentkit-via-mcp` — Exposes AgentKit tools through MCP for MCP-compatible runtimes.
- `production-readiness-agentkit` — Structured production readiness checklist for AgentKit integrations.

## Configuration

Required environment variables:

- `SCALEKIT_ENV_URL`
- `SCALEKIT_CLIENT_ID`
- `SCALEKIT_CLIENT_SECRET`

## Links

- [AgentKit overview](https://docs.scalekit.com/agentkit/overview.md)
- [AgentKit quickstart](https://docs.scalekit.com/agentkit/quickstart.md)
- [LLM docs map](https://docs.scalekit.com/llms.txt)
