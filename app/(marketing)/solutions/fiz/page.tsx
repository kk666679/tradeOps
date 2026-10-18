'use client';

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

/* ============================================================
   TYPES
============================================================ */
type ThemeMode = 'light' | 'dark' | 'system';

/* ============================================================
   GLOBAL STYLES
   (verbatim from original HTML — could be extracted to a .css
    module or global stylesheet if preferred)
============================================================ */
const globalStyles = `
  :root {
    --bg-page: #f8fafc;
    --bg-panel: #ffffff;
    --bg-alt: #f1f5f9;
    --bg-chip: rgba(15, 23, 42, 0.05);
    --bg-hover: rgba(15, 23, 42, 0.04);
    --bg-note: #eff6ff;
    --border-subtle: rgba(15, 23, 42, 0.08);
    --border-strong: rgba(15, 23, 42, 0.16);
    --border-note: #bfdbfe;
    --border-warn: #fde68a;
    --border-danger: #fecaca;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #64748b;
    --text-faint: #94a3b8;
    --accent: #7c3aed;
    --accent-soft: rgba(124, 58, 237, 0.1);
    --accent-text: #6d28d9;
    --accent-2: #0891b2;
    --accent-2-soft: rgba(8, 145, 178, 0.1);
    --accent-2-text: #0e7490;
    --success: #059669;
    --success-soft: rgba(5, 150, 105, 0.1);
    --warn: #d97706;
    --warn-soft: rgba(217, 119, 6, 0.1);
    --danger: #dc2626;
    --danger-soft: rgba(220, 38, 38, 0.08);
    --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);
    --shadow-md: 0 4px 12px -4px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.06);
    --shadow-lg: 0 20px 40px -16px rgba(15, 23, 42, 0.18), 0 4px 8px -4px rgba(15, 23, 42, 0.08);
    --shadow-xl: 0 40px 60px -24px rgba(15, 23, 42, 0.24);
    --hero-glow-a: rgba(124, 58, 237, 0.18);
    --hero-glow-b: rgba(8, 145, 178, 0.14);
  }

  .dark {
    --bg-page: #050505;
    --bg-panel: #0d0d10;
    --bg-alt: #09090c;
    --bg-chip: rgba(255, 255, 255, 0.07);
    --bg-hover: rgba(255, 255, 255, 0.05);
    --bg-note: rgba(37, 99, 235, 0.08);
    --border-subtle: rgba(255, 255, 255, 0.08);
    --border-strong: rgba(255, 255, 255, 0.16);
    --border-note: rgba(37, 99, 235, 0.3);
    --border-warn: rgba(217, 119, 6, 0.3);
    --border-danger: rgba(220, 38, 38, 0.3);
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
    --text-faint: #64748b;
    --accent: #a78bfa;
    --accent-soft: rgba(167, 139, 250, 0.14);
    --accent-text: #c4b5fd;
    --accent-2: #22d3ee;
    --accent-2-soft: rgba(34, 211, 238, 0.14);
    --accent-2-text: #67e8f9;
    --success: #34d399;
    --success-soft: rgba(52, 211, 153, 0.14);
    --warn: #fbbf24;
    --warn-soft: rgba(251, 191, 36, 0.14);
    --danger: #f87171;
    --danger-soft: rgba(248, 113, 113, 0.14);
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
    --shadow-md: 0 4px 12px -4px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 20px 40px -16px rgba(0, 0, 0, 0.8), 0 4px 8px -4px rgba(0, 0, 0, 0.4);
    --shadow-xl: 0 40px 60px -24px rgba(0, 0, 0, 1);
    --hero-glow-a: rgba(167, 139, 250, 0.22);
    --hero-glow-b: rgba(34, 211, 238, 0.18);
  }

  .theme-transitioning *, .theme-transitioning *::before, .theme-transitioning *::after {
    transition: background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease !important;
  }

  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  html { scroll-behavior: smooth; scroll-padding-top: 80px; }
  body {
    background: var(--bg-page);
    color: var(--text-primary);
    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    font-size: 15px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    transition: background-color .2s ease, color .2s ease;
  }

  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-variant-ligatures: none; }

  a { color: var(--accent-text); text-decoration: none; }
  a:hover { text-decoration: underline; }

  code:not(pre code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.86em;
    padding: .1rem .35rem;
    border-radius: .25rem;
    background: var(--bg-chip);
    border: 1px solid var(--border-subtle);
    color: var(--text-primary);
    white-space: nowrap;
  }

  /* HEADER */
  .site-header {
    position: fixed; top: 0; left: 0; right: 0; height: 60px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-subtle);
    display: flex; align-items: center; gap: 1rem;
    padding: 0 1.5rem; z-index: 50;
    transition: background-color .2s ease, border-color .2s ease;
  }
  .dark .site-header { background: rgba(5, 5, 5, 0.9); }

  .brand {
    display: flex; align-items: center; gap: .55rem;
    font-weight: 700; font-size: 14.5px; color: var(--text-primary);
    flex-shrink: 0; text-decoration: none;
  }
  .brand:hover { text-decoration: none; }
  .brand-icon {
    display: flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border-radius: .5rem;
    background: linear-gradient(135deg, #7c3aed, #0891b2);
    color: #fff; flex-shrink: 0;
  }
  .brand-divider { width: 1px; height: 22px; background: var(--border-subtle); margin: 0 .35rem; }
  .brand-badge {
    display: inline-block; font-family: ui-monospace, monospace;
    font-size: 10px; font-weight: 700; letter-spacing: .05em;
    padding: .12rem .4rem; border-radius: .3rem;
    background: var(--accent-soft); color: var(--accent-text); text-transform: uppercase;
  }

  .site-nav { display: flex; align-items: center; gap: 1.25rem; margin-left: 1.5rem; }
  .site-nav a {
    font-size: 13.5px; font-weight: 500; color: var(--text-secondary);
    text-decoration: none; transition: color .15s;
  }
  .site-nav a:hover { color: var(--text-primary); text-decoration: none; }

  .header-actions { display: flex; align-items: center; gap: .6rem; flex-shrink: 0; margin-left: auto; }

  .theme-toggle {
    display: flex; align-items: center; gap: .1rem;
    padding: .2rem; border-radius: 9999px; background: var(--bg-hover);
  }
  .theme-btn {
    display: flex; align-items: center; justify-content: center;
    width: 26px; height: 26px; border-radius: 9999px;
    color: var(--text-muted); background: transparent; border: none;
    cursor: pointer; transition: all .15s;
  }
  .theme-btn:hover { color: var(--text-primary); }
  .theme-btn.active { background: var(--bg-panel); color: var(--text-primary); box-shadow: var(--shadow-sm); }

  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: .4rem;
    height: 34px; padding: 0 .9rem; border-radius: .45rem;
    font-size: 13px; font-weight: 600;
    border: 1px solid transparent; background: transparent;
    color: var(--text-secondary); cursor: pointer;
    transition: all .15s ease; text-decoration: none; white-space: nowrap;
  }
  .btn:hover { text-decoration: none; }
  .btn-ghost { color: var(--text-secondary); border-color: transparent; }
  .btn-ghost:hover { background: var(--bg-hover); color: var(--text-primary); }
  .btn-primary { background: var(--text-primary); color: var(--bg-page); border-color: var(--text-primary); }
  .btn-primary:hover { background: var(--text-primary); color: var(--bg-page); filter: brightness(1.1); }
  .dark .btn-primary { background: #fff; color: #0a0a0a; border-color: #fff; }
  .dark .btn-primary:hover { filter: brightness(0.92); color: #0a0a0a; }

  .menu-btn {
    display: none; width: 34px; height: 34px;
    align-items: center; justify-content: center; border-radius: .4rem;
    background: transparent; border: 1px solid var(--border-subtle);
    color: var(--text-primary); cursor: pointer;
  }

  /* HERO */
  .hero {
    position: relative; overflow: hidden;
    padding: 140px 1.5rem 100px;
    border-bottom: 1px solid var(--border-subtle);
  }
  .hero-glow-a, .hero-glow-b {
    position: absolute; border-radius: 9999px; filter: blur(140px); pointer-events: none;
  }
  .hero-glow-a { top: -100px; left: 15%; width: 600px; height: 500px; background: var(--hero-glow-a); }
  .hero-glow-b { top: -60px; right: 12%; width: 500px; height: 450px; background: var(--hero-glow-b); }

  .hero-inner {
    position: relative; max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center;
  }
  @media (min-width: 900px) { .hero-inner { grid-template-columns: 1.15fr 1fr; } }

  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: .5rem;
    padding: .3rem .75rem .3rem .4rem; border-radius: 9999px;
    font-family: ui-monospace, monospace; font-size: 10.5px; font-weight: 600;
    letter-spacing: .08em; text-transform: uppercase;
    background: var(--bg-panel); border: 1px solid var(--border-subtle);
    color: var(--text-secondary); margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);
  }
  .hero-eyebrow-dot {
    display: inline-flex; align-items: center; justify-content: center;
    width: 20px; height: 20px; border-radius: 9999px;
    background: linear-gradient(135deg, #7c3aed, #0891b2);
    color: #fff; font-size: 9px; font-weight: 700;
  }
  .hero h1 {
    font-size: 2.75rem; font-weight: 800; letter-spacing: -.03em;
    line-height: 1.05; margin: 0 0 1.25rem; color: var(--text-primary);
  }
  @media (min-width: 768px) { .hero h1 { font-size: 3.5rem; } }
  @media (min-width: 1100px) { .hero h1 { font-size: 4rem; } }
  .hero h1 .gradient {
    background: linear-gradient(135deg, #7c3aed, #0891b2);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .dark .hero h1 .gradient {
    background: linear-gradient(135deg, #a78bfa, #22d3ee);
    -webkit-background-clip: text; background-clip: text;
  }
  .hero-lead {
    font-size: 1.08rem; line-height: 1.65; color: var(--text-secondary);
    margin: 0 0 2rem; max-width: 520px;
  }
  .hero-actions { display: flex; flex-wrap: wrap; gap: .75rem; }
  .hero-actions .btn { height: 44px; padding: 0 1.35rem; font-size: 14px; border-radius: .55rem; }
  .hero-actions .btn-primary { box-shadow: var(--shadow-md); }

  .hero-stats {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
    margin-top: 2.5rem; padding-top: 2rem;
    border-top: 1px solid var(--border-subtle); max-width: 480px;
  }
  .hero-stat-value {
    font-size: 1.5rem; font-weight: 800; letter-spacing: -.02em;
    color: var(--text-primary); line-height: 1;
  }
  .hero-stat-label {
    font-family: ui-monospace, monospace; font-size: 10.5px;
    letter-spacing: .05em; text-transform: uppercase;
    color: var(--text-muted); margin-top: .4rem;
  }

  .hero-visual { position: relative; aspect-ratio: 1 / 1; max-width: 480px; margin: 0 auto; }
  .fiz-canvas {
    position: relative; width: 100%; height: 100%; border-radius: 1.5rem;
    background: var(--bg-panel); border: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-xl); overflow: hidden;
  }
  .fiz-canvas-inner {
    position: absolute; inset: 0; padding: 1.5rem;
    display: grid; grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr; gap: .6rem;
  }
  .fiz-tile {
    border-radius: .65rem; padding: .7rem;
    display: flex; flex-direction: column; justify-content: space-between;
    background: var(--bg-alt); border: 1px solid var(--border-subtle);
    position: relative; overflow: hidden; transition: transform .2s;
  }
  .fiz-tile:hover { transform: translateY(-2px); }
  .fiz-tile.duty { background: var(--success-soft); border-color: transparent; }
  .fiz-tile.bonded { background: var(--accent-soft); border-color: transparent; }
  .fiz-tile.export { background: var(--accent-2-soft); border-color: transparent; }
  .fiz-tile-label {
    font-family: ui-monospace, monospace; font-size: 9px;
    letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted);
  }
  .fiz-tile-title {
    font-size: 12px; font-weight: 700; color: var(--text-primary);
    line-height: 1.25; margin-top: .25rem;
  }
  .fiz-tile-badge {
    display: inline-block; font-family: ui-monospace, monospace;
    font-size: 8.5px; font-weight: 700; letter-spacing: .04em;
    padding: .1rem .3rem; border-radius: .2rem;
    background: var(--bg-panel); color: var(--success);
    text-transform: uppercase; align-self: flex-start;
  }
  .fiz-tile.bonded .fiz-tile-badge { color: var(--accent-text); }
  .fiz-tile.export .fiz-tile-badge { color: var(--accent-2-text); }
  .fiz-border-line {
    position: absolute; inset: .75rem; border-radius: 1rem;
    border: 1.5px dashed var(--border-strong); pointer-events: none;
  }
  .fiz-label {
    position: absolute; top: .75rem; right: 1rem;
    font-family: ui-monospace, monospace; font-size: 9px;
    letter-spacing: .08em; text-transform: uppercase;
    color: var(--accent-text); background: var(--bg-panel);
    padding: .15rem .45rem; border-radius: .25rem;
    border: 1px solid var(--border-subtle); z-index: 2;
  }

  /* SECTIONS */
  .section { padding: 80px 1.5rem; border-bottom: 1px solid var(--border-subtle); }
  .section.alt { background: var(--bg-alt); }
  .section-inner { max-width: 1100px; margin: 0 auto; }
  .section-head { max-width: 720px; margin-bottom: 3rem; }
  .section-head.center { margin-left: auto; margin-right: auto; text-align: center; }
  .section-eyebrow {
    display: inline-flex; align-items: center; gap: .4rem;
    font-family: ui-monospace, monospace; font-size: 10.5px; font-weight: 600;
    letter-spacing: .08em; text-transform: uppercase;
    color: var(--accent-text); margin-bottom: .9rem;
  }
  .section-eyebrow::before {
    content: ""; width: 6px; height: 6px; border-radius: 9999px; background: var(--accent);
  }
  .section h2 {
    font-size: 2rem; font-weight: 800; letter-spacing: -.025em;
    line-height: 1.15; margin: 0 0 1rem; color: var(--text-primary);
  }
  @media (min-width: 768px) { .section h2 { font-size: 2.4rem; } }
  .section-lead {
    font-size: 1.05rem; line-height: 1.65; color: var(--text-secondary); margin: 0;
  }

  /* DEFINITION */
  .definition-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
  @media (min-width: 900px) { .definition-grid { grid-template-columns: 1.3fr 1fr; } }
  .definition-body p {
    color: var(--text-secondary); margin: 0 0 1rem; font-size: 1rem; line-height: 1.7;
  }
  .definition-body p:last-child { margin-bottom: 0; }
  .definition-card {
    padding: 1.5rem; border-radius: .9rem; background: var(--bg-panel);
    border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);
  }
  .definition-card-title {
    font-family: ui-monospace, monospace; font-size: 10.5px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted);
    margin-bottom: .9rem;
  }
  .legal-list { list-style: none; margin: 0; padding: 0; }
  .legal-list li {
    padding: .65rem 0; border-bottom: 1px solid var(--border-subtle);
    display: flex; gap: .75rem; align-items: flex-start;
    font-size: 13.5px; color: var(--text-secondary); line-height: 1.5;
  }
  .legal-list li:last-child { border-bottom: none; padding-bottom: 0; }
  .legal-list li:first-child { padding-top: 0; }
  .legal-list .num {
    flex-shrink: 0; font-family: ui-monospace, monospace;
    font-size: 11px; font-weight: 700; color: var(--accent-text); width: 20px;
  }
  .legal-list strong {
    color: var(--text-primary); font-weight: 600; display: block; margin-bottom: .1rem;
  }

  /* LOCATIONS */
  .locations-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 2rem; }
  @media (min-width: 640px) { .locations-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1000px) { .locations-grid { grid-template-columns: repeat(4, 1fr); } }
  .location-card {
    padding: 1.25rem; border-radius: .8rem; background: var(--bg-panel);
    border: 1px solid var(--border-subtle);
    transition: transform .2s, box-shadow .2s, border-color .2s;
  }
  .location-card:hover {
    transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: var(--border-strong);
  }
  .location-state {
    font-family: ui-monospace, monospace; font-size: 10px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted);
    margin-bottom: .35rem;
  }
  .location-name { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: .4rem; }
  .location-detail { font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; }

  /* BENEFITS */
  .benefits-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
  @media (min-width: 700px) { .benefits-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1000px) { .benefits-grid { grid-template-columns: repeat(3, 1fr); } }
  .benefit-card {
    padding: 1.5rem; border-radius: .9rem; background: var(--bg-panel);
    border: 1px solid var(--border-subtle);
    transition: transform .2s, box-shadow .2s;
    position: relative; overflow: hidden;
  }
  .benefit-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
  .benefit-card::before {
    content: ""; position: absolute; left: 0; top: 0; right: 0; height: 3px;
    background: var(--benefit-accent, var(--accent)); opacity: .85;
  }
  .benefit-icon {
    display: flex; align-items: center; justify-content: center;
    width: 44px; height: 44px; border-radius: .65rem; margin-bottom: 1.1rem;
    background: var(--benefit-soft, var(--accent-soft));
    color: var(--benefit-accent, var(--accent));
  }
  .benefit-title {
    font-size: 15px; font-weight: 700; color: var(--text-primary);
    margin: 0 0 .5rem; line-height: 1.35;
  }
  .benefit-desc { font-size: 13.5px; color: var(--text-secondary); line-height: 1.6; margin: 0; }
  .benefit-card.duty { --benefit-accent: var(--success); --benefit-soft: var(--success-soft); }
  .benefit-card.tax { --benefit-accent: var(--accent); --benefit-soft: var(--accent-soft); }
  .benefit-card.capital { --benefit-accent: var(--accent-2); --benefit-soft: var(--accent-2-soft); }
  .benefit-card.speed { --benefit-accent: var(--warn); --benefit-soft: var(--warn-soft); }

  /* LIFECYCLE */
  .lifecycle-wrap {
    background: var(--bg-panel); border: 1px solid var(--border-subtle);
    border-radius: 1.25rem; padding: 2rem; box-shadow: var(--shadow-lg); overflow: hidden;
  }
  .lifecycle-phases { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
  @media (min-width: 800px) { .lifecycle-phases { grid-template-columns: repeat(3, 1fr); gap: 1.25rem; } }
  .lifecycle-phase { position: relative; }
  .phase-head {
    display: flex; align-items: center; gap: .65rem; margin-bottom: 1.1rem;
    padding-bottom: .9rem; border-bottom: 1px solid var(--border-subtle);
  }
  .phase-num {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: .55rem;
    font-family: ui-monospace, monospace; font-size: 12px; font-weight: 800;
    background: var(--phase-soft, var(--accent-soft));
    color: var(--phase-accent, var(--accent-text)); flex-shrink: 0;
  }
  .phase-title { font-size: 13.5px; font-weight: 700; color: var(--text-primary); line-height: 1.3; }
  .phase-sub {
    font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: .05em;
    text-transform: uppercase; color: var(--text-muted); margin-top: .15rem;
  }
  .phase-steps { list-style: none; margin: 0; padding: 0; counter-reset: step; }
  .phase-steps li {
    position: relative; padding: .55rem 0 .55rem 1.35rem;
    font-size: 13px; color: var(--text-secondary); line-height: 1.5;
    border-left: 2px solid var(--border-subtle); margin-left: .35rem;
    counter-increment: step;
  }
  .phase-steps li::before {
    content: counter(step, decimal-leading-zero);
    position: absolute; left: -1.35rem; top: .55rem;
    font-family: ui-monospace, monospace; font-size: 9.5px; font-weight: 700;
    color: var(--text-faint); background: var(--bg-panel); padding: .15rem 0;
  }
  .phase-steps li:last-child { border-left-color: transparent; }
  .phase-steps strong { color: var(--text-primary); font-weight: 600; }
  .lifecycle-phase.inbound { --phase-accent: var(--success); --phase-soft: var(--success-soft); }
  .lifecycle-phase.production { --phase-accent: var(--accent); --phase-soft: var(--accent-soft); }
  .lifecycle-phase.outbound { --phase-accent: var(--accent-2); --phase-soft: var(--accent-2-soft); }

  /* COMPLIANCE */
  .compliance-table {
    width: 100%; border-collapse: collapse; font-size: 13.5px;
    background: var(--bg-panel); border-radius: .9rem; overflow: hidden;
    border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);
  }
  .compliance-table thead { background: var(--bg-alt); }
  .compliance-table th {
    text-align: left; font-family: ui-monospace, monospace;
    font-size: 10.5px; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; color: var(--text-muted);
    padding: .75rem 1rem; border-bottom: 1px solid var(--border-subtle);
  }
  .compliance-table td {
    padding: .9rem 1rem; border-bottom: 1px solid var(--border-subtle);
    color: var(--text-secondary); vertical-align: top; line-height: 1.55;
  }
  .compliance-table tr:last-child td { border-bottom: none; }
  .compliance-table .auth-name {
    font-weight: 700; color: var(--text-primary); font-size: 13.5px; margin-bottom: .1rem;
  }
  .compliance-table .auth-code {
    font-family: ui-monospace, monospace; font-size: 10.5px;
    color: var(--text-muted); letter-spacing: .03em;
  }
  .compliance-table .deadline {
    display: inline-block; font-family: ui-monospace, monospace;
    font-size: 10.5px; font-weight: 700; letter-spacing: .04em;
    padding: .12rem .4rem; border-radius: .25rem;
    background: var(--warn-soft); color: var(--warn);
    text-transform: uppercase; white-space: nowrap;
  }

  /* DOCUMENTS */
  .docs-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
  @media (min-width: 700px) { .docs-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1000px) { .docs-grid { grid-template-columns: repeat(3, 1fr); } }
  .doc-card {
    padding: 1.1rem 1.25rem; border-radius: .75rem;
    background: var(--bg-panel); border: 1px solid var(--border-subtle);
    transition: border-color .15s, box-shadow .15s;
    display: flex; gap: .85rem; align-items: flex-start;
  }
  .doc-card:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }
  .doc-icon {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: .5rem;
    background: var(--accent-soft); color: var(--accent-text); flex-shrink: 0;
  }
  .doc-content { flex: 1; min-width: 0; }
  .doc-key {
    font-family: ui-monospace, monospace; font-size: 10px; font-weight: 700;
    letter-spacing: .04em; color: var(--text-muted); text-transform: uppercase;
    margin-bottom: .2rem;
  }
  .doc-title { font-size: 13.5px; font-weight: 700; color: var(--text-primary); margin: 0 0 .25rem; line-height: 1.35; }
  .doc-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin: 0; }

  /* COMPARISON */
  .comparison-wrap {
    overflow-x: auto; border-radius: .9rem;
    border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);
  }
  .comparison {
    width: 100%; border-collapse: collapse; background: var(--bg-panel);
    font-size: 13.5px; min-width: 700px;
  }
  .comparison thead th {
    text-align: left; padding: .9rem 1rem;
    font-family: ui-monospace, monospace; font-size: 10.5px; font-weight: 700;
    letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted);
    background: var(--bg-alt); border-bottom: 1px solid var(--border-subtle);
  }
  .comparison thead th.fiz { color: var(--accent-text); background: var(--accent-soft); }
  .comparison tbody td {
    padding: .85rem 1rem; border-bottom: 1px solid var(--border-subtle);
    color: var(--text-secondary); vertical-align: top; line-height: 1.55;
  }
  .comparison tbody tr:last-child td { border-bottom: none; }
  .comparison tbody td:first-child { font-weight: 600; color: var(--text-primary); }
  .comparison tbody td.fiz-col {
    background: var(--accent-soft); color: var(--text-primary); font-weight: 500;
  }
  .comparison .yes { display: inline-flex; align-items: center; gap: .35rem; color: var(--success); font-weight: 600; }
  .comparison .no { display: inline-flex; align-items: center; gap: .35rem; color: var(--text-muted); }
  .comparison .partial { display: inline-flex; align-items: center; gap: .35rem; color: var(--warn); font-weight: 600; }

  /* CTA */
  .cta-section {
    padding: 100px 1.5rem; text-align: center;
    background: var(--bg-alt); border-bottom: 1px solid var(--border-subtle);
    position: relative; overflow: hidden;
  }
  .cta-section::before {
    content: ""; position: absolute; top: -100px; left: 50%;
    transform: translateX(-50%); width: 600px; height: 400px;
    background: var(--hero-glow-a); filter: blur(120px); pointer-events: none;
  }
  .cta-inner { position: relative; max-width: 640px; margin: 0 auto; }
  .cta-section h2 {
    font-size: 2.2rem; font-weight: 800; letter-spacing: -.025em;
    line-height: 1.15; margin: 0 0 1rem; color: var(--text-primary);
  }
  .cta-section p {
    font-size: 1.02rem; color: var(--text-secondary); line-height: 1.65; margin: 0 0 2rem;
  }
  .cta-actions { display: flex; flex-wrap: wrap; gap: .75rem; justify-content: center; }
  .cta-actions .btn { height: 44px; padding: 0 1.4rem; font-size: 14px; border-radius: .55rem; }

  /* FOOTER */
  .site-footer { padding: 3rem 1.5rem 2rem; background: var(--bg-panel); border-top: 1px solid var(--border-subtle); }
  .footer-inner {
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr; gap: 2rem;
  }
  @media (min-width: 700px) { .footer-inner { grid-template-columns: 2fr 1fr 1fr 1fr; } }
  .footer-brand {
    display: flex; align-items: center; gap: .55rem;
    font-weight: 700; font-size: 14.5px; color: var(--text-primary); margin-bottom: .75rem;
  }
  .footer-tagline { font-size: 13px; color: var(--text-muted); line-height: 1.6; max-width: 280px; margin: 0; }
  .footer-heading {
    font-family: ui-monospace, monospace; font-size: 10.5px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted);
    margin: 0 0 .85rem;
  }
  .footer-links { list-style: none; margin: 0; padding: 0; }
  .footer-links li { margin-bottom: .5rem; }
  .footer-links a { font-size: 13px; color: var(--text-secondary); text-decoration: none; transition: color .12s; }
  .footer-links a:hover { color: var(--text-primary); text-decoration: none; }
  .footer-bottom {
    max-width: 1100px; margin: 2rem auto 0; padding-top: 1.5rem;
    border-top: 1px solid var(--border-subtle);
    display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem;
    font-family: ui-monospace, monospace; font-size: 11px;
    letter-spacing: .03em; color: var(--text-faint);
  }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .site-nav { display: none; }
    .menu-btn { display: flex; }
    .hero { padding: 110px 1.25rem 70px; }
    .section { padding: 60px 1.25rem; }
    .cta-section { padding: 80px 1.25rem; }
    .hero h1 { font-size: 2.2rem; }
    .hero-stats { grid-template-columns: 1fr 1fr; max-width: none; }
  }
  @media (max-width: 500px) {
    .hero h1 { font-size: 1.9rem; }
    .hero-actions .btn { width: 100%; }
    .hero-stat-value { font-size: 1.25rem; }
    .section h2 { font-size: 1.65rem; }
    .cta-section h2 { font-size: 1.75rem; }
    .header-actions .btn-ghost { display: none; }
    .lifecycle-wrap { padding: 1.25rem; }
  }
`;

