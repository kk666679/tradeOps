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
============================================================ */
const globalStyles = `
  :root {
    --bg-page: #f8fafc;
    --bg-panel: #ffffff;
    --bg-alt: #f1f5f9;
    --bg-chip: rgba(15, 23, 42, 0.05);
    --bg-hover: rgba(15, 23, 42, 0.04);

    --border-subtle: rgba(15, 23, 42, 0.08);
    --border-strong: rgba(15, 23, 42, 0.16);

    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #64748b;
    --text-faint: #94a3b8;

    --accent: #0891b2;
    --accent-soft: rgba(8, 145, 178, 0.1);
    --accent-text: #0e7490;
    --accent-2: #7c3aed;
    --accent-2-soft: rgba(124, 58, 237, 0.1);
    --accent-2-text: #6d28d9;
    --accent-3: #ea580c;
    --accent-3-soft: rgba(234, 88, 12, 0.1);
    --accent-3-text: #c2410c;

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

    --hero-glow-a: rgba(8, 145, 178, 0.18);
    --hero-glow-b: rgba(124, 58, 237, 0.14);
  }

  .dark {
    --bg-page: #050505;
    --bg-panel: #0d0d10;
    --bg-alt: #09090c;
    --bg-chip: rgba(255, 255, 255, 0.07);
    --bg-hover: rgba(255, 255, 255, 0.05);

    --border-subtle: rgba(255, 255, 255, 0.08);
    --border-strong: rgba(255, 255, 255, 0.16);

    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
    --text-faint: #64748b;

    --accent: #22d3ee;
    --accent-soft: rgba(34, 211, 238, 0.14);
    --accent-text: #67e8f9;
    --accent-2: #a78bfa;
    --accent-2-soft: rgba(167, 139, 250, 0.14);
    --accent-2-text: #c4b5fd;
    --accent-3: #fb923c;
    --accent-3-soft: rgba(251, 146, 60, 0.14);
    --accent-3-text: #fdba74;

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

    --hero-glow-a: rgba(34, 211, 238, 0.22);
    --hero-glow-b: rgba(167, 139, 250, 0.18);
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
    background: linear-gradient(135deg, #0891b2, #7c3aed);
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
    background: linear-gradient(135deg, #0891b2, #7c3aed);
    color: #fff; font-size: 9px; font-weight: 700;
  }
  .hero h1 {
    font-size: 2.75rem; font-weight: 800; letter-spacing: -.03em;
    line-height: 1.05; margin: 0 0 1.25rem; color: var(--text-primary);
  }
  @media (min-width: 768px) { .hero h1 { font-size: 3.5rem; } }
  @media (min-width: 1100px) { .hero h1 { font-size: 4rem; } }
  .hero h1 .gradient {
    background: linear-gradient(135deg, #0891b2, #7c3aed);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .dark .hero h1 .gradient {
    background: linear-gradient(135deg, #22d3ee, #a78bfa);
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
  .fcz-canvas {
    position: relative; width: 100%; height: 100%; border-radius: 1.5rem;
    background: var(--bg-panel); border: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-xl); overflow: hidden;
  }
  .fcz-canvas-inner {
    position: absolute; inset: 0; padding: 1.5rem;
    display: grid; grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr; gap: .6rem;
  }
  .fcz-tile {
    border-radius: .65rem; padding: .7rem;
    display: flex; flex-direction: column; justify-content: space-between;
    background: var(--bg-alt); border: 1px solid var(--border-subtle);
    position: relative; overflow: hidden; transition: transform .2s;
  }
  .fcz-tile:hover { transform: translateY(-2px); }
  .fcz-tile.inbound { background: var(--success-soft); border-color: transparent; }
  .fcz-tile.storage { background: var(--accent-soft); border-color: transparent; }
  .fcz-tile.outbound { background: var(--accent-2-soft); border-color: transparent; }
  .fcz-tile-label {
    font-family: ui-monospace, monospace; font-size: 9px;
    letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted);
  }
  .fcz-tile-title {
    font-size: 12px; font-weight: 700; color: var(--text-primary);
    line-height: 1.25; margin-top: .25rem;
  }
  .fcz-tile-badge {
    display: inline-block; font-family: ui-monospace, monospace;
    font-size: 8.5px; font-weight: 700; letter-spacing: .04em;
    padding: .1rem .3rem; border-radius: .2rem;
    background: var(--bg-panel); color: var(--success);
    text-transform: uppercase; align-self: flex-start;
  }
  .fcz-tile.storage .fcz-tile-badge { color: var(--accent-text); }
  .fcz-tile.outbound .fcz-tile-badge { color: var(--accent-2-text); }
  .fcz-border-line {
    position: absolute; inset: .75rem; border-radius: 1rem;
    border: 1.5px dashed var(--border-strong); pointer-events: none;
  }
  .fcz-label {
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

  /* CHOOSER */
  .chooser-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 2rem; }
  @media (min-width: 700px) { .chooser-grid { grid-template-columns: repeat(3, 1fr); } }
  .chooser-card {
    position: relative; padding: 1.5rem; border-radius: 1rem;
    background: var(--bg-panel); border: 1px solid var(--border-subtle);
    transition: transform .2s, box-shadow .2s, border-color .2s;
    overflow: hidden;
  }
  .chooser-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
  .chooser-card.featured {
    border-color: var(--accent);
    background: linear-gradient(180deg, var(--accent-soft), var(--bg-panel) 60%);
  }
  .chooser-card.featured::before {
    content: "RECOMMENDED";
    position: absolute; top: .75rem; right: .75rem;
    font-family: ui-monospace, monospace; font-size: 8.5px; font-weight: 800;
    letter-spacing: .08em; padding: .15rem .4rem; border-radius: .2rem;
    background: var(--accent); color: #fff;
  }
  .chooser-label {
    font-family: ui-monospace, monospace; font-size: 10px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted);
    margin-bottom: .5rem;
  }
  .chooser-title {
    font-size: 1.15rem; font-weight: 800; letter-spacing: -.01em;
    color: var(--text-primary); margin: 0 0 .5rem; line-height: 1.25;
  }
  .chooser-desc {
    font-size: 13px; color: var(--text-secondary); line-height: 1.55; margin: 0 0 1rem;
  }
  .chooser-tag {
    display: inline-block; font-family: ui-monospace, monospace;
    font-size: 10px; font-weight: 700; letter-spacing: .04em;
    padding: .15rem .45rem; border-radius: .25rem;
    background: var(--bg-chip); color: var(--text-secondary);
    text-transform: uppercase;
  }
  .chooser-card.fcz .chooser-tag { background: var(--accent-soft); color: var(--accent-text); }

  /* PERMITTED ACTIVITIES */
  .permitted-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; margin-top: 2rem; }
  @media (min-width: 800px) { .permitted-grid { grid-template-columns: 1fr 1fr; } }
  .permitted-col {
    padding: 1.5rem; border-radius: 1rem; background: var(--bg-panel);
    border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);
  }
  .permitted-head {
    display: flex; align-items: center; gap: .65rem;
    margin-bottom: 1.1rem; padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-subtle);
  }
  .permitted-icon {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: .5rem; flex-shrink: 0;
  }
  .permitted-col.yes .permitted-icon { background: var(--success-soft); color: var(--success); }
  .permitted-col.no .permitted-icon { background: var(--danger-soft); color: var(--danger); }
  .permitted-title { font-size: 14px; font-weight: 700; color: var(--text-primary); line-height: 1.3; }
  .permitted-sub {
    font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: .05em;
    text-transform: uppercase; color: var(--text-muted); margin-top: .15rem;
  }
  .permitted-list { list-style: none; margin: 0; padding: 0; }
  .permitted-list li {
    position: relative; padding: .55rem 0 .55rem 1.75rem;
    font-size: 13.5px; line-height: 1.55; color: var(--text-secondary);
    border-bottom: 1px solid var(--border-subtle);
  }
  .permitted-list li:last-child { border-bottom: none; }
  .permitted-list li::before {
    content: ""; position: absolute; left: .35rem; top: .85rem;
    width: 6px; height: 6px; border-radius: 9999px;
  }
  .permitted-col.yes .permitted-list li::before { background: var(--success); box-shadow: 0 0 0 3px var(--success-soft); }
  .permitted-col.no .permitted-list li::before { background: var(--danger); box-shadow: 0 0 0 3px var(--danger-soft); }
  .permitted-list strong { color: var(--text-primary); font-weight: 600; }

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
  .benefit-card.transship { --benefit-accent: var(--accent); --benefit-soft: var(--accent-soft); }
  .benefit-card.tax { --benefit-accent: var(--accent-2); --benefit-soft: var(--accent-2-soft); }
  .benefit-card.valueadd { --benefit-accent: var(--accent-3); --benefit-soft: var(--accent-3-soft); }

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
  .lifecycle-phase.storage { --phase-accent: var(--accent); --phase-soft: var(--accent-soft); }
  .lifecycle-phase.outbound { --phase-accent: var(--accent-2); --phase-soft: var(--accent-2-soft); }

  /* TABLES */
  .comparison-wrap {
    overflow-x: auto; border-radius: .9rem;
    border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);
  }
  .compliance-table {
    width: 100%; border-collapse: collapse; font-size: 13.5px;
    background: var(--bg-panel); min-width: 700px;
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

  /* COMPARISON TABLE */
  .comparison {
    width: 100%; border-collapse: collapse; background: var(--bg-panel);
    font-size: 13.5px; min-width: 720px;
  }
  .comparison thead th {
    text-align: left; padding: .9rem 1rem;
    font-family: ui-monospace, monospace; font-size: 10.5px; font-weight: 700;
    letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted);
    background: var(--bg-alt); border-bottom: 1px solid var(--border-subtle);
  }
  .comparison thead th.fcz { color: var(--accent-text); background: var(--accent-soft); }
  .comparison tbody td {
    padding: .85rem 1rem; border-bottom: 1px solid var(--border-subtle);
    color: var(--text-secondary); vertical-align: top; line-height: 1.55;
  }
  .comparison tbody tr:last-child td { border-bottom: none; }
  .comparison tbody td:first-child { font-weight: 600; color: var(--text-primary); }
  .comparison tbody td.fcz-col {
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

  useEffect(() => {
    try {
      const stored = (localStorage.getItem('theme') as ThemeMode | null) ?? 'system';
      setModeState(stored);
    } catch {
      /* ignore */
    }
  }, []);

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
        <span className="brand-badge">FCZ</span>
      </a>

      <nav className="site-nav">
        <a href="#what-is-fcz">What is an FCZ</a>
        <a href="#choose">FCZ or FIZ</a>
        <a href="#activities">Activities</a>
        <a href="#lifecycle">Lifecycle</a>
        <a href="#compliance">Compliance</a>
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
            <span className="hero-eyebrow-dot">FCZ</span>
            Free Commercial Zone · Malaysia
          </div>

          <h1>
            Distribution
            <br />
            without duty.
            <br />
            <span className="gradient">Transshipment without friction.</span>
          </h1>

          <p className="hero-lead">
            A Free Commercial Zone lets you import, store, re-pack, and re-export
            goods without paying customs duty — as long as they stay inside the
            zone. No manufacturing, but unlimited storage, fast transshipment,
            and a lighter compliance footprint than a FIZ.
          </p>

          <div className="hero-actions">
            <a href="#lifecycle" className="btn btn-primary">
              See the FCZ lifecycle
              <ArrowRight />
            </a>
            <a href="#choose" className="btn btn-ghost">
              FCZ or FIZ?
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">0%</div>
              <div className="hero-stat-label">Duty in zone</div>
            </div>
            <div>
              <div className="hero-stat-value">∞</div>
              <div className="hero-stat-label">Storage limit</div>
            </div>
            <div>
              <div className="hero-stat-value">ZB1</div>
              <div className="hero-stat-label">Customs form</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="fcz-canvas">
            <div className="fcz-border-line" />
            <div className="fcz-label">FCZ BOUNDARY</div>
            <div className="fcz-canvas-inner">
              <div className="fcz-tile inbound">
                <div>
                  <div className="fcz-tile-label">Inbound</div>
                  <div className="fcz-tile-title">Vessel discharge</div>
                </div>
                <div className="fcz-tile-badge">Duty 0%</div>
              </div>
              <div className="fcz-tile inbound">
                <div>
                  <div className="fcz-tile-label">Step 02</div>
                  <div className="fcz-tile-title">ZB1 declaration</div>
                </div>
                <div className="fcz-tile-badge">Inbound</div>
              </div>
              <div className="fcz-tile storage">
                <div>
                  <div className="fcz-tile-label">Step 05</div>
                  <div className="fcz-tile-title">Bonded inventory</div>
                </div>
                <div className="fcz-tile-badge">Unlimited</div>
              </div>
              <div className="fcz-tile storage">
                <div>
                  <div className="fcz-tile-label">Step 06</div>
                  <div className="fcz-tile-title">Repack · relabel</div>
                </div>
                <div className="fcz-tile-badge">Permitted</div>
              </div>
              <div className="fcz-tile outbound">
                <div>
                  <div className="fcz-tile-label">Step 08</div>
                  <div className="fcz-tile-title">ZB2 declaration</div>
                </div>
                <div className="fcz-tile-badge">Outbound</div>
              </div>
              <div className="fcz-tile outbound">
                <div>
                  <div className="fcz-tile-label">Step 09</div>
                  <div className="fcz-tile-title">Transship / export</div>
                </div>
                <div className="fcz-tile-badge">Duty 0%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   WHAT IS AN FCZ
============================================================ */
type Location = { state: string; name: string; detail: string };

const locations: Location[] = [
  { state: 'Selangor', name: 'Port Klang Free Zone (PKFZ)', detail: "Malaysia's largest FCZ. Regional distribution, transshipment, and value-added logistics on a 1,000-acre site." },
  { state: 'Penang', name: 'Butterworth Free Zone', detail: 'Port-linked zone on the mainland. Distribution and transshipment for northern Malaysia and southern Thailand.' },
  { state: 'Johor', name: 'Pasir Gudang Free Zone', detail: 'Deep-water port zone. Chemical, petrochemical, and bulk transshipment operations.' },
  { state: 'Johor', name: 'Tanjung Pelepas Free Zone', detail: 'One of the busiest container ports in the region. Transshipment and distribution for global carriers.' },
  { state: 'Selangor', name: 'KLIA Free Zone', detail: 'Air cargo and e-commerce fulfilment. High-value, time-sensitive distribution.' },
  { state: 'Johor', name: 'Senai Airport Free Zone', detail: 'Airport-linked logistics for electronics and aerospace components.' },
  { state: 'Sabah', name: 'Kota Kinabalu Industrial Park', detail: 'Regional distribution hub for East Malaysia and BIMP-EAGA trade.' },
  { state: 'Sarawak', name: 'Sama Jaya Free Zone', detail: 'High-tech distribution and value-added logistics for the Sarawak corridor.' },
];

function WhatIsFcz() {
  return (
    <section className="section" id="what-is-fcz">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-eyebrow">Definition</div>
          <h2>What is a Free Commercial Zone?</h2>
          <p className="section-lead">
            A Free Commercial Zone is a designated area for trading,
            distribution, transshipment, and value-added logistics — not
            manufacturing. Goods enter duty-free, can be stored indefinitely,
            and are re-exported or released to the domestic market on demand.
          </p>
        </div>

        <div className="definition-grid">
          <div className="definition-body">
            <p>
              Malaysia&apos;s Free Zones Act 1990 creates two kinds of zones.{' '}
              <strong>Free Industrial Zones (FIZ)</strong> are for manufacturing.{' '}
              <strong>Free Commercial Zones (FCZ)</strong> are for everything
              else in the trade flow: storage, distribution, consolidation,
              transshipment, break-bulk, repacking, re-labelling, grading, and
              sorting.
            </p>
            <p>
              The legal boundary is the same as a FIZ — goods inside the FCZ are
              treated as being outside the principal customs area for duty and
              sales tax purposes. But the operational boundary is different. An
              FCZ is designed for the movement and handling of goods, not their
              transformation. You can repack a pallet. You cannot turn aluminium
              into a housing.
            </p>
            <p>
              This makes the FCZ the natural home for regional distribution
              centres, e-commerce fulfilment hubs, and transshipment operations.
              A container leaving Shanghai can be discharged at Port Klang,
              moved into the FCZ, unpacked, re-packed for three different
              Southeast Asian markets, and re-exported — all without triggering
              duty.
            </p>
            <p>
              TradeOps models the FCZ as a ten-step lifecycle across three
              phases — inbound, storage, outbound. The customs declarations are
              different from a FIZ (ZB1 and ZB2 instead of K1 and bonded entry),
              the statutory burden is lighter, and the document trail is centred
              on the transshipment manifest and delivery order.
            </p>
          </div>

          <div className="definition-card">
            <div className="definition-card-title">Legal foundations</div>
            <ul className="legal-list">
              <li>
                <span className="num">01</span>
                <div>
                  <strong>Free Zones Act 1990</strong>
                  Establishes FCZs and the legal boundary between zone and
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
                  <strong>Customs Regulations 2019</strong>
                  Governs ZB1 (goods in) and ZB2 (goods out) declarations for FCZ
                  operations.
                </div>
              </li>
              <li>
                <span className="num">04</span>
                <div>
                  <strong>Sales Tax Act 2018</strong>
                  Zero-rates sales tax on goods handled within an FCZ for export.
                </div>
              </li>
              <li>
                <span className="num">05</span>
                <div>
                  <strong>Income Tax (Exemption) Orders</strong>
                  Provide Investment Tax Exemption (ITE) and other incentives for
                  FCZ operators.
                </div>
              </li>
              <li>
                <span className="num">06</span>
                <div>
                  <strong>MITI FCZ Guidelines</strong>
                  Governs FCZ operator licensing, permitted activities, and
                  annual reporting.
                </div>
              </li>
            </ul>
          </div>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '3rem 0 1rem' }}>
          Malaysia&apos;s major FCZ locations
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
   CHOOSER
============================================================ */
function Chooser() {
  return (
    <section className="section alt" id="choose">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-eyebrow">Choose your zone</div>
          <h2>FCZ or FIZ or bonded warehouse?</h2>
          <p className="section-lead">
            All three defer duty. The right choice depends on what you actually
            do with the goods inside the boundary.
          </p>
        </div>

        <div className="chooser-grid">
          <div className="chooser-card fcz featured">
            <div className="chooser-label">You move things</div>
            <h3 className="chooser-title">Free Commercial Zone</h3>
            <p className="chooser-desc">
              You receive goods, store them, repack, relabel, consolidate, and
              re-export or distribute. No transformation of the product itself.
            </p>
            <span className="chooser-tag">Distribution · transshipment</span>
          </div>

          <div className="chooser-card">
            <div className="chooser-label">You make things</div>
            <h3 className="chooser-title">Free Industrial Zone</h3>
            <p className="chooser-desc">
              You import raw materials, transform them into finished goods, and
              export or release to the domestic market. Manufacturing is the
              point.
            </p>
            <span className="chooser-tag">Manufacturing · assembly</span>
          </div>

          <div className="chooser-card">
            <div className="chooser-label">You store things</div>
            <h3 className="chooser-title">Bonded Warehouse</h3>
            <p className="chooser-desc">
              You hold goods under bond for a defined period before they enter
              the domestic market or are re-exported. Limited value-added
              operations.
            </p>
            <span className="chooser-tag">Storage · deferral</span>
          </div>
        </div>

        <div
          style={{
            marginTop: '2rem',
            padding: '1.25rem 1.5rem',
            borderRadius: '.8rem',
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Rule of thumb.</strong>{' '}
            If the value you add comes from <em>moving</em> goods, you want an
            FCZ. If it comes from <em>transforming</em> goods, you want a FIZ. If
            it comes from <em>holding</em> goods, you want a bonded warehouse.
            The three are often adjacent — PKFZ and Port Klang&apos;s bonded
            warehouses sit inside the same port complex.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ACTIVITIES
============================================================ */
type ActivityItem = { lead: string; rest: string };

const permittedActivities: ActivityItem[] = [
  { lead: 'Storage and warehousing', rest: 'unlimited duration, ambient or temperature-controlled.' },
  { lead: 'Distribution and consolidation', rest: 'order picking, packing, and dispatch.' },
  { lead: 'Transshipment', rest: 'direct or indirect, from one vessel or aircraft to another.' },
  { lead: 'Break-bulk and deconsolidation', rest: 'unpacking containers into smaller shipments.' },
  { lead: 'Repacking and re-labelling', rest: 'new packaging, market-specific labels, language variants.' },
  { lead: 'Grading and sorting', rest: 'quality, size, colour, or other classification.' },
  { lead: 'Kitting and light assembly', rest: 'bundling goods with accessories, as long as essential character is preserved.' },
  { lead: 'Inspection and testing', rest: 'QC, sampling, and conformity checks before release.' },
];

const prohibitedActivities: ActivityItem[] = [
  { lead: 'Full manufacturing', rest: 'transforming raw materials into a new product with a different HS code. This requires a FIZ or a licensed manufacturing warehouse (LMW).' },
  { lead: 'Processing raw materials', rest: 'smelting, refining, chemical synthesis, or any operation that changes the essential character.' },
  { lead: 'Mixing and blending', rest: 'creating a new product by combining ingredients. Repacking pre-blended goods is permitted; blending itself is not.' },
  { lead: 'Machine assembly from components', rest: 'assembling a finished machine from parts that arrive separately. Requires an FIZ or LMW.' },
  { lead: 'Fabrication and machining', rest: 'cutting, welding, moulding, or forming from raw stock.' },
  { lead: 'Any operation that changes the HS code', rest: 'even if the process is otherwise simple, a tariff shift is the test.' },
];

function Activities() {
  return (
    <section className="section" id="activities">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-eyebrow">Activities</div>
          <h2>What you can and cannot do inside an FCZ</h2>
          <p className="section-lead">
            The FCZ boundary is the dividing line between distribution and
            manufacturing. These are the permitted and prohibited operations
            under the Free Zones Act 1990 and MITI guidelines.
          </p>
        </div>

        <div className="permitted-grid">
          <div className="permitted-col yes">
            <div className="permitted-head">
              <div className="permitted-icon">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div>
                <div className="permitted-title">Permitted</div>
                <div className="permitted-sub">Trade &amp; logistics</div>
              </div>
            </div>
            <ul className="permitted-list">
              {permittedActivities.map((a) => (
                <li key={a.lead}>
                  <strong>{a.lead}</strong> — {a.rest}
                </li>
              ))}
            </ul>
          </div>

          <div className="permitted-col no">
            <div className="permitted-head">
              <div className="permitted-icon">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </div>
              <div>
                <div className="permitted-title">Not permitted</div>
                <div className="permitted-sub">Manufacturing</div>
              </div>
            </div>
            <ul className="permitted-list">
              {prohibitedActivities.map((a) => (
                <li key={a.lead}>
                  <strong>{a.lead}</strong> — {a.rest}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem 1.25rem',
            borderRadius: '.65rem',
            background: 'var(--warn-soft)',
            border: '1px solid rgba(217, 119, 6, 0.25)',
            display: 'flex',
            gap: '.75rem',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: '.3rem',
              background: 'var(--warn)',
              color: '#fff',
              marginTop: '.1rem',
            }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </svg>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            <strong style={{ color: 'var(--text-primary)' }}>The HS code test.</strong>{' '}
            If your operation changes the 6-digit HS code of the goods, customs
            will treat it as manufacturing — and manufacturing is not permitted
            inside an FCZ. When in doubt, ask JKDM for a classification ruling
            before you start operations.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   BENEFITS
============================================================ */
type Benefit = {
  variant: 'duty' | 'transship' | 'tax' | 'valueadd';
  title: string;
  description: string;
  icon: ReactNode;
};

const benefits: Benefit[] = [
  {
    variant: 'duty',
    title: 'Duty suspension',
    description:
      'Goods enter duty-free and stay duty-free until they leave the zone for the domestic market. For a distribution business moving thousands of SKUs, this is the single biggest cash-flow lever.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    variant: 'transship',
    title: 'Transshipment without entry',
    description:
      'Goods can move from one vessel to another, or from vessel to aircraft, without filing a full customs entry. For transshipment-heavy ports like PTP and PKFZ, this is the operational advantage.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 2l4 4-4 4" />
        <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
        <path d="M7 22l-4-4 4-4" />
        <path d="M21 13v1a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    variant: 'tax',
    title: 'Tax incentives',
    description:
      'Qualified FCZ operators can access Investment Tax Exemption (ITE), stamp duty exemption on property, and reduced withholding tax on interest. Applications go through MIDA.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v18H3z" />
        <path d="M9 9h6v6H9z" />
      </svg>
    ),
  },
  {
    variant: 'valueadd',
    title: 'Value-added operations',
    description:
      'Repack, relabel, grade, sort, kit, and consolidate — all duty-free. An FCZ lets you localise packaging for different markets without setting up a factory.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    variant: 'transship',
    title: 'Unlimited storage',
    description:
      'Unlike a bonded warehouse, which requires periodic renewal, an FCZ allows goods to remain in the zone indefinitely. This is ideal for slow-moving SKUs and seasonal buffers.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    variant: 'duty',
    title: 'Lighter statutory burden',
    description:
      'No foreign worker quota, no PLKS, no FOMEMA, no JTKSM labour return. FCZ operators deal primarily with JKDM, MITI, and standard corporate authorities — not the full FIZ compliance stack.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M3 10h18" />
        <path d="M5 6l7-3 7 3" />
        <path d="M4 10v11" />
        <path d="M20 10v11" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
      </svg>
    ),
  },
];

function Benefits() {
  return (
    <section className="section alt" id="benefits">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-eyebrow">Why FCZ</div>
          <h2>The economics of a distribution zone</h2>
          <p className="section-lead">
            An FCZ converts duty, storage limits, and transshipment friction into
            speed and working capital. These are the four levers that matter.
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
  variant: 'inbound' | 'storage' | 'outbound';
  num: string;
  title: string;
  sub: string;
  steps: ActivityItem[];
};

const phases: Phase[] = [
  {
    variant: 'inbound',
    num: '01',
    title: 'Inbound',
    sub: 'Vessel to zone',
    steps: [
      { lead: 'Shipping Instruction', rest: 'booking confirmed with carrier, manifest and B/L issued.' },
      { lead: 'Vessel Arrival', rest: 'container discharged at the FCZ-adjacent port.' },
      { lead: 'ZB1 Declaration', rest: 'goods brought into the FCZ under duty suspension.' },
      { lead: 'Receiving', rest: 'deconsolidation, inspection, and storage booking.' },
    ],
  },
  {
    variant: 'storage',
    num: '02',
    title: 'Storage',
    sub: 'Inside the zone',
    steps: [
      { lead: 'Bonded Inventory', rest: 'every pallet and carton tracked in the bonded ledger. No time limit.' },
      { lead: 'Value-Added Ops', rest: 'repacking, relabelling, grading, sorting, kitting as needed.' },
      { lead: 'Order Consolidation', rest: 'pick and pack against customer orders or transshipment instructions.' },
    ],
  },
  {
    variant: 'outbound',
    num: '03',
    title: 'Outbound',
    sub: 'Zone to market',
    steps: [
      { lead: 'ZB2 Declaration', rest: 'goods removed from the FCZ. Triggers duty if released domestically.' },
      { lead: 'Transship / Export', rest: 're-export, transshipment, or domestic release via K1.' },
      { lead: 'Compliance Return', rest: 'monthly stock return to JKDM, full audit trail.' },
    ],
  },
];

function Lifecycle() {
  return (
    <section className="section" id="lifecycle">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-eyebrow">Lifecycle</div>
          <h2>From vessel discharge to transshipment</h2>
          <p className="section-lead">
            Ten steps, three phases. The FCZ lifecycle is shorter than the FIZ
            because there is no production to track — but the transshipment and
            consolidation logic is more complex.
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
      'ZB1 (goods in), ZB2 (goods out), K1 (domestic release), K2 (export), K9 (transshipment), monthly stock return, annual audit.',
    deadline: 'Monthly',
    portal: 'MyGDX',
  },
  {
    name: 'MITI',
    code: 'Ministry of Investment, Trade & Industry',
    obligation:
      'FCZ operator licence, permitted activities declaration, annual compliance report.',
    deadline: 'Annual',
    portal: 'MITI',
  },
  {
    name: 'MIDA',
    code: 'Malaysian Investment Development Authority',
    obligation:
      'Investment Tax Exemption (ITE) application and annual reporting. Stamp duty exemption on property.',
    deadline: 'Annual',
    portal: 'MIDA',
  },
  {
    name: 'Local Council',
    code: 'PBT / MBPJ / MBSA',
    obligation: 'Business premises licence, fire safety certificate, annual renewal.',
    deadline: 'Annual',
    portal: 'Council portal',
  },
  {
    name: 'LHDN',
    code: 'Inland Revenue Board',
    obligation:
      'Corporate tax filing, PCB for employees (if any), Form E for FCZ operator staff.',
    deadline: '15th · 31 Mar',
    portal: 'e-PCB · e-Filing',
  },
  {
    name: 'KWSP / PERKESO',
    code: 'EPF · SOCSO',
    obligation:
      'Standard employment contributions for any Malaysian or foreign staff employed at the FCZ.',
    deadline: '15th',
    portal: 'i-Akaun · PERKESO',
  },
];

function Compliance() {
  return (
    <section className="section alt" id="compliance">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-eyebrow">Compliance</div>
          <h2>A lighter calendar than a FIZ</h2>
          <p className="section-lead">
            FCZ operators deal primarily with customs and trade authorities. The
            heavy labour, immigration, and health compliance that dominates a FIZ
            does not apply unless you employ foreign workers.
          </p>
        </div>

        <div className="comparison-wrap">
          <table className="compliance-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Authority</th>
                <th style={{ width: '44%' }}>Obligation</th>
                <th style={{ width: '16%' }}>Deadline</th>
                <th style={{ width: '12%' }}>Portal</th>
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

        <p
          style={{
            marginTop: '1.5rem',
            fontSize: '12.5px',
            color: 'var(--text-muted)',
            fontFamily: 'ui-monospace, monospace',
            letterSpacing: '.02em',
          }}
        >
          Note: FCZ operators do not typically deal with JTKSM, JIM (PLKS), or
          FOMEMA unless they hire foreign workers directly. Distribution centre
          staff are usually Malaysian.
        </p>
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
    key: 'zb1_declaration',
    title: 'ZB1 Declaration',
    description: 'Customs declaration for goods brought into the FCZ. Duty suspended on entry.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      </svg>
    ),
  },
  {
    key: 'zb2_declaration',
    title: 'ZB2 Declaration',
    description: 'Customs declaration for goods removed from the FCZ. Triggers duty if released domestically.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      </svg>
    ),
  },
  {
    key: 'k9_transshipment',
    title: 'K9 Transshipment Declaration',
    description: 'Customs declaration for direct or indirect transshipment. No full entry required.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20" />
        <path d="M12 2v20" />
      </svg>
    ),
  },
  {
    key: 'k1_import',
    title: 'K1 Import Declaration',
    description: 'Customs declaration for release into the domestic market. Duty becomes payable.',
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
    key: 'k2_export',
    title: 'K2 Export Declaration',
    description: 'Customs declaration for re-export from the FCZ. Duty remains zero.',
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
    key: 'delivery_order',
    title: 'Delivery Order',
    description: 'Authorises release of goods from the FCZ to the consignee or carrier.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V9" />
      </svg>
    ),
  },
  {
    key: 'gate_pass',
    title: 'Gate Pass',
    description: 'Physical movement record for containers or trucks entering or leaving the FCZ.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    key: 'stock_return',
    title: 'Monthly Stock Return',
    description: 'Reconciliation of every unit in the FCZ against the bonded ledger. Filed with JKDM monthly.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5V19A9 3 0 0 0 21 19V5" />
        <path d="M3 12A9 3 0 0 0 21 12" />
      </svg>
    ),
  },
  {
    key: 'transship_manifest',
    title: 'Transshipment Manifest',
    description: 'Consolidated list of cargo moving from one vessel or aircraft to another inside the FCZ.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
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
          <h2>The FCZ document set</h2>
          <p className="section-lead">
            The FCZ declaration forms are different from a FIZ. ZB1 and ZB2
            replace the bonded entry, and the transshipment manifest replaces
            the production order as the operational spine.
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
  fcz: ReactNode;
  fiz: ReactNode;
  warehouse: ReactNode;
};

const comparisonRows: ComparisonRow[] = [
  {
    feature: 'Duty treatment',
    fcz: <span className="yes">Suspended</span>,
    fiz: <span className="yes">Suspended</span>,
    warehouse: <span className="partial">Suspended</span>,
  },
  {
    feature: 'Manufacturing',
    fcz: <span className="no">Not allowed</span>,
    fiz: <span className="yes">Primary purpose</span>,
    warehouse: <span className="no">Not allowed</span>,
  },
  {
    feature: 'Storage duration',
    fcz: <span className="yes">Unlimited</span>,
    fiz: <span className="yes">Unlimited</span>,
    warehouse: <span className="partial">24 months (extendable)</span>,
  },
  {
    feature: 'Value-added operations',
    fcz: <span className="yes">Repack · relabel · grade · sort</span>,
    fiz: <span className="yes">Full manufacturing</span>,
    warehouse: <span className="partial">Limited</span>,
  },
  {
    feature: 'Transshipment',
    fcz: <span className="yes">Core function</span>,
    fiz: <span className="partial">Limited</span>,
    warehouse: <span className="no">Not primary</span>,
  },
  {
    feature: 'Customs code',
    fcz: <span className="yes">ZB1 · ZB2 · K9</span>,
    fiz: <span className="partial">K1 · bonded entry</span>,
    warehouse: <span className="partial">GPB</span>,
  },
  {
    feature: 'Tax incentives',
    fcz: <span className="yes">ITE · stamp duty</span>,
    fiz: <span className="yes">Pioneer · ITA · PH</span>,
    warehouse: <span className="partial">Limited</span>,
  },
  {
    feature: 'Foreign worker quota',
    fcz: <span className="no">Not priority</span>,
    fiz: <span className="yes">Priority access</span>,
    warehouse: <span className="no">Standard quota</span>,
  },
  {
    feature: 'Compliance footprint',
    fcz: <span className="yes">Light — JKDM · MITI · MIDA</span>,
    fiz: <span className="partial">Heavy — 6+ authorities</span>,
    warehouse: <span className="partial">Medium</span>,
  },
  {
    feature: 'Typical resident',
    fcz: <span className="yes">3PL · distributor · e-commerce</span>,
    fiz: <span className="partial">Manufacturer</span>,
    warehouse: <span className="partial">Importer · trader</span>,
  },
];

function Comparison() {
  return (
    <section className="section alt">
      <div className="section-inner">
        <div className="section-head">
          <div className="section-eyebrow">Comparison</div>
          <h2>FCZ vs FIZ vs bonded warehouse</h2>
          <p className="section-lead">
            All three defer duty. The differences are operational — what you can
            do inside, how long you can stay, and how heavy the compliance is.
          </p>
        </div>

        <div className="comparison-wrap">
          <table className="comparison">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Feature</th>
                <th className="fcz" style={{ width: '24%' }}>FCZ</th>
                <th style={{ width: '24%' }}>FIZ</th>
                <th style={{ width: '24%' }}>Bonded Warehouse</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature}>
                  <td>{row.feature}</td>
                  <td className="fcz-col">{row.fcz}</td>
                  <td>{row.fiz}</td>
                  <td>{row.warehouse}</td>
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
          Source: Free Zones Act 1990, Customs Act 1967, Sales Tax Act 2018, MITI
          FCZ Guidelines, JKDM public rulings.
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
        <h2>Run your FCZ on TradeOps.</h2>
        <p>
          The bonded ledger, ZB1/ZB2 declarations, transshipment manifest, and
          statutory calendar in one operational thread. Start with the ten-step
          FCZ template, or bring your own workflow.
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
   PAGE
============================================================ */
export default function FreeCommercialZonePage() {
  const { mode, setMode } = useTheme();
  useSmoothScroll();

  return (
    <>
      <style>{globalStyles}</style>
      <SiteHeader mode={mode} onThemeChange={setMode} />
      <main>
        <Hero />
        <WhatIsFcz />
        <Chooser />
        <Activities />
        <Benefits />
        <Lifecycle />
        <Compliance />
        <Documents />
        <Comparison />
        <CtaSection />
      </main>
    </>
  );
}