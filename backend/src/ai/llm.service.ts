import { Injectable, Logger } from '@nestjs/common';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL ?? 'http://localhost:3100';
const MCP_API_KEY = process.env.MCP_API_KEY ?? '';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  async complete(prompt: string, system = 'You are a customs assistant.'): Promise<string> {
    if (!MCP_SERVER_URL || !MCP_API_KEY) {
      this.logger.warn('MCP_SERVER_URL or MCP_API_KEY not configured — returning offline stub');
      return '[offline] ' + prompt.slice(0, 200) + '\n\n(system: ' + system + ')';
    }

    try {
      const res = await fetch(`${MCP_SERVER_URL}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MCP_API_KEY}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: crypto.randomUUID(),
          method: 'tools/call',
          params: {
            name: 'llm_complete',
            arguments: { prompt, system },
          },
        }),
      });

      if (!res.ok) {
        this.logger.error(`MCP server error: ${res.status}`);
        return '[error] MCP server returned ' + res.status;
      }

      const data = await res.json() as { result?: { content?: { type: string; text: string }[] }; error?: { message: string } };

      if (data.error) {
        this.logger.error('MCP tool error', data.error);
        return '[error] ' + data.error.message;
      }

      return data.result?.content?.find((c) => c.type === 'text')?.text ?? '[no response]';
    } catch (err) {
      this.logger.error('MCP request failed', err instanceof Error ? err.message : String(err));
      return '[offline] ' + prompt.slice(0, 200);
    }
  }
}