/* ============================================================
   SHARED ICONS
============================================================ */
function BrandIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* ============================================================
   HOOKS
============================================================ */
function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>('system');

  // Read stored preference on mount
  useEffect(() => {
    try {
      const stored = (localStorage.getItem('theme') as ThemeMode | null) ?? 'system';
      setModeState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  // Apply theme to <html> element, react to system changes
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const dark = mode === 'dark' || (mode === 'system' && mq.matches);
      root.classList.toggle('dark', dark);
    };

    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    setModeState(next);
    window.setTimeout(() => root.classList.remove('theme-transitioning'), 250);
  }, []);

  return { mode, setMode };
}

function useSmoothScroll() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      const el = document.querySelector(href);
      if (!el) return;

      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);
}

/* ============================================================
   HEADER
============================================================ */
type HeaderProps = {
  mode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
};

function SiteHeader({ mode, onThemeChange }: HeaderProps) {
  return (
    <header className="site-header">
      <a href="#" className="brand">
        <span className="brand-icon">
          <BrandIcon size={15} />
        </span>
        <span>TradeOps</span>
        <span className="brand-divider" />
        <span className="brand-badge">FIZ</span>
      </a>

      <nav className="site-nav">
        <a href="#what-is-fiz">What is a FIZ</a>
        <a href="#benefits">Benefits</a>
        <a href="#lifecycle">Lifecycle</a>
        <a href="#compliance">Compliance</a>
        <a href="#documents">Documents</a>
      </nav>

      <div className="header-actions">
        <div className="theme-toggle" role="group" aria-label="Theme">
          <button
            className={`theme-btn${mode === 'light' ? ' active' : ''}`}
            data-theme-option="light"
            title="Light"
            aria-pressed={mode === 'light'}
            onClick={() => onThemeChange('light')}
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" /><path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" /><path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </button>
          <button
            className={`theme-btn${mode === 'dark' ? ' active' : ''}`}
            data-theme-option="dark"
            title="Dark"
            aria-pressed={mode === 'dark'}
            onClick={() => onThemeChange('dark')}
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </button>
          <button
            className={`theme-btn${mode === 'system' ? ' active' : ''}`}
            data-theme-option="system"
            title="System"
            aria-pressed={mode === 'system'}
            onClick={() => onThemeChange('system')}
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="3" rx="2" />
              <path d="M8 21h8" /><path d="M12 17v4" />
            </svg>
          </button>
        </div>
        <a href="#" className="btn btn-ghost">Sign in</a>
        <a href="#cta" className="btn btn-primary">
          Get started
          <ArrowRight />
        </a>
        <button className="menu-btn" aria-label="Menu">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" />
          </svg>
        </button>
      </div>
    </header>
  );
}

