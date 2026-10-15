'use client';
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import type { GraphNode, Viewport, CanvasSize } from '@/lib/workflow-studio/types';
import { NODE_WIDTH, PROV_COLOR, STATUS_COLOR } from '@/lib/workflow-studio/constants';
import { computeEdgePath, flowToScreen } from '@/lib/workflow-studio/graph-utils';
import { NodeCard } from './NodeCard';
import { useStudio } from '@/lib/workflow-studio/store';
import { byType } from '@/lib/workflow-studio/node-definitions';
import { useStudioInteractions } from '@/lib/workflow-studio/hooks/use-studio-interactions';

export function WorkflowCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null!);
  const nodes = useStudio((s) => s.nodes);
  const edges = useStudio((s) => s.edges);
  const sizes = useStudio((s) => s.sizes);
  const viewport = useStudio((s) => s.viewport);
  const canvasSize = useStudio((s) => s.canvasSize);
  const selNodes = useStudio((s) => s.selNodes);
  const selEdges = useStudio((s) => s.selEdges);
  const dragging = useStudio((s) => s.dragging);
  const linking = useStudio((s) => s.linking);
  const marquee = useStudio((s) => s.marquee);
  const panning = useStudio((s) => s.panning);
  const hotPortId = useStudio((s) => s.hotPortId);
  const guides = useStudio((s) => s.guides);
  const edgeStyle = useStudio((s) => s.edgeStyle);
  const spaceDown = useStudio((s) => s.spaceDown);
  const mode = useStudio((s) => s.mode);
  const prodEnabled = useStudio((s) => s.prodEnabled);
  const transport = useStudio((s) => s.transport);

  const banner = useMemo(() => {
    if (mode === 'development') return { cls: 'dev', text: '⚠ DEVELOPMENT SIMULATION — NOT CONNECTED TO JKDM' };
    if (mode === 'production' && !(prodEnabled && transport)) return { cls: 'block', text: '⚠ PRODUCTION INTEGRATION UNAVAILABLE — MANUAL PROCESSING REQUIRED' };
    if (mode === 'production') return { cls: 'block', text: '⚠ LIVE CONNECTION NOT PROBED — DO NOT TREAT AS CONNECTED' };
    return null;
  }, [mode, prodEnabled, transport]);

  const { onWheel, onCanvasMouseDown, onNodeMouseDown, onStartLink, onPortEnter, onPortLeave,
          onCanvasDragOver, onCanvasDrop } = useStudioInteractions(canvasRef);

  const setCanvasSize = useStudio((s) => s.setCanvasSize);
  const onMeasure = useStudio((s) => s.onMeasure);
  const setContextMenu = useStudio((s) => s.setContextMenu);
  const setSelNodes = useStudio((s) => s.setSelNodes);
  const setSelEdges = useStudio((s) => s.setSelEdges);
  const setTab = useStudio((s) => s.setTab);
  const openHsPicker = useStudio((s) => s.openHsPicker);
  const setViewport = useStudio((s) => s.setViewport);

  useLayoutEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const update = () => setCanvasSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [setCanvasSize]);

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const onNodeCtx = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    if (!selNodes.has(id)) { setSelNodes(new Set([id])); setSelEdges(new Set()); }
    setContextMenu({ x: e.clientX, y: e.clientY, kind: 'node', target: id });
  }, [selNodes, setSelNodes, setSelEdges, setContextMenu]);

  const onEdgeCtx = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    setSelEdges(new Set([id]));
    setSelNodes(new Set());
    setContextMenu({ x: e.clientX, y: e.clientY, kind: 'edge', target: id });
  }, [setSelEdges, setSelNodes, setContextMenu]);

  const onCanvasCtx = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-node-id]')) return;
    if ((e.target as HTMLElement).classList.contains('bws-edge-path')) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, kind: 'canvas', target: null });
  }, [setContextMenu]);

  const ghostPath = useMemo(() => {
    if (!linking) return null;
    const src = nodeById.get(linking.sourceId);
    if (!src) return null;
    const srcH = sizes[src.id] || 130;
    const s1 = flowToScreen(src.x + NODE_WIDTH / 2, src.y + srcH, viewport);
    const s2 = { x: linking.mouseScreenX, y: linking.mouseScreenY };
    const dy = Math.max(30, Math.abs(s2.y - s1.y) * 0.5);
    return `M ${s1.x} ${s1.y} C ${s1.x} ${s1.y + dy}, ${s2.x} ${s2.y - dy}, ${s2.x} ${s2.y}`;
  }, [linking, nodeById, sizes, viewport]);

  const marqueeRect = useMemo(() => {
    if (!marquee) return null;
    return {
      x: Math.min(marquee.startX, marquee.endX),
      y: Math.min(marquee.startY, marquee.endY),
      w: Math.abs(marquee.endX - marquee.startX),
      h: Math.abs(marquee.endY - marquee.startY),
    };
  }, [marquee]);

  return (
    <main
      ref={canvasRef}
      className={'bws-canvas' + (panning ? ' panning' : '') + (spaceDown ? ' pan-mode' : '')}
      onWheel={onWheel}
      onMouseDown={onCanvasMouseDown}
      onContextMenu={onCanvasCtx}
      onDragOver={onCanvasDragOver}
      onDrop={onCanvasDrop}
      style={{
        backgroundPosition: `${viewport.x}px ${viewport.y}px`,
        backgroundSize: `20px 20px`,
      }}
    >
      {banner && <div className={'bws-banner ' + banner.cls}>{banner.text}</div>}

      <svg
        className="bws-edges-svg"
        width={canvasSize.w}
        height={canvasSize.h}
        viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
      >
        {edges.map((e) => {
          const a = nodeById.get(e.source);
          const b = nodeById.get(e.target);
          if (!a || !b) return null;
          const aH = sizes[a.id] || 130;
          const d = computeEdgePath(a, b, aH, viewport, edgeStyle);
          const color = PROV_COLOR[e.provenance] || PROV_COLOR.pending;
          const dashed = e.provenance === 'synthetic' || e.provenance === 'pending';
          const isSel = selEdges.has(e.id);
          const aC = flowToScreen(a.x + NODE_WIDTH / 2, a.y + aH, viewport);
          const bC = flowToScreen(b.x + NODE_WIDTH / 2, b.y, viewport);
          return (
            <g key={e.id}>
              <path
                className={'bws-edge-path' + (isSel ? ' selected' : '')}
                d={d} fill="none" stroke={color} strokeWidth={2}
                strokeDasharray={dashed ? '6 4' : undefined}
                onMouseDown={(ev) => {
                  ev.stopPropagation();
                  setSelEdges(new Set([e.id]));
                  setSelNodes(new Set());
                  setTab('node');
                }}
                onContextMenu={(ev) => onEdgeCtx(ev, e.id)}
              />
              {e.provenance !== 'pending' && (
                <text
                  className="bws-edge-label"
                  x={(aC.x + bC.x) / 2}
                  y={(aC.y + bC.y) / 2 - 5}
                  textAnchor="middle" fill={color}
                >
                  {e.provenance}
                </text>
              )}
            </g>
          );
        })}
        {ghostPath && <path className="bws-ghost-edge" d={ghostPath} fill="none" stroke="#3b82f6" strokeWidth={2} />}
        {guides.xs.map((x, i) => {
          const p = flowToScreen(x, 0, viewport);
          return <line key={'gx' + i} className="bws-guide-line" x1={p.x} y1={0} x2={p.x} y2={canvasSize.h} />;
        })}
        {guides.ys.map((y, i) => {
          const p = flowToScreen(0, y, viewport);
          return <line key={'gy' + i} className="bws-guide-line" x1={0} y1={p.y} x2={canvasSize.w} y2={p.y} />;
        })}
      </svg>

      <div
        className="bws-graph-content"
        style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})` }}
      >
        {nodes.map((n) => (
          <NodeCard
            key={n.id}
            node={n}
            def={byType[n.type]}
            selected={selNodes.has(n.id)}
            dragging={!!(dragging && dragging.ids.includes(n.id))}
            hotPort={!!(linking && hotPortId === n.id)}
            onMouseDown={onNodeMouseDown}
            onContextMenu={onNodeCtx}
            onMeasure={onMeasure}
            onStartLink={onStartLink}
            onPortEnter={onPortEnter}
            onPortLeave={onPortLeave}
            onOpenPicker={openHsPicker}
          />
        ))}
      </div>

      {marqueeRect && marqueeRect.w > 2 && marqueeRect.h > 2 && (
        <div className="bws-marquee" style={{
          left: marqueeRect.x, top: marqueeRect.y,
          width: marqueeRect.w, height: marqueeRect.h,
        }} />
      )}

      <div className="bws-legend">
        <span><i style={{ background: '#10b981' }} />verified</span>
        <span><i style={{ background: '#f59e0b' }} />manual</span>
        <span><i style={{ background: '#a855f7' }} />synthetic</span>
        <span><i style={{ background: '#ef4444' }} />blocked</span>
        <span><i style={{ background: '#3b82f6' }} />local</span>
        <span><i style={{ background: '#14b8a6' }} />HS</span>
      </div>

      <ZoomControls />
      <Minimap nodes={nodes} viewport={viewport} canvasSize={canvasSize} onJump={(fx, fy) => {
        setViewport((v) => ({ ...v, x: canvasSize.w / 2 - fx * v.zoom, y: canvasSize.h / 2 - fy * v.zoom }));
      }} />
    </main>
  );
}

function ZoomControls() {
  const viewport = useStudio((s) => s.viewport);
  const canvasSize = useStudio((s) => s.canvasSize);
  const setViewport = useStudio((s) => s.setViewport);
  const fitView = useStudio((s) => s.fitView);

  const zoomAt = (factor: number) => {
    const cx = canvasSize.w / 2, cy = canvasSize.h / 2;
    setViewport((v) => {
      const nz = Math.max(0.25, Math.min(2.5, v.zoom * factor));
      const k = nz / v.zoom;
      return { x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k, zoom: nz };
    });
  };

  const resetZoom = () => {
    const cx = canvasSize.w / 2, cy = canvasSize.h / 2;
    setViewport((v) => {
      const k = 1 / v.zoom;
      return { x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k, zoom: 1 };
    });
  };

  return (
    <div className="bws-zoom-ctrl">
      <button title="Zoom in" onClick={() => zoomAt(1.15)}>+</button>
      <button title="Zoom out" onClick={() => zoomAt(1 / 1.15)}>−</button>
      <button title="Reset zoom" onClick={resetZoom}>1</button>
      <button title="Fit to view" onClick={fitView}>⌂</button>
      <div className="bws-zoom-label">{Math.round(viewport.zoom * 100)}%</div>
    </div>
  );
}

function Minimap({ nodes, viewport, canvasSize, onJump }: {
  nodes: GraphNode[]; viewport: Viewport; canvasSize: CanvasSize;
  onJump: (x: number, y: number) => void;
}) {
  const width = 180, height = 130, padding = 8;
  const bounds = useMemo(() => {
    if (!nodes.length) return { x: 0, y: 0, w: 400, h: 400 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach((n) => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + NODE_WIDTH);
      maxY = Math.max(maxY, n.y + 130);
    });
    const pad = 60;
    return { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 };
  }, [nodes]);
  const scale = Math.min((width - padding * 2) / bounds.w, (height - padding * 2) / bounds.h);
  const vx = -viewport.x / viewport.zoom;
  const vy = -viewport.y / viewport.zoom;
  const vw = canvasSize.w / viewport.zoom;
  const vh = canvasSize.h / viewport.zoom;

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - rect.left - padding) / scale + bounds.x;
    const fy = (e.clientY - rect.top - padding) / scale + bounds.y;
    onJump(fx, fy);
  };

  return (
    <div className="bws-minimap" onClick={onClick}>
      <svg viewBox={`0 0 ${width} ${height}`}>
        {nodes.map((n) => {
          const x = padding + (n.x - bounds.x) * scale;
          const y = padding + (n.y - bounds.y) * scale;
          const color = STATUS_COLOR[n.status] || STATUS_COLOR.idle;
          return <rect key={n.id} x={x} y={y} width={NODE_WIDTH * scale} height={130 * scale} rx={2} fill={color} opacity={0.75} />;
        })}
        <rect
          x={padding + (vx - bounds.x) * scale}
          y={padding + (vy - bounds.y) * scale}
          width={Math.max(4, vw * scale)} height={Math.max(4, vh * scale)}
          fill="rgba(59,130,246,.15)" stroke="#3b82f6" strokeWidth={1}
        />
      </svg>
    </div>
  );
}
