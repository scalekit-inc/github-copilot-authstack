# AGENTS.md

> This repository builds GitHub Copilot CLI plugins for marketplace distribution.
> Read this before writing any code. These rules are non-negotiable.

---

## What Lives Here

Every artifact in this repo is a **GitHub Copilot CLI plugin** — installable via
`copilot plugin marketplace add <repo>` and shareable across teams.

A plugin bundles any combination of: agents, skills, MCP servers, LSP servers, and hooks.

---

## Repository Layout

```
.
├── .github/
│   └── plugin/
│       └── marketplace.json           # Marketplace manifest — REQUIRED
├── plugins/
│   └── <plugin-name>/
│       ├── .github/
│       │   └── plugin/
│       │       └── plugin.json        # Plugin manifest — REQUIRED
│       ├── .mcp.json                  # MCP servers config (optional)
│       ├── agents/
│       │   └── *.agent.md             # Agent definitions
│       ├── skills/
│       │   └── <skill-name>/
│       │       └── SKILL.md           # Skill definitions
│       └── README.md                 # Required
└── AGENTS.md                          # This file
```

---

## Non-negotiable Rules

> These rules apply to all work in this monorepo. No exceptions.

- **Work on one plugin at a time** — never edit multiple plugins in a single change unless explicitly requested
- **Never add secrets** — no tokens, credentials, or private endpoints in any file
- **Prefer minimal changes** — improve correctness, security, and clarity with smallest viable surface area
- **Keep instructions stable** — avoid time-dependent guidance (e.g., "before August 2025")
- **Use forward slashes** — always use forward slashes in all file paths, never backslashes

---

## CLI Commands Reference

Use these commands to manage plugins:

| Command | Description |
| --- | --- |
| `copilot plugin install SPECIFICATION` | Install a plugin from marketplace, GitHub repo, Git URL, or local path |
| `copilot plugin uninstall NAME` | Remove a plugin |
| `copilot plugin list` | List installed plugins |
| `copilot plugin update NAME` | Update a specific plugin |
| `copilot plugin update --all` | Update all installed plugins |
| `copilot plugin disable NAME` | Temporarily disable a plugin without uninstalling it |
| `copilot plugin enable NAME` | Re-enable a disabled plugin |
| `copilot plugin marketplace add SPECIFICATION` | Register a marketplace |
| `copilot plugin marketplace list` | List registered marketplaces |
| `copilot plugin marketplace browse NAME` | Browse marketplace plugins |
| `copilot plugin marketplace remove NAME` | Unregister a marketplace |

### Plugin Specification for Install Command

| Format | Example | Description |
| --- | --- | --- |
| Marketplace | `plugin@marketplace` | Plugin from a registered marketplace |
| GitHub | `OWNER/REPO` | Root of a GitHub repository |
| GitHub subdir | `OWNER/REPO:PATH/TO/PLUGIN` | Subdirectory in a repository |
| Git URL | `https://github.com/o/r.git` | Any Git URL |
| Local path | `./my-plugin` or `/abs/path` | Local directory |

---

## Marketplace Manifest (`marketplace.json`)

Required at `.github/plugin/marketplace.json`. Copilot CLI also recognizes this file in `.claude-plugin/`.

```json
{
  "name": "my-marketplace",
  "owner": {
    "name": "Your Organization",
    "email": "plugins@example.com"
  },
  "metadata": {
    "description": "Curated plugins for our team",
    "version": "1.0.0"
  },
  "plugins": [
    {
      "name": "frontend-design",
      "description": "Create a professional-looking GUI ...",
      "version": "2.1.0",
      "source": "./plugins/frontend-design"
    },
    {
      "name": "security-checks",
      "description": "Check for potential security vulnerabilities ...",
      "version": "1.3.0",
      "source": "./plugins/security-checks"
    }
  ]
}
```

### Marketplace Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Kebab-case marketplace name. Max 64 chars. |
| `owner` | object | Yes | `{ name, email? }` — marketplace owner info. |
| `plugins` | array | Yes | List of plugin entries. |
| `metadata` | object | No | `{ description?, version?, pluginRoot? }` |

