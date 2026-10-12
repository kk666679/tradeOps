import fs from 'node:fs';
import path from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';
import figlet from 'figlet';

interface McpServer {
  name: string;
  cwd: string;
  command: string;
  args: string[];
}

const ROOT = path.resolve(__dirname, '..');
// MCP server packages live beside the Nest app's `src` tree, not inside it.
const SERVERS_DIR = path.join(ROOT, 'mcp/servers');
const children = new Map<string, ChildProcess>();
let shuttingDown = false;

function log(name: string, message: string): void {
  console.log(`[MCP:${name}] ${message}`);
}

function discoverServers(): McpServer[] {
  if (!fs.existsSync(SERVERS_DIR)) {
    throw new Error(`Directory not found: ${SERVERS_DIR}`);
  }

  return fs.readdirSync(SERVERS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry): McpServer | null => {
      const cwd = path.join(SERVERS_DIR, entry.name);
      const pkgPath = path.join(cwd, 'package.json');

      const pkg = fs.existsSync(pkgPath)
        ? JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
        : {};

      if (pkg.scripts?.['start:mcp']) {
        return {
          name: entry.name,
          cwd,
          command: 'npm',
          args: ['run', 'start:mcp'],
        };
      }

      if (pkg.scripts?.start) {
        return {
          name: entry.name,
          cwd,
          command: 'npm',
          args: ['run', 'start'],
        };
      }

      const candidates = [
        'dist/index.js',
        'dist/main.js',
        'dist/server.js',
        'index.js',
        'main.js',
        'server.js',
      ];

      const entryFile = candidates.find((file) =>
        fs.existsSync(path.join(cwd, file)),
      );

      if (!entryFile) {
        log(entry.name, 'Skipped: no recognized startup entry');
        return null;
      }

      return {
        name: entry.name,
        cwd,
        command: process.execPath,
        args: [path.join(cwd, entryFile)],
      };
    })
    .filter((server): server is McpServer => server !== null);
}

function startServer(server: McpServer): void {
  log(server.name, 'Starting...');

  const child = spawn(server.command, server.args, {
    cwd: server.cwd,
    // The launcher is a process supervisor, so MCP servers must expose a
    // network transport instead of speaking stdio to this wrapper.
    env: {
      ...process.env,
      MCP_TRANSPORT: process.env.MCP_TRANSPORT ?? 'streamable-http',
      BACKEND_URL: process.env.BACKEND_URL ?? 'http://localhost:3001',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
  });

  children.set(server.name, child);

  child.stdout?.on('data', (data: Buffer) => {
    for (const line of data.toString().split(/\r?\n/).filter(Boolean)) {
      log(server.name, line);
    }
  });

  child.stderr?.on('data', (data: Buffer) => {
    for (const line of data.toString().split(/\r?\n/).filter(Boolean)) {
      log(`${server.name}:ERR`, line);
    }
  });

  child.on('error', (error) => {
    log(server.name, `Failed to launch: ${error.message}`);
  });

  child.on('exit', (code, signal) => {
    children.delete(server.name);
    log(server.name, `Exited (code=${code}, signal=${signal})`);
  });
}

function shutdown(): void {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children.values()) {
    if (child.exitCode === null) child.kill('SIGTERM');
  }

  setTimeout(() => {
    for (const child of children.values()) {
      if (child.exitCode === null) child.kill('SIGKILL');
    }
  }, 5000).unref();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

try {
  console.log(figlet.textSync('TradeOps', { font: 'Standard' }));
  console.log('TradeOps MCP Launcher\n');

  const servers = discoverServers();
  console.log(`Discovered ${servers.length} runnable server(s).`);

  if (servers.length === 0) {
    throw new Error('No runnable MCP servers found.');
  }

  for (const server of servers) startServer(server);
} catch (error) {
  console.error('[MCP Launcher]', error);
  process.exitCode = 1;
}
