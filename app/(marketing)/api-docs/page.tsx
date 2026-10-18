'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/* ============================================================
   TYPES
============================================================ */
type ThemeMode = 'light' | 'dark' | 'system';
type HttpMethod = 'get' | 'post' | 'patch' | 'delete';

type NavItem = { href: string; label: string; method?: HttpMethod };
type NavGroup = { title: string; items: NavItem[] };
type CodeTab = { lang: string; label: string; html: string };

/* ============================================================
   GLOBAL STYLES
============================================================ */
const globalStyles = `
  :root {
    --bg-page: #f8fafc;
    --bg-panel: #ffffff;
    --bg-sidebar: #ffffff;
    --bg-code: #0f172a;
    --bg-code-header: #1e293b;
    --bg-hover: rgba(15, 23, 42, 0.04);
    --bg-chip: rgba(15, 23, 42, 0.05);
    --bg-note: #eff6ff;
    --bg-warn: #fffbeb;
    --bg-danger: #fef2f2;
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
    --get: #2563eb;
    --get-bg: rgba(37, 99, 235, 0.1);
    --post: #059669;
    --post-bg: rgba(5, 150, 105, 0.1);
    --patch: #d97706;
    --patch-bg: rgba(217, 119, 6, 0.1);
    --delete: #dc2626;
    --delete-bg: rgba(220, 38, 38, 0.1);
    --shadow-panel: 0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px -12px rgba(15, 23, 42, 0.12);
  }

  .dark {
    --bg-page: #050505;
    --bg-panel: #0f0f14;
    --bg-sidebar: #0a0a0c;
    --bg-code: #050505;
    --bg-code-header: #0f0f14;
    --bg-hover: rgba(255, 255, 255, 0.05);
    --bg-chip: rgba(255, 255, 255, 0.07);
    --bg-note: rgba(37, 99, 235, 0.1);
    --bg-warn: rgba(217, 119, 6, 0.1);
    --bg-danger: rgba(220, 38, 38, 0.1);
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
    --get: #60a5fa;
    --get-bg: rgba(96, 165, 250, 0.14);
    --post: #34d399;
    --post-bg: rgba(52, 211, 153, 0.14);
    --patch: #fbbf24;
    --patch-bg: rgba(251, 191, 36, 0.14);
    --delete: #f87171;
    --delete-bg: rgba(248, 113, 113, 0.14);
    --shadow-panel: 0 1px 3px rgba(0, 0, 0, 0.4), 0 8px 24px -12px rgba(0, 0, 0, 0.6);
  }

  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  html { scroll-behavior: smooth; scroll-padding-top: 80px; }
  body {
    background: var(--bg-page);
    color: var(--text-primary);
    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    transition: background-color .2s ease, color .2s ease;
  }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-variant-ligatures: none; }
  a { color: var(--accent-text); text-decoration: none; }
  a:hover { text-decoration: underline; }
  code:not(pre code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.88em;
    padding: .12rem .38rem;
    border-radius: .28rem;
    background: var(--bg-chip);
    border: 1px solid var(--border-subtle);
    color: var(--text-primary);
    white-space: nowrap;
  }

  .header {
    position: fixed; top: 0; left: 0; right: 0; height: 60px;
    background: var(--bg-panel); border-bottom: 1px solid var(--border-subtle);
    display: flex; align-items: center; gap: 1rem; padding: 0 1.25rem; z-index: 50;
  }
  .brand {
    display: flex; align-items: center; gap: .6rem;
    font-weight: 700; font-size: 14px; color: var(--text-primary);
    flex-shrink: 0; text-decoration: none;
  }
  .brand:hover { text-decoration: none; }
  .brand-icon {
    display: flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border-radius: .5rem;
    background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff;
  }
  .brand-divider { width: 1px; height: 22px; background: var(--border-subtle); margin: 0 .25rem; }
  .brand-badge {
    display: inline-block; font-family: ui-monospace, monospace;
    font-size: 10px; font-weight: 700; letter-spacing: .05em;
    padding: .12rem .4rem; border-radius: .3rem;
    background: var(--accent-soft); color: var(--accent-text);
  }
  .search-wrap { flex: 1; max-width: 440px; position: relative; }
  .search-input {
    width: 100%; height: 34px; padding: 0 .7rem 0 2rem;
    border-radius: .5rem; border: 1px solid var(--border-subtle);
    background: var(--bg-page); color: var(--text-primary);
    font-size: 13px; outline: none;
    transition: border-color .15s, box-shadow .15s;
  }
  .search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
  .search-input::placeholder { color: var(--text-faint); }
  .search-icon {
    position: absolute; left: .65rem; top: 50%; transform: translateY(-50%);
    color: var(--text-faint); pointer-events: none;
  }
  .search-kbd {
    position: absolute; right: .5rem; top: 50%; transform: translateY(-50%);
    font-family: ui-monospace, monospace; font-size: 10px;
    padding: .12rem .35rem; border-radius: .25rem;
    background: var(--bg-chip); border: 1px solid var(--border-subtle);
    color: var(--text-faint); pointer-events: none;
  }
  .header-actions { display: flex; align-items: center; gap: .4rem; flex-shrink: 0; margin-left: auto; }
  .version-select {
    height: 32px; padding: 0 .6rem; border-radius: .45rem;
    border: 1px solid var(--border-strong); background: transparent;
    color: var(--text-primary); font-size: 12px; font-weight: 600;
    font-family: ui-monospace, monospace; cursor: pointer;
  }
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
  .theme-btn.active { background: var(--bg-panel); color: var(--text-primary); box-shadow: 0 1px 2px rgba(0,0,0,.1); }
  .menu-btn {
    display: none; width: 32px; height: 32px;
    align-items: center; justify-content: center; border-radius: .4rem;
    background: transparent; border: 1px solid var(--border-subtle);
    color: var(--text-primary); cursor: pointer;
  }

  .layout { display: flex; padding-top: 60px; min-height: 100vh; }

  .sidebar {
    position: fixed; top: 60px; left: 0; bottom: 0; width: 280px;
    background: var(--bg-sidebar); border-right: 1px solid var(--border-subtle);
    overflow-y: auto; padding: 1.25rem .75rem 3rem; z-index: 30;
  }
  .sidebar::-webkit-scrollbar { width: 8px; }
  .sidebar::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }
  .nav-group { margin-bottom: 1.5rem; }
  .nav-group-title {
    font-family: ui-monospace, monospace; font-size: 10px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--text-faint); padding: 0 .65rem; margin-bottom: .5rem;
  }
  .nav-link {
    display: flex; align-items: center; gap: .5rem;
    padding: .4rem .65rem; border-radius: .4rem;
    color: var(--text-secondary); font-size: 13px; font-weight: 500;
    text-decoration: none; transition: all .12s; line-height: 1.4;
  }
  .nav-link:hover { background: var(--bg-hover); color: var(--text-primary); text-decoration: none; }
  .nav-link.active { background: var(--accent-soft); color: var(--accent-text); font-weight: 600; }
  .nav-method {
    font-family: ui-monospace, monospace; font-size: 9px; font-weight: 700;
    letter-spacing: .02em; padding: .05rem .3rem; border-radius: .2rem;
    flex-shrink: 0; text-transform: uppercase;
  }
  .nav-method.get { color: var(--get); background: var(--get-bg); }
  .nav-method.post { color: var(--post); background: var(--post-bg); }
  .nav-method.patch { color: var(--patch); background: var(--patch-bg); }
  .nav-method.delete { color: var(--delete); background: var(--delete-bg); }

  .main { flex: 1; margin-left: 280px; display: flex; min-width: 0; }
  .content { flex: 1; max-width: 860px; padding: 2.5rem 2rem 6rem; min-width: 0; }

  .toc {
    position: sticky; top: 60px; width: 220px; flex-shrink: 0;
    height: calc(100vh - 60px); overflow-y: auto;
    padding: 2.5rem 1rem 3rem; display: none;
  }
  @media (min-width: 1280px) { .toc { display: block; } }
  .toc-title {
    font-family: ui-monospace, monospace; font-size: 10px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase; color: var(--text-faint);
    margin-bottom: .65rem;
  }
  .toc-list { list-style: none; margin: 0; padding: 0; border-left: 1px solid var(--border-subtle); }
  .toc-list li { margin: 0; }
  .toc-list a {
    display: block; padding: .3rem .65rem; margin-left: -1px;
    border-left: 2px solid transparent; font-size: 12px;
    color: var(--text-muted); line-height: 1.4; text-decoration: none; transition: all .12s;
  }
  .toc-list a:hover { color: var(--text-primary); border-left-color: var(--border-strong); }
  .toc-list a.active { color: var(--accent-text); border-left-color: var(--accent); font-weight: 600; }

  .article-section {
    scroll-margin-top: 80px; margin-bottom: 3rem;
    padding-bottom: 2rem; border-bottom: 1px solid var(--border-subtle);
  }
  .article-section:last-child { border-bottom: none; margin-bottom: 0; }
  .section-eyebrow {
    display: inline-block; font-family: ui-monospace, monospace;
    font-size: 10px; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; color: var(--accent-text);
    background: var(--accent-soft); padding: .15rem .45rem;
    border-radius: .25rem; margin-bottom: .75rem;
  }
  h1 { font-size: 2rem; font-weight: 800; letter-spacing: -.025em; line-height: 1.15; margin: 0 0 .75rem; color: var(--text-primary); }
  h2 { font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em; line-height: 1.25; margin: 0 0 1rem; color: var(--text-primary); }
  h3 { font-size: 1.05rem; font-weight: 700; line-height: 1.3; margin: 1.75rem 0 .65rem; color: var(--text-primary); }
  h4 { font-size: .9rem; font-weight: 700; line-height: 1.3; margin: 1.25rem 0 .5rem; color: var(--text-primary); }
  p { margin: 0 0 .9rem; color: var(--text-secondary); }
  .lead { font-size: 1.02rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 1.5rem; }
  ul, ol { margin: 0 0 .9rem; padding-left: 1.4rem; color: var(--text-secondary); }
  li { margin: .3rem 0; }
  strong { color: var(--text-primary); font-weight: 600; }

  .endpoint { margin: 2rem 0 1.25rem; scroll-margin-top: 80px; }
  .endpoint-header {
    display: flex; align-items: center; gap: .6rem;
    padding: .75rem .9rem; border-radius: .6rem;
    background: var(--bg-panel); border: 1px solid var(--border-subtle);
    margin-bottom: 1rem; flex-wrap: wrap; box-shadow: var(--shadow-panel);
  }
  .method {
    display: inline-block; font-family: ui-monospace, monospace;
    font-size: 11px; font-weight: 700; letter-spacing: .04em;
    padding: .25rem .55rem; border-radius: .35rem;
    text-transform: uppercase; flex-shrink: 0;
  }
  .method.get { color: var(--get); background: var(--get-bg); }
  .method.post { color: var(--post); background: var(--post-bg); }
  .method.patch { color: var(--patch); background: var(--patch-bg); }
  .method.delete { color: var(--delete); background: var(--delete-bg); }
  .endpoint-path {
    font-family: ui-monospace, monospace; font-size: 13.5px; font-weight: 600;
    color: var(--text-primary); word-break: break-all; flex: 1; min-width: 0;
  }
  .endpoint-path .param { color: var(--accent-text); }
  .endpoint-title { font-size: 1.15rem; font-weight: 700; margin: 0 0 .35rem; color: var(--text-primary); }
  .endpoint-desc { font-size: 13.5px; color: var(--text-secondary); margin: 0 0 1rem; line-height: 1.55; }

  .code-block {
    margin: 1rem 0 1.25rem; border-radius: .6rem; overflow: hidden;
    background: var(--bg-code); border: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-panel);
  }
  .code-header {
    display: flex; align-items: center; gap: .25rem;
    padding: .35rem .5rem .35rem .65rem;
    background: var(--bg-code-header);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  .code-tab {
    font-family: ui-monospace, monospace; font-size: 11px; font-weight: 600;
    letter-spacing: .02em; padding: .3rem .55rem; border-radius: .3rem;
    background: transparent; border: none; color: #94a3b8;
    cursor: pointer; transition: all .12s;
  }
  .code-tab:hover { color: #e2e8f0; }
  .code-tab.active { background: rgba(255, 255, 255, 0.08); color: #f1f5f9; }
  .code-header-spacer { flex: 1; }
  .copy-btn {
    display: flex; align-items: center; gap: .3rem;
    font-family: ui-monospace, monospace; font-size: 10.5px; font-weight: 600;
    letter-spacing: .04em; text-transform: uppercase;
    padding: .3rem .5rem; border-radius: .3rem;
    background: transparent; border: none; color: #94a3b8;
    cursor: pointer; transition: all .12s;
  }
  .copy-btn:hover { color: #e2e8f0; background: rgba(255, 255, 255, 0.06); }
  .copy-btn.copied { color: #34d399; }
  .code-body { overflow-x: auto; }
  .code-body pre {
    margin: 0; padding: 1rem 1.1rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12.5px; line-height: 1.65; color: #e2e8f0;
    white-space: pre; tab-size: 2;
  }
  .tok-keyword { color: #c084fc; }
  .tok-string { color: #86efac; }
  .tok-number { color: #fbbf24; }
  .tok-comment { color: #64748b; font-style: italic; }
  .tok-property { color: #93c5fd; }
  .tok-function { color: #fbbf24; }
  .tok-punct { color: #94a3b8; }
  .tok-variable { color: #f1f5f9; }
  .tok-boolean { color: #f472b6; }
  .tok-operator { color: #f472b6; }
  .tok-url { color: #93c5fd; }

  .params-table {
    width: 100%; border-collapse: collapse; margin: 1rem 0 1.5rem;
    font-size: 12.5px; border: 1px solid var(--border-subtle);
    border-radius: .5rem; overflow: hidden;
  }
  .params-table thead { background: var(--bg-hover); }
  .params-table th {
    text-align: left; font-family: ui-monospace, monospace;
    font-size: 10.5px; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; color: var(--text-muted);
    padding: .55rem .75rem; border-bottom: 1px solid var(--border-subtle);
  }
  .params-table td {
    padding: .65rem .75rem; border-bottom: 1px solid var(--border-subtle);
    color: var(--text-secondary); vertical-align: top; line-height: 1.55;
  }
  .params-table tr:last-child td { border-bottom: none; }
  .params-table .param-name {
    font-family: ui-monospace, monospace; font-size: 12px; font-weight: 600;
    color: var(--text-primary);
  }
  .params-table .param-type {
    font-family: ui-monospace, monospace; font-size: 11px;
    color: var(--accent-text); white-space: nowrap;
  }
  .params-table .required {
    display: inline-block; font-family: ui-monospace, monospace;
    font-size: 9px; font-weight: 700; letter-spacing: .04em;
    padding: .05rem .3rem; border-radius: .2rem;
    background: var(--delete-bg); color: var(--delete);
    text-transform: uppercase; margin-left: .35rem;
  }
  .params-table .optional {
    display: inline-block; font-family: ui-monospace, monospace;
    font-size: 9px; font-weight: 700; letter-spacing: .04em;
    padding: .05rem .3rem; border-radius: .2rem;
    background: var(--bg-chip); color: var(--text-faint);
    text-transform: uppercase; margin-left: .35rem;
  }

  .callout {
    display: flex; gap: .75rem; align-items: flex-start;
    padding: .9rem 1rem; border-radius: .55rem;
    margin: 1rem 0 1.25rem; border: 1px solid;
    font-size: 13px; line-height: 1.55;
  }
  .callout-icon {
    flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    width: 20px; height: 20px; border-radius: .3rem; margin-top: .05rem;
  }
  .callout-body { flex: 1; min-width: 0; }
  .callout-body p { margin: 0; color: var(--text-secondary); font-size: 13px; }
  .callout-body p + p { margin-top: .4rem; }
  .callout-body strong { color: var(--text-primary); }
  .callout.info { background: var(--bg-note); border-color: var(--border-note); }
  .callout.info .callout-icon { color: var(--get); }
  .callout.warn { background: var(--bg-warn); border-color: var(--border-warn); }
  .callout.warn .callout-icon { color: var(--patch); }
  .callout.danger { background: var(--bg-danger); border-color: var(--border-danger); }
  .callout.danger .callout-icon { color: var(--delete); }

  .status-badge {
    display: inline-block; font-family: ui-monospace, monospace;
    font-size: 10.5px; font-weight: 700; letter-spacing: .04em;
    padding: .15rem .45rem; border-radius: .3rem; text-transform: uppercase;
  }
  .status-2xx { background: var(--post-bg); color: var(--post); }
  .status-4xx { background: rgba(217,119,6,.1); color: var(--patch); }
  .status-5xx { background: var(--danger-bg, rgba(220,38,38,.1)); color: var(--delete); }

  .page-nav {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
    margin-top: 3rem; padding-top: 2rem;
    border-top: 1px solid var(--border-subtle);
  }
  .page-nav a {
    display: block; padding: .85rem 1rem; border-radius: .55rem;
    border: 1px solid var(--border-subtle); background: var(--bg-panel);
    text-decoration: none; transition: all .15s; box-shadow: var(--shadow-panel);
  }
  .page-nav a:hover { border-color: var(--border-strong); text-decoration: none; transform: translateY(-1px); }
  .page-nav-label {
    font-family: ui-monospace, monospace; font-size: 10px; font-weight: 600;
    letter-spacing: .08em; text-transform: uppercase; color: var(--text-faint);
    margin-bottom: .2rem;
  }
  .page-nav-title { font-size: 13.5px; font-weight: 700; color: var(--text-primary); }
  .page-nav .next { text-align: right; }

  .docs-footer {
    margin-top: 4rem; padding-top: 1.5rem;
    border-top: 1px solid var(--border-subtle);
    font-size: 12px; color: var(--text-faint);
    font-family: ui-monospace, monospace; letter-spacing: .03em;
    display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  }

  .overlay {
    display: none; position: fixed; inset: 0;
    background: rgba(0, 0, 0, .5); z-index: 25;
  }

  @media (max-width: 1024px) {
    .sidebar { transform: translateX(-100%); transition: transform .25s ease; width: 280px; }
    .sidebar.open { transform: translateX(0); box-shadow: 4px 0 20px rgba(0,0,0,.15); }
    .main { margin-left: 0; }
    .menu-btn { display: flex; }
    .overlay.open { display: block; }
    .content { padding: 1.5rem 1rem 4rem; }
    .toc { display: none; }
    .search-wrap { max-width: none; }
    .search-kbd { display: none; }
  }

  @media (max-width: 640px) {
    .header { padding: 0 .75rem; gap: .5rem; height: 56px; }
    .brand-badge { display: none; }
    .version-select { font-size: 11px; padding: 0 .4rem; }
    h1 { font-size: 1.5rem; }
    h2 { font-size: 1.25rem; }
    h3 { font-size: 1rem; }
    .code-body pre { font-size: 11.5px; }
    .params-table { font-size: 11.5px; }
    .params-table th, .params-table td { padding: .5rem; }
    .page-nav { grid-template-columns: 1fr; }
    .page-nav .next { text-align: left; }
    .endpoint-header { padding: .6rem .7rem; }
    .endpoint-path { font-size: 12px; }
  }

  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 5px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-faint); }
`;

