import { Injectable, OnModuleInit } from '@nestjs/common';
import { pipeline, type FeatureExtractionPipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;
env.allowRemoteModels = true;
env.useBrowserCache = true;

@Injectable()
export class EmbeddingsService implements OnModuleInit {
  private embedder: FeatureExtractionPipeline | null = null;
  private readonly modelId = 'Xenova/all-MiniLM-L6-v2';
  private readonly embeddingDim = 384;

  async onModuleInit() {
    try {
      this.embedder = await pipeline('feature-extraction', this.modelId, {
        quantized: true,
      });
    } catch (error) {
      console.error('Failed to initialize embeddings model:', error);
      throw new Error('Embeddings service unavailable');
    }
  }

  async embed(text: string): Promise<number[]> {
    if (!this.embedder) {
      await this.onModuleInit();
    }
    const output = await this.embedder!(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data) as number[];
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    if (!this.embedder) {
      await this.onModuleInit();
    }
    const outputs = await this.embedder!(texts, { pooling: 'mean', normalize: true });
    const results: number[][] = [];
    for (let i = 0; i < texts.length; i++) {
      const start = i * this.embeddingDim;
      const end = start + this.embeddingDim;
      results.push(Array.from(outputs.data.slice(start, end)) as number[]);
    }
    return results;
  }

  getDimension(): number {
    return this.embeddingDim;
  }
}