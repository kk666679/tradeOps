'use client';

export default function GuidePanel() {
  return (
    <div className="border-b border-[#1f2937] p-2.5">
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
        React Flow cheat sheet
      </div>
      <div className="text-[10.5px] leading-[1.75] text-[#4b5563]">
        <b className="text-[#9ca3af]">Components in use:</b><br />
        <code>ReactFlow</code> · <code>ReactFlowProvider</code> · <code>Background</code> ·{' '}
        <code>Controls</code> · <code>ControlButton</code> · <code>MiniMap</code> ·{' '}
        <code>Panel</code> · <code>Handle</code> · <code>BaseEdge</code> ·{' '}
        <code>EdgeLabelRenderer</code> · <code>NodeToolbar</code> · <code>NodeResizer</code> ·{' '}
        <code>ViewportPortal</code>
        <br /><br />
        <b className="text-[#9ca3af]">Hooks:</b><br />
        <code>useReactFlow</code> · <code>useNodesState</code> · <code>useEdgesState</code> ·{' '}
        <code>useNodes</code> · <code>useEdges</code> · <code>useConnection</code> ·{' '}
        <code>useNodeId</code> · <code>useKeyPress</code> · <code>useOnSelectionChange</code> ·{' '}
        <code>useViewport</code> · <code>useUpdateNodeInternals</code> ·{' '}
        <code>useNodesInitialized</code> · <code>useNodesData</code>
        <br /><br />
        <b className="text-[#9ca3af]">Utils:</b><br />
        <code>addEdge</code> · <code>getBezierPath</code> · <code>getConnectedEdges</code> ·{' '}
        <code>getIncomers</code> · <code>getOutgoers</code> · <code>isEdge</code> · <code>isNode</code>
      </div>
    </div>
  );
}