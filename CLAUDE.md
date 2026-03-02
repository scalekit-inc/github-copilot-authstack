# CLAUDE.md (Repo guide for agents)

This repository contains GitHub Copilot CLI plugins for marketplace distribution.
It is a monorepo. Always work inside one plugin directory at a time.

If you are making changes, read AGENTS.md first and follow it as the source of truth.

## Quick orientation

Top level:

- .github/plugin/ Marketplace manifest location
- plugins/ Monorepo root for all plugins
- AGENTS.md Non negotiable rules for manifests, commands, security
- README.md Repo overview

Plugins (examples you may see here):

- plugins/frontend-design/
- plugins/security-checks/
- plugins/deploy-tools/

Each plugin is expected to look like:
plugins/<plugin-name>/
  manifest.json Plugin manifest (name, version, commands)
  src/index.ts Plugin entrypoint
  commands/ CLI command implementations
  package.json Node.js dependencies
  README.md Required docs for that plugin

## Marketplace structure

The marketplace.json file in .github/plugin/ defines which plugins are available:

```json
{
  "name": "github-copilot-authstack",
  "owner": {
    "name": "Plugin Owner",
    "email": "owner@example.com"
  },
  "metadata": {
    "description": "GitHub Copilot CLI plugins marketplace",
    "version": "1.0.0"
  },
  "plugins": [
    {
      "name": "plugin-name",
      "description": "Plugin description",
      "version": "1.0.0",
      "source": "./plugins/plugin-name"
    }
  ]
}
```

Source paths are relative to the repository root. Use `./plugins/plugin-name` or `plugins/plugin-name` (both work).

## Golden rules

- Do not edit multiple plugins in one change unless explicitly requested.
- Prefer smallest viable change that improves correctness, safety, or docs.
- Never add secrets, tokens, or credentials to this repo.
- Follow naming rules from AGENTS.md for plugin names and command names.
- Keep command implementations focused and testable.

## Workflow for improvements

1. Identify the target plugin directory under plugins/<plugin-name>.
2. Read these files before coding:
   - .github/plugin/marketplace.json
   - plugins/<plugin-name>/manifest.json
   - plugins/<plugin-name>/README.md
   - plugins/<plugin-name>/src/index.ts
   - Any relevant commands/*.ts
3. Decide the change type:
   - New plugin: Create plugin directory, update marketplace.json
   - New command: Add command file, update manifest.json commands array
   - Command change: Update command implementation, update README if needed
   - Manifest change: Update manifest.json fields (version, description, etc.)
4. Update documentation:
   - Always update plugins/<plugin-name>/README.md when behavior changes.
   - Update .github/plugin/marketplace.json if adding/updating plugins.
5. Local verification:
   - Add marketplace locally:
     copilot plugin marketplace add ./github-copilot-authstack
   - List available plugins:
     copilot plugin list
   - Test the plugin command:
     copilot <plugin-name> <command> [args]
6. Definition of done:
   - Clear docs for how to use the change
   - No secrets added
   - Naming follows AGENTS.md
   - Marketplace.json source path is correct
   - Minimal surface area change

## When adding a new plugin

1. Create plugin directory: plugins/<plugin-name>/
2. Create manifest.json with required fields
3. Create src/index.ts with plugin entrypoint
4. Create commands/ directory and implement commands
5. Create package.json with dependencies
6. Create README.md with all 7 required sections
7. Update .github/plugin/marketplace.json to include the new plugin
8. Test locally with copilot CLI

## When updating an existing plugin

1. Edit plugin files in plugins/<plugin-name>/
2. Update version in manifest.json if behavior changes
3. Update README.md if commands or behavior changes
4. Run local tests with copilot CLI
5. Commit changes with conventional commit message

## Common pitfalls to avoid

- Wrong source paths in marketplace.json. Must be relative to repo root.
- Missing required fields in manifest.json.
- Using reserved words in plugin names (github, copilot).
- Not validating command inputs.
- Forgetting to update README.md when behavior changes.
- Hardcoding credentials or secrets.
- Not testing with copilot CLI before committing.

## Testing before publishing

Always test locally:

```bash
# Add the marketplace
copilot plugin marketplace add ./github-copilot-authstack

# Verify marketplace loaded
copilot plugin list

# Test plugin commands
copilot <plugin-name> <command> [args]

# Verify output matches expected behavior
```

Run unit tests if available:

```bash
cd plugins/<plugin-name>
npm test
```

## When uncertain

If the request is ambiguous, ask which plugin folder under plugins/ is the target before making changes.

If unsure about marketplace.json structure, reference the existing entries in .github/plugin/marketplace.json.

## Branch strategy for pushing

When making changes that will be pushed to GitHub:

1. Create a feature branch: `git checkout -b feature/plugin-name-update`
2. Make your changes
3. Test locally with copilot CLI
4. Commit changes with conventional commit format
5. Push to remote: `git push origin feature/plugin-name-update`
6. Create pull request for review

Never push directly to main branch for marketplace changes.
