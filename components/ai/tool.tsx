'use client';

export function ToolCallCard({ call }: { call: unknown }) {
  return (
    <details className="my-2 rounded-md border bg-card p-3 text-sm">
      <summary className="cursor-pointer font-medium">Tool call</summary>
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-muted-foreground">
        {JSON.stringify(call, null, 2)}
      </pre>
    </details>
  );
}
