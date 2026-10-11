import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  get defaultModel(): string {
    return process.env.OPENAI_MODEL?.trim() || 'gpt-4o';
  }

  async complete(
    prompt: string,
    system = 'You are a customs assistant.',
    options: ChatCompletionOptions = {},
  ): Promise<string> {
    return this.chat(
      [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      options,
    );
  }

  async chat(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {},
  ): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      throw new ServiceUnavailableException('AI provider is not configured (OPENAI_API_KEY is missing).');
    }

    const baseUrl = (process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/+$/, '');
    const model = options.model ?? this.defaultModel;
    let response: Response;
    try {
      response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          ...(options.temperature !== undefined ? { temperature: options.temperature } : {}),
          ...(options.maxTokens !== undefined ? { max_tokens: options.maxTokens } : {}),
        }),
        signal: AbortSignal.timeout(60_000),
      });
    } catch (err) {
      this.logger.error(`AI provider request failed: ${err instanceof Error ? err.message : String(err)}`);
      throw new BadGatewayException('AI provider could not be reached.');
    }

    if (!response.ok) {
      this.logger.error(`AI provider returned HTTP ${response.status}.`);
      throw new BadGatewayException(`AI provider request failed with status ${response.status}.`);
    }

    let result: unknown;
    try {
      result = await response.json();
    } catch {
      throw new BadGatewayException('AI provider returned an invalid response.');
    }

    const content =
      typeof result === 'object' &&
      result !== null &&
      'choices' in result &&
      Array.isArray(result.choices) &&
      typeof result.choices[0] === 'object' &&
      result.choices[0] !== null &&
      'message' in result.choices[0] &&
      typeof result.choices[0].message === 'object' &&
      result.choices[0].message !== null &&
      'content' in result.choices[0].message
        ? result.choices[0].message.content
        : undefined;

    if (typeof content !== 'string') {
      throw new BadGatewayException('AI provider response did not include a text completion.');
    }
    return content;
  }
}