/* ============================================================
   HERO
============================================================ */
function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow-a" />
      <div className="hero-glow-b" />

      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot">FIZ</span>
            Free Industrial Zone · Malaysia
          </div>

          <h1>
            Duty-suspended
            <br />
            manufacturing,
            <br />
            <span className="gradient">fully orchestrated.</span>
          </h1>

          <p className="hero-lead">
            A Free Industrial Zone lets you import raw materials, manufacture, and
            export finished goods without paying customs duty — as long as the
            goods never enter the domestic market. TradeOps runs the bonded
            ledger, statutory filings, and document trail end to end.
          </p>

          <div className="hero-actions">
            <a href="#lifecycle" className="btn btn-primary">
              See the FIZ lifecycle
              <ArrowRight />
            </a>
            <a href="#what-is-fiz" className="btn btn-ghost">
              What is a FIZ
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">0%</div>
              <div className="hero-stat-label">Import duty</div>
            </div>
            <div>
              <div className="hero-stat-value">10 yr</div>
              <div className="hero-stat-label">Tax holiday</div>
            </div>
            <div>
              <div className="hero-stat-value">6</div>
              <div className="hero-stat-label">Authorities</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="fiz-canvas">
            <div className="fiz-border-line" />
            <div className="fiz-label">FIZ BOUNDARY</div>
            <div className="fiz-canvas-inner">
              <div className="fiz-tile duty">
                <div>
                  <div className="fiz-tile-label">Inbound</div>
                  <div className="fiz-tile-title">Raw materials</div>
                </div>
                <div className="fiz-tile-badge">Duty 0%</div>
              </div>
              <div className="fiz-tile bonded">
                <div>
                  <div className="fiz-tile-label">Step 02</div>
                  <div className="fiz-tile-title">Bonded entry</div>
                </div>
                <div className="fiz-tile-badge">Suspended</div>
              </div>
              <div className="fiz-tile bonded">
                <div>
                  <div className="fiz-tile-label">Step 04</div>
                  <div className="fiz-tile-title">Bonded ledger</div>
                </div>
                <div className="fiz-tile-badge">Real-time</div>
              </div>
              <div className="fiz-tile">
                <div>
                  <div className="fiz-tile-label">Step 06</div>
                  <div className="fiz-tile-title">Manufacturing</div>
                </div>
                <div className="fiz-tile-badge" style={{ color: 'var(--text-muted)' }}>
                  Assembly
                </div>
              </div>
              <div className="fiz-tile">
                <div>
                  <div className="fiz-tile-label">Step 08</div>
                  <div className="fiz-tile-title">FG inspection</div>
                </div>
                <div className="fiz-tile-badge" style={{ color: 'var(--text-muted)' }}>
                  QA release
                </div>
              </div>
              <div className="fiz-tile export">
                <div>
                  <div className="fiz-tile-label">Step 11</div>
                  <div className="fiz-tile-title">Export clearance</div>
                </div>
                <div className="fiz-tile-badge">Duty exempt</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   WHAT IS A FIZ
