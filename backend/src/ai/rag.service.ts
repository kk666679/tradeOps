import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { LlmService } from './llm.service';

export interface RagAnswer { answer: string; sources: { id: string; score: number }[] }

@Injectable()
export class RagService {
  constructor(private embed: EmbeddingsService, private llm: LlmService) {}
  async answer(tenantId: string, question: string): Promise<RagAnswer> {
    const vector = await this.embed.embed(question);
    // TODO: query Weaviate with (tenantId, vector)
    const answer = await this.llm.complete(question, 'Answer using retrieved context only.');
    return { answer, sources: [{ id: 'stub', score: 1 - (vector[0] ?? 0) }] };
  }
}
