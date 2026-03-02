import { Plugin } from '@copilot/cli';
import { setupCommand } from '../commands/setup';
import { generateCommand } from '../commands/generate';
import { validateCommand } from '../commands/validate';

export const plugin: Plugin = {
  name: 'mcp-auth',
  version: '1.0.0',
  commands: [
    setupCommand,
    generateCommand,
    validateCommand
  ],
  async initialize() {
    // No initialization required
  },
  async shutdown() {
    // No cleanup required
  }
};
