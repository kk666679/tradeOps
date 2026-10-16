import { table } from '../utils';
import type { CommandSpec } from '../types';

export const workflowCommands: CommandSpec[] = [
  {
    name: 'run',
    aliases: ['r', 'exec'],
    usage: 'run',
    summary: 'Execute the active workflow graph',
    group: 'workflow',
    handler: (_args, ctx) => {
      if (ctx.isRunning()) {
        return { lines: ['⚠ a run is already in progress'] };
      }
      ctx.emit('terminal.run', 'local', 'Run dispatched from terminal');
      ctx.run();
      return { lines: ['▶ dispatching run…'] };
    },
  },
  {
    name: 'pause',
    usage: 'pause',
    summary: 'Request the running workflow to halt after the current node',
    group: 'workflow',
    handler: (_args, ctx) => {
      if (!ctx.isRunning()) return { lines: ['no run in progress'] };
      ctx.pause();
      return { lines: ['⏸ pause requested — will halt after the current node'] };
    },
  },
  {
    name: 'status',
    aliases: ['st', 'stat'],
    usage: 'status',
    summary: 'Show declaration + integration status',
    group: 'workflow',
    handler: (_args, ctx) => {
      const d = ctx.getDecl();
      const m = ctx.getMode();
      const caps = ctx.getCapabilities();
      return {
        lines: [
          table([
            ['mode', m],
            ['declaration', d.id],
            ['state', d.status],
            ['history', `${d.historyLength} entries`],
            ['pending', d.pending ?? '—'],
            ['capabilities', `${caps.length}`],
            ['running', ctx.isRunning() ? 'yes' : 'no'],
          ]),
        ],
      };
    },
  },
];
