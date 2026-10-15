import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { WeaviateClient } from 'weaviate-client';
import { PrismaService } from '../prisma/prisma.service';

interface VectorRecord {
  id: string;
  vector: number[];
  payload: Record<string, unknown>;
}

@Injectable()
export class VectorService implements OnModuleInit {
  private usePgVector = true;
  private weaviateClient: WeaviateClient | null = null;

  constructor(
    private config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    const weaviateHost = this.config.get('weaviate.host');
    const weaviateApiKey = this.config.get('weaviate.apiKey');

    if (weaviateHost && weaviateApiKey) {
      try {
        const { ApiKey, connectToWeaviateCloud } = await import('weaviate-client');
        this.weaviateClient = await connectToWeaviateCloud(weaviateHost, {
          authCredentials: new ApiKey(weaviateApiKey),
        });
        this.usePgVector = false;
        console.log('Weaviate connected successfully');
      } catch (error) {
        console.warn('Weaviate connection failed, falling back to pgvector:', error);
        this.usePgVector = true;
      }
    }
  }

  async upsert(tenantId: string, id: string, vector: number[], payload: Record<string, unknown>) {
    if (this.usePgVector) {
      return this.upsertPgVector(tenantId, id, vector, payload);
    }
    return this.upsertWeaviate(tenantId, id, vector, payload);
  }

  private async upsertPgVector(tenantId: string, id: string, vector: number[], payload: Record<string, unknown>) {
    const vectorStr = `[${vector.join(',')}]`;
    await this.prisma.$executeRawUnsafe(
      `INSERT INTO "VectorEmbedding" (id, "tenantId", vector, payload, "createdAt", "updatedAt")
       VALUES ($1, $2, $3::vector, $4::jsonb, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET vector = $3::vector, payload = $4::jsonb, "updatedAt" = NOW()`,
      id,
      tenantId,
      vectorStr,
      JSON.stringify(payload),
    );
  }

  private async upsertWeaviate(tenantId: string, id: string, vector: number[], payload: Record<string, unknown>) {
    if (!this.weaviateClient) return;
    const collection = this.weaviateClient.collections.get('Document');
    const properties = { tenantId, ...payload };
    if (await collection.data.exists(id)) {
      await collection.data.replace({ id, vectors: vector, properties });
    } else {
      await collection.data.insert({ id, vectors: vector, properties });
    }
  }

  async search(tenantId: string, vector: number[], k = 5): Promise<{ id: string; score: number; payload: Record<string, unknown> }[]> {
    if (this.usePgVector) {
      return this.searchPgVector(tenantId, vector, k);
    }
    return this.searchWeaviate(tenantId, vector, k);
  }

  private async searchPgVector(tenantId: string, vector: number[], k: number) {
    const vectorStr = `[${vector.join(',')}]`;
    const results = await this.prisma.$queryRawUnsafe<
      { id: string; score: number; payload: Record<string, unknown> }[]
    >(
      `SELECT id, 1 - (vector <=> $1::vector) as score, payload
       FROM "VectorEmbedding"
       WHERE "tenantId" = $2
       ORDER BY vector <=> $1::vector
       LIMIT $3`,
      vectorStr,
      tenantId,
      k,
    );
    return results;
  }

  private async searchWeaviate(tenantId: string, vector: number[], k: number) {
    if (!this.weaviateClient) return [];
    const collection = this.weaviateClient.collections.get('Document');
    const results = await collection.query.nearVector(vector, {
      limit: k,
      filters: collection.filter.byProperty('tenantId').equal(tenantId),
      returnMetadata: ['score'],
    });
    return results.objects.map((obj: any) => ({
      id: obj.id,
      score: obj.metadata?.score ?? 0,
      payload: obj.properties,
    }));
  }

  async delete(tenantId: string, id: string) {
    if (this.usePgVector) {
      await this.prisma.$executeRawUnsafe(
        `DELETE FROM "VectorEmbedding" WHERE id = $1 AND "tenantId" = $2`,
        id,
        tenantId,
      );
    } else if (this.weaviateClient) {
      const collection = this.weaviateClient.collections.get('Document');
      await collection.data.deleteById(id);
    }
  }
}