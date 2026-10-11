import { Injectable } from '@nestjs/common';
@Injectable()
export class EmbeddingsService {
  async embed(text: string): Promise<number[]> {
    // Delegate to @huggingface/transformers or OpenAI. Offline stub for now.
    return Array.from({ length: 16 }, (_, i) => ((text.charCodeAt(i % text.length) ?? 0) % 97) / 97);
  }
  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.embed(t)));
  }
}
