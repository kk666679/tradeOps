import type { Metadata } from 'next';
import SearchWorkspace from './SearchWorkspace';

export const metadata: Metadata = { title: 'Search' };

export default function Page() {
  return <SearchWorkspace />;
}
