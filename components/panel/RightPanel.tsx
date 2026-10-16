'use client';

import type {
  Capability, ChatMessage, Declaration, DeclarationStatus,
  IntegrationMode, StudioEdge, StudioEvent, StudioNode,
} from '@/types';
import ChatPanel from './ChatPanel';
import IntegrationPanel from './IntegrationPanel';
import DeclarationPanel from './DeclarationPanel';
import AuditPanel from './AuditPanel';
import NodePanel from './NodePanel';
import EdgePanel from './EdgePanel';

export type RightTab = 'chat' | 'integration' | 'declaration' | 'audit' | 'node' | 'edge';

const TITLES: Record<RightTab, string> = {
  chat: 'Studio Assistant',
  integration: 'Integration',
  declaration: 'Declaration',
  audit: 'Audit Trail',
  node: 'Node Contract',
  edge: 'Edge',
};

const TABS: Array<[RightTab, string]> = [
  ['chat', 'Chat'],
  ['integration', 'Integr.'],
  ['declaration', 'Decl.'],
  ['audit', 'Audit'],
  ['node', 'Node'],
  ['edge', 'Edge'],
];

export interface RightPanelProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  tab: RightTab;
  onTabChange: (t: RightTab) => void;

  chat: ChatMessage[];
  chatInput: string;
  onChatInputChange: (v: string) => void;
  onSendChat: () => void;
  approveOn: boolean;
  onToggleApprove: () => void;

  mode: IntegrationMode;
  verified: boolean;
  prodEnabled: boolean;
  transport: boolean;
  onProdEnabledChange: (v: boolean) => void;
  onTransportChange: (v: boolean) => void;
  supported: Capability[];
  nodeCount: number;
  edgeCount: number;
  loopCount: number;
  blockedNodes: StudioNode[];

  decl: Declaration;
  onAdvance: (target: DeclarationStatus) => void;
  onApproveObservation: () => void;

  events: StudioEvent[];

  chosenNode: StudioNode | undefined;
  chosenEdge: StudioEdge | undefined;
  nodeById: Map<string, StudioNode>;
  onDuplicate: () => void;
  onDeleteSelection: () => void;
}

export default function RightPanel(props: RightPanelProps) {
  const { collapsed, onToggleCollapsed, tab, onTabChange } = props;

  return (
    <aside className={
      'flex min-w-0 flex-col overflow-hidden border-l border-[#1f2937] bg-[#0f141b] ' +
      (collapsed ? 'items-center py-2' : '')
    }>
      {collapsed ? (
        <button onClick={onToggleCollapsed} title="Expand"
          className="grid h-6 w-6 place-items-center rounded text-[#6b7280] hover:bg-[#1f2731] hover:text-[#e5e7eb]">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      ) : (
        <>
          <div className="flex flex-none items-center gap-1.5 border-b border-[#1f2937] px-2 py-1.5">
            <button onClick={onToggleCollapsed} title="Collapse"
              className="grid h-[22px] w-[22px] place-items-center rounded text-[#6b7280] hover:bg-[#1f2731] hover:text-[#e5e7eb]">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <span className="flex-1 truncate text-[11px] font-semibold">{TITLES[tab]}</span>
          </div>

          <div className="flex flex-none overflow-x-auto border-b border-[#1f2937]">
            {TABS.map(([k, l]) => (
              <button key={k} onClick={() => onTabChange(k)}
                className={
                  'min-w-[56px] flex-1 whitespace-nowrap border-b-2 px-1 py-2 text-[9.5px] font-extrabold uppercase tracking-wide ' +
                  (tab === k ? 'border-blue-500 text-[#60a5fa]' : 'border-transparent text-[#4b5563] hover:text-[#9ca3af]')
                }>
                {l}
              </button>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {tab === 'chat' && (
              <ChatPanel
                messages={props.chat}
                input={props.chatInput}
                onInputChange={props.onChatInputChange}
                onSend={props.onSendChat}
                approveOn={props.approveOn}
                onToggleApprove={props.onToggleApprove}
              />
            )}
            {tab === 'integration' && (
              <IntegrationPanel
                mode={props.mode}
                verified={props.verified}
                prodEnabled={props.prodEnabled}
                transport={props.transport}
                onProdEnabledChange={props.onProdEnabledChange}
                onTransportChange={props.onTransportChange}
                supported={props.supported}
                nodeCount={props.nodeCount}
                edgeCount={props.edgeCount}
                loopCount={props.loopCount}
                blockedNodes={props.blockedNodes}
              />
            )}
            {tab === 'declaration' && (
              <DeclarationPanel
                decl={props.decl}
                onAdvance={props.onAdvance}
                onApproveObservation={props.onApproveObservation}
              />
            )}
            {tab === 'audit' && <AuditPanel events={props.events} mode={props.mode} />}
            {tab === 'node' && (
              <NodePanel
                node={props.chosenNode}
                onDuplicate={props.onDuplicate}
                onDelete={props.onDeleteSelection}
              />
            )}
            {tab === 'edge' && (
              <EdgePanel
                edge={props.chosenEdge}
                nodeById={props.nodeById}
                onDelete={() => props.onDeleteSelection()}
              />
            )}
          </div>
        </>
      )}
    </aside>
  );
}