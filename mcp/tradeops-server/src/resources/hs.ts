/**
 * HS code reference resources.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const HS_CODES_STUB = [
  { code: '2101.12', description: 'Instant coffee', rate: 0.15 },
  { code: '8703.23', description: 'Vehicles with spark-ignition engine', rate: 0.25 },
  { code: '6204.62', description: 'Women trousers of cotton', rate: 0.12 },
];

const HS_RULINGS_STUB: Record<string, unknown[]> = {
  '2101.12': [
    { ruling: 'Note that instant coffee qualifies for preferential rate', authority: 'WCO', year: 2024 },
  ],
  '8703.23': [{ ruling: 'Engine displacement must be documented', authority: 'customs', year: 2024 }],
  '6204.62': [{ ruling: 'Must contain ≥50% cotton for this HS code', authority: 'WCO', year: 2024 }],
};

export async function registerHsResources(server: McpServer): Promise<void> {
  // Static HS codes list
  server.resource(
    'hs-codes-master',
    'tradeops://master/hs-codes',
    async () => {
      return {
        contents: [
          {
            uri: 'tradeops://master/hs-codes',
            mimeType: 'application/json',
            text: JSON.stringify({ codes: HS_CODES_STUB }, null, 2),
          },
        ],
      };
    },
  );

  // HS code rulings - template simulation
  // Note: MCP resource templates not fully supported; this simulates template behavior
  server.resource(
    'hs-code-rulings',
    'tradeops://hs/sample/rulings',
    async () => {
      const sampleCode = '2101.12';
      const rulings = HS_RULINGS_STUB[sampleCode] || [];
      const uri = `tradeops://hs/${sampleCode}/rulings`;
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({ hsCode: sampleCode, rulings }, null, 2),
          },
        ],
      };
    },
  );
}
