import type { Metadata } from 'next';
import { WalkthroughPage } from '../../_components/WalkthroughPage';
import { WALKTHROUGH_SPECS } from '../../_components/walkthrough-specs';

export const metadata: Metadata = { title: 'Trade operations walkthrough' };

export default function Page() {
  return <WalkthroughPage spec={WALKTHROUGH_SPECS['trade-ops']} />;
}
