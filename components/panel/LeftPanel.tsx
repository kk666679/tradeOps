'use client';

import type { Capability, IntegrationMode, LibraryDef, StudioNode } from '@/types';
import NodesPalette from './NodesPalette';
import LayersPanel from './LayersPanel';
import GuidePanel from './GuidePanel';

export type LeftTab = 'nodes' | 'layers' | 'inspector';

const TITLES: Record<LeftTab, string> = {
  nodes: 'Node Palette',
  layers: 'Layers',
  inspector: 'Inspector',
};

export interface LeftPanelProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  tab: LeftTab;
  onTabChange: (t: LeftTab) => void;
  supported: Capability[];
  mode: IntegrationMode;
  nodes: StudioNode[];
  nodeById: Map<string, StudioNode>;
  loopGroups: string[][];
  blockedNodes: StudioNode[];
  selectedNode: string | null;
  onSelectNode: (id: string) => void;
  onAddNode: (def: LibraryDef) => void;
  onDragStart: (e: React.DragEvent, def: LibraryDef) => void;
}

export default function LeftPanel(props: LeftPanelProps) {
  const { collapsed, onToggleCollapsed, tab, onTabChange } = props;

  return (
    <aside className={
      'flex min-w-0 flex-col overflow-hidden border-r border-[#1f2937] bg-[#0f141b] ' +
      (collapsed ? 'items-center py-2' : '')
    }>
      {collapsed ? (
        <button onClick={onToggleCollapsed} title="Expand"
          className="grid h-6 w-6 place-items-center rounded text-[#6b7280] hover:bg-[#1f2731] hover:text-[#e5e7eb]">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      ) : (
        <>
          <div className="flex flex-none items-center gap-1.5 border-b border-[#1f2937] px-2 py-1.5">
            <span className="flex-1 truncate text-[11px] font-semibold">{TITLES[tab]}</span>
            <button onClick={onToggleCollapsed} title="Collapse"
              className="grid h-[22px] w-[22px] place-items-center rounded text-[#6b7280] hover:bg-[#1f2731] hover:text-[#e5e7eb]">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>

          <div className="flex flex-none gap-0.5 border-b border-[#1f2937] px-1.5 py-1">
            {(['nodes', 'layers', 'inspector'] as LeftTab[]).map((k) => (
              <button key={k} onClick={() => onTabChange(k)}
                className={
                  'flex-1 rounded px-1 py-1 text-[10px] font-bold uppercase tracking-wider ' +
                  (tab === k ? 'bg-[#233044] text-[#e5e7eb]' : 'text-[#6b7280] hover:bg-[#1f2731] hover:text-[#9ca3af]')
                }>
                {k === 'nodes' ? 'Nodes' : k === 'layers' ? 'Layers' : 'Guide'}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {tab === 'nodes' && (
              <NodesPalette
                supported={props.supported}
                mode={props.mode}
                onAddNode={props.onAddNode}
                onDragStart={props.onDragStart}
              />
            )}
            {tab === 'layers' && (
              <LayersPanel
                nodes={props.nodes}
                nodeById={props.nodeById}
                loopGroups={props.loopGroups}
                blockedNodes={props.blockedNodes}
                selectedNode={props.selectedNode}
                onSelectNode={props.onSelectNode}
              />
            )}
            {tab === 'inspector' && <GuidePanel />}
          </div>
        </>
      )}
    </aside>
  );
}