### Plugin Entry Fields (objects within the `plugins` array)

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Kebab-case plugin name. Max 64 chars. |
| `source` | string | object | Yes | Where to fetch the plugin (relative path, GitHub, or URL). |
| `description` | string | No | Plugin description. Max 1024 chars. |
| `version` | string | No | Plugin version. |
| `author` | object | No | `{ name, email?, url? }` |
| `homepage` | string | No | Plugin homepage URL. |
| `repository` | string | No | Source repository URL. |
| `license` | string | No | License identifier. |
| `keywords` | string[] | No | Search keywords. |
| `category` | string | No | Plugin category. |
| `tags` | string[] | No | Additional tags. |
| `commands` | string | string[] | No | Path(s) to command directories. |
| `agents` | string | string[] | No | Path(s) to agent directories. |
| `skills` | string | string[] | No | Path(s) to skill directories. |
| `hooks` | string | object | No | Path to hooks config or inline hooks object. |
| `mcpServers` | string | object | No | Path to MCP config or inline server definitions. |
| `lspServers` | string | object | No | Path to LSP config or inline server definitions. |
| `strict` | boolean | No | When `true` (the default), plugins must conform to the full schema and validation rules. When `false`, relaxed validation is used. |

Rules:
- `name` is the marketplace identifier — use lowercase letters, numbers, and hyphens
- `owner.name` and `owner.email` identify the marketplace maintainer
- `metadata.description` provides marketplace-level description
- `metadata.version` follows semantic versioning: `major.minor.patch`
- `plugins` array lists all available plugins in this marketplace
- `source` is the path to the plugin directory, relative to repository root
- Source paths can use `./plugins/plugin-name` or `plugins/plugin-name` (both resolve the same)

---

## Plugin Manifest (`plugin.json`)

Required at `plugins/<plugin-name>/.github/plugin/plugin.json`. Copilot CLI also recognizes this file at the plugin root.

### Required Fields

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Kebab-case plugin name (letters, numbers, hyphens only). Max 64 chars. |

### Optional Metadata Fields

| Field | Type | Description |
| --- | --- | --- |
| `description` | string | Brief description. Max 1024 chars. |
| `version` | string | Semantic version (e.g., `1.0.0`). |
| `author` | object | `name` (required), `email` (optional), `url` (optional). |
| `homepage` | string | Plugin homepage URL. |
| `repository` | string | Source repository URL. |
| `license` | string | License identifier (e.g., `MIT`). |
| `keywords` | string[] | Search keywords. |
| `category` | string | Plugin category. |
| `tags` | string[] | Additional tags. |

### Component Path Fields

These tell the CLI where to find your plugin's components. All are optional. The CLI uses default conventions if omitted.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `agents` | string | string[] | `agents/` | Path(s) to agent directories (`.agent.md` files). |
| `skills` | string | string[] | `skills/` | Path(s) to skill directories (`SKILL.md` files). |
| `commands` | string | string[] | — | Path(s) to command directories. |
| `hooks` | string | object | — | Path to a hooks config file, or an inline hooks object. |
| `mcpServers` | string | object | — | Path to an MCP config file (e.g., `.mcp.json`), or inline server definitions. |
| `lspServers` | string | object | — | Path to an LSP config file, or inline server definitions. |

### Example `plugin.json` File

```json
{
  "name": "my-dev-tools",
  "description": "React development utilities",
  "version": "1.2.0",
  "author": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "license": "MIT",
  "keywords": ["react", "frontend"],
  "agents": "agents/",
  "skills": ["skills/", "extra-skills/"],
  "hooks": "hooks.json",
  "mcpServers": ".mcp.json"
}
```

Rules:
- `name` becomes the plugin identifier
- Lowercase letters, numbers, hyphens only
- Never use "github" or "copilot" as part of the name
- Follow semantic versioning: `major.minor.patch`
- Component paths can be strings or arrays of strings
- All paths are relative to the plugin root

---

## File Locations

| Item | Path |
| --- | --- |
| Installed plugins | `~/.copilot/state/installed-plugins/MARKETPLACE/PLUGIN-NAME` (installed via a marketplace) and `~/.copilot/state/installed-plugins/PLUGIN-NAME` (installed directly) |
| Marketplace cache | `~/.copilot/state/marketplace-cache/` |
| Plugin manifest | `plugin.json`, `.github/plugin/plugin.json`, or `.claude-plugin/plugin.json` |
| Marketplace manifest | `.github/plugin/marketplace.json` or `.claude-plugin/marketplace.json` |
| Agents | `agents/` (default, overridable in manifest) |
| Skills | `skills/` (default, overridable in manifest) |
| Hooks config | `hooks.json` or `hooks/hooks.json` |
| MCP config | `.mcp.json` or `.github/mcp.json` |
| LSP config | `lsp.json` or `.github/lsp.json` |

