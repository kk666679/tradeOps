import { NODE_WIDTH } from './constants';
import type { GraphEdge, GraphNode, Viewport, EdgeStyle } from './types';

export function topoOrder(nodes: GraphNode[], edges: GraphEdge[]): string[] {
  const indeg = new Map<string, number>(nodes.map((n) => [n.id, 0]));
  const adj = new Map<string, string[]>(nodes.map((n) => [n.id, []]));
  const ids = new Set(nodes.map((n) => n.id));

  edges.forEach((e) => {
    if (!ids.has(e.source) || !ids.has(e.target)) return;
    indeg.set(e.target, (indeg.get(e.target) || 0) + 1);
    adj.get(e.source)!.push(e.target);
  });

  const queue: string[] = nodes
    .filter((n) => indeg.get(n.id) === 0)
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .map((n) => n.id);

  const out: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    out.push(id);
    for (const t of adj.get(id) || []) {
      indeg.set(t, (indeg.get(t) || 0) - 1);
      if (indeg.get(t) === 0) queue.push(t);
    }
  }
  nodes.forEach((n) => { if (!out.includes(n.id)) out.push(n.id); });
  return out;
}

export function wouldCreateCycle(source: string, target: string, edges: GraphEdge[]): boolean {
  if (source === target) return true;
  const adj = new Map<string, string[]>();
  edges.forEach((e) => {
    if (!adj.has(e.source)) adj.set(e.source, []);
    adj.get(e.source)!.push(e.target);
  });
  const stack: string[] = [target];
  const seen = new Set<string>();
  while (stack.length) {
    const id = stack.pop()!;
    if (id === source) return true;
    if (seen.has(id)) continue;
    seen.add(id);
    for (const t of adj.get(id) || []) stack.push(t);
  }
  return false;
}

export function flowToScreen(x: number, y: number, vp: Viewport): { x: number; y: number } {
  return { x: x * vp.zoom + vp.x, y: y * vp.zoom + vp.y };
}

export function computeEdgePath(
  a: GraphNode,
  b: GraphNode,
  aH: number,
  vp: Viewport,
  style: EdgeStyle,
): string {
  const s1 = flowToScreen(a.x + NODE_WIDTH / 2, a.y + aH, vp);
  const s2 = flowToScreen(b.x + NODE_WIDTH / 2, b.y, vp);
  if (style === 'straight') return `M ${s1.x} ${s1.y} L ${s2.x} ${s2.y}`;
  if (style === 'step') {
    const midY = (s1.y + s2.y) / 2;
    return `M ${s1.x} ${s1.y} L ${s1.x} ${midY} L ${s2.x} ${midY} L ${s2.x} ${s2.y}`;
  }
  const dy = Math.max(30, Math.abs(s2.y - s1.y) * 0.5);
  return `M ${s1.x} ${s1.y} C ${s1.x} ${s1.y + dy}, ${s2.x} ${s2.y - dy}, ${s2.x} ${s2.y}`;
}

export interface FitResult { x: number; y: number; zoom: number }

export function computeFitView(
  nodes: GraphNode[],
  sizes: Record<string, number>,
  canvas: { w: number; h: number },
  minZoom: number,
  maxZoom: number,
): FitResult | null {
  if (!nodes.length) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  nodes.forEach((n) => {
    const h = sizes[n.id] || 130;
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + NODE_WIDTH);
    maxY = Math.max(maxY, n.y + h);
  });
  const pad = 70;
  const w = maxX - minX + pad * 2;
  const h = maxY - minY + pad * 2;
  const zoom = Math.max(minZoom, Math.min(maxZoom, Math.min(canvas.w / w, canvas.h / h)));
  const x = (canvas.w - (maxX - minX) * zoom) / 2 - minX * zoom;
  const y = (canvas.h - (maxY - minY) * zoom) / 2 - minY * zoom;
  return { x, y, zoom };
}
