'use client';
import * as React from 'react';

export interface aiTestimonialSummaryInsight {
  id: string;
  title: string;
  confidence: number;
  action?: string;
}

export interface aiTestimonialSummaryProps {
  insights?: aiTestimonialSummaryInsight[];
  onRun?: () => void;
}

export function aiTestimonialSummary({ insights = [], onRun }: aiTestimonialSummaryProps) {
  return (
    <div className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b px-3 py-2 text-xs">
        <span className="font-medium">Testimonial Summary</span>
        <button onClick={onRun} className="rounded border px-2 py-0.5 text-[11px] hover:bg-slate-50">Run</button>
      </div>
      <div className="space-y-1.5 p-3 text-sm">
        {insights.length === 0 ? (
          <p className="text-xs text-slate-400">No suggestions</p>
        ) : insights.map((i) => (
          <div key={i.id} className="flex items-start justify-between gap-2 rounded border p-2">
            <div className="min-w-0">
              <div className="font-medium">{i.title}</div>
              {i.action ? <div className="text-xs text-slate-500">{i.action}</div> : null}
            </div>
            <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px]">{(i.confidence * 100).toFixed(0) + '%'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default aiTestimonialSummary;
