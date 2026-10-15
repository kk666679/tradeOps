"use client";

import { useCallback, useRef } from "react";
import {
  Background, BackgroundVariant, Controls, MiniMap,
  ReactFlow, useReactFlow,
  type Connection, type Edge, type EdgeChange, type Node, type NodeChange,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { workflowNodeTypes } from "../nodes/node-types";
import { workflowEdgeTypes } from "../edges";
import type { WorkflowNode } from "../types/workflow";

export interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  nodeTypes?: NodeTypes;
  onNodesChange: (c: NodeChange[]) => void;
  onEdgesChange: (c: EdgeChange[]) => void;
  onConnect: (c: Connection) => void;
  isValidConnection: (c: Connection | Edge) => boolean;
  onNodeClick?: (node: Node) => void;
  onPaneClick?: () => void;
  onDropNode?: (type: WorkflowNode["type"], position: { x: number; y: number }) => void;
}

export function WorkflowCanvas({
  nodes, edges, nodeTypes = workflowNodeTypes, onNodesChange, onEdgesChange, onConnect,
  isValidConnection, onNodeClick, onPaneClick, onDropNode,
}: WorkflowCanvasProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }, []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/x-workflow-node") as WorkflowNode["type"];
    if (!type || !onDropNode) return;
    onDropNode(type, screenToFlowPosition({ x: e.clientX, y: e.clientY }));
  }, [onDropNode, screenToFlowPosition]);

  return (
    <div ref={wrapper} className="h-full w-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes} edges={edges}
        nodeTypes={nodeTypes} edgeTypes={workflowEdgeTypes}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onConnect={onConnect} isValidConnection={isValidConnection}
        onNodeClick={(_, node) => onNodeClick?.(node)}
        onPaneClick={() => onPaneClick?.()}
        fitView minZoom={0.25} maxZoom={2}
        proOptions={{ hideAttribution: false }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#26262b" />
        <Controls showInteractive={false} position="bottom-left" />
        <MiniMap nodeStrokeWidth={3}
          nodeColor={(n: Node) => {
            const t = String(n.type ?? "");
            if (t.startsWith("trigger.")) return "#3b82f6";
            if (t.startsWith("logic.")) return "#f59e0b";
            if (t.startsWith("action.")) return "#8b5cf6";
            if (t.startsWith("data.")) return "#06b6d4";
            if (t === "output") return "#10b981";
            return "#71717a";
          }}
          maskColor="rgba(10,10,11,0.75)" position="bottom-right" pannable zoomable />
      </ReactFlow>
    </div>
  );
}
