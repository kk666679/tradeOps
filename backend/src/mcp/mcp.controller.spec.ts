import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { McpModule } from './mcp.module';

const describeWithDatabase = process.env.DATABASE_URL ? describe : describe.skip;

describeWithDatabase('McpController', () => {
  let app: INestApplication | undefined;
  let accessToken: string;
  let otherTenantToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [McpModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    accessToken = app.get(JwtService).sign({
      sub: 'user-1',
      tenantId: 'tenant-1',
      role: 'operator',
    });
    otherTenantToken = app.get(JwtService).sign({
      sub: 'user-2',
      tenantId: 'tenant-2',
      role: 'operator',
    });
  });

  afterAll(async () => {
    await app?.close();
  });

  it('authenticates sessions and rejects cross-tenant operations', async () => {
    if (!app) throw new Error('test application was not initialized');
    await request(app.getHttpServer())
      .post('/api/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-11-25',
          capabilities: {},
          clientInfo: { name: 'backend-test', version: '1.0.0' },
        },
      })
      .expect(401);

    const initialize = await request(app.getHttpServer())
      .post('/api/mcp')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-11-25',
          capabilities: {},
          clientInfo: { name: 'backend-test', version: '1.0.0' },
        },
      })
      .expect(200);

    const sessionId = initialize.headers['mcp-session-id'];
    expect(sessionId).toBeTruthy();

    await request(app.getHttpServer())
      .post('/api/mcp')
      .set('Authorization', `Bearer ${otherTenantToken}`)
      .set('Mcp-Session-Id', sessionId)
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} })
      .expect(403);

    const toolList = await request(app.getHttpServer())
      .post('/api/mcp')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Mcp-Session-Id', sessionId)
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', id: 3, method: 'tools/list', params: {} })
      .expect(200);

    expect(toolList.body.result.tools.map((tool: { name: string }) => tool.name))
      .toContain('yard.status');

    await request(app.getHttpServer())
      .post('/api/mcp')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Mcp-Session-Id', sessionId)
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
          name: 'yard.status',
          arguments: { tenantId: 'tenant-2' },
        },
      })
      .expect(403);

    await request(app.getHttpServer())
      .post('/api/mcp')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Mcp-Session-Id', sessionId)
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: 5,
        method: 'resources/read',
        params: { uri: 'tradeops://yard/tenant-2' },
      })
      .expect(403);

    const gate = await request(app.getHttpServer())
      .post('/api/mcp')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Mcp-Session-Id', sessionId)
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: 6,
        method: 'tools/call',
        params: {
          name: 'gate.in',
          arguments: {
            tenantId: 'tenant-1',
            containerId: 'C-1',
            plate: 'ABC123',
            manifestWeightKg: 1000,
            observedWeightKg: 1500,
            observedPlate: 'ABC123',
            zone: 'CFS',
          },
        },
      })
      .expect(200);

    expect(gate.body.result.resultType).toBe('input_required');
    expect(gate.body.result.content[0].text).toContain('requires broker confirmation');

    await request(app.getHttpServer())
      .delete('/api/mcp')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Mcp-Session-Id', sessionId)
      .expect(200);
  });
});
