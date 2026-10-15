import { createElement } from "react";
import { BaseEdge, getBezierPath, type EdgeProps, type EdgeTypes } from "@xyflow/react";
import { WorkflowEdge } from "./workflow-edge";

function UnsupportedWorkflowEdge(props: EdgeProps) {
	const [path] = getBezierPath({
		sourceX: props.sourceX,
		sourceY: props.sourceY,
		sourcePosition: props.sourcePosition,
		targetX: props.targetX,
		targetY: props.targetY,
		targetPosition: props.targetPosition,
	});
  return createElement(BaseEdge, {
    id: props.id,
    path,
    markerEnd: props.markerEnd,
    markerStart: props.markerStart,
    style: { ...props.style, stroke: "#fbbf24", strokeDasharray: "5 4" },
  });
}

export const workflowEdgeTypes: EdgeTypes = {
	default: WorkflowEdge,
	unsupported: UnsupportedWorkflowEdge,
};
