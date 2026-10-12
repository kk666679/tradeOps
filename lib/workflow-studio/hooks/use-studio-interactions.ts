'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useStudio } from '../store';
import { NODE_WIDTH, SNAP_THRESHOLD_PX, GRID_SIZE } from '../constants';
import { wouldCreateCycle } from '../graph-utils';
import { byType } from '../node-definitions';
import type { DragState } from '../types';

export function useStudioInteractions(canvasRef: React.RefObject<HTMLDivElement>) {
  const store = useStudio;

  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const s = store.getState();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    s.setViewport((v) => {
      const nz = Math.max(0.25, Math.min(2.5, v.zoom * factor));
      const k = nz / v.zoom;
      return { x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k, zoom: nz };
    });
  }, [canvasRef, store]);

  const onNodeMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (e.button === 1) return;
    if ((e.target as HTMLElement).closest('[data-port]')) return;
    e.stopPropagation();

    const s = store.getState();
    const additive = e.shiftKey || e.metaKey || e.ctrlKey;

    let ids: string[];
    if (additive) {
      const next = new Set(s.selNodes);
      if (next.has(id)) next.delete(id); else next.add(id);
      s.setSelNodes(next);
      ids = [...next];
    } else {
      if (s.selNodes.has(id)) ids = [...s.selNodes];
      else { s.setSelNodes(new Set([id])); ids = [id]; }
      s.setSelEdges(new Set());
    }
    s.setTab('node');

    if (!ids.includes(id)) return;

    const startPositions = new Map<string, { x: number; y: number }>();
    for (const nid of ids) {
      const n = s.nodes.find((x) => x.id === nid);
      if (n) startPositions.set(nid, { x: n.x, y: n.y });
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const flowX = (screenX - s.viewport.x) / s.viewport.zoom;
    const flowY = (screenY - s.viewport.y) / s.viewport.zoom;

    s.setDragging({
      ids, startPositions,
      mouseStartFlow: { x: flowX, y: flowY },
      nodesBefore: s.nodes, edgesBefore: s.edges,
      moved: false,
    });
  }, [canvasRef, store]);

  const onStartLink = useCallback((e: React.MouseEvent, sourceId: string) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    store.getState().setLinking({
      sourceId,
      mouseScreenX: e.clientX - rect.left,
      mouseScreenY: e.clientY - rect.top,
    });
  }, [canvasRef, store]);

  const onPortEnter = useCallback((id: string) => store.getState().setHotPortId(id), [store]);
  const onPortLeave = useCallback((id: string) => {
    store.getState().setHotPortId((p) => (p === id ? null : p));
  }, [store]);

  const onCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) return;
    const s = store.getState();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (e.button === 1 || s.spaceDown || e.altKey) {
      e.preventDefault();
      s.setPanning({ startScreenX: sx, startScreenY: sy, startVp: { ...s.viewport } });
      return;
    }
    if (e.button === 0) {
      if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
        s.setSelNodes(new Set());
        s.setSelEdges(new Set());
      }
      s.setMarquee({
        startX: sx, startY: sy, endX: sx, endY: sy,
        additive: e.shiftKey || e.metaKey || e.ctrlKey,
        baseNodes: e.shiftKey ? new Set(s.selNodes) : new Set(),
        baseEdges: e.shiftKey ? new Set(s.selEdges) : new Set(),
      });
    }
  }, [canvasRef, store]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const s = store.getState();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const toFlow = (x: number, y: number) => ({
        x: (x - s.viewport.x) / s.viewport.zoom,
        y: (y - s.viewport.y) / s.viewport.zoom,
      });

      if (s.panning) {
        const dx = sx - s.panning.startScreenX;
        const dy = sy - s.panning.startScreenY;
        s.setViewport({
          x: s.panning.startVp.x + dx,
          y: s.panning.startVp.y + dy,
          zoom: s.panning.startVp.zoom,
        });
      }

      if (s.dragging) {
        const cur = toFlow(sx, sy);
        const dx = cur.x - s.dragging.mouseStartFlow.x;
        const dy = cur.y - s.dragging.mouseStartFlow.y;

        const proposed = new Map<string, { x: number; y: number }>();
        for (const id of s.dragging.ids) {
          const sp = s.dragging.startPositions.get(id);
          if (sp) proposed.set(id, { x: sp.x + dx, y: sp.y + dy });
        }

        const dragIds = new Set(s.dragging.ids);
        const others = s.nodes.filter((n) => !dragIds.has(n.id));
        const threshold = SNAP_THRESHOLD_PX / s.viewport.zoom;
        const getXAnchors = (x: number) => [x, x + NODE_WIDTH / 2, x + NODE_WIDTH];
        const getYAnchors = (y: number, h: number) => [y, y + h / 2, y + h];
        const otherX: number[] = [];
        const otherY: number[] = [];
        for (const o of others) {
          const oh = s.sizes[o.id] || 130;
          getXAnchors(o.x).forEach((v) => otherX.push(v));
          getYAnchors(o.y, oh).forEach((v) => otherY.push(v));
        }
        const xs = new Set<number>();
        const ys = new Set<number>();
        const finalPositions = new Map<string, { x: number; y: number }>();
        for (const [id, pos] of proposed) {
          const h = s.sizes[id] || 130;
          let bestDx = 0, bestDxDist = Infinity;
          for (const mx of getXAnchors(pos.x)) {
            for (const ox of otherX) {
              const d = Math.abs(mx - ox);
              if (d < threshold && d < bestDxDist) { bestDxDist = d; bestDx = ox - mx; }
            }
          }
          let bestDy = 0, bestDyDist = Infinity;
          for (const my of getYAnchors(pos.y, h)) {
            for (const oy of otherY) {
              const d = Math.abs(my - oy);
              if (d < threshold && d < bestDyDist) { bestDyDist = d; bestDy = oy - my; }
            }
          }
          const finalX = pos.x + bestDx;
          const finalY = pos.y + bestDy;
          if (bestDx) {
            const target = getXAnchors(finalX).find((v) =>
              otherX.some((o) => Math.abs(o - v) < 0.5));
            if (target != null) xs.add(target);
          }
          if (bestDy) {
            const target = getYAnchors(finalY, h).find((v) =>
              otherY.some((o) => Math.abs(o - v) < 0.5));
            if (target != null) ys.add(target);
          }
          finalPositions.set(id, { x: finalX, y: finalY });
        }
        s.setGuides({ xs: [...xs], ys: [...ys] });
        s.setNodes((ns) => ns.map((n) => {
          const fp = finalPositions.get(n.id);
          return fp ? { ...n, x: fp.x, y: fp.y } : n;
        }));
        if (!s.dragging.moved) {
          s.setDragging({ ...s.dragging, moved: true });
        }
      }

      if (s.linking) {
        s.setLinking((l) => l ? { ...l, mouseScreenX: sx, mouseScreenY: sy } : null);
      }
      if (s.marquee) {
        s.setMarquee((m) => m ? { ...m, endX: sx, endY: sy } : null);
      }
    };

    const onUp = (e: MouseEvent) => {
      const s = store.getState();

      if (s.panning) s.setPanning(null);

      if (s.dragging) {
        if (s.dragging.moved) {
          if (s.snapToGrid) {
            s.setNodes((ns) => ns.map((n) => {
              if (!s.dragging!.ids.includes(n.id)) return n;
              return {
                ...n,
                x: Math.round(n.x / GRID_SIZE) * GRID_SIZE,
                y: Math.round(n.y / GRID_SIZE) * GRID_SIZE,
              };
            }));
          }
          const d = s.dragging;
          store.setState((st) => ({
            history: {
              past: [...st.history.past.slice(-49), { nodes: d.nodesBefore, edges: d.edgesBefore }],
              future: [],
            },
          }));
        }
        s.setDragging(null);
        s.setGuides({ xs: [], ys: [] });
      }

      if (s.linking) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const targetNode = el && (el as HTMLElement).closest('[data-node-id]');
        const targetId = targetNode instanceof HTMLElement ? targetNode.dataset.nodeId : undefined;

        if (targetId && targetId !== s.linking.sourceId) {
          const exists = s.edges.some((x) =>
            x.source === s.linking!.sourceId && x.target === targetId);
          if (exists) {
            s.addAudit('graph.edge.duplicate', 'local',
              `Connection ${s.linking.sourceId} → ${targetId} already exists.`);
          } else if (wouldCreateCycle(s.linking.sourceId, targetId, s.edges)) {
            s.addAudit('graph.edge.cycle_blocked', 'local',
              `Refused: ${s.linking.sourceId} → ${targetId} would create a cycle.`);
          } else {
            s.snapshot();
            const newEdge = {
              id: 'e' + Math.random().toString(36).slice(2, 10),
              source: s.linking.sourceId,
              target: targetId,
              provenance: 'pending' as const,
            };
            s.setEdges((es) => [...es, newEdge]);
            s.addAudit('graph.edge.created', 'local',
              `Connected ${s.linking.sourceId} → ${targetId}.`);
          }
        }
        s.setLinking(null);
        s.setHotPortId(null);
      }

      if (s.marquee) {
        const m = s.marquee;
        const vp = s.viewport;
        const x1 = Math.min(m.startX, m.endX);
        const x2 = Math.max(m.startX, m.endX);
        const y1 = Math.min(m.startY, m.endY);
        const y2 = Math.max(m.startY, m.endY);
        if (Math.abs(x2 - x1) < 3 && Math.abs(y2 - y1) < 3) {
          s.setMarquee(null);
          return;
        }
        const fx1 = (x1 - vp.x) / vp.zoom;
        const fy1 = (y1 - vp.y) / vp.zoom;
        const fx2 = (x2 - vp.x) / vp.zoom;
        const fy2 = (y2 - vp.y) / vp.zoom;
        const nextNodes = new Set(m.baseNodes);
        const nextEdges = new Set(m.baseEdges);
        for (const n of s.nodes) {
          const h = s.sizes[n.id] || 130;
          if (n.x + NODE_WIDTH >= fx1 && n.x <= fx2 && n.y + h >= fy1 && n.y <= fy2) {
            nextNodes.add(n.id);
          }
        }
        for (const ed of s.edges) {
          const a = s.nodes.find((n) => n.id === ed.source);
          const b = s.nodes.find((n) => n.id === ed.target);
          if (!a || !b) continue;
          const ah = s.sizes[a.id] || 130;
          const mx = (a.x + NODE_WIDTH / 2 + b.x + NODE_WIDTH / 2) / 2;
          const my = (a.y + ah / 2 + b.y + (s.sizes[b.id] || 130) / 2) / 2;
          if (mx >= fx1 && mx <= fx2 && my >= fy1 && my <= fy2) nextEdges.add(ed.id);
        }
        s.setSelNodes(nextNodes);
        s.setSelEdges(nextEdges);
        s.setMarquee(null);
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [canvasRef, store]);

  const onPaletteDragStart = useCallback((e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/x-jkdm-node-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  const onCanvasDragOver = useCallback((e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('application/x-jkdm-node-type')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const onCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/x-jkdm-node-type');
    const def = byType[type];
    if (!def) return;
    const s = store.getState();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const vp = s.viewport;
    const fx = (sx - vp.x) / vp.zoom - NODE_WIDTH / 2;
    const fy = (sy - vp.y) / vp.zoom - 30;
    s.addNode(def, fx, fy);
  }, [canvasRef, store]);

  return {
    onWheel, onCanvasMouseDown, onNodeMouseDown, onStartLink,
    onPortEnter, onPortLeave,
    onPaletteDragStart, onCanvasDragOver, onCanvasDrop,
  };
}
