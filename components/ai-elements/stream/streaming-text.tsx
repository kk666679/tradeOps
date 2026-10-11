'use client';

/**
 * StreamingText
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface StreamingTextProps {
  text: string;
  streaming?: boolean;
  speed?: number;         // chars per second
  reducedMotion?: boolean;
  className?: string;
}

export function StreamingText({ text, streaming, speed = 40, reducedMotion, className }: StreamingTextProps) {
  const [shown, setShown] = React.useState(streaming ? 0 : text.length);
  React.useEffect(() => {
    if (!streaming || reducedMotion) { setShown(text.length); return; }
    let raf = 0; let last = performance.now(); let i = shown;
    const tick = (t: number) => {
      const dt = (t - last) / 1000; last = t;
      i = Math.min(text.length, i + dt * speed);
      setShown(Math.floor(i));
      if (i < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, streaming, speed, reducedMotion]);
  return (
    <span className={className} aria-live="polite">
      {text.slice(0, shown)}
      {streaming && shown < text.length ? <span className="AnimatePulse">▍</span> : null}
    </span>
  );
}

export default StreamingText;
