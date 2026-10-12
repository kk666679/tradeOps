'use client';
import { useEffect } from 'react';
import { useStudio } from '../store';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const isEditing = () => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return false;
      return ['INPUT','TEXTAREA','SELECT'].includes(el.tagName) || el.isContentEditable;
    };

    const onDown = (e: KeyboardEvent) => {
      const s = useStudio.getState();

      if (e.code === 'Space' && !isEditing()) {
        s.setSpaceDown(true);
        e.preventDefault();
        return;
      }
      if (isEditing()) return;

      const meta = e.metaKey || e.ctrlKey;

      if (e.key === 'Escape') {
        if (s.contextMenu) s.setContextMenu(null);
        else if (s.showShortcuts) s.setShowShortcuts(false);
        else if (s.pickerTargetId) s.closeHsPicker();
        else if (s.manualModalOpen) s.setManualModalOpen(false);
        else {
          s.setLinking(null); s.setDragging(null);
          s.setMarquee(null); s.setPanning(null);
          s.setSelNodes(new Set()); s.setSelEdges(new Set());
          s.setGuides({ xs: [], ys: [] });
        }
        return;
      }
      if (e.key === '?') { s.setShowShortcuts(!s.showShortcuts); return; }
      if (meta && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) s.redo(); else s.undo();
        return;
      }
      if (meta && e.key.toLowerCase() === 'c') { e.preventDefault(); s.copySelection(); return; }
      if (meta && e.key.toLowerCase() === 'v') { e.preventDefault(); s.pasteClipboard(); return; }
      if (meta && e.key.toLowerCase() === 'd') { e.preventDefault(); s.duplicateSelection(); return; }
      if (meta && e.key.toLowerCase() === 'a') { e.preventDefault(); s.selectAll(); return; }
      if (meta && e.key.toLowerCase() === 'g') { e.preventDefault(); s.setSnapToGrid((v) => !v); return; }
      if (meta && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        const cx = s.canvasSize.w / 2, cy = s.canvasSize.h / 2;
        s.setViewport((v) => {
          const nz = Math.min(2.5, v.zoom * 1.15);
          const k = nz / v.zoom;
          return { x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k, zoom: nz };
        });
        return;
      }
      if (meta && e.key === '-') {
        e.preventDefault();
        const cx = s.canvasSize.w / 2, cy = s.canvasSize.h / 2;
        s.setViewport((v) => {
          const nz = Math.max(0.25, v.zoom / 1.15);
          const k = nz / v.zoom;
          return { x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k, zoom: nz };
        });
        return;
      }
      if (meta && e.key === '0') {
        e.preventDefault();
        const cx = s.canvasSize.w / 2, cy = s.canvasSize.h / 2;
        s.setViewport((v) => {
          const k = 1 / v.zoom;
          return { x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k, zoom: 1 };
        });
        return;
      }
      if (meta && e.key === '1') { e.preventDefault(); s.fitView(); return; }

      if (!meta && e.key.toLowerCase() === 'h') {
        if (s.selNodes.size === 1) {
          e.preventDefault();
          s.openHsPicker([...s.selNodes][0]);
        }
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        s.deleteSelected();
        return;
      }
    };

    const onUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') useStudio.getState().setSpaceDown(false);
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);
}
