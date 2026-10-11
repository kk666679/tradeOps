import { randomUUID } from 'node:crypto';
import { BadRequestException, Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { z } from 'zod';
import { LlmService } from './llm.service';

const ChatCompletionRequestSchema = z.object({
  model: z.string().min(1).max(128).optional(),
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string().min(1).max(32_000),
    }).strict(),
  ).min(1).max(64),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().min(1).max(16_384).optional(),
  stream: z.literal(false).optional(),
}).strict();

@Controller('ai/v1')
@UseGuards(AuthGuard('jwt'))
export class AiGatewayController {
  constructor(private readonly llm: LlmService) {}

  @Post('chat/completions')
  async chatCompletions(@Body() body: unknown) {
    const parsed = ChatCompletionRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Invalid chat completion request.',
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }

    const { messages, model, temperature, max_tokens: maxTokens } = parsed.data;
    const content = await this.llm.chat(messages, { model, temperature, maxTokens });
    const responseModel = model ?? this.llm.defaultModel;
    return {
      id: `chatcmpl-${randomUUID()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: responseModel,
      choices: [
        {
          index: 0,
          message: { role: 'assistant', content },
          finish_reason: 'stop',
        },
      ],
    };
  }
}
