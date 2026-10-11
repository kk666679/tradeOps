import { BadRequestException } from '@nestjs/common';
import { jest } from '@jest/globals';
import { AiGatewayController } from './ai-gateway.controller';
import { LlmService } from './llm.service';

describe('AiGatewayController', () => {
  it('returns an OpenAI-compatible chat completion response', async () => {
    const llm = {
      defaultModel: 'test-model',
      chat: jest.fn().mockResolvedValue('The shipment is ready.'),
    } as unknown as LlmService;
    const controller = new AiGatewayController(llm);

    const result = await controller.chatCompletions({
      messages: [{ role: 'user', content: 'Check shipment status.' }],
    });

    expect(result).toMatchObject({
      object: 'chat.completion',
      model: 'test-model',
      choices: [{
        index: 0,
        message: { role: 'assistant', content: 'The shipment is ready.' },
        finish_reason: 'stop',
      }],
    });
    expect(result.id).toMatch(/^chatcmpl-/);
  });

  it('rejects malformed requests before calling the provider', async () => {
    const chat = jest.fn();
    const controller = new AiGatewayController({
      defaultModel: 'test-model',
      chat,
    } as unknown as LlmService);

    await expect(controller.chatCompletions({ messages: [] })).rejects.toBeInstanceOf(BadRequestException);
    expect(chat).not.toHaveBeenCalled();
  });
});
