'use client';
import { useStudio } from '@/lib/workflow-studio/store';
import { useMemo } from 'react';
import { definitions, GROUPS } from '@/lib/workflow-studio/node-definitions';
import { getSupportedOperations } from '@/lib/workflow-studio/logic';

export function NodePalette() {
  const mode = useStudio((s) => s.mode);
  const prodEnabled = useStudio((s) => s.prodEnabled);
  const transport = useStudio((s) => s.transport);
  const addNode = useStudio((s) => s.addNode);

  const supported = useMemo(
    () => getSupportedOperations(mode, prodEnabled, transport),
    [mode, prodEnabled, transport],
  );

  return (
    <aside className="bws-palette">
      <h4>Node Palette</h4>
      <div className="bws-muted" style={{ margin: '0 4px 10px', fontSize: 10 }}>
        Drag onto canvas, click to add. Press <kbd>H</kbd> on a selected node to attach an HS code.
      </div>
      {GROUPS.map((g) => (
        <section key={g}>
          <h4>{g}</h4>
          {definitions.filter((d) => d.group === g).map((d) => {
            const available = !d.requires || supported.includes(d.requires);
            return (
              <button
                key={d.type}
                className={'bws-item' + (available ? '' : ' unavailable')}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/x-jkdm-node-type', d.type);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => addNode(d)}
                title={available ? `Drag · ${d.label}` : `Unavailable in ${mode}`}
              >
                {d.label}
                <small>
                  {d.group === 'Classification'
                    ? 'HS catalog operation · always available'
                    : d.requires
                      ? (available ? 'capability: ' + d.requires : 'unavailable · ' + d.requires)
                      : d.human ? 'human approval'
                      : d.sideEffect ? 'external side-effect'
                      : 'local operation'}
                </small>
              </button>
            );
          })}
        </section>
      ))}
    </aside>
  );
}
