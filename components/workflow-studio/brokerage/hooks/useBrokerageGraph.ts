"use client";
import { useMemo } from "react";
import type { BrokerageEdge, BrokerageNode } from "../types";
import { buildBrokerageWorkflowGraph, type BuildBrokerageGraphOptions } from "../workflow/brokerageWorkflowGraph";

export type UseBrokerageGraphOptions = BuildBrokerageGraphOptions;
export interface UseBrokerageGraphResult {
  nodes: BrokerageNode[]; edges: BrokerageEdge[];
}

export function useBrokerageGraph(options: UseBrokerageGraphOptions): UseBrokerageGraphResult {
  return useMemo(() => buildBrokerageWorkflowGraph(options), [options]);
}
