import * as React from 'react';

export interface TrustBadgesProps { badges?: string[] }

export function TrustBadges({ badges = ['SOC 2 Type II', 'ISO 27001', 'GDPR', 'PDPA', 'ASYCUDA-ready'] }: TrustBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((b) => (
        <span key={b} className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {b}
        </span>
      ))}
    </div>
  );
}
export default TrustBadges;
