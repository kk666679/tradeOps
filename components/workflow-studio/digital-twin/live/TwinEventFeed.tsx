'use client';
import * as React from 'react';
import { TwinLiveStream, type LiveEvent } from './TwinLiveStream';

interface Props { events?: LiveEvent[]; onSelect?: (e: LiveEvent) => void; }

export function TwinEventFeed({ events, onSelect }: Props) {
  return (
    <div onClick={(ev) => {
      const target = (ev.target as HTMLElement).closest('li');
      if (!target || !onSelect || !events) return;
      const idx = Array.from(target.parentElement?.children ?? []).indexOf(target);
      const found = events[idx];
      if (found) onSelect(found);
    }}>
      <TwinLiveStream events={events} />
    </div>
  );
}
export default TwinEventFeed;
