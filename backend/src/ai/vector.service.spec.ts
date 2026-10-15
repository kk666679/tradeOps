import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { describe, expect, it, jest } from '@jest/globals';
import { PrismaService } from '../prisma/prisma.service';
import { VectorService } from './vector.service';

describe('VectorService', () => {
  it('uses the injected Prisma service for pgvector searches', async () => {
    const queryRawUnsafe = jest
      .fn<(...args: unknown[]) => Promise<{ id: string; score: number; payload: Record<string, unknown> }[]>>()
      .mockResolvedValue([]);
    const prisma = {
      $queryRawUnsafe: queryRawUnsafe,
    };
    const module = await Test.createTestingModule({
      providers: [
        VectorService,
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    const service = module.get(VectorService);

    await expect(service.search('tenant-1', [0.1, 0.2])).resolves.toEqual([]);
    expect(queryRawUnsafe).toHaveBeenCalled();
  });
});
