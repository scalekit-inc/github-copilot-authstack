# Tool Discovery

Live AgentKit metadata is the source of truth for:

- current connector coverage
- tool names
- `input_schema`
- `output_schema`

This is the most important rule in the hybrid structure.

## What belongs in docs vs live metadata

Use `references/` for:

- stable terminology
- auth and setup guidance
- connector quirks
- example workflows

Use live metadata for:

- current tools for a connector
- required input fields
- optional input fields
- output shape

## Official Scalekit docs

- [Tools overview](https://docs.scalekit.com/agentkit/tools/overview.md)
- [Scalekit optimized built-in tools](https://docs.scalekit.com/agentkit/tools/scalekit-optimized-tools.md)
- [AgentKit connectors](https://docs.scalekit.com/agentkit/connectors.md)

## Discovery workflow

1. Start from a connector or exact tool name.
2. Query live AgentKit metadata.
3. Inspect:
   - tool name
   - description
   - connector or provider grouping
   - `input_schema.required`
   - `input_schema.properties`
   - `output_schema.properties`
4. Narrow the tool set to the few tools needed for the workflow.
5. Only execute after the schema is clear and the user has an `ACTIVE` connected account.

## Important distinction

Do not confuse:

- dashboard `connection_name`
- connector or provider slug used for discovery filters

The first is used for authorization and connected-account operations.
The second is used for catalog discovery.

## Copilot workflow

Use:

- `discovering-connector-tools` when the user needs current tools or schemas
- The Scalekit MCP server (`https://mcp.scalekit.com`) when the user wants to run a live tool and inspect the exact payload

## Fallback rule

If live credentials are unavailable, connector notes are still useful as a directional guide, but they must be treated as non-exhaustive.

## Related docs

- [connections.md](connections.md)
- [connected-accounts.md](connected-accounts.md)
- [connectors.md](connectors.md)