"use client";

import { memo } from "react";
import {
  BaseEdge, EdgeLabelRenderer, EdgeToolbar,
  getSmoothStepPath, useReactFlow, type EdgeProps,
} from "@xyflow/react";

function WorkflowEdgeImpl(props: EdgeProps) {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX: props.sourceX, sourceY: props.sourceY,
    targetX: props.targetX, targetY: props.targetY,
    sourcePosition: props.sourcePosition, targetPosition: props.targetPosition,
  });
  const { setEdges } = useReactFlow();

  return (
    <>
      <BaseEdge id={props.id} path={path} selected={props.selected} />
      {props.selected && (
        <EdgeLabelRenderer>
          <div style={{ position: "absolute", transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`, pointerEvents: "all" }} className="nodrag nopan">
            <EdgeToolbar edgeId={props.id} x={0} y={0} isVisible>
              <button type="button"
                onClick={() => setEdges((es) => es.filter((e) => e.id !== props.id))}
                className="rounded border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400">
                Delete
              </button>
            </EdgeToolbar>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const WorkflowEdge = memo(WorkflowEdgeImpl);
WorkflowEdge.displayName = "WorkflowEdge";
