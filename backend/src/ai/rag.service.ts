import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { LlmService } from './llm.service';
import { VectorService } from './vector.service';

export interface RagAnswer {
  answer: string;
  sources: { id: string; score: number; payload?: Record<string, unknown> }[];
}

@Injectable()
export class RagService {
  constructor(
    private embed: EmbeddingsService,
    private llm: LlmService,
    private vector: VectorService,
  ) {}

  async answer(tenantId: string, question: string): Promise<RagAnswer> {
    const vector = await this.embed.embed(question);
    const searchResults = await this.vector.search(tenantId, vector, 5);

    if (searchResults.length === 0) {
      const answer = await this.llm.complete(
        question,
        'No relevant context found. Answer based on general knowledge.',
      );
      return { answer, sources: [] };
    }

    const context = searchResults
      .map((r, i) => `[Source ${i + 1}]: ${JSON.stringify(r.payload)}`)
      .join('\n\n');

    const prompt = `Answer the question using only the provided context. If the context doesn't contain the answer, say so.

Context:
${context}

Question: ${question}

Answer:`;

    const answer = await this.llm.complete(prompt, '');

    return {
      answer,
      sources: searchResults.map((r) => ({
        id: r.id,
        score: r.score,
        payload: r.payload,
      })),
    };
  }

  async indexDocument(
    tenantId: string,
    id: string,
    text: string,
    metadata: Record<string, unknown> = {},
  ): Promise<void> {
    const vector = await this.embed.embed(text);
    await this.vector.upsert(tenantId, id, vector, { text, ...metadata });
  }

  async indexDocuments(
    tenantId: string,
    documents: { id: string; text: string; metadata?: Record<string, unknown> }[],
  ): Promise<void> {
    const vectors = await this.embed.embedBatch(documents.map((d) => d.text));
    await Promise.all(
      documents.map((doc, i) =>
        this.vector.upsert(tenantId, doc.id, vectors[i], { text: doc.text, ...doc.metadata }),
      ),
    );
  }
}