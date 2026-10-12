'use client';
import { useKeyboardShortcuts } from '@/lib/workflow-studio/hooks/use-keyboard-shortcuts';
import { TopBar } from './TopBar';
import { NodePalette } from './NodePalette';
import { WorkflowCanvas } from './WorkflowCanvas';
import { InspectorPanel } from './InspectorPanel';
import { ContextMenu } from './ContextMenu';
import { ShortcutsHelp } from './ShortcutsHelp';
import { ManualResponseModal } from './ManualResponseModal';
import { HsPickerModal } from './HsPickerModal';

export function WorkflowStudio() {
  useKeyboardShortcuts();
  return (
    <div className="bws-root">
      <TopBar />
      <div className="bws-body">
        <NodePalette />
        <WorkflowCanvas />
        <InspectorPanel />
      </div>
      <ContextMenu />
      <ShortcutsHelp />
      <ManualResponseModal />
      <HsPickerModal />
    </div>
  );
}
