import * as React from 'react';
import type { Metadata } from 'next';
import { CargoWorkspace } from '@/components/cargo/CargoWorkspace';

export const metadata: Metadata = { title: 'Cargo' };

export default function Page() {
  return <CargoWorkspace />;
}