============================================================ */
type Location = { state: string; name: string; detail: string };

const locations: Location[] = [
  { state: 'Penang', name: 'Bayan Lepas FIZ', detail: 'The oldest and largest FIZ in Malaysia. Electronics, semiconductors, and medical devices.' },
  { state: 'Johor', name: 'Pasir Gudang FIZ', detail: 'Port-linked industrial zone. Petrochemicals, logistics, and heavy manufacturing.' },
  { state: 'Johor', name: 'Senai FIZ', detail: 'Airport-linked. High-value components and electronics export.' },
  { state: 'Johor', name: 'Tanjung Pelepas FIZ', detail: 'Container port zone. Transshipment, distribution, and light manufacturing.' },
  { state: 'Kedah', name: 'Kulim FIZ', detail: 'Science park. Semiconductors, solar, and advanced manufacturing.' },
  { state: 'Selangor', name: 'Port Klang FIZ', detail: "Malaysia's largest port zone. Distribution and value-added logistics." },
  { state: 'Sarawak', name: 'Samalaju FIZ', detail: 'Energy-intensive industries. Aluminium, ferroalloys, and downstream processing.' },
  { state: 'Sabah', name: 'Kota Kinabalu FIZ', detail: 'Regional distribution and palm oil downstream processing.' },
];

