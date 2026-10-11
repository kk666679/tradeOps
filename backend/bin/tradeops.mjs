#!/usr/bin/env node
import { createHmac } from 'node:crypto';

const apiBase = (process.env.TRADEOPS_API_URL ?? 'http://localhost:3001/api').replace(/\/+$/, '');
const [command, ...args] = process.argv.slice(2);

function usage() {
  console.error(`Usage:
  tradeops ai <prompt>
  tradeops telemetry send <device-id> <event> <data-json>
  tradeops telemetry get <device-id> [limit]

Environment:
  TRADEOPS_API_URL         Backend API base URL (default: http://localhost:3001/api)
  TRADEOPS_ACCESS_TOKEN    JWT for authenticated AI and telemetry-read requests
  TRADEOPS_TENANT_ID       Tenant ID for signed telemetry webhook requests
  IOT_WEBHOOK_SECRET       Shared webhook signing secret`);
  process.exitCode = 2;
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let result;
  try {
    result = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Backend returned an invalid JSON response (HTTP ${response.status}).`);
  }
  if (!response.ok) {
    throw new Error(`Backend request failed (HTTP ${response.status}): ${JSON.stringify(result)}`);
  }
  return result;
}

async function main() {
  if (command === 'ai' && args.length) {
    const token = process.env.TRADEOPS_ACCESS_TOKEN;
    if (!token) throw new Error('TRADEOPS_ACCESS_TOKEN is required for AI requests.');
    const result = await request('/ai/v1/chat/completions', {
      method: 'POST',
      body: { messages: [{ role: 'user', content: args.join(' ') }] },
      headers: { authorization: `Bearer ${token}` },
    });
    console.log(result.choices[0].message.content);
    return;
  }

  if (command === 'telemetry' && args[0] === 'send' && args.length === 4) {
    const [deviceId, eventName, dataJson] = args.slice(1);
    const tenantId = process.env.TRADEOPS_TENANT_ID;
    const secret = process.env.IOT_WEBHOOK_SECRET;
    if (!tenantId || !secret) throw new Error('TRADEOPS_TENANT_ID and IOT_WEBHOOK_SECRET are required.');
    let data;
    try {
      data = JSON.parse(dataJson);
    } catch {
      throw new Error('Telemetry data must be valid JSON.');
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('Telemetry data must be a JSON object.');
    }
    const body = { event: eventName, data, timestamp: new Date().toISOString() };
    const timestamp = String(Math.floor(Date.now() / 1000));
    const canonical = `${timestamp}.${tenantId}.${deviceId}.${JSON.stringify(body)}`;
    const signature = createHmac('sha256', secret).update(canonical).digest('hex');
    const result = await request(`/iot/webhooks/${encodeURIComponent(deviceId)}`, {
      method: 'POST',
      body,
      headers: {
        'x-tenant-id': tenantId,
        'x-tradeops-timestamp': timestamp,
        'x-tradeops-signature': signature,
      },
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command === 'telemetry' && args[0] === 'get' && args.length >= 2 && args.length <= 3) {
    const token = process.env.TRADEOPS_ACCESS_TOKEN;
    if (!token) throw new Error('TRADEOPS_ACCESS_TOKEN is required to read telemetry.');
    const [deviceId, limit] = args.slice(1);
    const query = limit ? `?limit=${encodeURIComponent(limit)}` : '';
    const result = await request(`/iot/devices/${encodeURIComponent(deviceId)}/telemetry${query}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  usage();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