---

## Loading Order and Precedence

If you install multiple plugins it's possible that some custom agents, skills, MCP servers, or tools supplied via MCP servers have duplicate names. In this situation, the CLI determines which component to use based on a precedence order.

### Agents and Skills — First-Found-Wins Precedence

If you have a project-level custom agent or skill with the same name or ID as one in a plugin you install, the agent or skill in the plugin is silently ignored. The plugin cannot override project-level or personal configurations. Custom agents are deduplicated using their ID, which is derived from its file name (for example, if the file is named `reviewer.agent.md`, the agent ID is `reviewer`). Skills are deduplicated by their name field inside the `SKILL.md` file.

Loading order for agents:
1. `~/.copilot/agents/` (user, .github convention)
2. `<project>/.github/agents/` (project)
3. `<parents>/.github/agents/` (inherited, monorepo)
4. `~/.claude/agents/` (user, .claude convention)
5. `<project>/.claude/agents/` (project)
6. `<parents>/.claude/agents/` (inherited, monorepo)
7. `PLUGIN: agents/` dirs (plugin, by install order)
8. Remote org/enterprise agents (remote, via API)

Loading order for skills:
1. `<project>/.github/skills/` (project)
2. `<project>/.agents/skills/` (project)
3. `<project>/.claude/skills/` (project)
4. `<parents>/.github/skills/` etc. (inherited)
5. `~/.copilot/skills/` (personal-copilot)
6. `~/.claude/skills/` (personal-claude)
7. `PLUGIN: skills/` dirs (plugin)
8. `COPILOT_SKILLS_DIRS` env + config (custom)

Then commands (`.claude/commands/`) are loaded, and skills override commands.

### MCP Servers — Last-Wins Precedence

If you install a plugin that defines an MCP server with the same server name as an MCP server you have already installed, the plugin's definition takes precedence. You can use the `--additional-mcp-config` command-line option to override an MCP server configuration with the same name, installed using a plugin.

Loading order for MCP servers:
1. `~/.copilot/mcp-config.json` (lowest priority)
2. `.vscode/mcp.json` (workspace)
3. `PLUGIN: MCP configs` (plugins)
4. `--additional-mcp-config` flag (highest priority)

### Built-in Components

Built-in tools and agents are always present and cannot be overridden by user-defined components:
- tools: bash, view, apply_patch, glob, rg, task, ...
- agents: explore, task, code-review, general-purpose, research

---

## Agents (`.agent.md` Files)

Agents live in `plugins/<plugin-name>/agents/<agent-name>.agent.md`.

Agent ID is derived from the filename (without `.agent.md` extension). For example, `reviewer.agent.md` has agent ID `reviewer`.

### Agent Structure

```markdown
# Agent Name

> Brief description of what this agent does.

## When to Use

Describe when to invoke this agent.

## Capabilities

List the agent's capabilities.

## Instructions

Detailed instructions for the agent.
```

---

## Skills (`SKILL.md` Files)

Skills live in `plugins/<plugin-name>/skills/<skill-name>/SKILL.md`.

Skill name is defined by the `name` field inside the `SKILL.md` file. Skills are deduplicated by name, so ensure unique names across all skills.

### Skill Structure

```markdown
# Skill Name

> Brief description of what this skill does.

## Available Tools

List the tools this skill has access to.

## Instructions

Detailed instructions for the skill.

## Examples

Provide usage examples.
```

---

## MCP Servers (`.mcp.json` Files)

MCP server configs can be defined at the plugin root or in a dedicated `.mcp.json` file referenced in `plugin.json`.

### MCP Config Structure

```json
{
  "mcpServers": {
    "server-name": {
      "command": "node",
      "args": ["path/to/server.js"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

---

## Security (Non-negotiable)

- **Never hardcode credentials** — use `${ENV_VAR}` in configs, `process.env.X` in code
- Validate all inputs before processing
- Use structured errors — never raw exception messages to users
- No `eval()` or dynamic `exec()` — reject any generated code execution
- **Always use forward slashes** in all file paths to prevent cross-platform issues
- Sanitize all file paths — prevent path traversal
- Validate before processing, not after

---

## Testing & Iteration

### Local Testing

Test plugins locally before publishing:

```bash
# Add local marketplace
copilot plugin marketplace add ./github-copilot-authstack