function WhatIsFiz() {
  return (
    <section className="section" id="what-is-fiz">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-eyebrow">Definition</div>
          <h2>What is a Free Industrial Zone?</h2>
          <p className="section-lead">
            A FIZ is a legally designated industrial area where goods can be
            imported, stored, manufactured, and re-exported without customs duty,
            excise, or sales tax — as long as they stay inside the zone.
          </p>
        </div>

        <div className="definition-grid">
          <div className="definition-body">
            <p>
              Malaysia&apos;s Free Zones Act 1990 creates two kinds of zones:{' '}
              <strong>Free Industrial Zones (FIZ)</strong> for manufacturing, and{' '}
              <strong>Free Commercial Zones (FCZ)</strong> for trading and
              distribution. Both are treated as being outside the principal
              customs area for duty and tax purposes.
            </p>
            <p>
              When you bring raw materials into a FIZ, you file a bonded entry
              with the Royal Malaysian Customs Department (JKDM). Duty is{' '}
              <em>suspended</em> — not paid. The materials enter a bonded ledger,
              get issued to production, get transformed into finished goods, and
              are then either exported (duty stays zero) or released into the
              domestic market (duty becomes payable).
            </p>
            <p>
              The zone is a legal fiction with real consequences: customs
              considers goods inside the FIZ to be outside Malaysia for duty
              purposes, but inside Malaysia for manufacturing and labour law.
              That split is what makes a FIZ powerful — and what makes the
              compliance trail so demanding.
            </p>
            <p>
              TradeOps models the FIZ as a twelve-step lifecycle, each step tied
              to a specific document, system, and statutory authority. The bonded
              ledger is the spine — every material movement, every production
              order, every export declaration writes to it.
            </p>
          </div>

          <div className="definition-card">
            <div className="definition-card-title">Legal foundations</div>
            <ul className="legal-list">
              <li>
                <span className="num">01</span>
                <div>
                  <strong>Free Zones Act 1990</strong>
                  Establishes FIZs, FCZs, and the legal boundary between zone and
                  domestic market.
                </div>
              </li>
              <li>
                <span className="num">02</span>
                <div>
                  <strong>Customs Act 1967, s.14A</strong>
                  Provides for duty suspension on goods in a designated free zone.
                </div>
              </li>
              <li>
                <span className="num">03</span>
                <div>
                  <strong>Sales Tax Act 2018</strong>
                  Zero-rates sales tax on goods manufactured within a FIZ for export.
                </div>
              </li>
              <li>
                <span className="num">04</span>
                <div>
                  <strong>Income Tax Act 1967</strong>
                  Provides the statutory basis for FIZ tax exemptions and pioneer
                  status.
                </div>
              </li>
              <li>
                <span className="num">05</span>
                <div>
                  <strong>Employment Act 1955</strong>
                  Applies inside the FIZ — labour law and foreign worker rules are
                  fully in force.
                </div>
              </li>
            </ul>
          </div>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '3rem 0 1rem' }}>
          Malaysia&apos;s major FIZ locations
        </h3>

        <div className="locations-grid">
          {locations.map((loc) => (
            <div className="location-card" key={loc.name}>
              <div className="location-state">{loc.state}</div>
              <div className="location-name">{loc.name}</div>
              <div className="location-detail">{loc.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   BENEFITS
============================================================ */
type Benefit = {
  variant: 'duty' | 'tax' | 'capital' | 'speed';
  title: string;
  description: string;
  icon: ReactNode;
};

const benefits: Benefit[] = [
  {
    variant: 'duty',
    title: 'Duty suspension',
    description:
      'Raw materials enter duty-free. Instead of tying up 5–25% of inventory value in duty, that capital stays on your balance sheet while the goods are inside the zone.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    variant: 'tax',
    title: 'Tax incentives',
    description:
      'Qualified FIZ companies can access Pioneer Status, Investment Tax Allowance, or the Principal Hub scheme — reducing effective income tax from 24% to as low as 0–10% for a defined period.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v18H3z" />
        <path d="M9 9h6v6H9z" />
      </svg>
    ),
  },
  {
    variant: 'capital',
    title: 'Working capital release',
    description:
      'Finished goods inside the zone can be pledged for inventory financing. With TradeOps, the bonded ledger and RWA tokenization let you unlock cash against finished goods before they ship.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    variant: 'speed',
    title: 'Faster clearance',
    description:
      'FIZ goods clear through designated customs channels. Bonded entries are filed electronically, exams are prioritised, and release is typically measured in hours — not days.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    variant: 'tax',
    title: 'Foreign worker access',
    description:
      'FIZ manufacturers have priority access to foreign worker quotas through JTKSM and JIM. The compliance burden is real — PLKS, FOMEMA, SOCSO, EPF, and LHDN all apply — but the quota availability is higher.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    variant: 'capital',
    title: 'On-chain financing',
    description:
      'TradeOps mints an ERC-721 token against each finished goods batch, with provenance, quality, and custody attached. Global lenders can finance against the token without touching the physical inventory.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
];

function Benefits() {
  return (
    <section className="section alt" id="benefits">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-eyebrow">Why FIZ</div>
          <h2>The economics of a duty-suspended zone</h2>
          <p className="section-lead">
            A FIZ converts duty, tax, and cash-flow friction into working
            capital. These are the four levers that make it economically
            meaningful.
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((b, i) => (
            <div className={`benefit-card ${b.variant}`} key={`${b.title}-${i}`}>
              <div className="benefit-icon">{b.icon}</div>
              <h3 className="benefit-title">{b.title}</h3>
              <p className="benefit-desc">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   LIFECYCLE
============================================================ */
type Phase = {
  variant: 'inbound' | 'production' | 'outbound';
  num: string;
  title: string;
  sub: string;
  steps: Array<{ lead: string; rest: string }>;
};

const phases: Phase[] = [
  {
    variant: 'inbound',
    num: '01',
    title: 'Inbound',
    sub: 'Import to bonded stock',
    steps: [
      { lead: 'Purchase Order', rest: 'supplier confirmed, commercial invoice and packing list issued.' },
      { lead: 'Bonded Entry', rest: 'K1 declaration filed with JKDM. Duty suspended under s.14A.' },
      { lead: 'Quality Inspection', rest: 'physical receipt, bonded vs non-bonded segregation, incoming QC.' },
      { lead: 'Bonded Ledger', rest: 'every unit booked to the ledger with batch, quantity, and customs status.' },
    ],
  },
  {
    variant: 'production',
    num: '02',
    title: 'Production',
    sub: 'Transform inside the zone',
    steps: [
      { lead: 'Production Order', rest: 'work order opened, raw materials issued from bonded stock.' },
      { lead: 'Manufacturing', rest: 'assembly, machining, or blending. Scrap and yield recorded.' },
      { lead: 'Value-Added Ops', rest: 'testing, labelling, repacking, or kitting as permitted by JKDM.' },
      { lead: 'FG Inspection', rest: 'final QC. Batch certified and released to finished goods.' },
    ],
  },
  {
    variant: 'outbound',
    num: '03',
    title: 'Outbound',
    sub: 'Export or domestic release',
    steps: [
      { lead: 'RWA Tokenization', rest: 'optional. Mint an ERC-721 token against the batch for financing.' },
      { lead: 'FG Warehouse', rest: 'bonded storage inside the FIZ. Custody preserved.' },
      { lead: 'Export Clearance', rest: 'K2 declaration. Duty remains zero on export.' },
      { lead: 'Compliance Report', rest: 'full audit trail across all twelve steps, retained seven years.' },
    ],
  },
];

function Lifecycle() {
  return (
    <section className="section" id="lifecycle">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-eyebrow">Lifecycle</div>
          <h2>From raw material to export clearance</h2>
          <p className="section-lead">
            Twelve steps, three phases. Every step writes to the same bonded
            ledger, and every document is tied to a specific customs rule or
            statutory requirement.
          </p>
        </div>

        <div className="lifecycle-wrap">
          <div className="lifecycle-phases">
            {phases.map((phase) => (
              <div className={`lifecycle-phase ${phase.variant}`} key={phase.num}>
                <div className="phase-head">
                  <div className="phase-num">{phase.num}</div>
                  <div>
                    <div className="phase-title">{phase.title}</div>
                    <div className="phase-sub">{phase.sub}</div>
                  </div>
                </div>
                <ul className="phase-steps">
                  {phase.steps.map((s) => (
                    <li key={s.lead}>
                      <strong>{s.lead}</strong> — {s.rest}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   COMPLIANCE
============================================================ */
type Authority = {
  name: string;
  code: string;
  obligation: string;
  deadline: string;
  portal: string;
};

const authorities: Authority[] = [
  {
    name: 'JKDM',
    code: 'Royal Malaysian Customs',
    obligation:
      'Bonded entry (K1), bonded ledger reconciliation, export declaration (K2), monthly GPB return, stock audit.',
    deadline: 'Monthly',
    portal: 'MyGDX',
  },
  {
    name: 'JTKSM',
    code: 'Labour Department',
    obligation: 'Annual labour return, workplace compliance, foreign worker quota and permits.',
    deadline: '31 Jan',
    portal: 'JTKSM',
  },
  {
    name: 'JIM',
    code: 'Immigration Department',
    obligation: 'PLKS issuance and renewal per foreign worker, levy payment, security bond.',
    deadline: 'Per pass',
    portal: 'MyIMMs',
  },
  {
    name: 'LHDN',
    code: 'Inland Revenue Board',
    obligation: 'Monthly PCB / MTD submission, annual Form E, EA generation per employee.',
    deadline: '15th · 31 Mar',
    portal: 'e-PCB · e-Filing',
  },
  {
    name: 'KWSP',
    code: 'EPF',
    obligation: 'Monthly EPF contribution (employer 12–13%, employee 11%), Form A submission.',
    deadline: '15th',
    portal: 'i-Akaun',
  },
  {
    name: 'PERKESO',
    code: 'SOCSO',
    obligation: 'Monthly SOCSO and EIS contribution, Form 2 for new employees, benefit claims.',
    deadline: '15th',
    portal: 'PERKESO',
  },
  {
    name: 'FOMEMA',
    code: 'Foreign Worker Health',
    obligation: 'Annual medical screening per foreign worker. Failed screenings escalate.',
    deadline: 'Annual',
    portal: 'FOMEMA',
  },
];

function Compliance() {
  return (
    <section className="section alt" id="compliance">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-eyebrow">Compliance</div>
          <h2>Six authorities, one calendar</h2>
          <p className="section-lead">
            A FIZ manufacturer is simultaneously regulated by customs, labour,
            immigration, tax, retirement, and health authorities. Each has its
            own filings, deadlines, and portals.
          </p>
        </div>

        <div className="comparison-wrap">
          <table className="compliance-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Authority</th>
                <th style={{ width: '45%' }}>Obligation</th>
                <th style={{ width: '15%' }}>Deadline</th>
                <th style={{ width: '10%' }}>Portal</th>
              </tr>
            </thead>
            <tbody>
              {authorities.map((a) => (
                <tr key={a.name}>
                  <td>
                    <div className="auth-name">{a.name}</div>
                    <div className="auth-code">{a.code}</div>
                  </td>
                  <td>{a.obligation}</td>
                  <td>
                    <span className="deadline">{a.deadline}</span>
                  </td>
                  <td>{a.portal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   DOCUMENTS
============================================================ */
type Doc = {
  key: string;
  title: string;
  description: string;
  icon: ReactNode;
};

const docs: Doc[] = [
  {
    key: 'bonded_entry',
    title: 'Bonded Entry Declaration (K1)',
    description: 'Filed with JKDM to move raw materials into the FIZ under duty suspension.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      </svg>
    ),
  },
  {
    key: 'bonded_ledger',
    title: 'Bonded Stock Ledger',
    description: 'Real-time record of every movement — receipt, issue, scrap, return, export.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5V19A9 3 0 0 0 21 19V5" />
        <path d="M3 12A9 3 0 0 0 21 12" />
      </svg>
    ),
  },
  {
    key: 'production_order',
    title: 'Production Order',
    description: 'Work order with material issue from bonded stock. Deducts from the ledger automatically.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      </svg>
    ),
  },
  {
    key: 'fg_inspection',
    title: 'FG Inspection Certificate',
    description: 'Batch certification that releases finished goods to storage and enables tokenization.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    key: 'rwa_token',
    title: 'RWA Tokenization Certificate',
    description: 'ERC-721 mint record linking the physical batch to an on-chain asset for financing.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M12 22V12" />
        <path d="m3.3 7 8.7 5 8.7-5" />
      </svg>
    ),
  },
  {
    key: 'export_clearance',
    title: 'Export Declaration (K2)',
    description: 'Filed with JKDM on export. Preserves the duty exemption on finished goods.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </svg>
    ),
  },
  {
    key: 'epf_form_a',
    title: 'EPF Form A (KWSP)',
    description: 'Monthly EPF contribution return. Due 15th of the following month.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
  },
  {
    key: 'socso_form_2',
    title: 'SOCSO Form 2 (PERKESO)',
    description: 'Employee registration for SOCSO and EIS. Filed for every new hire.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      </svg>
    ),
  },
  {
    key: 'plks',
    title: 'PLKS — Temporary Employment Pass',
    description: 'Issued by JIM per foreign worker. Renewal is a per-pass compliance event.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
];

function Documents() {
  return (
    <section className="section" id="documents">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-eyebrow">Documents</div>
          <h2>The paperwork spine</h2>
          <p className="section-lead">
            A FIZ is only as strong as its audit trail. Every step in the
            lifecycle produces a document that a customs officer, auditor, or
            lender may ask for years later.
          </p>
        </div>

        <div className="docs-grid">
          {docs.map((d) => (
            <div className="doc-card" key={d.key}>
              <div className="doc-icon">{d.icon}</div>
              <div className="doc-content">
                <div className="doc-key">{d.key}</div>
                <div className="doc-title">{d.title}</div>
                <p className="doc-desc">{d.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   COMPARISON
============================================================ */
type ComparisonRow = {
  feature: string;
  fiz: ReactNode;
  warehouse: ReactNode;
  normal: ReactNode;
};

const comparisonRows: ComparisonRow[] = [
  {
    feature: 'Duty treatment',
    fiz: <span className="yes">Suspended</span>,
    warehouse: <span className="partial">Suspended</span>,
    normal: <span className="no">Payable at import</span>,
  },
  {
    feature: 'Manufacturing allowed',
    fiz: <span className="yes">Yes — primary purpose</span>,
    warehouse: <span className="partial">Limited value-added</span>,
    normal: <span className="yes">Yes — anywhere</span>,
  },
  {
    feature: 'Storage duration',
    fiz: <span className="yes">Unlimited</span>,
    warehouse: <span className="partial">24 months (extendable)</span>,
    normal: <span className="no">Not applicable</span>,
  },
  {
    feature: 'Tax incentives',
    fiz: <span className="yes">Pioneer · ITA · PH</span>,
    warehouse: <span className="partial">Limited</span>,
    normal: <span className="no">Standard rate</span>,
  },
  {
    feature: 'Foreign worker quota',
    fiz: <span className="yes">Priority access</span>,
    warehouse: <span className="partial">Case-by-case</span>,
    normal: <span className="no">Standard quota</span>,
  },
  {
    feature: 'Customs audit intensity',
    fiz: <span className="partial">High — ledger-driven</span>,
    warehouse: <span className="partial">Medium</span>,
    normal: <span className="no">Low</span>,
  },
  {
    feature: 'Domestic sale',
    fiz: <span className="partial">Duty triggered</span>,
    warehouse: <span className="partial">Duty triggered</span>,
    normal: <span className="yes">Already paid</span>,
  },
  {
    feature: 'Statutory authorities',
    fiz: <span className="partial">6+ (JKDM, JTKSM, JIM, LHDN, KWSP, PERKESO, FOMEMA)</span>,
    warehouse: <span className="partial">4+</span>,
    normal: <span className="no">Standard corporate</span>,
  },
];

function Comparison() {
  return (
    <section className="section alt">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-eyebrow">Comparison</div>
          <h2>FIZ vs bonded warehouse vs normal import</h2>
          <p className="section-lead">
            All three defer duty, but they differ in what you can do inside the
            boundary, how long you can stay, and how much compliance overhead
            you carry.
          </p>
        </div>

        <div className="comparison-wrap">
          <table className="comparison">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Feature</th>
                <th className="fiz" style={{ width: '24%' }}>FIZ</th>
                <th style={{ width: '24%' }}>Bonded Warehouse</th>
                <th style={{ width: '24%' }}>Normal Import</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature}>
                  <td>{row.feature}</td>
                  <td className="fiz-col">{row.fiz}</td>
                  <td>{row.warehouse}</td>
                  <td>{row.normal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p
          style={{
            marginTop: '1.5rem',
            fontSize: '12.5px',
            color: 'var(--text-muted)',
            fontFamily: 'ui-monospace, monospace',
            letterSpacing: '.02em',
          }}
        >
          Source: Free Zones Act 1990, Customs Act 1967, Sales Tax Act 2018,
          Income Tax Act 1967. Deadlines shown are statutory minimums.
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   CTA
============================================================ */
function CtaSection() {
  return (
    <section className="cta-section" id="cta">
      <div className="cta-inner">
        <h2>Run your FIZ on TradeOps.</h2>
        <p>
          The bonded ledger, statutory calendar, and document trail in one
          operational thread. Start with the twelve-step lifecycle template, or
          bring your own workflow.
        </p>
        <div className="cta-actions">
          <a href="#" className="btn btn-primary">
            Get started
            <ArrowRight />
          </a>
          <a href="#" className="btn btn-ghost">
            Talk to sales
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
============================================================ */
function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">
            <span className="brand-icon">
              <BrandIcon size={14} />
            </span>
            TradeOps
          </div>
          <p className="footer-tagline">
            Duty-suspended manufacturing, statutory compliance, and on-chain
            financing in one operational thread.
          </p>
        </div>

        <div>
          <h4 className="footer-heading">Product</h4>
          <ul className="footer-links">
            <li><a href="#">Workflow Studio</a></li>
            <li><a href="#">Document Library</a></li>
            <li><a href="#">API Reference</a></li>
            <li><a href="#">Webhooks</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Solutions</h4>
          <ul className="footer-links">
            <li><a href="#">Manufacturing</a></li>
            <li><a href="#">Customs Brokerage</a></li>
            <li><a href="#">Freight Brokerage</a></li>
            <li><a href="#">Statutory Compliance</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-links">
            <li><a href="#">About</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Legal</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 TradeOps Sdn Bhd · Co. No. 202301004821</span>
        <span>Made in Malaysia</span>
      </div>
    </footer>
  );
}

/* ============================================================
   PAGE
============================================================ */
export default function FreeIndustrialZonePage() {
  const { mode, setMode } = useTheme();
  useSmoothScroll();

  return (
    <>
      <style>{globalStyles}</style>
      <SiteHeader mode={mode} onThemeChange={setMode} />
      <main>
        <Hero />
        <WhatIsFiz />
        <Benefits />
        <Lifecycle />
        <Compliance />
        <Documents />
        <Comparison />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}