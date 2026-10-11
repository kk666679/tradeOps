'use client';
import * as React from 'react';

export function HeroIllustration() {
  return (
    <div className="relative h-72 w-full max-w-md md:h-96">
      <div className="absolute inset-0 rounded-2xl border bg-gradient-to-br from-sky-50 via-background to-amber-50 p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-sky-500" /> Trade
          <span className="ml-3 h-2 w-2 rounded-full bg-amber-500" /> Ops
          <span className="ml-auto">live</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg border bg-background p-3"><div className="text-muted-foreground">Inbound</div><div className="text-lg font-semibold">247</div></div>
          <div className="rounded-lg border bg-background p-3"><div className="text-muted-foreground">Outbound</div><div className="text-lg font-semibold">189</div></div>
          <div className="rounded-lg border bg-background p-3"><div className="text-muted-foreground">Bonded</div><div className="text-lg font-semibold">1,024</div></div>
        </div>
        <div className="mt-3 flex h-32 items-end gap-1 rounded-lg border bg-background p-3">
          {[40, 65, 45, 78, 52, 88, 66, 92, 74, 60, 84, 58].map((h, i) => (
            <div key={i} className={'flex-1 rounded-t ' + (i % 2 ? 'bg-sky-500/70' : 'bg-amber-500/70')} style={{ height: h + '%' }} />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>customs · agents · twin</span><span>updated now</span></div>
      </div>
    </div>
  );
}
export default HeroIllustration;
