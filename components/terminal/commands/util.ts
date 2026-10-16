import { newLineId } from '../utils';
import type { CommandSpec, CommandGroup } from '../types';
import { COMMANDS } from './index';

export const utilCommands: CommandSpec[] = [
  {
    name: 'help',
    aliases: ['?', 'h'],
    usage: 'help [command]',
    summary: 'List commands or show detail for one',
    group: 'util',
    completions: () => COMMANDS.filter((c) => !c.hidden).map((c) => c.name),
    handler: (args) => {
      if (args[0]) {
        const cmd = COMMANDS.find(
          (c) => c.name === args[0] || c.aliases?.includes(args[0]),
        );
        if (!cmd) return { lines: [`✗ unknown command "${args[0]}"`] };
        return {
          lines: [
            `${cmd.name} — ${cmd.summary}`,
            `  usage:   ${cmd.usage}`,
            `  group:   ${cmd.group}`,
            cmd.aliases?.length ? `  aliases: ${cmd.aliases.join(', ')}` : '',
          ].filter(Boolean) as string[],
        };
      }

      const byGroup = new Map<CommandGroup, CommandSpec[]>();
      for (const c of COMMANDS) {
        if (c.hidden) continue;
        const list = byGroup.get(c.group) ?? [];
        list.push(c);
        byGroup.set(c.group, list);
      }

      const lines: string[] = ['Available commands:'];
      const order: CommandGroup[] = [
        'workflow',
        'declaration',
        'graph',
        'integration',
        'util',
      ];
      for (const g of order) {
        const list = byGroup.get(g);
        if (!list?.length) continue;
        lines.push('');
        lines.push(`  ${g.toUpperCase()}`);
        for (const c of list) {
          lines.push(`    ${c.name.padEnd(14, ' ')}${c.summary}`);
        }
      }
      return { lines };
    },
  },
  {
    name: 'clear',
    aliases: ['cls'],
    usage: 'clear',
    summary: 'Clear the terminal scrollback',
    group: 'util',
    handler: () => ({ clear: true, silent: true }),
  },
  {
    name: 'echo',
    usage: 'echo <text…>',
    summary: 'Print text (respects quoting)',
    group: 'util',
    handler: (args) => ({ lines: [args.join(' ')] }),
  },
  {
    name: 'time',
    aliases: ['now'],
    usage: 'time',
    summary: 'Show the local clock and current epoch',
    group: 'util',
    handler: () => ({
      lines: [
        `${new Date().toLocaleString('en-GB', { hour12: false })}`,
        `epoch: ${Date.now()}`,
      ],
    }),
  },
  {
    name: 'export',
    usage: 'export',
    summary: 'Download the transcript as .log',
    group: 'util',
    handler: () => ({
      lines: [{ kind: 'info', text: '⟶ use the ⤓ button in the header to export the transcript' }],
    }),
  },
  {
    name: 'shortcuts',
    usage: 'shortcuts',
    summary: 'Show keyboard shortcuts',
    group: 'util',
    handler: () => ({
      lines: [
        'keyboard shortcuts:',
        '  ↑ / ↓         previous / next command',
        '  Tab           complete command or argument',
        '  Ctrl+L        clear the transcript',
        '  Ctrl+C        cancel the current input',
        '  /             (in Console) focus search',
      ],
    }),
  },
];

export const INTERNAL_LINE_ID = newLineId;
