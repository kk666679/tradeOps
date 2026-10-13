import * as React from 'react';
import { WalkthroughProvider, WalkthroughRouteTracker } from './_components/WalkthroughContext';

export default function WalkthroughLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalkthroughProvider>
      <WalkthroughRouteTracker />
      {children}
    </WalkthroughProvider>
  );
}
