import { DigitalTwinStudio } from '@/components/digital-twin';
import { DigitalTwinCanvas } from '@/components/workflow-studio/digital-twin/canvas';
import { TwinNode } from '@/components/workflow-studio/digital-twin/TwinNode';

import { Sidebar } from '@/components/navigation/sidebar';
import type { TwinNodeData } from '@/lib/digital-twin/types';


export const metadata = {
  title: 'Digital Twin Studio',
  description: 'Live digital twin of free zone operations',
};

export default function DigitalTwinPage({
  searchParams,
}: {
  searchParams: { zoneId?: string };
}) {
  const zoneId = searchParams.zoneId ?? 'default';
  return <DigitalTwinStudio zoneId={zoneId} />;
}
