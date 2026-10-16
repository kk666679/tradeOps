import type { CommandSpec } from '../types';
import { workflowCommands } from './workflow';
import { declarationCommands } from './declaration';
import { graphCommands } from './graph';
import { integrationCommands } from './integration';
import { utilCommands } from './util';

export const COMMANDS: readonly CommandSpec[] = [
  ...workflowCommands,
  ...declarationCommands,
  ...graphCommands,
  ...integrationCommands,
  ...utilCommands,
];

export const COMMAND_INDEX: ReadonlyMap<string, CommandSpec> = (() => {
  const m = new Map<string, CommandSpec>();
  for (const c of COMMANDS) {
    m.set(c.name.toLowerCase(), c);
    c.aliases?.forEach((a) => m.set(a.toLowerCase(), c));
  }
  return m;
})();

export function resolveCommand(name: string): CommandSpec | undefined {
  return COMMAND_INDEX.get(name.toLowerCase());
}

export function commandsByGroup(): ReadonlyMap<string, readonly CommandSpec[]> {
  const m = new Map<string, CommandSpec[]>();
  for (const c of COMMANDS) {
    if (c.hidden) continue;
    const list = m.get(c.group) ?? [];
    list.push(c);
    m.set(c.group, list);
  }
  return m;
}

export {
  workflowCommands,
  declarationCommands,
  graphCommands,
  integrationCommands,
  utilCommands,
};