# List available plugins
copilot plugin list

# Install a specific plugin
copilot plugin install mcp-auth

# Test the plugin
copilot <agent-name> "Your prompt"
```

### Integration Testing

Test with real workflow scenarios to ensure agents and skills work as expected.

---

## Documentation Requirements

> **Required for every plugin** — Every plugin README must include these 7 sections.

1. **Purpose** — what problem this solves (2–3 sentences)
2. **Installation** — `copilot plugin marketplace add <repo>`
3. **Components reference** — every agent, skill, and MCP server
4. **Configuration** — required env vars + config examples
5. **Usage examples** — at least one end-to-end walkthrough
6. **Troubleshooting** — the 3 most common failure modes
7. **Security** — what credentials are needed and how to store them

**Important**: If behavior changes, update the plugin README in the same PR.

---

## Pre-publish Checklist

```
Marketplace
- [ ] marketplace.json has name, owner, metadata, plugins array
- [ ] All plugin source paths are correct relative to repo root
- [ ] Marketplace name is lowercase, hyphens only

Plugin
- [ ] plugin.json has name, description, version, homepage, license
- [ ] name is lowercase, hyphens only, no reserved words
- [ ] Component paths are correct (agents, skills, mcpServers, etc.)
- [ ] plugin.json exists at .github/plugin/plugin.json or plugin root

Agents
- [ ] All agent IDs are unique (derived from filename)
- [ ] All .agent.md files are valid markdown
- [ ] Forward slashes in all file paths

Skills
- [ ] All skill names are unique (defined in SKILL.md)
- [ ] All SKILL.md files are valid markdown
- [ ] Forward slashes in all file paths

MCP Servers
- [ ] All server names are unique
- [ ] No hardcoded credentials
- [ ] Environment variables use ${ENV_VAR} format

Security
- [ ] Zero hardcoded credentials anywhere in the repo
- [ ] All inputs are validated
- [ ] Error messages are user-friendly and actionable

Testing
- [ ] Plugin loaded locally and confirmed working
- [ ] All agents tested with real scenarios
- [ ] All skills tested with real scenarios
- [ ] Integration tested with copilot CLI

Documentation
- [ ] README covers all 7 required sections
```

---

## Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Marketplace name | `kebab-case` | `team-plugins` |
| Plugin name | `kebab-case` | `mcp-auth` |
| Agent filename | `<name>.agent.md` | `scalekit-mcp-auth-troubleshooter.agent.md` |
| Agent ID | derived from filename | `scalekit-mcp-auth-troubleshooter` |
| Skill directory | `kebab-case` | `mcp-auth` |
| Skill name | defined in SKILL.md | `MCP Auth` |
| MCP server name | `kebab-case` | `scalekit-auth-server` |

**Note**: All file paths must use forward slashes (`/`) regardless of operating system.

---

## Publishing Process

1. **Create feature branch**: `git checkout -b feature/plugin-name`
2. **Update marketplace.json**: Add or update plugin entry
3. **Implement plugin**: Create plugin directory with all required files
4. **Test locally**: Add marketplace and test all components
5. **Commit changes**: Use conventional commit format
6. **Push to GitHub**: `git push origin feature/plugin-name`
7. **Create PR**: Request review and merge to main
8. **Tag release**: `git tag v1.0.0 && git push --tags`

---

## User Installation Instructions

Provide these instructions to users:

```bash
# Add the marketplace
copilot plugin marketplace add octo-org/octo-repo

# List available plugins
copilot plugin list

# Install a specific plugin
copilot plugin install mcp-auth

# Use an agent from the plugin
copilot <agent-name> "Your prompt"
```

---

## Common Pitfalls to Avoid

- Incorrect source paths in marketplace.json (must be relative to repo root)
- Missing required fields in plugin.json
- Using reserved words in plugin names (github, copilot, etc.)
- Hardcoding credentials or API keys
- Not validating inputs
- Missing README documentation sections
- Not testing with copilot CLI before publishing
- Agent ID conflicts (duplicate agent IDs across plugins)
- Skill name conflicts (duplicate skill names across plugins)
- MCP server name conflicts (duplicate server names)
- Not understanding loading order and precedence rules
