'use client';

import { useEffect } from 'react';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';

export function useTwinShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, [contenteditable]')) return;

      const s = useDigitalTwinStore.getState();
      const meta = e.metaKey || e.ctrlKey;

      if (e.code === 'Space') {
        e.preventDefault();
        s.setMode(s.mode === 'running' ? 'paused' : 'running');
        return;
      }
      if (e.key === 'Escape') {
        s.selectNode(null);
        s.selectEdge(null);
        return;
      }
      if (e.key === '1') { s.setActiveTab('properties'); return; }
      if (e.key === '2') { s.setActiveTab('reasoning'); return; }
      if (e.key === '3') { s.setActiveTab('live'); return; }
      if (e.key === '4') { s.setActiveTab('simulation'); return; }
      if (meta && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        s.toggleSidebar();
      }
      if (meta && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        s.toggleInspector();
      }
      if (meta && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        s.toggleDock();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
