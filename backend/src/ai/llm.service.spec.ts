import { BadGatewayException, ServiceUnavailableException } from '@nestjs/common';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { LlmService } from './llm.service';

describe('LlmService', () => {
  const originalApiKey = process.env.OPENAI_API_KEY;
  const originalModel = process.env.OPENAI_MODEL;

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalApiKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalApiKey;
    if (originalModel === undefined) delete process.env.OPENAI_MODEL;
    else process.env.OPENAI_MODEL = originalModel;
  });

  it('returns the assistant text from the configured OpenAI-compatible endpoint', async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.OPENAI_MODEL = 'test-model';
    const fetch = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: 'Ready.' } }] }), { status: 200 }),
    );

    await expect(new LlmService().complete('Hello')).resolves.toBe('Ready.');
    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ authorization: 'Bearer test-key' }),
      }),
    );
  });

  it('fails explicitly when the provider is not configured', async () => {
    delete process.env.OPENAI_API_KEY;
    await expect(new LlmService().complete('Hello')).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('does not mask upstream or malformed-response failures as completions', async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response('unavailable', { status: 503 }));
    await expect(new LlmService().complete('Hello')).rejects.toBeInstanceOf(BadGatewayException);

    jest.restoreAllMocks();
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }));
    await expect(new LlmService().complete('Hello')).rejects.toBeInstanceOf(BadGatewayException);
  });
});
