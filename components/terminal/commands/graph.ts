import { padEnd } from '../utils';
import type { CommandSpec } from '../types';

export const graphCommands: CommandSpec[] = [
  {
    name: 'ls',
    aliases: ['nodes', 'list'],
    usage: 'ls [nodes|edges]',
    summary: 'List nodes or edges in the active graph',
    group: 'graph',
    completions: () => ['nodes', 'edges'],
    handler: (args, ctx) => {
      const which = (args[0] ?? 'nodes').toLowerCase();
      if (which === 'edges' || which === 'e') {
        const es = ctx.listEdges();
        if (!es.length) return { lines: ['no edges'] };
        return {
          lines: [
            `edges: ${es.length}`,
            ...es.map(
              (e) =>
                `  ${padEnd(e.id, 8)} ${e.source} → ${e.target}` +
                `  port ${e.port}  [${e.provenance}]`,
            ),
          ],
        };
      }
      if (which !== 'nodes' && which !== 'n') {
        return { lines: [`unknown target "${which}" — try "nodes" or "edges"`] };
      }
      const ns = ctx.listNodes();
      if (!ns.length) return { lines: ['no nodes'] };
      return {
        lines: [
          `nodes: ${ns.length}`,
          ...ns.map(
            (n) =>
              `  ${padEnd(n.id, 8)} ${padEnd(n.status, 10)} ${n.label}`,
          ),
        ],
      };
    },
  },
  {
    name: 'wire',
    aliases: ['connect', 'link'],
    usage: 'wire <sourceId> <targetId> [port=0]',
    summary: 'Create an edge between two nodes',
    group: 'graph',
    handler: (args, ctx) => {
      if (args.length < 2) {
        return { lines: ['usage: wire <sourceId> <targetId> [port]'] };
      }
      const [s, t, p] = args;
      const port = p != null ? Number(p) : 0;
      if (Number.isNaN(port)) {
        return { lines: [`✗ port must be a number, got "${p}"`] };
      }
      const ok = ctx.wire(s, t, port);
      return {
        lines: [
          ok
            ? `✓ wired ${s} → ${t} (port ${port})`
            : `✗ failed to wire ${s} → ${t} — check node ids and for duplicates`,
        ],
      };
    },
  },
  {
    name: 'rm',
    aliases: ['delete', 'del'],
    usage: 'rm <nodeId | edge:<edgeId>>',
    summary: 'Delete a node or edge',
    group: 'graph',
    handler: (args, ctx) => {
      if (!args[0]) return { lines: ['usage: rm <nodeId | edge:<edgeId>>'] };
      const target = args[0];
      if (target.startsWith('edge:')) {
        const id = target.slice(5);
        return {
          lines: [ctx.deleteEdge(id) ? `✓ removed edge ${id}` : `✗ no such edge ${id}`],
        };
      }
      return {
        lines: [
          ctx.deleteNode(target)
            ? `✓ removed node ${target}`
            : `✗ no such node ${target}`,
        ],
      };
    },
  },
  {
    name: 'rename',
    aliases: ['mv'],
    usage: 'rename <nodeId> <newLabel>',
    summary: 'Rename a node',
    group: 'graph',
    handler: (args, ctx) => {
      if (args.length < 2) return { lines: ['usage: rename <nodeId> <newLabel>'] };
      const [id, ...rest] = args;
      const label = rest.join(' ');
      const ok = ctx.renameNode(id, label);
      return {
        lines: [ok ? `✓ renamed ${id} → "${label}"` : `✗ no such node ${id}`],
      };
    },
  },
  {
    name: 'focus',
    aliases: ['goto'],
    usage: 'focus <nodeId>',
    summary: 'Select and scroll to a node',
    group: 'graph',
    handler: (args, ctx) => {
      if (!args[0]) return { lines: ['usage: focus <nodeId>'] };
      const ok = ctx.focusNode(args[0]);
      return {
        lines: [ok ? `→ focused ${args[0]}` : `✗ no such node ${args[0]}`],
      };
    },
  },
];
