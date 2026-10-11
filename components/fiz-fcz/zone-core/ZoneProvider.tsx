'use client';

/**
 * ZoneProvider
 * Auto-scaffolded. Replace the body with domain logic.
 */

import * as React from 'react';

interface Ctx { ready: boolean }
const Ctx = React.createContext<Ctx>({ ready: false });

export function ZoneProvider({ children }: { children: React.ReactNode }) {
  const value = React.useMemo<Ctx>(() => ({ ready: true }), []);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useZone = () => React.useContext(Ctx);
export default ZoneProvider;
