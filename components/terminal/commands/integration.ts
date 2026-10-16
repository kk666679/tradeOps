import { table } from '../utils';
import type { CommandSpec } from '../types';

export const integrationCommands: CommandSpec[] = [
  {
    name: 'mode',
    usage: 'mode [development|manual|production]',
    summary: 'Switch the integration adapter mode',
    group: 'integration',
    completions: () => ['development', 'manual', 'production'],
    handler: (args, ctx) => {
      if (!args[0]) {
        return { lines: [table([['mode', ctx.getMode()]])] };
      }
      const m = args[0].toLowerCase();
      if (m !== 'development' && m !== 'manual' && m !== 'production') {
        return { lines: [`✗ unknown mode "${args[0]}" — try development / manual / production`] };
      }
      ctx.setMode(m);
      ctx.emit('terminal.mode', 'local', `Mode set to ${m} from terminal`);
      return { lines: [`✓ mode → ${m}`] };
    },
  },
  {
    name: 'capabilities',
    aliases: ['caps'],
    usage: 'capabilities',
    summary: 'List capabilities available in the current mode',
    group: 'integration',
    handler: (_args, ctx) => {
      const caps = ctx.getCapabilities();
      if (!caps.length) {
        return { lines: ['no capabilities in current mode — submissions remain blocked'] };
      }
      return {
        lines: [
          `capabilities (${caps.length}):`,
          ...caps.map((c) => `  • ${c}`),
        ],
      };
    },
  },
  {
    name: 'hs',
    aliases: ['tariff'],
    usage: 'hs <code|description>',
    summary: 'Look up an HS / AHTN tariff code',
    group: 'integration',
    handler: (args, ctx) => {
      if (!args.length) return { lines: ['usage: hs <code|description>'] };
      const q = args.join(' ');
      const hit = ctx.lookupHSCode(q);
      return { lines: [hit ?? `no match for "${q}"`] };
    },
  },
  {
    name: 'attach',
    usage: 'attach <hsCode>',
    summary: 'Attach an HS code to the selected node',
    group: 'integration',
    handler: (args, ctx) => {
      if (!args[0]) return { lines: ['usage: attach <hsCode>'] };
      const ok = ctx.insertHSCode(args[0]);
      return {
        lines: [ok ? `✓ attached HS ${args[0]}` : `✗ could not attach ${args[0]}`],
      };
    },
  },
];