/* ============================================================
   NAVIGATION DATA
============================================================ */
const navGroups: NavGroup[] = [
  {
    title: 'Getting Started',
    items: [
      { href: '#introduction', label: 'Introduction' },
      { href: '#authentication', label: 'Authentication' },
      { href: '#base-url', label: 'Base URL & Versioning' },
      { href: '#quick-start', label: 'Quick Start' },
      { href: '#errors', label: 'Errors' },
      { href: '#rate-limits', label: 'Rate Limits' },
      { href: '#pagination', label: 'Pagination' },
    ],
  },
  {
    title: 'Workflows',
    items: [
      { href: '#list-workflows', label: 'List workflows', method: 'get' },
      { href: '#get-workflow', label: 'Retrieve workflow', method: 'get' },
      { href: '#create-workflow', label: 'Create workflow', method: 'post' },
      { href: '#update-workflow', label: 'Update workflow', method: 'patch' },
      { href: '#delete-workflow', label: 'Delete workflow', method: 'delete' },
    ],
  },
  {
    title: 'Steps',
    items: [
      { href: '#list-steps', label: 'List steps', method: 'get' },
      { href: '#create-step', label: 'Create step', method: 'post' },
      { href: '#update-step', label: 'Update step', method: 'patch' },
      { href: '#delete-step', label: 'Delete step', method: 'delete' },
      { href: '#reorder-steps', label: 'Reorder steps', method: 'post' },
    ],
  },
  {
    title: 'Templates',
    items: [
      { href: '#list-templates', label: 'List templates', method: 'get' },
      { href: '#get-template', label: 'Retrieve template', method: 'get' },
      { href: '#install-template', label: 'Install template', method: 'post' },
    ],
  },
  {
    title: 'Documents',
    items: [
      { href: '#list-documents', label: 'List documents', method: 'get' },
      { href: '#get-document', label: 'Retrieve document', method: 'get' },
      { href: '#generate-pdf', label: 'Generate PDF', method: 'post' },
    ],
  },
  {
    title: 'Webhooks',
    items: [
      { href: '#list-webhooks', label: 'List webhooks', method: 'get' },
      { href: '#create-webhook', label: 'Create webhook', method: 'post' },
      { href: '#delete-webhook', label: 'Delete webhook', method: 'delete' },
      { href: '#webhook-events', label: 'Event types' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { href: '#sdks', label: 'SDKs & Libraries' },
      { href: '#changelog', label: 'Changelog' },
    ],
  },
];

const tocLinks = [
  { href: '#introduction', label: 'Introduction' },
  { href: '#authentication', label: 'Authentication' },
  { href: '#base-url', label: 'Base URL & Versioning' },
  { href: '#quick-start', label: 'Quick Start' },
  { href: '#errors', label: 'Errors' },
  { href: '#rate-limits', label: 'Rate Limits' },
  { href: '#pagination', label: 'Pagination' },
  { href: '#list-workflows', label: 'Workflows' },
  { href: '#list-steps', label: 'Steps' },
  { href: '#list-templates', label: 'Templates' },
  { href: '#list-documents', label: 'Documents' },
  { href: '#list-webhooks', label: 'Webhooks' },
  { href: '#sdks', label: 'SDKs' },
  { href: '#changelog', label: 'Changelog' },
];

/* ============================================================
   HOOKS
============================================================ */
function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    try {
      const stored = (localStorage.getItem('theme') as ThemeMode | null) ?? 'system';
      setModeState(stored);
    } catch { /* ignore */ }
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
    try { localStorage.setItem('theme', next); } catch { /* ignore */ }
    setModeState(next);
  }, []);

  return { mode, setMode };
}

function useScrollspy(): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>('.article-section[id], .endpoint[id]')
      );
      const offset = 90;
      let current: HTMLElement | null = els[0] ?? null;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= offset) current = el;
        else break;
      }
      setActiveId(current?.id ?? null);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  return activeId;
}

function useSearch(query: string) {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.article-section, .endpoint');
    const navLinks = document.querySelectorAll<HTMLElement>('.nav-link');
    const q = query.trim().toLowerCase();

    if (!q) {
      sections.forEach((s) => (s.style.display = ''));
      navLinks.forEach((l) => (l.style.display = ''));
      return;
    }

    sections.forEach((s) => {
      s.style.display = (s.textContent?.toLowerCase() || '').includes(q) ? '' : 'none';
    });

    navLinks.forEach((l) => {
      const href = l.getAttribute('href');
      const target = href ? document.querySelector(href) : null;
      const targetText = target?.textContent?.toLowerCase() || '';
      const labelText = l.textContent?.toLowerCase() || '';
      l.style.display = targetText.includes(q) || labelText.includes(q) ? '' : 'none';
    });
  }, [query]);
}

function useMobileSidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return { open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) };
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
   ICONS
============================================================ */
function BrandMark({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </svg>
  );
}

/* ============================================================
   REUSABLE COMPONENTS
============================================================ */
function CodeBlock({ tabs, defaultLang }: { tabs: CodeTab[]; defaultLang?: string }) {
  const [active, setActive] = useState(defaultLang ?? tabs[0]?.lang ?? 'text');
  const [copied, setCopied] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const copy = async () => {
    const pre = bodyRef.current?.querySelector('pre:not([hidden])');
    if (!pre) return;
    const text = pre.textContent || '';
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* ignore */ }
  };

  return (
    <div className="code-block">
      <div className="code-header">
        {tabs.map((t) => (
          <button
            key={t.lang}
            className={`code-tab${active === t.lang ? ' active' : ''}`}
            onClick={() => setActive(t.lang)}
            type="button"
          >
            {t.label}
          </button>
        ))}
        <span className="code-header-spacer" />
        <button
          className={`copy-btn${copied ? ' copied' : ''}`}
          onClick={copy}
          type="button"
          aria-label="Copy code"
        >
          <CopyIcon />
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="code-body" ref={bodyRef}>
        {tabs.map((t) => (
          <pre
            key={t.lang}
            data-lang={t.lang}
            hidden={active !== t.lang}
            dangerouslySetInnerHTML={{ __html: t.html }}
          />
        ))}
      </div>
    </div>
  );
}

function Callout({ variant, children }: { variant: 'info' | 'warn' | 'danger'; children: ReactNode }) {
  const icon = variant === 'info' ? <InfoIcon /> : <WarnIcon />;
  return (
    <div className={`callout ${variant}`}>
      <div className="callout-icon">{icon}</div>
      <div className="callout-body">{children}</div>
    </div>
  );
}

