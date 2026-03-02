# AGENTS.md

> This repository builds GitHub Copilot CLI plugins for marketplace distribution.
> Read this before writing any code. These rules are non-negotiable.

---

## What Lives Here

Every artifact in this repo is a **GitHub Copilot CLI plugin** — installable via
`copilot plugin marketplace add <repo>` and shareable across teams.

A plugin bundles any combination of: CLI commands, sub-commands, and configurations.

---

## Repository Layout

```
.
├── .github/
│   └── plugin/
│       └── marketplace.json           # Marketplace manifest — REQUIRED
├── plugins/
│   └── <plugin-name>/
│       ├── manifest.json              # Plugin manifest — REQUIRED
│       ├── src/
│       │   └── index.ts               # Plugin entrypoint
│       ├── commands/
│       │   └── *.ts                   # CLI command implementations
│       ├── package.json               # Node.js dependencies
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

Rules:
- `name` is the marketplace identifier — use lowercase letters, numbers, and hyphens
- `owner.name` and `owner.email` identify the marketplace maintainer
- `metadata.description` provides marketplace-level description
- `metadata.version` follows semantic versioning: `major.minor.patch`
- `plugins` array lists all available plugins in this marketplace
- `source` is the path to the plugin directory, relative to repository root
- Source paths can use `./plugins/plugin-name` or `plugins/plugin-name` (both resolve the same)

---

## Plugin Manifest (`manifest.json`)

Required at `plugins/<plugin-name>/manifest.json`.

```json
{
  "name": "frontend-design",
  "description": "Generate professional GUI layouts and components",
  "version": "2.1.0",
  "author": {
    "name": "Author Name"
  },
  "homepage": "https://github.com/org/repo",
  "repository": "https://github.com/org/repo",
  "license": "MIT",
  "main": "./src/index.ts",
  "commands": [
    {
      "name": "generate",
      "description": "Generate a GUI component from a description"
    },
    {
      "name": "validate",
      "description": "Validate a UI design against best practices"
    }
  ]
}
```

Rules:
- `name` becomes the plugin command namespace: `copilot <plugin-name> <command>`
- Lowercase letters, numbers, hyphens only
- Never use "github" or "copilot" as part of the name
- Follow semantic versioning: `major.minor.patch`
- `main` specifies the entrypoint file
- `commands` array lists all CLI commands this plugin provides

---

## Command Implementation Rules

Commands live in `plugins/<plugin-name>/commands/<command-name>.ts`.

```typescript
import { Command } from '@copilot/cli';

export const generateCommand: Command = {
  name: 'generate',
  description: 'Generate a GUI component from a description',
  async execute(args: string[]) {
    const description = args[0];
    if (!description) {
      throw new Error('Description is required');
    }

    // Implementation here
    const result = await generateComponent(description);
    return result;
  }
};
```

### Naming Convention

Use **simple present tense** verbs. The `name` becomes the sub-command.

| Good | Acceptable | Bad |
|---|---|---|
| `generate` | `gen` | `helper` |
| `validate` | `check` | `utils` |
| `analyze` | `analyze` | `tools` |
| `deploy` | `deploy-helper` | `files` |

### Description Rules

- Always write in **third person** — it's shown in help text
- Include keywords users would naturally say
- State both **what it does** and **when to use it**
- Max 256 characters

```typescript
// BAD
description: 'Helps with components'

// GOOD
description: 'Generate a GUI component from a description. Use when creating new UI elements.'
```

---

## Plugin Entry Point (`src/index.ts`)

Required at `plugins/<plugin-name>/src/index.ts`.

```typescript
import { Plugin } from '@copilot/cli';
import { generateCommand } from '../commands/generate';
import { validateCommand } from '../commands/validate';

export const plugin: Plugin = {
  name: 'frontend-design',
  version: '2.1.0',
  commands: [
    generateCommand,
    validateCommand
  ],
  async initialize() {
    // Plugin initialization logic
    console.log('Frontend Design plugin initialized');
  },
  async shutdown() {
    // Plugin cleanup logic
    console.log('Frontend Design plugin shutting down');
  }
};
```

---

## Security (Non-negotiable)

- **Never hardcode credentials** — use `${ENV_VAR}` in configs, `process.env.X` in code
- Validate all command inputs before processing
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

# Test a specific plugin command
copilot frontend-design generate "Create a login form"
```

### Unit Testing

Write unit tests for each command:

```typescript
import { describe, it, expect } from '@jest/globals';
import { generateCommand } from './generate';

describe('generateCommand', () => {
  it('should generate a component from description', async () => {
    const result = await generateCommand.execute(['Create a button']);
    expect(result).toBeDefined();
  });

  it('should throw error when description is missing', async () => {
    await expect(generateCommand.execute([])).rejects.toThrow('Description is required');
  });
});
```

---

## Documentation Requirements

> **Required for every plugin** — Every plugin README must include these 7 sections.

1. **Purpose** — what problem this solves (2–3 sentences)
2. **Installation** — `copilot plugin marketplace add <repo>`
3. **Commands reference** — every `copilot <plugin-name> <command>`
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
- [ ] manifest.json has name, description, version, homepage, license
- [ ] name is lowercase, hyphens only, no reserved words
- [ ] commands array lists all available commands
- [ ] main entrypoint exists and exports plugin object

Commands
- [ ] All descriptions are in third person
- [ ] All command names are simple present tense verbs
- [ ] No command named helper, utils, tools, data, or files
- [ ] All inputs are validated before processing
- [ ] Forward slashes in all file paths

Security
- [ ] Zero hardcoded credentials anywhere in the repo
- [ ] All command inputs are validated
- [ ] Error messages are user-friendly and actionable

Testing
- [ ] All commands tested with unit tests
- [ ] Plugin loaded locally and confirmed working
- [ ] Integration tested with copilot CLI

Documentation
- [ ] README covers all 7 required sections
```

---

## Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Marketplace name | `kebab-case` | `team-plugins` |
| Plugin name | `kebab-case` | `frontend-design` |
| Command name | `snake_case`, verb | `generate`, `validate` |
| Source files | `kebab-case.ts` | `generate-component.ts` |
| Test files | `<name>.test.ts` | `generate.test.ts` |

**Note**: All file paths must use forward slashes (`/`) regardless of operating system.

---

## Publishing Process

1. **Create feature branch**: `git checkout -b feature/plugin-name`
2. **Update marketplace.json**: Add or update plugin entry
3. **Implement plugin**: Create plugin directory with all required files
4. **Test locally**: Add marketplace and test all commands
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
copilot plugin install frontend-design

# Use the plugin
copilot frontend-design generate "Create a login form"
```

---

## Common Pitfalls to Avoid

- Incorrect source paths in marketplace.json (must be relative to repo root)
- Missing required fields in manifest.json
- Using reserved words in plugin names (github, copilot, etc.)
- Hardcoding credentials or API keys
- Not validating command inputs
- Missing README documentation sections
- Not testing with copilot CLI before publishing
