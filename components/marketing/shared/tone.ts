/**
 * Unified tone system for marketing components.
 * Maps to globals.css semantic tokens (signal, fiz, fcz, cargo, clear, alert, muted).
 */
export type Tone = 'signal' | 'fiz' | 'fcz' | 'cargo' | 'clear' | 'alert' | 'muted';

export const TONES: Record<Tone, {
  ring: string;
  surface: string;
  chip: string;
  accent: string;
  text: string;
  hover: string;
}> = {
  signal: {
    ring: 'border-signal-200',
    surface: 'bg-signal-500/10',
    chip: 'bg-signal-500/10 text-signal-600',
    accent: 'bg-signal-500',
    text: 'text-signal-600',
    hover: 'hover:border-signal-300 hover:bg-signal-500/20',
  },
  fiz: {
    ring: 'border-fiz/30',
    surface: 'bg-fiz/10',
    chip: 'bg-fiz/10 text-fiz',
    accent: 'bg-fiz',
    text: 'text-fiz',
    hover: 'hover:border-fiz/50 hover:bg-fiz/20',
  },
  fcz: {
    ring: 'border-fcz/30',
    surface: 'bg-fcz/10',
    chip: 'bg-fcz/10 text-fcz',
    accent: 'bg-fcz',
    text: 'text-fcz',
    hover: 'hover:border-fcz/50 hover:bg-fcz/20',
  },
  cargo: {
    ring: 'border-cargo-300',
    surface: 'bg-cargo-500/10',
    chip: 'bg-cargo-500/10 text-cargo-600',
    accent: 'bg-cargo-500',
    text: 'text-cargo-600',
    hover: 'hover:border-cargo-400 hover:bg-cargo-500/20',
  },
  clear: {
    ring: 'border-clear-300',
    surface: 'bg-clear-500/10',
    chip: 'bg-clear-500/10 text-clear-600',
    accent: 'bg-clear-500',
    text: 'text-clear-600',
    hover: 'hover:border-clear-400 hover:bg-clear-500/20',
  },
  alert: {
    ring: 'border-alert-300',
    surface: 'bg-alert-500/10',
    chip: 'bg-alert-500/10 text-alert-600',
    accent: 'bg-alert-500',
    text: 'text-alert-600',
    hover: 'hover:border-alert-400 hover:bg-alert-500/20',
  },
  muted: {
    ring: 'border-border',
    surface: 'bg-muted',
    chip: 'bg-muted text-muted-foreground',
    accent: 'bg-muted-foreground',
    text: 'text-muted-foreground',
    hover: 'hover:border-ring hover:bg-accent',
  },
};

export const zoneChip = (zone: 'FIZ' | 'FCZ' | 'BONDED' | 'FTZ' | 'ALL') =>
  zone === 'FIZ'    ? 'rounded-full bg-fiz/10 px-2 py-0.5 text-[10px] text-fiz' :
  zone === 'FCZ'    ? 'rounded-full bg-fcz/10 px-2 py-0.5 text-[10px] text-fcz' :
  zone === 'BONDED' ? 'rounded-full bg-signal-500/10 px-2 py-0.5 text-[10px] text-signal-600' :
  zone === 'FTZ'    ? 'rounded-full bg-clear-500/10 px-2 py-0.5 text-[10px] text-clear-600' :
                      'rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground';