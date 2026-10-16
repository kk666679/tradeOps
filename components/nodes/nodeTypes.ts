'use client';

import type { NodeTypes } from '@xyflow/react';
import TaskNode from './TaskNode';
import GateNode from './GateNode';
import StartNode from './StartNode';
import EndNode from './EndNode';

export const nodeTypes: NodeTypes = {
  task: TaskNode,
  gate: GateNode,
  start: StartNode,
  end: EndNode,
};

export default nodeTypes;