function ApiTable({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <table className="params-table">
      <thead>
        <tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

function Endpoint({
  id, method, path, children,
}: {
  id: string;
  method: HttpMethod;
  path: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="endpoint" id={id}>
      <div className="endpoint-header">
        <span className={`method ${method}`}>{method.toUpperCase()}</span>
        <span className="endpoint-path">{path}</span>
      </div>
      {children}
    </div>
  );
}

/* ============================================================
   HEADER
============================================================ */
function Header({
  mode, onThemeChange, search, onSearchChange, onMenuToggle,
}: {
  mode: ThemeMode;
  onThemeChange: (m: ThemeMode) => void;
  search: string;
  onSearchChange: (v: string) => void;
  onMenuToggle: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        onSearchChange('');
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onSearchChange]);

  return (
    <header className="header">
      <button className="menu-btn" aria-label="Toggle navigation" onClick={onMenuToggle} type="button">
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" />
        </svg>
      </button>

      <a href="#introduction" className="brand">
        <span className="brand-icon"><BrandMark /></span>
        <span>TradeOps</span>
        <span className="brand-divider" />
        <span className="brand-badge">API</span>
      </a>

      <div className="search-wrap">
        <svg className="search-icon" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder="Search endpoints, params, errors…"
          autoComplete="off"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <span className="search-kbd">⌘K</span>
      </div>

      <div className="header-actions">
        <select className="version-select" aria-label="API version" defaultValue="v1.4">
          <option>v1.4 (current)</option>
          <option>v1.3</option>
          <option>v1.2</option>
          <option>v1.1</option>
        </select>

        <div className="theme-toggle" role="group" aria-label="Theme">
          <button
            className={`theme-btn${mode === 'light' ? ' active' : ''}`}
            title="Light"
            aria-pressed={mode === 'light'}
            onClick={() => onThemeChange('light')}
            type="button"
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" /><path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </button>
          <button
            className={`theme-btn${mode === 'dark' ? ' active' : ''}`}
            title="Dark"
            aria-pressed={mode === 'dark'}
            onClick={() => onThemeChange('dark')}
            type="button"
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </button>
          <button
            className={`theme-btn${mode === 'system' ? ' active' : ''}`}
            title="System"
            aria-pressed={mode === 'system'}
            onClick={() => onThemeChange('system')}
            type="button"
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="3" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   SIDEBAR + TOC
============================================================ */
function Sidebar({ open, activeId, onLinkClick }: { open: boolean; activeId: string | null; onLinkClick: () => void }) {
  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      {navGroups.map((group) => (
        <div className="nav-group" key={group.title}>
          <div className="nav-group-title">{group.title}</div>
          {group.items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link${activeId && item.href === `#${activeId}` ? ' active' : ''}`}
              onClick={onLinkClick}
            >
              {item.method && (
                <span className={`nav-method ${item.method}`}>
                  {item.method === 'delete' ? 'DEL' : item.method.toUpperCase()}
                </span>
              )}
              {item.label}
            </a>
          ))}
        </div>
      ))}
    </aside>
  );
}

function Toc({ activeId }: { activeId: string | null }) {
  return (
    <aside className="toc">
      <div className="toc-title">On this page</div>
      <ul className="toc-list">
        {tocLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={activeId && link.href === `#${activeId}` ? 'active' : ''}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* ============================================================
   PAGE
============================================================ */
export default function TradeOpsApiReference() {
  const { mode, setMode } = useTheme();
  const activeId = useScrollspy();
  const [search, setSearch] = useState('');
  const mobile = useMobileSidebar();
  useSearch(search);
  useSmoothScroll();

  return (
    <>
      <style>{globalStyles}</style>
      <Header
        mode={mode}
        onThemeChange={setMode}
        search={search}
        onSearchChange={setSearch}
        onMenuToggle={mobile.toggle}
      />

      <div className={`overlay${mobile.open ? ' open' : ''}`} onClick={mobile.close} />

      <div className="layout">
        <Sidebar open={mobile.open} activeId={activeId} onLinkClick={mobile.close} />

        <main className="main">
          <div className="content">
            <Introduction />
            <Authentication />
            <BaseUrl />
            <QuickStart />
            <Errors />
            <RateLimits />
            <Pagination />
            <WorkflowsApi />
            <StepsApi />
            <TemplatesApi />
            <DocumentsApi />
            <WebhooksApi />
            <Sdks />
            <Changelog />

            <nav className="page-nav">
              <a href="#introduction">
                <div className="page-nav-label">← Previous</div>
                <div className="page-nav-title">Introduction</div>
              </a>
              <a href="#authentication" className="next">
                <div className="page-nav-label">Next →</div>
                <div className="page-nav-title">Authentication</div>
              </a>
            </nav>

            <footer className="docs-footer">
              <div>TradeOps API · v1.4 · Last updated March 2026</div>
              <div>© 2026 TradeOps Sdn Bhd</div>
            </footer>
          </div>

          <Toc activeId={activeId} />
        </main>
      </div>
    </>
  );
}

/* ============================================================
   SECTIONS
============================================================ */
function Introduction() {
  return (
    <section className="article-section" id="introduction">
      <div className="section-eyebrow">Getting Started</div>
      <h1>TradeOps API Reference</h1>
      <p className="lead">
        The TradeOps API lets you programmatically build, run, and inspect
        manufacturing, customs, freight, and statutory workflows. Every action
        you can take in the Workflow Studio is available through the API.
      </p>

      <Callout variant="info">
        <p>
          <strong>New here?</strong> Start with the <a href="#quick-start">Quick Start</a>{' '}
          guide to make your first request in under five minutes.
        </p>
      </Callout>

      <h3>What you can do</h3>
      <ul>
        <li><strong>Workflows</strong> — create, update, and delete the four workflow types: manufacturing, customs, freight, and statutory.</li>
        <li><strong>Steps</strong> — add, edit, reorder, and remove the individual stages inside a workflow.</li>
        <li><strong>Templates</strong> — install pre-built workflow templates from the TradeOps library.</li>
        <li><strong>Documents</strong> — retrieve standard trade documents (ISF, CBP 7501, bills of lading, statutory forms) as structured JSON or PDF.</li>
        <li><strong>Webhooks</strong> — receive real-time events when workflows change, documents are generated, or deadlines approach.</li>
      </ul>

      <h3>Requirements</h3>
      <ul>
        <li>An active TradeOps workspace with the <strong>API Access</strong> add-on enabled.</li>
        <li>A secret API key issued from the workspace settings.</li>
        <li>HTTPS-only outbound traffic (TLS 1.2 minimum).</li>
      </ul>
    </section>
  );
}

function Authentication() {
  return (
    <section className="article-section" id="authentication">
      <div className="section-eyebrow">Getting Started</div>
      <h2>Authentication</h2>
      <p>
        Authenticate every request with a Bearer token in the{' '}
        <code>Authorization</code> header. API keys are scoped to a single
        workspace and inherit that workspace&apos;s role-based permissions.
      </p>

      <h3>API Keys</h3>
      <p>
        Generate API keys from <strong>Workspace Settings → API Access → Keys</strong>.
        Each key has a name, an environment (<code>live</code> or{' '}
        <code>test</code>), a scope list, and an optional expiry date.
      </p>

      <CodeBlock
        tabs={[
          {
            lang: 'curl',
            label: 'cURL',
            html: `<span class="tok-comment"># Live key</span>
<span class="tok-function">curl</span> https://api.tradeops.io/v1/workflows \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_9f3a...e21"</span> \\
  -H <span class="tok-string">"Content-Type: application/json"</span>

<span class="tok-comment"># Test key (sandbox)</span>
<span class="tok-function">curl</span> https://api.tradeops.io/v1/workflows \\
  -H <span class="tok-string">"Authorization: Bearer sk_test_4b7c...a09"</span>`,
          },
          {
            lang: 'js',
            label: 'Node.js',
            html: `<span class="tok-keyword">import</span> { TradeOps } <span class="tok-keyword">from</span> <span class="tok-string">'@tradeops/sdk'</span>;

<span class="tok-keyword">const</span> client = <span class="tok-keyword">new</span> <span class="tok-function">TradeOps</span>({
  apiKey: process.env.<span class="tok-property">TRADEOPS_API_KEY</span>, <span class="tok-comment">// sk_live_... or sk_test_...</span>
  baseUrl: <span class="tok-string">'https://api.tradeops.io/v1'</span>
});

<span class="tok-keyword">const</span> workflows = <span class="tok-keyword">await</span> client.workflows.<span class="tok-function">list</span>();`,
          },
          {
            lang: 'py',
            label: 'Python',
            html: `<span class="tok-keyword">import</span> os
<span class="tok-keyword">from</span> tradeops <span class="tok-keyword">import</span> TradeOps

client = <span class="tok-function">TradeOps</span>(
    api_key=os.environ[<span class="tok-string">"TRADEOPS_API_KEY"</span>],  <span class="tok-comment"># sk_live_... or sk_test_...</span>
    base_url=<span class="tok-string">"https://api.tradeops.io/v1"</span>
)

workflows = client.workflows.<span class="tok-function">list</span>()`,
          },
        ]}
      />

      <h3>Scopes</h3>
      <p>API keys are constrained by scopes. Request only the scopes your integration needs.</p>

      <ApiTable
        head={['Scope', 'Access']}
        rows={[
          [<span className="param-name" key="1">workflows:read</span>, 'List and retrieve workflows and steps.'],
          [<span className="param-name" key="2">workflows:write</span>, 'Create, update, delete, and reorder workflows and steps.'],
          [<span className="param-name" key="3">templates:read</span>, <>List and retrieve templates. Install is covered by <code>workflows:write</code>.</>],
          [<span className="param-name" key="4">documents:read</span>, 'Retrieve standard trade documents as JSON or PDF.'],
          [<span className="param-name" key="5">webhooks:manage</span>, 'Create, list, and delete webhooks.'],
        ]}
      />

      <Callout variant="warn">
        <p>
          <strong>Never expose secret keys in client-side code.</strong> All requests
          must originate from a trusted server. If a key leaks, revoke it
          immediately from the workspace settings.
        </p>
      </Callout>
    </section>
  );
}

function BaseUrl() {
  return (
    <section className="article-section" id="base-url">
      <div className="section-eyebrow">Getting Started</div>
      <h2>Base URL &amp; Versioning</h2>
      <p>
        All requests target <code>https://api.tradeops.io/v1</code>. The version
        is pinned in the path so upgrades never break existing integrations.
      </p>

      <ApiTable
        head={['Environment', 'Base URL', 'Key prefix']}
        rows={[
          [<span className="param-name" key="1">Live</span>, <code key="2">https://api.tradeops.io/v1</code>, <code key="3">sk_live_</code>],
          [<span className="param-name" key="4">Test</span>, <code key="5">https://api.tradeops.io/v1</code>, <code key="6">sk_test_</code>],
        ]}
      />

      <p>
        The test environment is a full sandbox: workflows you create, steps you
        add, and documents you generate stay isolated. No live customs filings
        or statutory submissions are triggered.
      </p>
    </section>
  );
}

function QuickStart() {
  return (
    <section className="article-section" id="quick-start">
      <div className="section-eyebrow">Getting Started</div>
      <h2>Quick Start</h2>
      <p>Create your first workflow, add a step, and retrieve the result in three requests.</p>

      <h3>1. Create a workflow</h3>
      <Endpoint id="quick-create" method="post" path="/v1/workflows">
        <CodeBlock
          tabs={[
            {
              lang: 'curl',
              label: 'cURL',
              html: `<span class="tok-function">curl</span> -X POST https://api.tradeops.io/v1/workflows \\
  -H <span class="tok-string">"Authorization: Bearer sk_test_..."</span> \\
  -H <span class="tok-string">"Content-Type: application/json"</span> \\
  -d <span class="tok-string">'{
    "name": "Q2 Import Clearance",
    "type": "customs",
    "description": "Import entry lifecycle for Q2 shipments"
  }'</span>`,
            },
            {
              lang: 'js',
              label: 'Node.js',
              html: `<span class="tok-keyword">const</span> wf = <span class="tok-keyword">await</span> client.workflows.<span class="tok-function">create</span>({
  name: <span class="tok-string">'Q2 Import Clearance'</span>,
  type: <span class="tok-string">'customs'</span>,
  description: <span class="tok-string">'Import entry lifecycle for Q2 shipments'</span>
});`,
            },
            {
              lang: 'py',
              label: 'Python',
              html: `wf = client.workflows.<span class="tok-function">create</span>(
    name=<span class="tok-string">"Q2 Import Clearance"</span>,
    type=<span class="tok-string">"customs"</span>,
    description=<span class="tok-string">"Import entry lifecycle for Q2 shipments"</span>
)`,
            },
          ]}
        />
      </Endpoint>

      <h3>2. Add a step</h3>
      <Endpoint
        id="quick-add-step"
        method="post"
        path={<>/v1/workflows/<span className="param">{'{workflow_id}'}</span>/steps</>}
      >
        <CodeBlock
          tabs={[
            {
              lang: 'curl',
              label: 'cURL',
              html: `<span class="tok-function">curl</span> -X POST https://api.tradeops.io/v1/workflows/wf_8a2f9c/steps \\
  -H <span class="tok-string">"Authorization: Bearer sk_test_..."</span> \\
  -H <span class="tok-string">"Content-Type: application/json"</span> \\
  -d <span class="tok-string">'{
    "title": "Prepare ISF filing",
    "phase": "Pre-arrival",
    "systems": ["ACE"],
    "docs": ["ISF 10+2"],
    "document_key": "isf_filing"
  }'</span>`,
            },
            {
              lang: 'js',
              label: 'Node.js',
              html: `<span class="tok-keyword">const</span> step = <span class="tok-keyword">await</span> client.workflows.<span class="tok-function">addStep</span>(<span class="tok-string">'wf_8a2f9c'</span>, {
  title: <span class="tok-string">'Prepare ISF filing'</span>,
  phase: <span class="tok-string">'Pre-arrival'</span>,
  systems: [<span class="tok-string">'ACE'</span>],
  docs: [<span class="tok-string">'ISF 10+2'</span>],
  document_key: <span class="tok-string">'isf_filing'</span>
});`,
            },
            {
              lang: 'py',
              label: 'Python',
              html: `step = client.workflows.<span class="tok-function">add_step</span>(
    <span class="tok-string">"wf_8a2f9c"</span>,
    title=<span class="tok-string">"Prepare ISF filing"</span>,
    phase=<span class="tok-string">"Pre-arrival"</span>,
    systems=[<span class="tok-string">"ACE"</span>],
    docs=[<span class="tok-string">"ISF 10+2"</span>],
    document_key=<span class="tok-string">"isf_filing"</span>
)`,
            },
          ]}
        />
      </Endpoint>

      <h3>3. Retrieve the workflow</h3>
      <Endpoint
        id="quick-get"
        method="get"
        path={<>/v1/workflows/<span className="param">{'{workflow_id}'}</span></>}
      >
        <Callout variant="info">
          <p>
            You&apos;ve just made a complete create → add → read cycle. Every
            workflow you create in the API appears immediately in the Workflow
            Studio UI.
          </p>
        </Callout>
      </Endpoint>
    </section>
  );
}

function Errors() {
  return (
    <section className="article-section" id="errors">
      <div className="section-eyebrow">Getting Started</div>
      <h2>Errors</h2>
      <p>
        The API uses standard HTTP status codes plus a JSON error envelope. Every
        error response includes a machine-readable <code>code</code>, a
        human-readable <code>message</code>, and a <code>request_id</code> you
        can hand to support.
      </p>

      <CodeBlock
        tabs={[
          {
            lang: 'json',
            label: 'Response',
            html: `<span class="tok-punct">{</span>
  <span class="tok-property">"error"</span><span class="tok-punct">:</span> <span class="tok-punct">{</span>
    <span class="tok-property">"code"</span><span class="tok-punct">:</span> <span class="tok-string">"workflow_not_found"</span><span class="tok-punct">,</span>
    <span class="tok-property">"message"</span><span class="tok-punct">:</span> <span class="tok-string">"No workflow exists with id wf_missing"</span><span class="tok-punct">,</span>
    <span class="tok-property">"request_id"</span><span class="tok-punct">:</span> <span class="tok-string">"req_7f3a9b2c1d"</span><span class="tok-punct">,</span>
    <span class="tok-property">"doc_url"</span><span class="tok-punct">:</span> <span class="tok-string">"https://docs.tradeops.io/errors/workflow_not_found"</span>
  <span class="tok-punct">}</span>
<span class="tok-punct">}</span>`,
          },
        ]}
      />

      <h3>Status codes</h3>
      <ApiTable
        head={['Status', 'Meaning', 'Typical causes']}
        rows={[
          [<span className="status-badge status-2xx" key="1">200 OK</span>, 'The request succeeded.', '—'],
          [<span className="status-badge status-2xx" key="2">201 Created</span>, 'A new resource was created.', 'POST /workflows, POST /steps'],
          [<span className="status-badge status-2xx" key="3">204 No Content</span>, 'The resource was deleted.', 'DELETE /workflows/{id}'],
          [<span className="status-badge status-4xx" key="4">400 Bad Request</span>, 'Malformed request body or parameters.', 'Missing required field, invalid JSON'],
          [<span className="status-badge status-4xx" key="5">401 Unauthorized</span>, 'Missing or invalid API key.', 'Header not set, key revoked'],
          [<span className="status-badge status-4xx" key="6">403 Forbidden</span>, 'The key lacks the required scope.', 'workflows:read only, attempting write'],
          [<span className="status-badge status-4xx" key="7">404 Not Found</span>, 'The resource does not exist.', 'Invalid workflow_id'],
          [<span className="status-badge status-4xx" key="8">409 Conflict</span>, 'The request conflicts with current state.', 'Duplicate workflow name in workspace'],
          [<span className="status-badge status-4xx" key="9">422 Unprocessable</span>, 'Semantic validation failed.', 'Invalid workflow type, unreachable webhook URL'],
          [<span className="status-badge status-4xx" key="10">429 Too Many Requests</span>, 'Rate limit exceeded.', <span key="c">See <a href="#rate-limits">Rate Limits</a>.</span>],
          [<span className="status-badge status-5xx" key="11">500 Server Error</span>, 'Unexpected server-side failure.', 'Retry with backoff, contact support'],
        ]}
      />

      <h3>Error codes</h3>
      <ApiTable
        head={['Code', 'Description']}
        rows={[
          [<span className="param-name" key="1">unauthorized</span>, 'The API key is missing or invalid.'],
          [<span className="param-name" key="2">insufficient_scope</span>, 'The key does not have the required scope.'],
          [<span className="param-name" key="3">workflow_not_found</span>, 'No workflow exists with the supplied id.'],
          [<span className="param-name" key="4">step_not_found</span>, 'No step exists with the supplied id.'],
          [<span className="param-name" key="5">invalid_workflow_type</span>, <>The workflow type is not one of <code>manufacturing</code>, <code>customs</code>, <code>freight</code>, <code>statutory</code>.</>],
          [<span className="param-name" key="6">duplicate_workflow_name</span>, 'A workflow with the same name exists in this workspace.'],
          [<span className="param-name" key="7">invalid_document_key</span>, 'The requested document template does not exist.'],
          [<span className="param-name" key="8">webhook_unreachable</span>, 'The webhook URL failed the test delivery.'],
          [<span className="param-name" key="9">rate_limit_exceeded</span>, 'Too many requests. Back off and retry.'],
        ]}
      />
    </section>
  );
}

function RateLimits() {
  return (
    <section className="article-section" id="rate-limits">
      <div className="section-eyebrow">Getting Started</div>
      <h2>Rate Limits</h2>
      <p>
        Requests are rate-limited per API key. The limit depends on your plan
        tier and refreshes on a rolling 60-second window.
      </p>

      <ApiTable
        head={['Plan', 'Requests / minute', 'Burst']}
        rows={[
          [<span className="param-name" key="1">Developer</span>, '60', '120'],
          [<span className="param-name" key="2">Team</span>, '600', '1,200'],
          [<span className="param-name" key="3">Enterprise</span>, '3,000', '6,000'],
        ]}
      />

      <p>Every response includes the following headers:</p>
      <ul>
        <li><code>X-RateLimit-Limit</code> — the request limit for the current window.</li>
        <li><code>X-RateLimit-Remaining</code> — requests left in the window.</li>
        <li><code>X-RateLimit-Reset</code> — Unix timestamp when the window resets.</li>
        <li><code>Retry-After</code> — seconds to wait before retrying (only on 429).</li>
      </ul>

      <Callout variant="warn">
        <p>
          <strong>Use exponential backoff.</strong> On <code>429</code> or{' '}
          <code>5xx</code>, wait <code>2^n</code> seconds (capped at 60) before
          retrying. Do not retry in a tight loop.
        </p>
      </Callout>
    </section>
  );
}

function Pagination() {
  return (
    <section className="article-section" id="pagination">
      <div className="section-eyebrow">Getting Started</div>
      <h2>Pagination</h2>
      <p>
        List endpoints use cursor-based pagination. Pass <code>limit</code> (max
        100, default 20) and <code>starting_after</code> (the last{' '}
        <code>id</code> from the previous page) to page through results.
      </p>

      <CodeBlock
        tabs={[
          {
            lang: 'curl',
            label: 'cURL',
            html: `<span class="tok-function">curl</span> <span class="tok-string">"https://api.tradeops.io/v1/workflows?limit=20&starting_after=wf_8a2f9c"</span> \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span>`,
          },
        ]}
      />

      <p>Responses contain a <code>data</code> array plus a <code>pagination</code> object:</p>

      <CodeBlock
        tabs={[
          {
            lang: 'json',
            label: 'Response',
            html: `<span class="tok-punct">{</span>
  <span class="tok-property">"data"</span><span class="tok-punct">:</span> <span class="tok-punct">[</span> <span class="tok-comment">/* ... */</span> <span class="tok-punct">],</span>
  <span class="tok-property">"pagination"</span><span class="tok-punct">:</span> <span class="tok-punct">{</span>
    <span class="tok-property">"has_more"</span><span class="tok-punct">:</span> <span class="tok-boolean">true</span><span class="tok-punct">,</span>
    <span class="tok-property">"next_cursor"</span><span class="tok-punct">:</span> <span class="tok-string">"wf_8a2f9c"</span><span class="tok-punct">,</span>
    <span class="tok-property">"total_count"</span><span class="tok-punct">:</span> <span class="tok-number">248</span>
  <span class="tok-punct">}</span>
<span class="tok-punct">}</span>`,
          },
        ]}
      />
    </section>
  );
}

/* ----------------------------------------------
   WORKFLOWS
---------------------------------------------- */
function WorkflowsApi() {
  return (
    <section className="article-section">
      <div className="section-eyebrow">Workflows</div>
      <h2>Workflows API</h2>
      <p className="lead">
        Workflows are the top-level container in TradeOps. Each workflow has a
        type that determines its accent color, its template library, and the
        standard documents it exposes.
      </p>

      <ApiTable
        head={['Type', 'Description']}
        rows={[
          [<span className="param-name" key="1">manufacturing</span>, 'Bonded production & FIZ lifecycle — purchase order through compliance report.'],
          [<span className="param-name" key="2">customs</span>, 'Import entry lifecycle — ISF through entry summary reconciliation.'],
          [<span className="param-name" key="3">freight</span>, 'Load lifecycle — intake through invoice settlement.'],
          [<span className="param-name" key="4">statutory</span>, 'Malaysian statutory compliance — JTKSM, JIM, LHDN, EPF, SOCSO, FOMEMA.'],
        ]}
      />

      {/* LIST WORKFLOWS */}
      <Endpoint id="list-workflows" method="get" path="/v1/workflows">
        <h3 className="endpoint-title">List workflows</h3>
        <p className="endpoint-desc">
          Returns a paginated list of workflows in the current workspace.
          Optional query parameters filter by type and name.
        </p>

        <h4>Query parameters</h4>
        <ApiTable
          head={['Name', 'Type', 'Description']}
          rows={[
            [
              <span key="n"><span className="param-name">type</span><span className="optional">optional</span></span>,
              <span className="param-type" key="t">string</span>,
              <>Filter by workflow type: <code>manufacturing</code>, <code>customs</code>, <code>freight</code>, <code>statutory</code>.</>,
            ],
            [
              <span key="n"><span className="param-name">limit</span><span className="optional">optional</span></span>,
              <span className="param-type" key="t">integer</span>,
              'Number of results (1–100). Defaults to 20.',
            ],
            [
              <span key="n"><span className="param-name">starting_after</span><span className="optional">optional</span></span>,
              <span className="param-type" key="t">string</span>,
              <>Cursor — the <code>id</code> of the last workflow from the previous page.</>,
            ],
          ]}
        />

        <CodeBlock
          tabs={[
            {
              lang: 'curl',
              label: 'cURL',
              html: `<span class="tok-function">curl</span> <span class="tok-string">"https://api.tradeops.io/v1/workflows?type=customs&limit=50"</span> \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span>`,
            },
            {
              lang: 'js',
              label: 'Node.js',
              html: `<span class="tok-keyword">const</span> list = <span class="tok-keyword">await</span> client.workflows.<span class="tok-function">list</span>({
  type: <span class="tok-string">'customs'</span>,
  limit: <span class="tok-number">50</span>
});`,
            },
            {
              lang: 'py',
              label: 'Python',
              html: `list_ = client.workflows.<span class="tok-function">list</span>(
    type=<span class="tok-string">"customs"</span>,
    limit=<span class="tok-number">50</span>
)`,
            },
          ]}
        />

        <h4>Response</h4>
        <CodeBlock
          tabs={[
            {
              lang: 'json',
              label: '200 OK',
              html: `<span class="tok-punct">{</span>
  <span class="tok-property">"data"</span><span class="tok-punct">:</span> <span class="tok-punct">[</span>
    <span class="tok-punct">{</span>
      <span class="tok-property">"id"</span><span class="tok-punct">:</span> <span class="tok-string">"wf_8a2f9c"</span><span class="tok-punct">,</span>
      <span class="tok-property">"name"</span><span class="tok-punct">:</span> <span class="tok-string">"Q2 Import Clearance"</span><span class="tok-punct">,</span>
      <span class="tok-property">"type"</span><span class="tok-punct">:</span> <span class="tok-string">"customs"</span><span class="tok-punct">,</span>
      <span class="tok-property">"description"</span><span class="tok-punct">:</span> <span class="tok-string">"Import entry lifecycle for Q2 shipments"</span><span class="tok-punct">,</span>
      <span class="tok-property">"step_count"</span><span class="tok-punct">:</span> <span class="tok-number">10</span><span class="tok-punct">,</span>
      <span class="tok-property">"created_at"</span><span class="tok-punct">:</span> <span class="tok-string">"2026-03-14T08:00:00Z"</span><span class="tok-punct">,</span>
      <span class="tok-property">"updated_at"</span><span class="tok-punct">:</span> <span class="tok-string">"2026-03-16T12:34:00Z"</span>
    <span class="tok-punct">}</span>
  <span class="tok-punct">],</span>
  <span class="tok-property">"pagination"</span><span class="tok-punct">:</span> <span class="tok-punct">{</span>
    <span class="tok-property">"has_more"</span><span class="tok-punct">:</span> <span class="tok-boolean">false</span><span class="tok-punct">,</span>
    <span class="tok-property">"next_cursor"</span><span class="tok-punct">:</span> <span class="tok-boolean">null</span><span class="tok-punct">,</span>
    <span class="tok-property">"total_count"</span><span class="tok-punct">:</span> <span class="tok-number">1</span>
  <span class="tok-punct">}</span>
<span class="tok-punct">}</span>`,
            },
          ]}
        />
      </Endpoint>

      {/* GET WORKFLOW */}
      <Endpoint
        id="get-workflow"
        method="get"
        path={<>/v1/workflows/<span className="param">{'{workflow_id}'}</span></>}
      >
        <h3 className="endpoint-title">Retrieve workflow</h3>
        <p className="endpoint-desc">
          Returns a single workflow with its steps, ordered by their current position.
        </p>

        <h4>Path parameters</h4>
        <ApiTable
          head={['Name', 'Type', 'Description']}
          rows={[[
            <span key="n"><span className="param-name">workflow_id</span><span className="required">required</span></span>,
            <span className="param-type" key="t">string</span>,
            <>The unique workflow identifier, e.g. <code>wf_8a2f9c</code>.</>,
          ]]}
        />

        <CodeBlock
          tabs={[
            {
              lang: 'curl',
              label: 'cURL',
              html: `<span class="tok-function">curl</span> https://api.tradeops.io/v1/workflows/wf_8a2f9c \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span>`,
            },
            { lang: 'js', label: 'Node.js', html: `<span class="tok-keyword">const</span> wf = <span class="tok-keyword">await</span> client.workflows.<span class="tok-function">get</span>(<span class="tok-string">'wf_8a2f9c'</span>);` },
            { lang: 'py', label: 'Python', html: `wf = client.workflows.<span class="tok-function">get</span>(<span class="tok-string">"wf_8a2f9c"</span>)` },
          ]}
        />

        <CodeBlock
          tabs={[
            {
              lang: 'json',
              label: '200 OK',
              html: `<span class="tok-punct">{</span>
  <span class="tok-property">"id"</span><span class="tok-punct">:</span> <span class="tok-string">"wf_8a2f9c"</span><span class="tok-punct">,</span>
  <span class="tok-property">"name"</span><span class="tok-punct">:</span> <span class="tok-string">"Q2 Import Clearance"</span><span class="tok-punct">,</span>
  <span class="tok-property">"type"</span><span class="tok-punct">:</span> <span class="tok-string">"customs"</span><span class="tok-punct">,</span>
  <span class="tok-property">"description"</span><span class="tok-punct">:</span> <span class="tok-string">"Import entry lifecycle for Q2 shipments"</span><span class="tok-punct">,</span>
  <span class="tok-property">"created_at"</span><span class="tok-punct">:</span> <span class="tok-string">"2026-03-14T08:00:00Z"</span><span class="tok-punct">,</span>
  <span class="tok-property">"updated_at"</span><span class="tok-punct">:</span> <span class="tok-string">"2026-03-16T12:34:00Z"</span><span class="tok-punct">,</span>
  <span class="tok-property">"steps"</span><span class="tok-punct">:</span> <span class="tok-punct">[</span>
    <span class="tok-punct">{</span>
      <span class="tok-property">"id"</span><span class="tok-punct">:</span> <span class="tok-string">"st_1"</span><span class="tok-punct">,</span>
      <span class="tok-property">"position"</span><span class="tok-punct">:</span> <span class="tok-number">1</span><span class="tok-punct">,</span>
      <span class="tok-property">"title"</span><span class="tok-punct">:</span> <span class="tok-string">"Prepare ISF filing"</span><span class="tok-punct">,</span>
      <span class="tok-property">"phase"</span><span class="tok-punct">:</span> <span class="tok-string">"Pre-arrival"</span><span class="tok-punct">,</span>
      <span class="tok-property">"systems"</span><span class="tok-punct">:</span> <span class="tok-punct">[</span><span class="tok-string">"ACE"</span><span class="tok-punct">],</span>
      <span class="tok-property">"docs"</span><span class="tok-punct">:</span> <span class="tok-punct">[</span><span class="tok-string">"ISF 10+2"</span><span class="tok-punct">],</span>
      <span class="tok-property">"document_key"</span><span class="tok-punct">:</span> <span class="tok-string">"isf_filing"</span><span class="tok-punct">,</span>
      <span class="tok-property">"warn"</span><span class="tok-punct">:</span> <span class="tok-string">"\\$5,000 per late filing"</span><span class="tok-punct">,</span>
      <span class="tok-property">"danger"</span><span class="tok-punct">:</span> <span class="tok-boolean">true</span>
    <span class="tok-punct">}</span>
  <span class="tok-punct">]</span>
<span class="tok-punct">}</span>`,
            },
          ]}
        />
      </Endpoint>

      {/* CREATE WORKFLOW */}
      <Endpoint id="create-workflow" method="post" path="/v1/workflows">
        <h3 className="endpoint-title">Create workflow</h3>
        <p className="endpoint-desc">
          Creates a new workflow. Workflow names must be unique within a workspace.
        </p>

        <h4>Body parameters</h4>
        <ApiTable
          head={['Name', 'Type', 'Description']}
          rows={[
            [
              <span key="n"><span className="param-name">name</span><span className="required">required</span></span>,
              <span className="param-type" key="t">string</span>,
              'Display name, 1–120 characters, unique per workspace.',
            ],
            [
              <span key="n"><span className="param-name">type</span><span className="required">required</span></span>,
              <span className="param-type" key="t">string</span>,
              <>One of <code>manufacturing</code>, <code>customs</code>, <code>freight</code>, <code>statutory</code>.</>,
            ],
            [
              <span key="n"><span className="param-name">description</span><span className="optional">optional</span></span>,
              <span className="param-type" key="t">string</span>,
              'Free-text description, max 500 characters.',
            ],
            [
              <span key="n"><span className="param-name">template_key</span><span className="optional">optional</span></span>,
              <span className="param-type" key="t">string</span>,
              <>If provided, seeds the workflow with the steps from a template. See <a href="#install-template">Install template</a>.</>,
            ],
          ]}
        />

        <CodeBlock
          tabs={[
            {
              lang: 'curl',
              label: 'cURL',
              html: `<span class="tok-function">curl</span> -X POST https://api.tradeops.io/v1/workflows \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span> \\
  -H <span class="tok-string">"Content-Type: application/json"</span> \\
  -d <span class="tok-string">'{
    "name": "Q2 Import Clearance",
    "type": "customs",
    "description": "Import entry lifecycle for Q2 shipments",
    "template_key": "customs_default"
  }'</span>`,
            },
            {
              lang: 'js',
              label: 'Node.js',
              html: `<span class="tok-keyword">const</span> wf = <span class="tok-keyword">await</span> client.workflows.<span class="tok-function">create</span>({
  name: <span class="tok-string">'Q2 Import Clearance'</span>,
  type: <span class="tok-string">'customs'</span>,
  description: <span class="tok-string">'Import entry lifecycle for Q2 shipments'</span>,
  template_key: <span class="tok-string">'customs_default'</span>
});`,
            },
            {
              lang: 'py',
              label: 'Python',
              html: `wf = client.workflows.<span class="tok-function">create</span>(
    name=<span class="tok-string">"Q2 Import Clearance"</span>,
    type=<span class="tok-string">"customs"</span>,
    description=<span class="tok-string">"Import entry lifecycle for Q2 shipments"</span>,
    template_key=<span class="tok-string">"customs_default"</span>
)`,
            },
          ]}
        />

        <Callout variant="info">
          <p>
            Returns <span className="status-badge status-2xx">201 Created</span>{' '}
            with the full workflow object, including its seeded steps if{' '}
            <code>template_key</code> was supplied.
          </p>
        </Callout>
      </Endpoint>

      {/* UPDATE WORKFLOW */}
      <Endpoint
        id="update-workflow"
        method="patch"
        path={<>/v1/workflows/<span className="param">{'{workflow_id}'}</span></>}
      >
        <h3 className="endpoint-title">Update workflow</h3>
        <p className="endpoint-desc">
          Updates the name, description, or type of a workflow. Only the supplied
          fields are modified.
        </p>

        <h4>Body parameters</h4>
        <ApiTable
          head={['Name', 'Type', 'Description']}
          rows={[
            [
              <span key="n"><span className="param-name">name</span><span className="optional">optional</span></span>,
              <span className="param-type" key="t">string</span>,
              'New display name.',
            ],
            [
              <span key="n"><span className="param-name">description</span><span className="optional">optional</span></span>,
              <span className="param-type" key="t">string</span>,
              'New description. Pass an empty string to clear.',
            ],
            [
              <span key="n"><span className="param-name">type</span><span className="optional">optional</span></span>,
              <span className="param-type" key="t">string</span>,
              'Change the workflow type. Existing steps are preserved; only the accent and template library change.',
            ],
          ]}
        />

        <CodeBlock
          tabs={[
            {
              lang: 'curl',
              label: 'cURL',
              html: `<span class="tok-function">curl</span> -X PATCH https://api.tradeops.io/v1/workflows/wf_8a2f9c \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span> \\
  -H <span class="tok-string">"Content-Type: application/json"</span> \\
  -d <span class="tok-string">'{ "name": "Q2 Import Clearance (revised)" }'</span>`,
            },
            {
              lang: 'js',
              label: 'Node.js',
              html: `<span class="tok-keyword">const</span> wf = <span class="tok-keyword">await</span> client.workflows.<span class="tok-function">update</span>(<span class="tok-string">'wf_8a2f9c'</span>, {
  name: <span class="tok-string">'Q2 Import Clearance (revised)'</span>
});`,
            },
            {
              lang: 'py',
              label: 'Python',
              html: `wf = client.workflows.<span class="tok-function">update</span>(
    <span class="tok-string">"wf_8a2f9c"</span>,
    name=<span class="tok-string">"Q2 Import Clearance (revised)"</span>
)`,
            },
          ]}
        />
      </Endpoint>

      {/* DELETE WORKFLOW */}
      <Endpoint
        id="delete-workflow"
        method="delete"
        path={<>/v1/workflows/<span className="param">{'{workflow_id}'}</span></>}
      >
        <h3 className="endpoint-title">Delete workflow</h3>
        <p className="endpoint-desc">
          Permanently deletes a workflow and all of its steps. This action cannot be undone.
        </p>

        <Callout variant="danger">
          <p>
            <strong>Irreversible.</strong> Deleting a workflow also deletes every
            step and unlinks every generated document. If you only want to
            archive it, set <code>name</code> to a prefixed value or move it to a
            different workspace.
          </p>
        </Callout>

        <CodeBlock
          tabs={[
            {
              lang: 'curl',
              label: 'cURL',
              html: `<span class="tok-function">curl</span> -X DELETE https://api.tradeops.io/v1/workflows/wf_8a2f9c \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span>`,
            },
            { lang: 'js', label: 'Node.js', html: `<span class="tok-keyword">await</span> client.workflows.<span class="tok-function">delete</span>(<span class="tok-string">'wf_8a2f9c'</span>);` },
            { lang: 'py', label: 'Python', html: `client.workflows.<span class="tok-function">delete</span>(<span class="tok-string">"wf_8a2f9c"</span>)` },
          ]}
        />

        <p>Returns <span className="status-badge status-2xx">204 No Content</span> on success.</p>
      </Endpoint>
    </section>
  );
}

/* ----------------------------------------------
   STEPS
---------------------------------------------- */
function StepsApi() {
  return (
    <section className="article-section">
      <div className="section-eyebrow">Steps</div>
      <h2>Steps API</h2>
      <p className="lead">
        Steps are the individual stages inside a workflow. Each step has a phase,
        one or more systems, one or more documents, and a description of what
        actually happens in real life.
      </p>

      <ApiTable
        head={['Field', 'Type', 'Description']}
        rows={[
          [<span className="param-name" key="1">id</span>, <span className="param-type" key="1t">string</span>, <>Step identifier, e.g. <code>st_1</code>.</>],
          [<span className="param-name" key="2">position</span>, <span className="param-type" key="2t">integer</span>, '1-based order within the workflow.'],
          [<span className="param-name" key="3">title</span>, <span className="param-type" key="3t">string</span>, 'Display title.'],
          [<span className="param-name" key="4">phase</span>, <span className="param-type" key="4t">string</span>, 'Lifecycle phase label, e.g. "Pre-arrival".'],
          [<span className="param-name" key="5">systems</span>, <span className="param-type" key="5t">string[]</span>, 'Systems involved (ACE, ABI, TMS, DAT, …).'],
          [<span className="param-name" key="6">docs</span>, <span className="param-type" key="6t">string[]</span>, 'Document names attached to the step.'],
          [<span className="param-name" key="7">document_key</span>, <span className="param-type" key="7t">string | null</span>, 'Links to a standard document template.'],
          [<span className="param-name" key="8">warn</span>, <span className="param-type" key="8t">string</span>, 'Optional warning chip text.'],
          [<span className="param-name" key="9">danger</span>, <span className="param-type" key="9t">boolean</span>, 'Whether the warning is critical.'],
          [<span className="param-name" key="10">reality</span>, <span className="param-type" key="10t">string</span>, 'Description of what actually happens in this step.'],
        ]}
      />

      {/* LIST STEPS */}
      <Endpoint
        id="list-steps"
        method="get"
        path={<>/v1/workflows/<span className="param">{'{workflow_id}'}</span>/steps</>}
      >
        <h3 className="endpoint-title">List steps</h3>
        <p className="endpoint-desc">Returns all steps for a workflow, ordered by position.</p>

        <CodeBlock
          tabs={[{
            lang: 'curl',
            label: 'cURL',
            html: `<span class="tok-function">curl</span> https://api.tradeops.io/v1/workflows/wf_8a2f9c/steps \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span>`,
          }]}
        />
      </Endpoint>

      {/* CREATE STEP */}
      <Endpoint
        id="create-step"
        method="post"
        path={<>/v1/workflows/<span className="param">{'{workflow_id}'}</span>/steps</>}
      >
        <h3 className="endpoint-title">Create step</h3>
        <p className="endpoint-desc">Appends a new step to the end of the workflow.</p>

        <h4>Body parameters</h4>
        <ApiTable
          head={['Name', 'Type', 'Description']}
          rows={[
            [<span key="n"><span className="param-name">title</span><span className="required">required</span></span>, <span className="param-type" key="t">string</span>, 'Step title, 1–200 characters.'],
            [<span key="n"><span className="param-name">phase</span><span className="optional">optional</span></span>, <span className="param-type" key="t">string</span>, 'Phase label.'],
            [<span key="n"><span className="param-name">systems</span><span className="optional">optional</span></span>, <span className="param-type" key="t">string[]</span>, 'Systems attached to the step.'],
            [<span key="n"><span className="param-name">docs</span><span className="optional">optional</span></span>, <span className="param-type" key="t">string[]</span>, 'Document names.'],
            [<span key="n"><span className="param-name">document_key</span><span className="optional">optional</span></span>, <span className="param-type" key="t">string</span>, <>Links to a standard template. See <a href="#list-documents">Documents</a>.</>],
            [<span key="n"><span className="param-name">warn</span><span className="optional">optional</span></span>, <span className="param-type" key="t">string</span>, 'Warning chip text.'],
            [<span key="n"><span className="param-name">danger</span><span className="optional">optional</span></span>, <span className="param-type" key="t">boolean</span>, <>Marks the warning as critical. Defaults to <code>false</code>.</>],
            [<span key="n"><span className="param-name">reality</span><span className="optional">optional</span></span>, <span className="param-type" key="t">string</span>, 'Description of what happens in this step.'],
          ]}
        />

        <CodeBlock
          tabs={[
            {
              lang: 'curl',
              label: 'cURL',
              html: `<span class="tok-function">curl</span> -X POST https://api.tradeops.io/v1/workflows/wf_8a2f9c/steps \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span> \\
  -H <span class="tok-string">"Content-Type: application/json"</span> \\
  -d <span class="tok-string">'{
    "title": "Coordinate manifest data",
    "phase": "Pre-arrival",
    "systems": ["AMS via ACE"],
    "docs": ["Carrier manifest"],
    "reality": "Carrier transmits the manifest 24 hours before loading."
  }'</span>`,
            },
            {
              lang: 'js',
              label: 'Node.js',
              html: `<span class="tok-keyword">const</span> step = <span class="tok-keyword">await</span> client.workflows.<span class="tok-function">addStep</span>(<span class="tok-string">'wf_8a2f9c'</span>, {
  title: <span class="tok-string">'Coordinate manifest data'</span>,
  phase: <span class="tok-string">'Pre-arrival'</span>,
  systems: [<span class="tok-string">'AMS via ACE'</span>],
  docs: [<span class="tok-string">'Carrier manifest'</span>],
  reality: <span class="tok-string">'Carrier transmits the manifest 24 hours before loading.'</span>
});`,
            },
            {
              lang: 'py',
              label: 'Python',
              html: `step = client.workflows.<span class="tok-function">add_step</span>(
    <span class="tok-string">"wf_8a2f9c"</span>,
    title=<span class="tok-string">"Coordinate manifest data"</span>,
    phase=<span class="tok-string">"Pre-arrival"</span>,
    systems=[<span class="tok-string">"AMS via ACE"</span>],
    docs=[<span class="tok-string">"Carrier manifest"</span>],
    reality=<span class="tok-string">"Carrier transmits the manifest 24 hours before loading."</span>
)`,
            },
          ]}
        />
      </Endpoint>

      {/* UPDATE STEP */}
      <Endpoint
        id="update-step"
        method="patch"
        path={<>/v1/workflows/<span className="param">{'{workflow_id}'}</span>/steps/<span className="param">{'{step_id}'}</span></>}
      >
        <h3 className="endpoint-title">Update step</h3>
        <p className="endpoint-desc">
          Partially updates a step. Only the supplied fields are modified; the
          others retain their current values.
        </p>

        <CodeBlock
          tabs={[
            {
              lang: 'curl',
              label: 'cURL',
              html: `<span class="tok-function">curl</span> -X PATCH https://api.tradeops.io/v1/workflows/wf_8a2f9c/steps/st_2 \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span> \\
  -H <span class="tok-string">"Content-Type: application/json"</span> \\
  -d <span class="tok-string">'{ "warn": "24-hour deadline", "danger": true }'</span>`,
            },
            {
              lang: 'js',
              label: 'Node.js',
              html: `<span class="tok-keyword">await</span> client.workflows.<span class="tok-function">updateStep</span>(<span class="tok-string">'wf_8a2f9c'</span>, <span class="tok-string">'st_2'</span>, {
  warn: <span class="tok-string">'24-hour deadline'</span>,
  danger: <span class="tok-boolean">true</span>
});`,
            },
            {
              lang: 'py',
              label: 'Python',
              html: `client.workflows.<span class="tok-function">update_step</span>(
    <span class="tok-string">"wf_8a2f9c"</span>, <span class="tok-string">"st_2"</span>,
    warn=<span class="tok-string">"24-hour deadline"</span>,
    danger=<span class="tok-boolean">True</span>
)`,
            },
          ]}
        />
      </Endpoint>

      {/* DELETE STEP */}
      <Endpoint
        id="delete-step"
        method="delete"
        path={<>/v1/workflows/<span className="param">{'{workflow_id}'}</span>/steps/<span className="param">{'{step_id}'}</span></>}
      >
        <h3 className="endpoint-title">Delete step</h3>
        <p className="endpoint-desc">Removes a step and re-indexes the positions of the remaining steps.</p>

        <CodeBlock
          tabs={[
            {
              lang: 'curl',
              label: 'cURL',
              html: `<span class="tok-function">curl</span> -X DELETE https://api.tradeops.io/v1/workflows/wf_8a2f9c/steps/st_2 \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span>`,
            },
            { lang: 'js', label: 'Node.js', html: `<span class="tok-keyword">await</span> client.workflows.<span class="tok-function">deleteStep</span>(<span class="tok-string">'wf_8a2f9c'</span>, <span class="tok-string">'st_2'</span>);` },
            { lang: 'py', label: 'Python', html: `client.workflows.<span class="tok-function">delete_step</span>(<span class="tok-string">"wf_8a2f9c"</span>, <span class="tok-string">"st_2"</span>)` },
          ]}
        />
        <p>Returns <span className="status-badge status-2xx">204 No Content</span> on success.</p>
      </Endpoint>

      {/* REORDER STEPS */}
      <Endpoint
        id="reorder-steps"
        method="post"
        path={<>/v1/workflows/<span className="param">{'{workflow_id}'}</span>/steps/reorder</>}
      >
        <h3 className="endpoint-title">Reorder steps</h3>
        <p className="endpoint-desc">
          Applies a new order to the steps in a workflow in a single request. The
          array must contain every step id in the workflow exactly once.
        </p>

        <h4>Body parameters</h4>
        <ApiTable
          head={['Name', 'Type', 'Description']}
          rows={[[
            <span key="n"><span className="param-name">order</span><span className="required">required</span></span>,
            <span className="param-type" key="t">string[]</span>,
            'Step ids in their new order, from first to last.',
          ]]}
        />

        <CodeBlock
          tabs={[
            {
              lang: 'curl',
              label: 'cURL',
              html: `<span class="tok-function">curl</span> -X POST https://api.tradeops.io/v1/workflows/wf_8a2f9c/steps/reorder \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span> \\
  -H <span class="tok-string">"Content-Type: application/json"</span> \\
  -d <span class="tok-string">'{ "order": ["st_3", "st_1", "st_2"] }'</span>`,
            },
            {
              lang: 'js',
              label: 'Node.js',
              html: `<span class="tok-keyword">await</span> client.workflows.<span class="tok-function">reorderSteps</span>(<span class="tok-string">'wf_8a2f9c'</span>, {
  order: [<span class="tok-string">'st_3'</span>, <span class="tok-string">'st_1'</span>, <span class="tok-string">'st_2'</span>]
});`,
            },
            {
              lang: 'py',
              label: 'Python',
              html: `client.workflows.<span class="tok-function">reorder_steps</span>(
    <span class="tok-string">"wf_8a2f9c"</span>,
    order=[<span class="tok-string">"st_3"</span>, <span class="tok-string">"st_1"</span>, <span class="tok-string">"st_2"</span>]
)`,
            },
          ]}
        />
      </Endpoint>
    </section>
  );
}

/* ----------------------------------------------
   TEMPLATES
---------------------------------------------- */
function TemplatesApi() {
  return (
    <section className="article-section">
      <div className="section-eyebrow">Templates</div>
      <h2>Templates API</h2>
      <p className="lead">
        Templates are curated workflows maintained by TradeOps. The four built-in
        templates — manufacturing, customs, freight, and statutory — can be
        installed into any workspace.
      </p>

      <Endpoint id="list-templates" method="get" path="/v1/templates">
        <h3 className="endpoint-title">List templates</h3>
        <p className="endpoint-desc">
          Returns the template library. Every template carries its type, its step
          count, and a preview of its first three steps.
        </p>

        <CodeBlock
          tabs={[
            { lang: 'curl', label: 'cURL', html: `<span class="tok-function">curl</span> https://api.tradeops.io/v1/templates \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span>` },
            { lang: 'js', label: 'Node.js', html: `<span class="tok-keyword">const</span> templates = <span class="tok-keyword">await</span> client.templates.<span class="tok-function">list</span>();` },
            { lang: 'py', label: 'Python', html: `templates = client.templates.<span class="tok-function">list</span>()` },
          ]}
        />

        <CodeBlock
          tabs={[{
            lang: 'json',
            label: '200 OK',
            html: `<span class="tok-punct">{</span>
  <span class="tok-property">"data"</span><span class="tok-punct">:</span> <span class="tok-punct">[</span>
    <span class="tok-punct">{</span>
      <span class="tok-property">"key"</span><span class="tok-punct">:</span> <span class="tok-string">"manufacturing_default"</span><span class="tok-punct">,</span>
      <span class="tok-property">"name"</span><span class="tok-punct">:</span> <span class="tok-string">"Manufacturing &amp; FIZ"</span><span class="tok-punct">,</span>
      <span class="tok-property">"type"</span><span class="tok-punct">:</span> <span class="tok-string">"manufacturing"</span><span class="tok-punct">,</span>
      <span class="tok-property">"step_count"</span><span class="tok-punct">:</span> <span class="tok-number">12</span><span class="tok-punct">,</span>
      <span class="tok-property">"description"</span><span class="tok-punct">:</span> <span class="tok-string">"Bonded production lifecycle"</span>
    <span class="tok-punct">},</span>
    <span class="tok-punct">{</span>
      <span class="tok-property">"key"</span><span class="tok-punct">:</span> <span class="tok-string">"customs_default"</span><span class="tok-punct">,</span>
      <span class="tok-property">"name"</span><span class="tok-punct">:</span> <span class="tok-string">"Customs broker"</span><span class="tok-punct">,</span>
      <span class="tok-property">"type"</span><span class="tok-punct">:</span> <span class="tok-string">"customs"</span><span class="tok-punct">,</span>
      <span class="tok-property">"step_count"</span><span class="tok-punct">:</span> <span class="tok-number">10</span><span class="tok-punct">,</span>
      <span class="tok-property">"description"</span><span class="tok-punct">:</span> <span class="tok-string">"Import entry lifecycle"</span>
    <span class="tok-punct">},</span>
    <span class="tok-punct">{</span>
      <span class="tok-property">"key"</span><span class="tok-punct">:</span> <span class="tok-string">"freight_default"</span><span class="tok-punct">,</span>
      <span class="tok-property">"name"</span><span class="tok-punct">:</span> <span class="tok-string">"Freight broker"</span><span class="tok-punct">,</span>
      <span class="tok-property">"type"</span><span class="tok-punct">:</span> <span class="tok-string">"freight"</span><span class="tok-punct">,</span>
      <span class="tok-property">"step_count"</span><span class="tok-punct">:</span> <span class="tok-number">8</span><span class="tok-punct">,</span>
      <span class="tok-property">"description"</span><span class="tok-punct">:</span> <span class="tok-string">"Load lifecycle"</span>
    <span class="tok-punct">},</span>
    <span class="tok-punct">{</span>
      <span class="tok-property">"key"</span><span class="tok-punct">:</span> <span class="tok-string">"statutory_default"</span><span class="tok-punct">,</span>
      <span class="tok-property">"name"</span><span class="tok-punct">:</span> <span class="tok-string">"Malaysian statutory"</span><span class="tok-punct">,</span>
      <span class="tok-property">"type"</span><span class="tok-punct">:</span> <span class="tok-string">"statutory"</span><span class="tok-punct">,</span>
      <span class="tok-property">"step_count"</span><span class="tok-punct">:</span> <span class="tok-number">6</span><span class="tok-punct">,</span>
      <span class="tok-property">"description"</span><span class="tok-punct">:</span> <span class="tok-string">"Statutory compliance calendar"</span>
    <span class="tok-punct">}</span>
  <span class="tok-punct">]</span>
<span class="tok-punct">}</span>`,
          }]}
        />
      </Endpoint>

      <Endpoint
        id="get-template"
        method="get"
        path={<>/v1/templates/<span className="param">{'{template_key}'}</span></>}
      >
        <h3 className="endpoint-title">Retrieve template</h3>
        <p className="endpoint-desc">
          Returns the full step list for a template, ready to be installed.
        </p>

        <CodeBlock
          tabs={[
            { lang: 'curl', label: 'cURL', html: `<span class="tok-function">curl</span> https://api.tradeops.io/v1/templates/customs_default \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span>` },
            { lang: 'js', label: 'Node.js', html: `<span class="tok-keyword">const</span> tpl = <span class="tok-keyword">await</span> client.templates.<span class="tok-function">get</span>(<span class="tok-string">'customs_default'</span>);` },
            { lang: 'py', label: 'Python', html: `tpl = client.templates.<span class="tok-function">get</span>(<span class="tok-string">"customs_default"</span>)` },
          ]}
        />
      </Endpoint>

      <Endpoint
        id="install-template"
        method="post"
        path={<>/v1/workflows/<span className="param">{'{workflow_id}'}</span>/install-template</>}
      >
        <h3 className="endpoint-title">Install template</h3>
        <p className="endpoint-desc">
          Copies every step from a template into an existing workflow. By default,
          existing steps are preserved and the template steps are appended; pass{' '}
          <code>replace: true</code> to clear first.
        </p>

        <h4>Body parameters</h4>
        <ApiTable
          head={['Name', 'Type', 'Description']}
          rows={[
            [<span key="n"><span className="param-name">template_key</span><span className="required">required</span></span>, <span className="param-type" key="t">string</span>, <>One of the template keys returned by <a href="#list-templates">List templates</a>.</>],
            [<span key="n"><span className="param-name">replace</span><span className="optional">optional</span></span>, <span className="param-type" key="t">boolean</span>, <>If <code>true</code>, deletes existing steps first. Defaults to <code>false</code>.</>],
          ]}
        />

        <CodeBlock
          tabs={[
            {
              lang: 'curl',
              label: 'cURL',
              html: `<span class="tok-function">curl</span> -X POST https://api.tradeops.io/v1/workflows/wf_8a2f9c/install-template \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span> \\
  -H <span class="tok-string">"Content-Type: application/json"</span> \\
  -d <span class="tok-string">'{ "template_key": "customs_default", "replace": true }'</span>`,
            },
            {
              lang: 'js',
              label: 'Node.js',
              html: `<span class="tok-keyword">await</span> client.workflows.<span class="tok-function">installTemplate</span>(<span class="tok-string">'wf_8a2f9c'</span>, {
  template_key: <span class="tok-string">'customs_default'</span>,
  replace: <span class="tok-boolean">true</span>
});`,
            },
            {
              lang: 'py',
              label: 'Python',
              html: `client.workflows.<span class="tok-function">install_template</span>(
    <span class="tok-string">"wf_8a2f9c"</span>,
    template_key=<span class="tok-string">"customs_default"</span>,
    replace=<span class="tok-boolean">True</span>
)`,
            },
          ]}
        />
      </Endpoint>
    </section>
  );
}

/* ----------------------------------------------
   DOCUMENTS
---------------------------------------------- */
function DocumentsApi() {
  return (
    <section className="article-section">
      <div className="section-eyebrow">Documents</div>
      <h2>Documents API</h2>
      <p className="lead">
        Standard trade documents are available as structured JSON or as generated
        PDFs. Each step in a workflow can reference a document template by key —
        the same keys used across the whole TradeOps platform.
      </p>

      <h3>Available document keys</h3>
      <ApiTable
        head={['Key', 'Label', 'Category']}
        rows={[
          [<span className="param-name" key="1">purchase_order</span>, 'Purchase Order', 'Manufacturing'],
          [<span className="param-name" key="2">bonded_entry</span>, 'Bonded Entry Declaration', 'Manufacturing'],
          [<span className="param-name" key="3">quality_inspection</span>, 'Incoming Quality Inspection', 'Manufacturing'],
          [<span className="param-name" key="4">bonded_ledger</span>, 'Bonded Stock Ledger', 'Manufacturing'],
          [<span className="param-name" key="5">rwa_token</span>, 'RWA Tokenization Certificate', 'Manufacturing'],
          [<span className="param-name" key="6">isf_filing</span>, 'Importer Security Filing (ISF-10)', 'Customs'],
          [<span className="param-name" key="7">cbp_3461</span>, 'CBP Form 3461', 'Customs'],
          [<span className="param-name" key="8">cbp_7501</span>, 'CBP Form 7501', 'Customs'],
          [<span className="param-name" key="9">bill_of_lading</span>, 'Ocean Bill of Lading', 'Customs'],
          [<span className="param-name" key="10">certificate_of_origin</span>, 'Certificate of Origin', 'Customs'],
          [<span className="param-name" key="11">rate_confirmation</span>, 'Rate Confirmation', 'Freight'],
          [<span className="param-name" key="12">freight_bol</span>, 'Freight Bill of Lading', 'Freight'],
          [<span className="param-name" key="13">pod</span>, 'Proof of Delivery', 'Freight'],
          [<span className="param-name" key="14">epf_form_a</span>, 'EPF Form A (KWSP)', 'Statutory'],
          [<span className="param-name" key="15">socso_form_2</span>, 'SOCSO Form 2 (PERKESO)', 'Statutory'],
          [<span className="param-name" key="16">lhdn_form_e</span>, 'LHDN Form E', 'Statutory'],
          [<span className="param-name" key="17">plks</span>, 'PLKS — Temporary Employment Pass', 'Statutory'],
          [<span className="param-name" key="18">fomema</span>, 'FOMEMA Registration', 'Statutory'],
        ]}
      />

      <Endpoint id="list-documents" method="get" path="/v1/documents">
        <h3 className="endpoint-title">List documents</h3>
        <p className="endpoint-desc">
          Returns every document template available in the workspace, with its
          key, label, and category.
        </p>

        <CodeBlock
          tabs={[
            { lang: 'curl', label: 'cURL', html: `<span class="tok-function">curl</span> https://api.tradeops.io/v1/documents \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span>` },
            { lang: 'js', label: 'Node.js', html: `<span class="tok-keyword">const</span> docs = <span class="tok-keyword">await</span> client.documents.<span class="tok-function">list</span>();` },
            { lang: 'py', label: 'Python', html: `docs = client.documents.<span class="tok-function">list</span>()` },
          ]}
        />
      </Endpoint>

      <Endpoint
        id="get-document"
        method="get"
        path={<>/v1/documents/<span className="param">{'{document_key}'}</span></>}
      >
        <h3 className="endpoint-title">Retrieve document</h3>
        <p className="endpoint-desc">
          Returns the document template as structured JSON: metadata, fields,
          table rows, signatures, and footer.
        </p>

        <CodeBlock
          tabs={[
            { lang: 'curl', label: 'cURL', html: `<span class="tok-function">curl</span> https://api.tradeops.io/v1/documents/cbp_7501 \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span>` },
            { lang: 'js', label: 'Node.js', html: `<span class="tok-keyword">const</span> doc = <span class="tok-keyword">await</span> client.documents.<span class="tok-function">get</span>(<span class="tok-string">'cbp_7501'</span>);` },
            { lang: 'py', label: 'Python', html: `doc = client.documents.<span class="tok-function">get</span>(<span class="tok-string">"cbp_7501"</span>)` },
          ]}
        />

        <CodeBlock
          tabs={[{
            lang: 'json',
            label: '200 OK',
            html: `<span class="tok-punct">{</span>
  <span class="tok-property">"key"</span><span class="tok-punct">:</span> <span class="tok-string">"cbp_7501"</span><span class="tok-punct">,</span>
  <span class="tok-property">"label"</span><span class="tok-punct">:</span> <span class="tok-string">"CBP Form 7501 — Entry Summary"</span><span class="tok-punct">,</span>
  <span class="tok-property">"agency"</span><span class="tok-punct">:</span> <span class="tok-string">"U.S. Customs and Border Protection"</span><span class="tok-punct">,</span>
  <span class="tok-property">"form_title"</span><span class="tok-punct">:</span> <span class="tok-string">"ENTRY SUMMARY"</span><span class="tok-punct">,</span>
  <span class="tok-property">"form_sub"</span><span class="tok-punct">:</span> <span class="tok-string">"CBP Form 7501"</span><span class="tok-punct">,</span>
  <span class="tok-property">"meta"</span><span class="tok-punct">:</span> <span class="tok-punct">{</span>
    <span class="tok-property">"Entry No."</span><span class="tok-punct">:</span> <span class="tok-string">"7TQ-004281-3"</span><span class="tok-punct">,</span>
    <span class="tok-property">"OMB No."</span><span class="tok-punct">:</span> <span class="tok-string">"1651-0022"</span>
  <span class="tok-punct">},</span>
  <span class="tok-property">"fields"</span><span class="tok-punct">:</span> <span class="tok-punct">[</span>
    <span class="tok-punct">{</span> <span class="tok-property">"label"</span><span class="tok-punct">:</span> <span class="tok-string">"Filer Code / Entry No."</span><span class="tok-punct">,</span> <span class="tok-property">"value"</span><span class="tok-punct">:</span> <span class="tok-string">"7TQ-004281-3"</span> <span class="tok-punct">},</span>
    <span class="tok-punct">{</span> <span class="tok-property">"label"</span><span class="tok-punct">:</span> <span class="tok-string">"Entry Type"</span><span class="tok-punct">,</span> <span class="tok-property">"value"</span><span class="tok-punct">:</span> <span class="tok-string">"01"</span> <span class="tok-punct">}</span>
  <span class="tok-punct">],</span>
  <span class="tok-property">"table"</span><span class="tok-punct">:</span> <span class="tok-punct">{</span>
    <span class="tok-property">"head"</span><span class="tok-punct">:</span> <span class="tok-punct">[</span><span class="tok-string">"Line"</span><span class="tok-punct">,</span> <span class="tok-string">"Description"</span><span class="tok-punct">,</span> <span class="tok-string">"HTSUS"</span><span class="tok-punct">,</span> <span class="tok-string">"Entered Value"</span><span class="tok-punct">,</span> <span class="tok-string">"Duty"</span><span class="tok-punct">],</span>
    <span class="tok-property">"rows"</span><span class="tok-punct">:</span> <span class="tok-punct">[</span>
      <span class="tok-punct">[</span><span class="tok-string">"001"</span><span class="tok-punct">,</span> <span class="tok-string">"Aluminium housing"</span><span class="tok-punct">,</span> <span class="tok-string">"7616.99.5190"</span><span class="tok-punct">,</span> <span class="tok-string">"11,640.00"</span><span class="tok-punct">,</span> <span class="tok-string">"291.00"</span><span class="tok-punct">]</span>
    <span class="tok-punct">],</span>
    <span class="tok-property">"total"</span><span class="tok-punct">:</span> <span class="tok-punct">[</span><span class="tok-string">""</span><span class="tok-punct">,</span> <span class="tok-string">"TOTAL"</span><span class="tok-punct">,</span> <span class="tok-string">""</span><span class="tok-punct">,</span> <span class="tok-string">"17,676.00"</span><span class="tok-punct">,</span> <span class="tok-string">"359.04"</span><span class="tok-punct">]</span>
  <span class="tok-punct">},</span>
  <span class="tok-property">"signatures"</span><span class="tok-punct">:</span> <span class="tok-punct">[</span>
    <span class="tok-punct">{</span> <span class="tok-property">"label"</span><span class="tok-punct">:</span> <span class="tok-string">"IMPORTER OF RECORD"</span><span class="tok-punct">,</span> <span class="tok-property">"script"</span><span class="tok-punct">:</span> <span class="tok-string">"TradeOps Distribution Inc."</span> <span class="tok-punct">}</span>
  <span class="tok-punct">]</span>
<span class="tok-punct">}</span>`,
          }]}
        />
      </Endpoint>

      <Endpoint
        id="generate-pdf"
        method="post"
        path={<>/v1/documents/<span className="param">{'{document_key}'}</span>/pdf</>}
      >
        <h3 className="endpoint-title">Generate PDF</h3>
        <p className="endpoint-desc">
          Renders the document as a print-ready PDF and returns a signed download
          URL valid for 5 minutes. Optionally supply overrides to fill fields
          with live data from your system.
        </p>

        <h4>Body parameters</h4>
        <ApiTable
          head={['Name', 'Type', 'Description']}
          rows={[
            [<span key="n"><span className="param-name">overrides</span><span className="optional">optional</span></span>, <span className="param-type" key="t">object</span>, 'Map of field labels to replacement values. Useful for stamping live PO numbers, B/L numbers, or invoice amounts.'],
            [<span key="n"><span className="param-name">paper</span><span className="optional">optional</span></span>, <span className="param-type" key="t">string</span>, <><code>a4</code> (default) or <code>letter</code>.</>],
            [<span key="n"><span className="param-name">include_stamp</span><span className="optional">optional</span></span>, <span className="param-type" key="t">boolean</span>, <>Whether to include the red &quot;APPROVED / RELEASED / FILED&quot; stamp. Defaults to <code>true</code>.</>],
          ]}
        />

        <CodeBlock
          tabs={[
            {
              lang: 'curl',
              label: 'cURL',
              html: `<span class="tok-function">curl</span> -X POST https://api.tradeops.io/v1/documents/cbp_7501/pdf \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span> \\
  -H <span class="tok-string">"Content-Type: application/json"</span> \\
  -d <span class="tok-string">'{
    "overrides": {
      "Entry No.": "7TQ-009912-1",
      "Summary Date": "15 MAR 2026"
    },
    "paper": "letter",
    "include_stamp": true
  }'</span>`,
            },
            {
              lang: 'js',
              label: 'Node.js',
              html: `<span class="tok-keyword">const</span> pdf = <span class="tok-keyword">await</span> client.documents.<span class="tok-function">pdf</span>(<span class="tok-string">'cbp_7501'</span>, {
  overrides: {
    <span class="tok-string">'Entry No.'</span>: <span class="tok-string">'7TQ-009912-1'</span>,
    <span class="tok-string">'Summary Date'</span>: <span class="tok-string">'15 MAR 2026'</span>
  },
  paper: <span class="tok-string">'letter'</span>,
  include_stamp: <span class="tok-boolean">true</span>
});`,
            },
            {
              lang: 'py',
              label: 'Python',
              html: `pdf = client.documents.<span class="tok-function">pdf</span>(
    <span class="tok-string">"cbp_7501"</span>,
    overrides={
        <span class="tok-string">"Entry No."</span>: <span class="tok-string">"7TQ-009912-1"</span>,
        <span class="tok-string">"Summary Date"</span>: <span class="tok-string">"15 MAR 2026"</span>
    },
    paper=<span class="tok-string">"letter"</span>,
    include_stamp=<span class="tok-boolean">True</span>
)`,
            },
          ]}
        />

        <CodeBlock
          tabs={[{
            lang: 'json',
            label: '200 OK',
            html: `<span class="tok-punct">{</span>
  <span class="tok-property">"id"</span><span class="tok-punct">:</span> <span class="tok-string">"pdf_4c8b2f91"</span><span class="tok-punct">,</span>
  <span class="tok-property">"document_key"</span><span class="tok-punct">:</span> <span class="tok-string">"cbp_7501"</span><span class="tok-punct">,</span>
  <span class="tok-property">"url"</span><span class="tok-punct">:</span> <span class="tok-string">"https://files.tradeops.io/pdf/pdf_4c8b2f91?token=..."</span><span class="tok-punct">,</span>
  <span class="tok-property">"expires_at"</span><span class="tok-punct">:</span> <span class="tok-string">"2026-03-15T12:05:00Z"</span><span class="tok-punct">,</span>
  <span class="tok-property">"size_bytes"</span><span class="tok-punct">:</span> <span class="tok-number">184320</span>
<span class="tok-punct">}</span>`,
          }]}
        />
      </Endpoint>
    </section>
  );
}

/* ----------------------------------------------
   WEBHOOKS
---------------------------------------------- */
function WebhooksApi() {
  return (
    <section className="article-section">
      <div className="section-eyebrow">Webhooks</div>
      <h2>Webhooks</h2>
      <p className="lead">
        Webhooks let you receive real-time HTTP callbacks when workflows change,
        documents are generated, or statutory deadlines approach. Every delivery
        is signed with HMAC-SHA256 using your endpoint&apos;s signing secret.
      </p>

      <Endpoint id="list-webhooks" method="get" path="/v1/webhooks">
        <h3 className="endpoint-title">List webhooks</h3>
        <p className="endpoint-desc">Returns every webhook configured for the workspace.</p>

        <CodeBlock
          tabs={[{ lang: 'curl', label: 'cURL', html: `<span class="tok-function">curl</span> https://api.tradeops.io/v1/webhooks \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span>` }]}
        />
      </Endpoint>

      <Endpoint id="create-webhook" method="post" path="/v1/webhooks">
        <h3 className="endpoint-title">Create webhook</h3>
        <p className="endpoint-desc">
          Registers a new webhook endpoint. TradeOps sends a test event
          immediately; the webhook stays inactive until that test succeeds.
        </p>

        <h4>Body parameters</h4>
        <ApiTable
          head={['Name', 'Type', 'Description']}
          rows={[
            [<span key="n"><span className="param-name">url</span><span className="required">required</span></span>, <span className="param-type" key="t">string</span>, 'HTTPS endpoint. Must respond 200 within 5 seconds.'],
            [<span key="n"><span className="param-name">events</span><span className="required">required</span></span>, <span className="param-type" key="t">string[]</span>, <>Event names to subscribe to. See <a href="#webhook-events">Event types</a>.</>],
            [<span key="n"><span className="param-name">description</span><span className="optional">optional</span></span>, <span className="param-type" key="t">string</span>, 'Free-text description.'],
          ]}
        />

        <CodeBlock
          tabs={[
            {
              lang: 'curl',
              label: 'cURL',
              html: `<span class="tok-function">curl</span> -X POST https://api.tradeops.io/v1/webhooks \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span> \\
  -H <span class="tok-string">"Content-Type: application/json"</span> \\
  -d <span class="tok-string">'{
    "url": "https://api.acme.com/tradeops/webhook",
    "events": ["workflow.updated", "document.generated", "deadline.approaching"]
  }'</span>`,
            },
            {
              lang: 'js',
              label: 'Node.js',
              html: `<span class="tok-keyword">const</span> wh = <span class="tok-keyword">await</span> client.webhooks.<span class="tok-function">create</span>({
  url: <span class="tok-string">'https://api.acme.com/tradeops/webhook'</span>,
  events: [<span class="tok-string">'workflow.updated'</span>, <span class="tok-string">'document.generated'</span>, <span class="tok-string">'deadline.approaching'</span>]
});`,
            },
            {
              lang: 'py',
              label: 'Python',
              html: `wh = client.webhooks.<span class="tok-function">create</span>(
    url=<span class="tok-string">"https://api.acme.com/tradeops/webhook"</span>,
    events=[<span class="tok-string">"workflow.updated"</span>, <span class="tok-string">"document.generated"</span>, <span class="tok-string">"deadline.approaching"</span>]
)`,
            },
          ]}
        />

        <Callout variant="info">
          <p>
            The response includes a <code>signing_secret</code> that is shown{' '}
            <strong>only once</strong>. Store it securely — you&apos;ll need it to
            verify the <code>X-TradeOps-Signature</code> header on every delivery.
          </p>
        </Callout>
      </Endpoint>

      <Endpoint
        id="delete-webhook"
        method="delete"
        path={<>/v1/webhooks/<span className="param">{'{webhook_id}'}</span></>}
      >
        <h3 className="endpoint-title">Delete webhook</h3>
        <p className="endpoint-desc">
          Removes the webhook and stops all deliveries. Pending retries are dropped.
        </p>

        <CodeBlock
          tabs={[{ lang: 'curl', label: 'cURL', html: `<span class="tok-function">curl</span> -X DELETE https://api.tradeops.io/v1/webhooks/wh_2f9a8c \\
  -H <span class="tok-string">"Authorization: Bearer sk_live_..."</span>` }]}
        />
      </Endpoint>

      <Endpoint id="webhook-events" method="get" path={<span style={{ color: 'var(--text-primary)' }}>Event types</span>}>
        <h3 className="endpoint-title">Event types</h3>
        <p className="endpoint-desc">
          Webhook payloads share a common envelope. The <code>type</code> field
          tells you which event fired.
        </p>

        <ApiTable
          head={['Event', 'Fires when']}
          rows={[
            [<span className="param-name" key="1">workflow.created</span>, 'A new workflow is created.'],
            [<span className="param-name" key="2">workflow.updated</span>, "A workflow's name, type, or description changes."],
            [<span className="param-name" key="3">workflow.deleted</span>, 'A workflow is deleted.'],
            [<span className="param-name" key="4">step.created</span>, 'A step is added to a workflow.'],
            [<span className="param-name" key="5">step.updated</span>, "A step's fields change."],
            [<span className="param-name" key="6">step.deleted</span>, 'A step is removed.'],
            [<span className="param-name" key="7">document.generated</span>, 'A PDF is generated for a document template.'],
            [<span className="param-name" key="8">deadline.approaching</span>, 'A statutory deadline is 7, 3, or 1 day away.'],
          ]}
        />

        <CodeBlock
          tabs={[{
            lang: 'json',
            label: 'Payload',
            html: `<span class="tok-punct">{</span>
  <span class="tok-property">"id"</span><span class="tok-punct">:</span> <span class="tok-string">"evt_9a2f3c81"</span><span class="tok-punct">,</span>
  <span class="tok-property">"type"</span><span class="tok-punct">:</span> <span class="tok-string">"workflow.updated"</span><span class="tok-punct">,</span>
  <span class="tok-property">"created_at"</span><span class="tok-punct">:</span> <span class="tok-string">"2026-03-16T12:34:00Z"</span><span class="tok-punct">,</span>
  <span class="tok-property">"workspace_id"</span><span class="tok-punct">:</span> <span class="tok-string">"ws_acme"</span><span class="tok-punct">,</span>
  <span class="tok-property">"data"</span><span class="tok-punct">:</span> <span class="tok-punct">{</span>
    <span class="tok-property">"workflow_id"</span><span class="tok-punct">:</span> <span class="tok-string">"wf_8a2f9c"</span><span class="tok-punct">,</span>
    <span class="tok-property">"changes"</span><span class="tok-punct">:</span> <span class="tok-punct">{</span>
      <span class="tok-property">"name"</span><span class="tok-punct">:</span> <span class="tok-punct">{</span> <span class="tok-property">"from"</span><span class="tok-punct">:</span> <span class="tok-string">"Q2 Import Clearance"</span><span class="tok-punct">,</span> <span class="tok-property">"to"</span><span class="tok-punct">:</span> <span class="tok-string">"Q2 Import Clearance (revised)"</span> <span class="tok-punct">}</span>
    <span class="tok-punct">}</span>
  <span class="tok-punct">}</span>
<span class="tok-punct">}</span>`,
          }]}
        />

        <h4>Signature verification</h4>
        <p>
          Every delivery includes an <code>X-TradeOps-Signature</code> header with
          an HMAC-SHA256 of the raw request body, using your endpoint&apos;s
          signing secret. Verify it before processing:
        </p>

        <CodeBlock
          tabs={[
            {
              lang: 'js',
              label: 'Node.js',
              html: `<span class="tok-keyword">import</span> crypto <span class="tok-keyword">from</span> <span class="tok-string">'node:crypto'</span>;

<span class="tok-keyword">function</span> <span class="tok-function">verifySignature</span>(rawBody, signature, secret) {
  <span class="tok-keyword">const</span> expected = crypto
    .<span class="tok-function">createHmac</span>(<span class="tok-string">'sha256'</span>, secret)
    .<span class="tok-function">update</span>(rawBody)
    .<span class="tok-function">digest</span>(<span class="tok-string">'hex'</span>);

  <span class="tok-keyword">return</span> crypto.<span class="tok-function">timingSafeEqual</span>(
    Buffer.<span class="tok-function">from</span>(expected),
    Buffer.<span class="tok-function">from</span>(signature)
  );
}`,
            },
            {
              lang: 'py',
              label: 'Python',
              html: `<span class="tok-keyword">import</span> hmac
<span class="tok-keyword">import</span> hashlib

<span class="tok-keyword">def</span> <span class="tok-function">verify_signature</span>(raw_body, signature, secret):
    expected = hmac.<span class="tok-function">new</span>(
        secret.<span class="tok-function">encode</span>(),
        raw_body.<span class="tok-function">encode</span>(),
        hashlib.sha256
    ).<span class="tok-function">hexdigest</span>()

    <span class="tok-keyword">return</span> hmac.<span class="tok-function">compare_digest</span>(expected, signature)`,
            },
          ]}
        />
      </Endpoint>
    </section>
  );
}

/* ----------------------------------------------
   SDKS & CHANGELOG
---------------------------------------------- */
function Sdks() {
  return (
    <section className="article-section" id="sdks">
      <div className="section-eyebrow">Resources</div>
      <h2>SDKs &amp; Libraries</h2>
      <p>
        First-party SDKs wrap the entire API surface with idiomatic clients. Use
        them to avoid hand-rolling authentication, retries, and pagination.
      </p>

      <ApiTable
        head={['Language', 'Package', 'Install']}
        rows={[
          [<span className="param-name" key="1">Node.js</span>, <code key="1t">@tradeops/sdk</code>, <code key="1i">npm install @tradeops/sdk</code>],
          [<span className="param-name" key="2">Python</span>, <code key="2t">tradeops</code>, <code key="2i">pip install tradeops</code>],
          [<span className="param-name" key="3">Go</span>, <code key="3t">github.com/tradeops/go-sdk</code>, <code key="3i">go get github.com/tradeops/go-sdk</code>],
          [<span className="param-name" key="4">Java</span>, <code key="4t">io.tradeops:sdk</code>, <code key="4i">implementation &apos;io.tradeops:sdk:1.4.0&apos;</code>],
        ]}
      />
    </section>
  );
}

function Changelog() {
  return (
    <section className="article-section" id="changelog">
      <div className="section-eyebrow">Resources</div>
      <h2>Changelog</h2>

      <h3>v1.4 — March 2026</h3>
      <ul>
        <li>Added <code>POST /documents/{'{key}'}/pdf</code> for server-side PDF generation.</li>
        <li>Added <code>document_key</code> field to steps.</li>
        <li>Added <code>deadline.approaching</code> webhook event.</li>
        <li>Deprecated <code>GET /documents/{'{key}'}/render</code> in favour of the new PDF endpoint.</li>
      </ul>

      <h3>v1.3 — January 2026</h3>
      <ul>
        <li>Added reorder endpoint <code>POST /workflows/{'{id}'}/steps/reorder</code>.</li>
        <li>Renamed <code>POST /workflows/{'{id}'}/template</code> to <code>install-template</code>.</li>
        <li>Added <code>total_count</code> to paginated responses.</li>
      </ul>

      <h3>v1.2 — November 2025</h3>
      <ul>
        <li>Initial public release with workflows, steps, templates, and webhooks.</li>
      </ul>
    </section>
  );
}