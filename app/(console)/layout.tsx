import AppShell from '@/components/console/AppShell';
import { RunProvider } from '@/providers/RunProvider';

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <RunProvider>
      <AppShell>{children}</AppShell>
    </RunProvider>
  );
}
