'use client';


import { Agent, Conversation, Message, Tool } from '@/components/ai-elements';
import { trpc } from '@/lib/trpc/react';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/ai-control/LoadingSpinner';

export default function LogisticsDashboard() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string; toolCalls?: any[] }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setIsLoading(true);
    const response = await fetch('/api/ai/orchestrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input }),
    });
    const data = await response.json();
    setMessages(prev => [...prev, { role: 'assistant', content: data.answer, toolCalls: data.toolCalls }]);
    setIsLoading(false);
    setInput('');
  };

  return (
    <div className="max-w-full w-full p-2 sm:p-4 overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-4">AI Logistics Assistant</h1>
      <div className="flex flex-col gap-4 lg:flex-row lg:h-[70vh]">
        <div className="flex-1 border rounded-lg p-4 overflow-y-auto min-w-0">
          <Conversation>
            {messages.map((msg, i) => (
              <Message key={i} from={msg.role as any} role={msg.role as any}>
                {msg.content}
                {msg.toolCalls && msg.toolCalls.map((tool, j) => (
                  <Tool key={j} name={tool.name} result={tool.result} />
                ))}
              </Message>
            ))}
            {isLoading && <LoadingSpinner />}
          </Conversation>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about shipments, carriers, costs..."
              className="flex-1 p-2 border rounded"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
          </form>
        </div>
        <div className="w-full lg:w-80 lg:ml-4 border rounded-lg p-4 min-w-0">
          <Agent />
          <div className="mt-4">
            <h3 className="font-semibold">Quick Actions</h3>
            <button className="mt-2 w-full text-left p-2 bg-gray-100 rounded" onClick={() => setInput('Show delayed shipments')}>Show delays</button>
            <button className="mt-2 w-full text-left p-2 bg-gray-100 rounded" onClick={() => setInput('Forecast demand for next 7 days')}>Forecast demand</button>
            <button className="mt-2 w-full text-left p-2 bg-gray-100 rounded" onClick={() => setInput('Suggest carrier from New York to Chicago')}>Suggest carrier</button>
          </div>
        </div>
      </div>
    </div>
  );
}