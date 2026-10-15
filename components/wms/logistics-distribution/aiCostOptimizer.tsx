'use client';

import { useState } from 'react';
import { PromptInput, Tool, ChainOfThought } from '@/components/ai-elements';
import { LoadingSpinner } from '@/components/ai-control/LoadingSpinner';

export default function AICostOptimizer() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          weight: weight ? parseFloat(weight) : undefined,
        }),
      });

      const data = await response.json();
      setAiResult(data);
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    const parts = prompt.match(/from (.+?) to (.+?)(?: weight (\d+(\.\d+)?))?/i);

    if (parts?.[1] !== undefined && parts[2] !== undefined) {
      const parsedOrigin = parts[1];
      const parsedDestination = parts[2];
      const parsedWeight = parts[3];

      setOrigin(parsedOrigin);
      setDestination(parsedDestination);
      if (parsedWeight) setWeight(parsedWeight);

      await handleOptimize();
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h2 className="text-xl font-bold">AI Transport Cost Optimizer</h2>

      <PromptInput
        placeholder="Ask: 'Find cheapest carrier from New York to Chicago weight 500kg'"
        onSubmit={handlePromptSubmit as (m: any, e: any) => void}
        className="w-full"
      />

      <div className="grid grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={handleOptimize}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Optimize
      </button>

      {loading && <LoadingSpinner />}

      {aiResult && (
        <div className="space-y-4 mt-4">
          <Tool name="Cost Optimization" result={aiResult.suggestion} />

          <ChainOfThought steps={aiResult.reasoning} />

          <div className="p-2 bg-gray-100 rounded">
            <p>
              <strong>Suggested Carrier:</strong>{' '}
              {aiResult.suggestion?.carrier}
            </p>
            <p>
              <strong>Estimated Cost:</strong> $
              {aiResult.suggestion?.cost}
            </p>
            <p>
              <strong>Reason:</strong>{' '}
              {aiResult.suggestion?.reason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}