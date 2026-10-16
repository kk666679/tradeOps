import { formatTime } from '../utils';
import type { CommandSpec } from '../types';

export const declarationCommands: CommandSpec[] = [
  {
    name: 'decl',
    aliases: ['advance', 'go'],
    usage: 'decl <state>',
    summary: 'Advance the declaration to a legal next state',
    group: 'declaration',
    completions: () => [
      'ready_for_review',
      'pending_approval',
      'approved_for_submission',
      'submission_pending',
      'submitted_unconfirmed',
      'acknowledged',
      'accepted',
      'released',
      'rejected',
    ],
    handler: (args, ctx) => {
      if (!args[0]) return { lines: ['usage: decl <state>'] };
      const ok = ctx.advanceDecl(args[0]);
      return {
        lines: [
          ok
            ? `✓ advanced → ${args[0]}`
            : `✗ illegal transition to "${args[0]}" (see history tab for allowed next states)`,
        ],
      };
    },
  },
  {
    name: 'approve',
    aliases: ['ap', 'ack'],
    usage: 'approve',
    summary: 'Commit the pending manual observation',
    group: 'declaration',
    handler: (_args, ctx) => {
      const ok = ctx.approve();
      return {
        lines: [
          ok
            ? '✓ reviewer approval applied — observation committed'
            : 'no pending observation to approve',
        ],
      };
    },
  },
  {
    name: 'manual',
    aliases: ['obs', 'record'],
    usage: 'manual',
    summary: 'Open the manual-response dialog',
    group: 'declaration',
    handler: (_args, ctx) => {
      ctx.openManual();
      return { lines: ['manual response dialog opened'] };
    },
  },
  {
    name: 'history',
    aliases: ['hist', 'log'],
    usage: 'history [n]',
    summary: 'Print the declaration state history (default 10 entries)',
    group: 'declaration',
    handler: (args, ctx) => {
      const limit = Number(args[0]) || 10;
      const rows = ctx.listDeclHistory(limit);
      if (!rows.length) return { lines: ['no history'] };
      return {
        lines: [
          `declaration history (last ${rows.length}):`,
          ...rows.map((r) => `  ${formatTime(r.at)}  ${r.text}`),
        ],
      };
    },
  },
];
