'use client';

import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';

/* ══════════════════════════════════════════════════════════
   STYLES (unchanged from the original)
   ══════════════════════════════════════════════════════════ */
const CSS = `
  :root{
    --navy:#0e1a2b; --navy-2:#16263d; --navy-3:#1e3350;
    --accent:#2f6bff; --accent-2:#00c2b2;
    --bg:#eef1f7; --card:#ffffff; --line:#e2e8f0;
    --text:#0f172a; --muted:#64748b;
    --ok:#10b981; --warn:#f59e0b; --danger:#ef4444;
    --radius:10px;
    --shadow:0 1px 2px rgba(15,23,42,.06),0 4px 14px rgba(15,23,42,.06);
    font-synthesis:none;
  }
  *{box-sizing:border-box}
  html,body{height:100%}
  body{
    margin:0; background:var(--bg); color:var(--text);
    font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    font-size:13.5px; -webkit-font-smoothing:antialiased;
  }
  button,input,select,textarea{font-family:inherit;font-size:inherit;color:inherit}
  button{cursor:pointer}
  .app{
    --sb-w:224px; --rail-w:372px;
    display:grid;
    grid-template-columns:var(--sb-w) 1fr var(--rail-w);
    grid-template-rows:56px 1fr;
    height:100vh;
    transition:grid-template-columns .2s cubic-bezier(.4,0,.2,1);
  }
  .app.sb-collapsed{--sb-w:58px}
  .app.rail-collapsed{--rail-w:56px}
  .topbar{grid-column:1/-1;display:flex;align-items:center;gap:16px;
    background:var(--navy);color:#e8eefc;padding:0 16px;border-bottom:1px solid #0a1320;z-index:20}
  .sidebar{background:var(--navy);color:#aebbd2;padding:46px 10px 14px;overflow-y:auto;
    position:relative;transition:padding .2s}
  .main{overflow-y:auto;padding:18px 20px 96px}
  .rail{background:var(--card);border-left:1px solid var(--line);display:flex;flex-direction:column;
    overflow:hidden;transition:none}
  .brand{display:flex;align-items:center;gap:10px;font-weight:700;letter-spacing:.2px;color:#fff}
  .brand .mark{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;font-size:14px;
    background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#04121f;font-weight:800}
  .brand small{display:block;font-weight:400;font-size:10.5px;color:#7d8fae;letter-spacing:.4px}
  .searchbox{flex:1;max-width:460px;position:relative}
  .searchbox input{width:100%;background:#1b2c45;border:1px solid #2a3f5e;border-radius:8px;
    padding:7px 10px 7px 30px;color:#dbe6f7;outline:none}
  .searchbox input:focus{border-color:var(--accent)}
  .searchbox svg{position:absolute;left:9px;top:50%;transform:translateY(-50%);opacity:.55}
  .search-results{position:absolute;top:calc(100% + 6px);left:0;right:0;background:#fff;border:1px solid var(--line);
    border-radius:10px;box-shadow:0 14px 34px rgba(15,23,42,.22);overflow:hidden;z-index:40;display:none;max-height:330px;overflow-y:auto}
  .search-results.open{display:block}
  .sr-item{padding:8px 11px;cursor:pointer;border-bottom:1px solid #f1f5f9}
  .sr-item:last-child{border-bottom:0}
  .sr-item:hover,.sr-item.hover{background:#f4f8ff}
  .sr-code{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;font-weight:700;color:#1e293b}
  .sr-desc{font-size:11px;color:var(--muted);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .sr-empty{padding:14px;text-align:center;color:var(--muted);font-size:12px}
  .spacer{flex:1}
  .badge-env{font-size:10.5px;padding:3px 8px;border-radius:99px;background:#14324a;color:#5eead4;border:1px solid #1d4f5e;white-space:nowrap}
  .user{display:flex;align-items:center;gap:8px;font-size:12px;color:#c7d4e8;white-space:nowrap}
  .avatar{width:28px;height:28px;border-radius:50%;background:#27405f;display:grid;place-items:center;font-weight:600;color:#cfe0ff}
  .sb-toggle{position:absolute;top:10px;right:10px;width:26px;height:26px;border-radius:8px;
    border:1px solid #2a3f5e;background:#16263d;color:#a9b8cf;display:grid;place-items:center;
    font-size:13px;line-height:1;transition:.15s;z-index:5}
  .sb-toggle:hover{background:#1e3350;color:#fff;border-color:#3b5880}
  .app.sb-collapsed .sidebar{padding:46px 6px 14px}
  .app.sb-collapsed .sb-toggle{right:calc(50% - 13px);transform:rotate(180deg)}
  .navgroup{margin-bottom:16px}
  .navgroup h4{margin:0 0 6px 10px;font-size:10px;letter-spacing:.9px;text-transform:uppercase;color:#5d7391;
    white-space:nowrap;overflow:hidden}
  .navitem{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;font-size:12.8px;
    color:#a9b8cf;cursor:pointer;border:1px solid transparent;user-select:none;transition:.12s}
  .navitem:hover{background:#16263d;color:#e2ecfb}
  .navitem.active{background:#1d3350;color:#fff;border-color:#27436b}
  .navitem .dot{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.55;flex:0 0 6px}
  .navitem .ini{display:none;width:24px;height:24px;border-radius:7px;background:#1b2c45;
    place-items:center;font-size:11px;font-weight:800;color:#cfe0ff;flex:0 0 24px}
  .navitem.active .ini{background:var(--accent);color:#fff}
  .navitem .lbl{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .app.sb-collapsed .navgroup h4,
  .app.sb-collapsed .navitem .lbl,
  .app.sb-collapsed .navitem .dot{display:none}
  .app.sb-collapsed .navgroup{margin-bottom:8px}
  .app.sb-collapsed .navitem{justify-content:center;padding:6px 0}
  .app.sb-collapsed .navitem .ini{display:grid}
  .card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:14px}
  .card-head{display:flex;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid var(--line);flex-wrap:wrap}
  .card-head h3{margin:0;font-size:13px;font-weight:650;letter-spacing:.1px}
  .card-head .sub{font-size:11.5px;color:var(--muted)}
  .card-body{padding:14px}
  .grid{display:grid;gap:12px}
  .g4{grid-template-columns:repeat(4,1fr)}
  .g3{grid-template-columns:repeat(3,1fr)}
  .g2{grid-template-columns:repeat(2,1fr)}
  @media(max-width:1400px){.g4{grid-template-columns:repeat(2,1fr)}}
  .field{display:flex;flex-direction:column;gap:5px;min-width:0}
  .field label{font-size:10.5px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--muted)}
  .field input,.field select{padding:7px 9px;border:1px solid var(--line);border-radius:8px;background:#fbfcfe;outline:none;width:100%}
  .field input:focus,.field select:focus{border-color:var(--accent);background:#fff;box-shadow:0 0 0 3px rgba(47,107,255,.12)}
  .field input[readonly]{background:#f1f4f9;color:var(--muted)}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:8px;
    border:1px solid var(--line);background:#fff;font-weight:600;font-size:12.5px;color:#334155;transition:.12s;text-decoration:none}
  .btn:hover{background:#f6f8fc;border-color:#cbd5e1}
  .btn-primary{background:var(--accent);border-color:var(--accent);color:#fff}
  .btn-primary:hover{background:#245ae0;border-color:#245ae0}
  .btn-ghost{background:transparent;border-color:transparent;color:var(--muted);padding:5px 8px}
  .btn-ghost:hover{background:#f1f5f9;color:var(--text)}
  .btn-sm{padding:4px 9px;font-size:11.5px;border-radius:7px}
  .btn-danger:hover{background:#fef2f2;border-color:#fecaca;color:var(--danger)}
  .btn:disabled{opacity:.45;cursor:not-allowed}
  .tablewrap{overflow-x:auto}
  table{width:100%;border-collapse:separate;border-spacing:0;min-width:920px}
  thead th{position:sticky;top:0;background:#f7f9fc;text-align:left;font-size:10.5px;letter-spacing:.6px;
    text-transform:uppercase;color:var(--muted);font-weight:650;padding:9px 10px;border-bottom:1px solid var(--line);white-space:nowrap}
  tbody td{padding:7px 10px;border-bottom:1px solid #eef2f7;vertical-align:top}
  tbody tr:hover{background:#fafcff}
  tbody tr.selected{background:#eff5ff;box-shadow:inset 3px 0 0 var(--accent)}
  td input,td select{width:100%;padding:6px 8px;border:1px solid transparent;background:transparent;border-radius:7px;outline:none}
  td input:hover,td select:hover{border-color:var(--line);background:#fff}
  td input:focus,td select:focus{border-color:var(--accent);background:#fff;box-shadow:0 0 0 3px rgba(47,107,255,.12)}
  .col-idx{width:34px;color:var(--muted);font-variant-numeric:tabular-nums;padding-top:13px!important}
  .col-desc{min-width:230px}
  .col-code{width:130px}
  .col-code input{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.4px}
  .col-origin{width:110px}
  .col-num{width:88px}
  .col-num input{text-align:right;font-variant-numeric:tabular-nums}
  .col-duty{width:112px}
  .col-act{width:118px;text-align:right}
  .duty-rate{display:flex;align-items:center;gap:3px;justify-content:flex-end}
  .duty-rate input{width:52px;text-align:right;font-variant-numeric:tabular-nums}
  .duty-amt{text-align:right;font-size:11.5px;color:var(--muted);font-variant-numeric:tabular-nums;margin-top:2px}
  .rowtools{display:flex;gap:2px;justify-content:flex-end}
  .code-chip{font-family:ui-monospace,Menlo,monospace;font-size:11px;background:#eef2ff;color:#3730a3;
    padding:2px 6px;border-radius:5px;display:inline-block}
  @keyframes flash{0%{background:#dbeafe}100%{background:transparent}}
  tr.flash td{animation:flash 1.1s ease}
  .mini{width:100%;border-collapse:collapse;min-width:0}
  .mini thead th{position:static;background:#f7f9fc;font-size:10.5px;letter-spacing:.5px;text-transform:uppercase;
    color:var(--muted);padding:8px 10px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}
  .mini td{padding:8px 10px;border-bottom:1px solid #eef2f7;font-size:12px;vertical-align:middle}
  .mini tr:hover td{background:#fafcff}
  .mini .mono{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;color:#3730a3;white-space:nowrap}
  .totals{display:flex;flex-direction:column;gap:8px;padding:14px}
  .trow{display:flex;justify-content:space-between;font-size:12.8px;color:#475569;align-items:center;gap:12px}
  .trow span:last-child{font-variant-numeric:tabular-nums;font-weight:600;color:var(--text);white-space:nowrap}
  .trow.grand{border-top:1px dashed var(--line);padding-top:10px;margin-top:4px;font-size:15px;color:var(--text);font-weight:700}
  .trow.grand span:last-child{color:var(--accent);font-size:17px}
  .trow .mini-input{width:96px;padding:4px 8px;border:1px solid var(--line);border-radius:7px;background:#fbfcfe;
    text-align:right;outline:none;font-variant-numeric:tabular-nums}
  .trow .mini-input:focus{border-color:var(--accent);background:#fff}
  .trow .cur{font-size:10.5px;color:var(--muted);font-weight:500}
  .tabs{display:flex;align-items:stretch;border-bottom:1px solid var(--line);background:#fbfcfe}
  .tab{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:11px 4px;text-align:center;
    font-size:11.5px;font-weight:600;color:var(--muted);border-bottom:2px solid transparent;background:none;
    border-top:0;border-left:0;border-right:0;white-space:nowrap;overflow:hidden}
  .tab:hover{color:var(--text);background:#f4f7fc}
  .tab.active{color:var(--accent);border-bottom-color:var(--accent);background:#fff}
  .ticon{font-size:12px;line-height:1}
  .rail-toggle{flex:0 0 30px;border:0;border-left:1px solid var(--line);background:transparent;color:var(--muted);
    font-size:12px;line-height:1;transition:.15s}
  .rail-toggle:hover{background:#eef2f7;color:var(--text)}
  .tabpane{display:none;padding:14px;overflow-y:auto;flex:1}
  .tabpane.active{display:block}
  .app.rail-collapsed .tabs{flex-direction:column;border-bottom:0}
  .app.rail-collapsed .tab{flex:0 0 auto;padding:13px 0;border-bottom:0;border-left:2px solid transparent}
  .app.rail-collapsed .tab.active{border-left-color:var(--accent);background:#fff}
  .app.rail-collapsed .tlbl{display:none}
  .app.rail-collapsed .rail-toggle{flex:0 0 30px;border-left:0;border-top:1px solid var(--line);
    width:100%;transform:rotate(180deg)}
  .app.rail-collapsed .tabpane{display:none!important}
  .hint{font-size:11.5px;color:var(--muted);line-height:1.5;margin:0 0 10px}
  .result{border:1px solid var(--line);border-radius:9px;padding:10px;margin-bottom:9px;background:#fff;transition:.12s}
  .result:hover{border-color:#bfd3ff;box-shadow:0 2px 10px rgba(47,107,255,.09)}
  .result .r-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
  .result .r-code{font-family:ui-monospace,Menlo,monospace;font-weight:700;font-size:13px;color:#1e293b}
  .result .r-desc{font-size:11.5px;color:#475569;margin:5px 0 7px;line-height:1.45}
  .result .r-meta{display:flex;gap:12px;font-size:11px;color:var(--muted);flex-wrap:wrap}
  .conf{display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:700;color:var(--ok);white-space:nowrap}
  .conf.low{color:var(--warn)}
  .bar{width:52px;height:5px;border-radius:99px;background:#e8edf5;overflow:hidden}
  .bar i{display:block;height:100%;background:var(--ok);border-radius:99px}
  .conf.low .bar i{background:var(--warn)}
  .empty{text-align:center;color:var(--muted);font-size:12px;padding:26px 10px;line-height:1.6}
  .empty .big{font-size:26px;display:block;margin-bottom:8px;opacity:.35}
  .check{display:flex;gap:9px;padding:9px 0;border-bottom:1px solid #f1f5f9;font-size:12.2px;line-height:1.45}
  .check:last-child{border-bottom:0}
  .check .ico{width:16px;height:16px;border-radius:50%;flex:0 0 16px;display:grid;place-items:center;
    font-size:10px;font-weight:800;color:#fff;margin-top:1px}
  .ico.pass{background:var(--ok)} .ico.warn{background:var(--warn)} .ico.fail{background:var(--danger)} .ico.info{background:#94a3b8}
  .check b{display:block;font-weight:650;color:#1e293b;margin-bottom:1px}
  .check small{color:var(--muted);font-size:11.3px}
  .audit{position:relative;padding-left:16px}
  .audit:before{content:"";position:absolute;left:4px;top:6px;bottom:6px;width:1px;background:var(--line)}
  .aevent{position:relative;padding:0 0 13px 0;font-size:12px;line-height:1.45}
  .aevent:before{content:"";position:absolute;left:-16px;top:5px;width:9px;height:9px;border-radius:50%;
    background:#fff;border:2px solid var(--accent)}
  .aevent time{display:block;font-size:10.5px;color:var(--muted);margin-top:2px}
  .doc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}
  .doc-card{position:relative;border:1px solid var(--line);border-radius:10px;padding:10px;background:#fff;
    display:flex;gap:10px;align-items:flex-start;transition:.14s;cursor:pointer}
  .doc-card:hover{border-color:#bfd3ff;box-shadow:0 4px 16px rgba(47,107,255,.12);transform:translateY(-1px)}
  .doc-thumb{width:40px;height:50px;border-radius:6px;flex:0 0 40px;display:grid;place-items:center;
    font-size:9.5px;font-weight:800;letter-spacing:.5px;border:1px solid #fca5a5;
    background:linear-gradient(160deg,#fee2e2,#fecaca);color:#b91c1c}
  .doc-card.inv .doc-thumb{background:linear-gradient(160deg,#dcfce7,#bbf7d0);border-color:#86efac;color:#15803d}
  .doc-card.pack .doc-thumb{background:linear-gradient(160deg,#dbeafe,#bfdbfe);border-color:#93c5fd;color:#1d4ed8}
  .doc-card.bol .doc-thumb{background:linear-gradient(160deg,#fef3c7,#fde68a);border-color:#fcd34d;color:#a16207}
  .doc-card.permit .doc-thumb{background:linear-gradient(160deg,#ede9fe,#ddd6fe);border-color:#c4b5fd;color:#6d28d9}
  .doc-card.coo .doc-thumb{background:linear-gradient(160deg,#cffafe,#a5f3fc);border-color:#67e8f9;color:#0e7490}
  .doc-info{min-width:0;flex:1}
  .doc-name{font-size:12px;font-weight:650;line-height:1.3;word-break:break-word;color:#1e293b}
  .doc-meta{font-size:10.5px;color:var(--muted);margin-top:3px}
  .doc-badge{display:inline-block;font-size:9.5px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;
    padding:1px 6px;border-radius:99px;background:#eef2ff;color:#3730a3;margin-top:6px}
  .doc-x{position:absolute;top:4px;right:4px;width:20px;height:20px;border-radius:6px;border:0;background:transparent;
    color:#94a3b8;font-size:11px;line-height:1;display:grid;place-items:center;opacity:0;transition:.12s}
  .doc-card:hover .doc-x{opacity:1}
  .doc-x:hover{background:#fef2f2;color:var(--danger)}
  .dropzone{border:1.5px dashed #cbd5e1;border-radius:10px;padding:16px;text-align:center;color:var(--muted);
    font-size:12px;background:#fbfcfe;transition:.15s;cursor:pointer;margin-top:12px;line-height:1.6}
  .dropzone b{color:var(--accent)}
  .dropzone.drag{border-color:var(--accent);background:#eff5ff;color:var(--accent)}
  .doc-req{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
  .req-pill{font-size:10.5px;font-weight:600;padding:3px 8px;border-radius:99px;border:1px solid var(--line);
    background:#fff;color:var(--muted)}
  .req-pill.ok{background:#ecfdf5;border-color:#a7f3d0;color:#047857}
  .req-pill.no{background:#fef2f2;border-color:#fecaca;color:#b91c1c}
  .actionbar{position:fixed;bottom:0;left:0;right:0;height:60px;background:#fff;border-top:1px solid var(--line);
    display:flex;align-items:center;gap:10px;padding:0 20px;box-shadow:0 -4px 16px rgba(15,23,42,.05);z-index:15}
  .actionbar .stat{font-size:12px;color:var(--muted)}
  .actionbar .stat b{color:var(--text)}
  #toasts{position:fixed;bottom:74px;right:18px;display:flex;flex-direction:column;gap:8px;z-index:90}
  .toast{background:#0f172a;color:#e8eefc;padding:10px 14px;border-radius:9px;font-size:12.5px;
    box-shadow:0 8px 24px rgba(15,23,42,.25);display:flex;gap:9px;align-items:center;
    animation:slidein .22s ease;max-width:340px;line-height:1.4}
  .toast.ok{border-left:3px solid var(--ok)} .toast.warn{border-left:3px solid var(--warn)} .toast.err{border-left:3px solid var(--danger)}
  @keyframes slidein{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}
  .modal{position:fixed;inset:0;background:rgba(15,23,42,.62);z-index:80;display:none;
    align-items:center;justify-content:center;padding:24px}
  .modal.open{display:flex}
  .modal-shell{background:#fff;border-radius:14px;width:min(1120px,100%);height:min(880px,100%);
    display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 80px rgba(2,6,23,.45);
    animation:pop .18s ease}
  .modal-shell.sm{width:min(760px,100%);height:auto;max-height:min(800px,100%)}
  @keyframes pop{from{opacity:0;transform:scale(.975)}to{opacity:1;transform:none}}
  .modal-bar{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--line);
    background:#fbfcfe;flex-wrap:wrap}
  .modal-bar .mtitle{font-size:13px;font-weight:650}
  .modal-bar .mmeta{font-size:11px;color:var(--muted)}
  .modal-body{flex:1;overflow:auto;background:#eef1f7}
  .modal-body.pad{padding:16px;background:#fff}
  #pdfFrame{width:100%;height:100%;border:0;display:block;background:#525659}
  .info-block{font-size:12.5px;line-height:1.6;color:#334155}
  .info-block h4{margin:16px 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:var(--muted)}
  .info-block h4:first-child{margin-top:0}
  .info-block ul{margin:6px 0 0;padding-left:18px}
  .view-head{display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;flex-wrap:wrap}
  .view-head h2{margin:0;font-size:17px;font-weight:700;letter-spacing:-.2px}
  .view-head p{margin:4px 0 0;font-size:12px;color:var(--muted);line-height:1.5;max-width:640px}
  .view-toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
  .view-toolbar input[type=search],.view-toolbar input[type=text],.view-toolbar select{
    padding:7px 10px;border:1px solid var(--line);border-radius:8px;background:#fff;outline:none;font-size:12.5px}
  .view-toolbar input:focus,.view-toolbar select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(47,107,255,.12)}
  .stat-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
  .chip{font-size:11.5px;font-weight:600;padding:5px 11px;border-radius:99px;background:#fff;
    border:1px solid var(--line);color:#475569}
  .chip b{color:var(--text)}
  .chip.ok{background:#ecfdf5;border-color:#a7f3d0;color:#047857}
  .chip.ok b{color:#065f46}
  .chip.warn{background:#fffbeb;border-color:#fde68a;color:#b45309}
  .chip.warn b{color:#92400e}
  .chip.err{background:#fef2f2;border-color:#fecaca;color:#b91c1c}
  .chip.info{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8}
  .verdict{padding:11px 13px;border-radius:9px;font-size:12.5px;line-height:1.55;border:1px solid}
  .verdict.ok{background:#ecfdf5;border-color:#a7f3d0;color:#065f46}
  .verdict.warn{background:#fffbeb;border-color:#fde68a;color:#92400e}
  .verdict.err{background:#fef2f2;border-color:#fecaca;color:#991b1b}
  .row-note{font-size:11.5px;color:var(--muted);line-height:1.4}
  tr.qres td{background:#f8fbff;border-bottom:1px solid #e2e8f0}
  ::-webkit-scrollbar{width:9px;height:9px}
  ::-webkit-scrollbar-thumb{background:#c7d2e0;border-radius:9px;border:2px solid transparent;background-clip:content-box}
  ::-webkit-scrollbar-thumb:hover{background:#a8b6c9;background-clip:content-box}
`;

/* ══════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════ */
type ToastKind = 'ok' | 'warn' | 'err';
type DocTypeKey = 'invoice' | 'packing' | 'bol' | 'permit' | 'coo';
type ViewKey =
  | 'studio' | 'queue' | 'drafts' | 'submitted' | 'tariff'
  | 'rulings' | 'fta' | 'restricted' | 'importers' | 'products';
type RailTab = 'classify' | 'checks' | 'audit';

interface HsEntry { code: string; desc: string; duty: number; kw: string[]; notes: string[]; }
interface Ruling { ref: string; subject: string; code: string; }
interface FtaAgreement { id: string; name: string; members: string[]; threshold: number; }
interface Importer { name: string; reg: string; status: string; }
interface DocTypeInfo { label: string; cls: string; required: boolean; }

interface Line { id: number; desc: string; code: string; origin: string; qty: number; val: number; rate: number; }
interface DraftItem { desc: string; code: string; origin: string; qty: number; val: number; rate: number; }
interface Product extends DraftItem {}

interface Doc {
  id: number; name: string; type: DocTypeKey;
  blob: Blob; url: string; pages: number;
  source: 'attached' | 'sample'; size: number; added: string;
}
interface AuditEvent { text: string; time: string; }
interface Toast { id: number; msg: string; kind: ToastKind; }
interface ClassResult extends HsEntry { hits: number; conf: number; }
interface Header {
  importer: string; defOrigin: string; port: string; incoterm: string;
  currency: string; fxRate: number; taxRate: number; declDate: string; otherCharges: number;
}
interface CheckItem { s: 'pass' | 'warn' | 'fail' | 'info'; t: string; d: string; }
interface Draft {
  id: string; declNo: string; savedAt: string; importer: string; currency: string;
  total: string; lineCount: number; header: Header; items: DraftItem[];
}
interface SubmittedRecord {
  mrn: string; declNo: string; submittedAt: string; importer: string;
  port: string; currency: string; total: string; items: Line[]; docs: string[];
}
interface InfoContent { title: string; body: React.ReactNode; }
type PdfRow = string | { text: string; style?: string };
interface Totals {
  totalValue: number; totalDutyMYR: number; valueMYR: number;
  tax: number; other: number; grand: number; fx: number;
}
interface DeclCtx {
  declNo: string; importer: string; incoterm: string; currency: string;
  port: string; defOrigin: string; declDate: string; lines: Line[];
}

/* ══════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════ */
const HS_DB: HsEntry[] = [
  { code:'8471.30.00', desc:'Portable automatic data processing machines, weight ≤ 10 kg (laptops, tablets)',
    duty:0, kw:['laptop','notebook','macbook','tablet','portable computer','data processing'], notes:[] },
  { code:'8517.13.00', desc:'Smartphones and other telephones for cellular networks',
    duty:0, kw:['smartphone','mobile phone','cellular','iphone','handset','phone'], notes:[] },
  { code:'8518.30.00', desc:'Headphones and earphones, whether or not combined with a microphone',
    duty:0, kw:['headphone','earphone','earbud','headset','bluetooth headphone'], notes:[] },
  { code:'8517.62.00', desc:'Machines for the reception, conversion and transmission of data (routers, switches)',
    duty:0, kw:['router','modem','network switch','access point','network equipment'],
    notes:['Encryption-capable network equipment may require a dual-use export/import permit.'] },
  { code:'8504.40.00', desc:'Static converters (power adapters, inverters, UPS)',
    duty:5, kw:['adapter','charger','converter','inverter','power supply','transformer'], notes:[] },
  { code:'8544.42.00', desc:'Electric conductors ≤ 1000 V, fitted with connectors',
    duty:5, kw:['cable','conductor','connector','usb cable','charging cable','wire'], notes:[] },
  { code:'6109.10.00', desc:'T-shirts, singlets and vests, knitted or crocheted, of cotton',
    duty:10, kw:['t-shirt','tshirt','tee shirt','singlet','vest','cotton shirt','knitted'],
    notes:['Textile labelling requirements apply (fibre content, care, origin).'] },
  { code:'0901.21.00', desc:'Coffee, roasted, not decaffeinated',
    duty:5, kw:['coffee','roasted coffee','coffee bean','espresso'],
    notes:['Food safety import permit and Halal certification may be required.'] },
  { code:'3004.90.00', desc:'Medicaments, put up in measured doses for retail sale',
    duty:0, kw:['medicine','medicament','pharmaceutical','drug','capsule','syrup'],
    notes:['Pharmaceutical products require a valid import licence from the Drug Authority.'] },
  { code:'3304.99.00', desc:'Beauty or skin-care preparations, other than medicaments',
    duty:10, kw:['cosmetic','skincare','skin care','cream','lotion','serum','beauty product'],
    notes:['Cosmetics require notification with the National Pharmaceutical Regulatory Agency.'] },
  { code:'9403.60.00', desc:'Other wooden furniture',
    duty:10, kw:['furniture','wooden','wood table','chair','desk','cabinet','shelf'],
    notes:['Timber products may require a phytosanitary / legality certificate.'] },
  { code:'3926.90.00', desc:'Other articles of plastics',
    duty:10, kw:['plastic','plastics','pvc','acrylic','moulded plastic','polymer'], notes:[] },
  { code:'8708.29.00', desc:'Other parts and accessories of motor vehicle bodies',
    duty:10, kw:['bumper','car part','vehicle body','automotive part','bracket','body panel'],
    notes:['Automotive parts may require type approval certification.'] },
  { code:'9503.00.00', desc:'Tricycles, scooters, dolls, toys and puzzles',
    duty:0, kw:['toy','toys','doll','puzzle','tricycle','board game'],
    notes:['Toys must comply with mandatory safety standards (MS ISO 8124).'] },
  { code:'4202.92.00', desc:'Travelling bags, sports bags and similar containers, of textile materials',
    duty:15, kw:['bag','backpack','handbag','luggage','pouch','tote'], notes:[] },
  { code:'7308.90.00', desc:'Other structures and parts of structures, of iron or steel',
    duty:10, kw:['steel structure','iron','beam','scaffold','tower','steel frame'], notes:[] },
];

const RULINGS: Ruling[] = [
  { ref:'BTI-2025-1187', subject:'Wireless earbuds with charging case', code:'8518.30.00' },
  { ref:'BTI-2025-0942', subject:'Foldable tablet with detachable keyboard', code:'8471.30.00' },
  { ref:'BTI-2024-2210', subject:'Cotton knitted promotional t-shirts', code:'6109.10.00' },
  { ref:'BTI-2024-1873', subject:'USB-C braided charging cable, 2 m', code:'8544.42.00' },
  { ref:'BTI-2024-1552', subject:'Roasted arabica coffee beans, retail packs', code:'0901.21.00' },
  { ref:'BTI-2023-0981', subject:'Moulded plastic storage crates', code:'3926.90.00' },
];

const FTA_AGREEMENTS: FtaAgreement[] = [
  { id:'ATIGA', name:'ASEAN Trade in Goods Agreement', members:['SG','TH','VN','ID','MY','PH','BN','KH','LA','MM'], threshold:40 },
  { id:'RCEP',  name:'Regional Comprehensive Economic Partnership', members:['CN','JP','KR','AU','SG','TH','VN','ID','MY','PH','NZ'], threshold:40 },
  { id:'MJEPA', name:'Malaysia–Japan Economic Partnership Agreement', members:['JP'], threshold:40 },
  { id:'MAFTA', name:'Malaysia–Australia Free Trade Agreement', members:['AU'], threshold:40 },
  { id:'AIFTA', name:'ASEAN–India Free Trade Area', members:['IN'], threshold:35 },
];

const DEFAULT_IMPORTERS: Importer[] = [
  { name:'Northwind Electronics Sdn Bhd', reg:'ROI-118742', status:'Active' },
  { name:'Selatan Textiles Pte Ltd', reg:'ROI-220319', status:'Active' },
  { name:'Asia Pacific Components Bhd', reg:'ROI-301884', status:'Active · bonded warehouse' },
];

const DOC_TYPES: Record<DocTypeKey, DocTypeInfo> = {
  invoice: { label:'Commercial Invoice',     cls:'inv',    required:true  },
  packing: { label:'Packing List',           cls:'pack',   required:true  },
  bol:     { label:'Bill of Lading / AWB',   cls:'bol',    required:true  },
  permit:  { label:'Import Permit',          cls:'permit', required:false },
  coo:     { label:'Certificate of Origin',  cls:'coo',    required:false },
};

const ORIGINS = ['CN','SG','JP','US','DE','IN','TH','VN','ID','AU','GB','KR'];
const DEF_ORIGIN_OPTIONS = ['CN','SG','JP','US','DE','IN','TH','VN'];
const PORT_OPTIONS = ['Port Klang (West) — MYPKG','Penang — MYPEN','Johor Bahru — MYJHB','KLIA Cargo — MYKUL'];
const INCOTERM_OPTIONS = ['CIF','FOB','EXW','DDP','CFR'];
const CURRENCY_OPTIONS = ['MYR','USD','SGD','EUR'];

const K_UI        = 'brokerdesk.ui.v2';
const K_DRAFTS    = 'brokerdesk.drafts.v2';
const K_SUBMITTED = 'brokerdesk.submitted.v2';
const K_IMPORTERS = 'brokerdesk.importers.v2';
const K_PRODUCTS  = 'brokerdesk.products.v2';

const CHECK_ICON: Record<CheckItem['s'], string> = { pass:'✓', warn:'!', fail:'✕', info:'i' };

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */
const num = (v: unknown): number => { const n = parseFloat(String(v)); return isFinite(n) ? n : 0; };

function fmtCur(n: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-MY', { style:'currency', currency, minimumFractionDigits:2 }).format(n || 0);
  } catch { return currency + ' ' + (n || 0).toFixed(2); }
}
function fmtMYR(n: number): string {
  try { return new Intl.NumberFormat('en-MY', { style:'currency', currency:'MYR', minimumFractionDigits:2 }).format(n || 0); }
  catch { return 'MYR ' + (n || 0).toFixed(2); }
}
function codeFmt(v: string): string {
  const d = String(v).replace(/[^0-9]/g, '').slice(0, 10);
  if (d.length <= 4) return d;
  if (d.length <= 6) return d.slice(0,4) + '.' + d.slice(4);
  if (d.length <= 8) return d.slice(0,4) + '.' + d.slice(4,6) + '.' + d.slice(6);
  return d.slice(0,4) + '.' + d.slice(4,6) + '.' + d.slice(6,8) + '.' + d.slice(8);
}
function kb(bytes: number): string {
  if (!bytes) return '0 KB';
  return bytes < 1024 * 1024
    ? Math.max(1, Math.round(bytes / 1024)) + ' KB'
    : (bytes / 1048576).toFixed(1) + ' MB';
}
function nowTime(): string {
  return new Date().toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
}
function escapeHtml(s: unknown): string {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;',
  }[c] as string));
}

/* ══════════════════════════════════════════════════════════
   LOCAL STORES
   ══════════════════════════════════════════════════════════ */
function readStore<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; }
  catch { return fallback; }
}
function writeStore(key: string, value: unknown): boolean {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}
const loadDrafts    = (): Draft[]            => readStore(K_DRAFTS, []);
const storeDrafts   = (l: Draft[])           => writeStore(K_DRAFTS, l.slice(0, 25));
const loadSubmitted = (): SubmittedRecord[]  => readStore(K_SUBMITTED, []);
const storeSubmitted= (l: SubmittedRecord[]) => writeStore(K_SUBMITTED, l.slice(0, 50));
const loadImporters = (): Importer[]         => readStore(K_IMPORTERS, []);
const storeImporters= (l: Importer[])        => writeStore(K_IMPORTERS, l);
const loadProducts  = (): Product[]          => readStore(K_PRODUCTS, []);
const storeProducts = (l: Product[])         => writeStore(K_PRODUCTS, l.slice(0, 100));

/* ══════════════════════════════════════════════════════════
   MINIMAL PDF GENERATOR (unchanged)
   ══════════════════════════════════════════════════════════ */
function buildPDF(title: string, subtitle: string, rows: PdfRow[]): Blob {
  const esc = (s: unknown) => String(s)
    .replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, '');

  const ops: string[] = [];
  ops.push('BT /F2 18 Tf 54 786 Td (' + esc(title) + ') Tj ET');
  ops.push('BT /F1 10 Tf 54 766 Td (' + esc(subtitle) + ') Tj ET');
  ops.push('0.86 0.90 0.96 RG 1 w 54 754 m 541 754 l S');

  let y = 730;
  rows.forEach(r => {
    if (r && typeof r === 'object' && r.style === 'gap') { y -= 12; return; }
    const text = typeof r === 'string' ? r : r.text;
    const style = (typeof r === 'object' && r.style) || 'body';
    let font = 'F1', size = 10.5, x = 54;
    if (style === 'h')    { font = 'F2'; size = 11; }
    if (style === 'mono') { font = 'F3'; size = 9; }
    if (style === 'right') { x = 372; }
    if (y < 56) y = 56;
    ops.push('BT /' + font + ' ' + size + ' Tf ' + x + ' ' + y + ' Td (' + esc(text) + ') Tj ET');
    y -= (style === 'mono' ? 14 : 17);
  });

  ops.push('BT /F1 8 Tf 54 40 Td (' + esc('BrokerDesk - demonstration document - not a legal customs document') + ') Tj ET');

  const stream = ops.join('\n');
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> /Contents 4 0 R >>',
    '<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>',
  ];

  let pdf = '%PDF-1.4\n';
  const offs: number[] = [];
  objs.forEach((o, i) => { offs.push(pdf.length); pdf += (i + 1) + ' 0 obj\n' + o + '\nendobj\n'; });

  const xref = pdf.length;
  pdf += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n';
  offs.forEach(o => { pdf += String(o).padStart(10, '0') + ' 00000 n \n'; });
  pdf += 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF';

  return new Blob([pdf], { type:'application/pdf' });
}

/* ══════════════════════════════════════════════════════════
   SAMPLE DOCUMENT ROW BUILDERS
   ══════════════════════════════════════════════════════════ */
function declNum(s: string): string { return s.replace(/[^0-9]/g, '') || '2026004418'; }
const padR = (s: string | number, n: number) => String(s).slice(0, n).padEnd(n, ' ');

function sampleInvoiceRows(ctx: DeclCtx): PdfRow[] {
  const cur = ctx.currency;
  const rows: PdfRow[] = [
    { text:'COMMERCIAL INVOICE', style:'h' },
    'Invoice No : INV-' + declNum(ctx.declNo),
    'Invoice Date: ' + (ctx.declDate || new Date().toISOString().slice(0, 10)),
    'Seller      : Shenzhen Yuanhe Trading Co., Ltd, Guangdong, CN',
    'Buyer       : ' + ctx.importer,
    'Terms       : ' + ctx.incoterm + '    Currency: ' + cur,
    { text:'', style:'gap' },
    { text:'NO  DESCRIPTION                                  QTY    UNIT        AMOUNT', style:'mono' },
  ];
  let total = 0;
  const items: { desc: string; qty: number; val: number }[] = ctx.lines.length ? ctx.lines : [{ desc:'Sample goods', qty:1, val:100 }];
  items.forEach((it, i) => {
    const amt = it.qty * it.val; total += amt;
    rows.push({ text: padR(i + 1, 2) + '  ' + padR(it.desc, 44) + '  ' + padR(it.qty, 5) + '  ' + padR(it.val.toFixed(2), 9) + '  ' + amt.toFixed(2), style:'mono' });
  });
  rows.push({ text:'', style:'gap' });
  rows.push({ text:'TOTAL INVOICE VALUE: ' + cur + ' ' + total.toFixed(2), style:'h' });
  rows.push('We certify that the information above is true and correct.');
  return rows;
}

function samplePackingRows(ctx: DeclCtx): PdfRow[] {
  const rows: PdfRow[] = [
    { text:'PACKING LIST', style:'h' },
    'Packing List No: PL-' + declNum(ctx.declNo),
    'Shipper        : Shenzhen Yuanhe Trading Co., Ltd, Guangdong, CN',
    'Consignee      : ' + ctx.importer,
    'Port of Loading: Yantian, CN    Port of Discharge: ' + ctx.port,
    { text:'', style:'gap' },
    { text:'NO  DESCRIPTION                                  CTNS   QTY    N.W.(KG)', style:'mono' },
  ];
  const items: { desc: string; qty: number }[] = ctx.lines.length ? ctx.lines : [{ desc:'Sample goods', qty:1 }];
  items.forEach((it, i) => {
    const ctns = Math.max(1, Math.round(it.qty / 50));
    const nw = (it.qty * 0.35).toFixed(1);
    rows.push({ text: padR(i + 1, 2) + '  ' + padR(it.desc, 44) + '  ' + padR(ctns, 5) + '  ' + padR(it.qty, 6) + '  ' + padR(nw, 8), style:'mono' });
  });
  rows.push({ text:'', style:'gap' });
  rows.push('Marks and numbers: NW-' + declNum(ctx.declNo) + ' / MADE IN ' + ctx.defOrigin);
  return rows;
}

function sampleBolRows(ctx: DeclCtx): PdfRow[] {
  return [
    { text:'BILL OF LADING', style:'h' },
    'B/L No        : MYPKG-88213' + declNum(ctx.declNo).slice(-3),
    'Carrier       : Pacific Meridian Line Pte Ltd',
    'Vessel / Voy  : MV OCEAN HARVEST / 014E',
    'Port of Load  : Yantian, CN',
    'Port of Disch : ' + ctx.port,
    'Container No  : MSKU 4471823  /  40HC',
    'Gross Weight  : 4,820.00 KG',
    { text:'', style:'gap' },
    'SHIPPED ON BOARD in apparent good order and condition.',
    'Freight: ' + (ctx.incoterm === 'CIF' ? 'PREPAID' : 'COLLECT'),
    { text:'', style:'gap' },
    'Number of original B/L issued: THREE (3)',
    'Place and date of issue: Port Klang, ' + (ctx.declDate || ''),
  ];
}

function sampleCooRows(ctx: DeclCtx): PdfRow[] {
  return [
    { text:'CERTIFICATE OF ORIGIN', style:'h' },
    'Certificate No: COO-' + declNum(ctx.declNo),
    'Exporter      : Shenzhen Yuanhe Trading Co., Ltd',
    'Consignee     : ' + ctx.importer,
    'Country of Origin: ' + ctx.defOrigin,
    'Country of Destination: MALAYSIA',
    { text:'', style:'gap' },
    'Origin criteria applied: wholly obtained / substantial transformation',
    'Preferential scheme: ATIGA / RCEP (as applicable)',
    { text:'', style:'gap' },
    'Declaration by the exporter: the goods described originate in the country stated.',
    'Issued by: China Council for the Promotion of International Trade (CCPIT)',
  ];
}

/* ══════════════════════════════════════════════════════════
   CLASSIFICATION ENGINE
   ══════════════════════════════════════════════════════════ */
function classify(text: string): ClassResult[] {
  const q = (text || '').toLowerCase().trim();
  if (!q) return [];
  return HS_DB
    .map(item => {
      let hits = 0, max = 0;
      item.kw.forEach(k => {
        const weight = k.includes(' ') ? 2 : 1;
        max += weight;
        if (q.includes(k)) hits += weight;
      });
      const conf = max ? Math.min(97, Math.round((hits / max) * 100) + 20) : 0;
      return { ...item, hits, conf };
    })
    .filter(r => r.hits > 0)
    .sort((a, b) => b.conf - a.conf)
    .slice(0, 5);
}

/* ══════════════════════════════════════════════════════════
   CALCULATIONS & VALIDATION
   ══════════════════════════════════════════════════════════ */
function computeTotals(lines: Line[], header: Header): Totals {
  const fx = Number(header.fxRate) || 1;
  let totalValue = 0, totalDutyMYR = 0;
  lines.forEach(l => {
    const lv = l.qty * l.val;
    totalValue += lv;
    totalDutyMYR += lv * fx * l.rate / 100;
  });
  const valueMYR = totalValue * fx;
  const tax = (valueMYR + totalDutyMYR) * header.taxRate / 100;
  const other = header.otherCharges;
  const grand = valueMYR + totalDutyMYR + tax + other;
  return { totalValue, totalDutyMYR, valueMYR, tax, other, grand, fx };
}

function computeChecks(lines: Line[], docs: Doc[], header: Header): CheckItem[] {
  const checks: CheckItem[] = [];

  checks.push(lines.length
    ? { s:'pass', t:'Line items present', d:`${lines.length} line item(s) captured.` }
    : { s:'fail', t:'No line items', d:'At least one line item is required to lodge a declaration.' });

  const missingCode = lines.filter(l => !l.code.trim());
  checks.push(missingCode.length
    ? { s:'fail', t:'HS code missing', d:`${missingCode.length} line(s) have no HS code assigned.` }
    : { s:'pass', t:'HS codes assigned', d:'All lines carry a tariff classification.' });

  const badCode = lines.filter(l => {
    const d = l.code.replace(/[^0-9]/g, '');
    return d.length > 0 && d.length < 8;
  });
  if (badCode.length) checks.push({ s:'warn', t:'Short tariff codes', d:`${badCode.length} line(s) use fewer than 8 digits. Confirm the national subheading.` });

  const zeroVal = lines.filter(l => l.val <= 0);
  checks.push(zeroVal.length
    ? { s:'warn', t:'Zero / missing value', d:`${zeroVal.length} line(s) have a unit value of 0. Verify the customs value basis.` }
    : { s:'pass', t:'Customs value declared', d:'All lines carry a positive unit value.' });

  const noOrigin = lines.filter(l => !l.origin);
  checks.push(noOrigin.length
    ? { s:'fail', t:'Origin not declared', d:'Preferential treatment cannot be assessed without country of origin.' }
    : { s:'pass', t:'Origin declared', d:'All lines carry a country of origin.' });

  const flagged: { code: string; note: string }[] = [];
  lines.forEach(l => {
    const entry = HS_DB.find(h => h.code === l.code.trim());
    if (entry && entry.notes.length) flagged.push({ code: entry.code, note: entry.notes[0] });
  });
  checks.push(flagged.length
    ? { s:'warn', t:'Permit / standards check required', d: flagged.map(f => `${f.code} — ${escapeHtml(f.note)}`).join('<br>') }
    : { s:'pass', t:'No permit triggers detected', d:'No restricted or standards-controlled goods identified.' });

  const ftaCandidates = lines.filter(l => ['CN','JP','KR','AU','VN','SG','TH','ID','IN'].includes(l.origin) && l.rate > 0);
  if (ftaCandidates.length) checks.push({ s:'info', t:'Preferential duty opportunity', d:`${ftaCandidates.length} line(s) originate in FTA partner countries but carry a non-zero duty rate. Check origin criteria.` });

  const present = new Set(docs.map(d => d.type));
  const missingDocs = (Object.entries(DOC_TYPES) as [DocTypeKey, DocTypeInfo][])
    .filter(([k, v]) => v.required && !present.has(k)).map(([, v]) => v.label);
  checks.push(missingDocs.length
    ? { s:'fail', t:'Required documents missing', d:'Attach: ' + missingDocs.join(', ') + '.' }
    : { s:'pass', t:'Supporting documents complete', d:'Invoice, packing list and transport document are attached.' });

  const headerOk = header.importer && header.incoterm && header.declDate && header.port;
  checks.push(headerOk
    ? { s:'pass', t:'Header data complete', d:'Importer, port, Incoterm and declaration date captured.' }
    : { s:'fail', t:'Header data incomplete', d:'Importer, port, Incoterm and declaration date are mandatory.' });

  const fx = Number(header.fxRate);
  if (header.currency !== 'MYR' && (!fx || fx === 1))
    checks.push({ s:'warn', t:'Exchange rate looks unconverted', d:'Declaration currency is not MYR but the exchange rate is 1.0000. Confirm the rate applied.' });

  return checks;
}

/* ══════════════════════════════════════════════════════════
   SMALL REUSABLE COMPONENTS
   ══════════════════════════════════════════════════════════ */
interface NumInputProps {
  value: number;
  onChange: (n: number) => void;
  className?: string;
  step?: number;
  min?: number;
  onFocus?: () => void;
}
function NumInput({ value, onChange, className, step, min, onFocus }: NumInputProps) {
  const [text, setText] = useState<string>(value === 0 ? '' : String(value));
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setText(value === 0 ? '' : String(value));
  }, [value]);
  return (
    <input
      className={className}
      type="number"
      min={min}
      step={step}
      value={text}
      onChange={e => { setText(e.target.value); onChange(num(e.target.value)); }}
      onFocus={() => { focused.current = true; onFocus?.(); }}
      onBlur={() => { focused.current = false; setText(value === 0 ? '' : String(value)); }}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   TOPBAR
   ══════════════════════════════════════════════════════════ */
interface TopbarProps {
  search: string;
  setSearch: (v: string) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  hits: HsEntry[];
  hover: number;
  setHover: React.Dispatch<React.SetStateAction<number>>;
  onSelect: (h: HsEntry) => void;
  searchRef: React.RefObject<HTMLInputElement>;
}
function Topbar({ search, setSearch, searchOpen, setSearchOpen, hits, hover, setHover, onSelect, searchRef }: TopbarProps) {
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && hits.length) { e.preventDefault(); setHover(h => Math.min(hits.length - 1, h + 1)); }
    else if (e.key === 'ArrowUp' && hits.length) { e.preventDefault(); setHover(h => Math.max(0, h - 1)); }
    else if (e.key === 'Enter') {
      const target = hover >= 0 && hits[hover] ? hits[hover] : hits[0];
      if (target) onSelect(target);
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };
  return (
    <header className="topbar">
      <div className="brand">
        <div className="mark">B</div>
        <div>
          BrokerDesk
          <small>HS CODE DECLARATION STUDIO</small>
        </div>
      </div>
      <div className="searchbox">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8ea4c4" strokeWidth="2.4">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          ref={searchRef}
          id="globalSearch"
          value={search}
          placeholder="Search HS code, ruling, or product…   e.g. 8471.30"
          autoComplete="off"
          onChange={e => {
            const v = e.target.value;
            setSearch(v);
            setSearchOpen(!!v.trim());
            setHover(-1);
          }}
          onFocus={() => { if (search.trim()) setSearchOpen(true); }}
          onKeyDown={onKey}
        />
        <div className={`search-results ${searchOpen && search.trim() ? 'open' : ''}`}>
          {hits.length
            ? hits.map((h, i) => (
                <div key={h.code} className={`sr-item ${i === hover ? 'hover' : ''}`} onClick={() => onSelect(h)}>
                  <div className="sr-code">
                    {h.code} <span style={{ color:'#94a3b8', fontWeight:500 }}>· {h.duty}% duty</span>
                  </div>
                  <div className="sr-desc">{h.desc}</div>
                </div>
              ))
            : <div className="sr-empty">No tariff matches. Try a broader term.</div>}
        </div>
      </div>
      <div className="spacer" />
      <span className="badge-env">● LIVE · Customs Gateway Connected</span>
      <div className="user">
        <div className="avatar">RA</div> R. Ahmed · Lic. 4471
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════════
   SIDEBAR
   ══════════════════════════════════════════════════════════ */
const NAV_GROUPS: { title: string; items: { key: ViewKey; label: string; ini: string }[] }[] = [
  { title:'Workspace', items: [
    { key:'studio',    label:'Declaration Studio',  ini:'D' },
    { key:'queue',     label:'Classification Queue', ini:'Q' },
    { key:'drafts',    label:'Draft Declarations',  ini:'D' },
    { key:'submitted', label:'Submitted / MRN',     ini:'S' },
  ]},
  { title:'Reference', items: [
    { key:'tariff',    label:'Tariff Schedule',     ini:'T' },
    { key:'rulings',   label:'Rulings & BTIs',      ini:'R' },
    { key:'fta',       label:'FTA Origin Rules',    ini:'F' },
    { key:'restricted',label:'Restricted Goods',    ini:'!' },
  ]},
  { title:'Clients', items: [
    { key:'importers', label:'Importer Registry',   ini:'I' },
    { key:'products',  label:'Product Master',      ini:'P' },
  ]},
];

interface SidebarProps {
  collapsed: boolean;
  view: ViewKey;
  onNavigate: (k: ViewKey) => void;
  onToggle: () => void;
}
function Sidebar({ collapsed, view, onNavigate, onToggle }: SidebarProps) {
  return (
    <aside className="sidebar">
      <button className="sb-toggle" onClick={onToggle}
        title={`${collapsed ? 'Expand' : 'Collapse'} sidebar (Ctrl+B)`}>
        {collapsed ? '⟩' : '⟨'}
      </button>
      {NAV_GROUPS.map(g => (
        <div className="navgroup" key={g.title}>
          <h4>{g.title}</h4>
          {g.items.map(it => (
            <div
              key={it.key}
              className={`navitem ${view === it.key ? 'active' : ''}`}
              title={it.label}
              onClick={() => onNavigate(it.key)}
            >
              <span className="ini">{it.ini}</span>
              <span className="dot" />
              <span className="lbl">{it.label}</span>
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}

/* ══════════════════════════════════════════════════════════
   LINE ROW
   ══════════════════════════════════════════════════════════ */
interface LineRowProps {
  line: Line;
  idx: number;
  fx: number;
  selected: boolean;
  flash: boolean;
  shouldFocus: boolean;
  onFocused: () => void;
  onSelect: () => void;
  onChange: (patch: Partial<Line>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onAi: () => void;
  onAudit: (text: string) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
}
function LineRow(props: LineRowProps) {
  const { line, idx, fx, selected, flash, shouldFocus, onFocused, onSelect, onChange,
    onRemove, onDuplicate, onAi, onAudit, onToast } = props;
  const descRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus) { descRef.current?.focus(); onFocused(); }
  }, [shouldFocus, onFocused]);

  const dutyAmt = line.qty * line.val * fx * line.rate / 100;

  const handleCodeBlur = () => {
    const formatted = codeFmt(line.code);
    const entry = HS_DB.find(h => h.code === formatted);
    const patch: Partial<Line> = { code: formatted };
    if (entry && line.rate === 0 && entry.duty !== 0) {
      patch.rate = entry.duty;
      onAudit(`Tariff assist: duty <b>${entry.duty}%</b> applied for <b>${entry.code}</b>.`);
      onToast(`Duty for ${entry.code} auto-filled at ${entry.duty}%.`, 'ok');
    }
    onChange(patch);
  };

  const stop = (e: React.MouseEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'BUTTON') e.stopPropagation();
  };

  return (
    <tr className={`${selected ? 'selected' : ''} ${flash ? 'flash' : ''}`} onClick={stop}>
      <td className="col-idx" onClick={onSelect}>{idx}</td>
      <td className="col-desc">
        <input ref={descRef} className="f-desc" placeholder="Describe the goods as declared…"
          value={line.desc} onChange={e => onChange({ desc: e.target.value })} onFocus={onSelect} />
      </td>
      <td className="col-code">
        <input className="f-code" placeholder="0000.00.00" value={line.code}
          onChange={e => onChange({ code: e.target.value })}
          onFocus={onSelect}
          onBlur={handleCodeBlur} />
      </td>
      <td className="col-origin">
        <select className="f-origin" value={line.origin}
          onChange={e => onChange({ origin: e.target.value })} onFocus={onSelect}>
          {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </td>
      <td className="col-num">
        <NumInput className="f-qty" value={line.qty} min={0} step={1}
          onChange={n => onChange({ qty: n })} onFocus={onSelect} />
      </td>
      <td className="col-num">
        <NumInput className="f-val" value={line.val} min={0} step={0.01}
          onChange={n => onChange({ val: n })} onFocus={onSelect} />
      </td>
      <td className="col-duty">
        <div className="duty-rate">
          <NumInput className="f-rate" value={line.rate} min={0} step={0.5}
            onChange={n => onChange({ rate: n })} onFocus={onSelect} />
          <span style={{ color:'#94a3b8' }}>%</span>
        </div>
        <div className="duty-amt">{fmtMYR(dutyAmt)}</div>
      </td>
      <td className="col-act">
        <div className="rowtools">
          <button className="btn btn-ghost btn-sm" title="AI classify this line" onClick={onAi}>⚡</button>
          <button className="btn btn-ghost btn-sm" title="Duplicate line" onClick={onDuplicate}>⧉</button>
          <button className="btn btn-ghost btn-sm" title="Remove line" onClick={onRemove}>✕</button>
        </div>
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════════════
   DECLARATION HEADER CARD
   ══════════════════════════════════════════════════════════ */
interface HeaderCardProps {
  header: Header;
  setHeader: (patch: Partial<Header>) => void;
  importerOptions: string[];
  declNo: string;
}
function DeclarationHeaderCard({ header, setHeader, importerOptions, declNo }: HeaderCardProps) {
  return (
    <section className="card">
      <div className="card-head">
        <h3>Declaration Header</h3>
        <span className="sub">· Import · Form C1</span>
        <div className="spacer" style={{ flex: 1 }} />
        <span className="code-chip">{declNo}</span>
      </div>
      <div className="card-body">
        <div className="grid g4">
          <div className="field">
            <label>Importer / Consignee</label>
            <select value={header.importer} onChange={e => setHeader({ importer: e.target.value })}>
              {importerOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Country of Origin (default)</label>
            <select value={header.defOrigin} onChange={e => setHeader({ defOrigin: e.target.value })}>
              {DEF_ORIGIN_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Port of Clearance</label>
            <select value={header.port} onChange={e => setHeader({ port: e.target.value })}>
              {PORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Incoterm 2020</label>
            <select value={header.incoterm} onChange={e => setHeader({ incoterm: e.target.value })}>
              {INCOTERM_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Currency</label>
            <select value={header.currency} onChange={e => setHeader({ currency: e.target.value })}>
              {CURRENCY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Exchange Rate (→ MYR)</label>
            <NumInput value={header.fxRate} step={0.0001}
              onChange={n => setHeader({ fxRate: n })} />
          </div>
          <div className="field">
            <label>Tax Rate (SST/VAT %)</label>
            <NumInput value={header.taxRate} step={0.5}
              onChange={n => setHeader({ taxRate: n })} />
          </div>
          <div className="field">
            <label>Declaration Date</label>
            <input type="date" value={header.declDate}
              onChange={e => setHeader({ declDate: e.target.value })} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   LINE ITEMS CARD
   ══════════════════════════════════════════════════════════ */
interface LineItemsCardProps {
  lines: Line[];
  fx: number;
  activeId: number | null;
  flashId: number | null;
  focusLineId: number | null;
  onSelectLine: (id: number) => void;
  onUpdateLine: (id: number, patch: Partial<Line>) => void;
  onRemoveLine: (id: number) => void;
  onDuplicateLine: (id: number) => void;
  onAiLine: (id: number) => void;
  onAddLine: () => void;
  onAutoAll: () => void;
  onLoadSample: () => void;
  onFocused: () => void;
  onAudit: (text: string) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
}
function LineItemsCard(props: LineItemsCardProps) {
  const { lines, fx, activeId, flashId, focusLineId, onSelectLine, onUpdateLine, onRemoveLine,
    onDuplicateLine, onAiLine, onAddLine, onAutoAll, onLoadSample, onFocused, onAudit, onToast } = props;
  return (
    <section className="card">
      <div className="card-head">
        <h3>Line Items</h3>
        <span className="sub">{lines.length} {lines.length === 1 ? 'line' : 'lines'}</span>
        <div className="spacer" style={{ flex: 1 }} />
        <button className="btn btn-sm" onClick={onAutoAll} title="Classify every line automatically">⚡ Auto-classify all</button>
        <button className="btn btn-sm" onClick={onLoadSample}>Load Sample</button>
        <button className="btn btn-sm btn-primary" onClick={onAddLine}>＋ Add Line</button>
      </div>
      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th className="col-idx">#</th>
              <th className="col-desc">Product Description</th>
              <th className="col-code">HS Code</th>
              <th className="col-origin">Origin</th>
              <th className="col-num">Qty</th>
              <th className="col-num">Unit Value</th>
              <th className="col-duty">Duty %</th>
              <th className="col-act">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <LineRow
                key={l.id}
                line={l}
                idx={i + 1}
                fx={fx}
                selected={activeId === l.id}
                flash={flashId === l.id}
                shouldFocus={focusLineId === l.id}
                onFocused={onFocused}
                onSelect={() => onSelectLine(l.id)}
                onChange={patch => onUpdateLine(l.id, patch)}
                onRemove={() => onRemoveLine(l.id)}
                onDuplicate={() => onDuplicateLine(l.id)}
                onAi={() => onAiLine(l.id)}
                onAudit={onAudit}
                onToast={onToast}
              />
            ))}
          </tbody>
        </table>
      </div>
      {lines.length === 0 && (
        <div className="empty">
          <span className="big">▤</span>
          No line items yet. Click <b>Add Line</b> or <b>Load Sample</b> to begin.
        </div>
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   DOCUMENTS CARD
   ══════════════════════════════════════════════════════════ */
interface DocumentsCardProps {
  docs: Doc[];
  onAddFiles: (files: FileList | File[]) => void;
  onRemoveDoc: (id: number) => void;
  onOpenDoc: (doc: Doc) => void;
  onLoadSampleDocs: () => void;
}
function DocumentsCard({ docs, onAddFiles, onRemoveDoc, onOpenDoc, onLoadSampleDocs }: DocumentsCardProps) {
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const present = new Set(docs.map(d => d.type));

  return (
    <section className="card">
      <div className="card-head">
        <h3>Supporting Documents</h3>
        <span className="sub">{docs.length} attached</span>
        <div className="spacer" style={{ flex: 1 }} />
        <button className="btn btn-sm" onClick={onLoadSampleDocs}>Load Sample Docs</button>
        <button className="btn btn-sm btn-primary" onClick={() => fileRef.current?.click()}>＋ Attach PDF</button>
      </div>
      <div className="card-body">
        <div className="doc-grid">
          {docs.map(d => {
            const t = DOC_TYPES[d.type];
            return (
              <div key={d.id} className={`doc-card ${t.cls}`} onClick={() => onOpenDoc(d)} title="Click to preview">
                <div className="doc-thumb">PDF</div>
                <div className="doc-info">
                  <div className="doc-name">{d.name}</div>
                  <div className="doc-meta">
                    {t.label} · {d.pages} page{d.pages > 1 ? 's' : ''} · {kb(d.size)}
                  </div>
                  <span className="doc-badge">{d.source === 'sample' ? 'Sample' : 'Attached'}</span>
                </div>
                <button className="doc-x" title="Remove document"
                  onClick={e => { e.stopPropagation(); onRemoveDoc(d.id); }}>✕</button>
              </div>
            );
          })}
        </div>
        {docs.length === 0 && (
          <div className="empty" style={{ padding:'18px 10px' }}>
            <span className="big">🖹</span>
            No documents attached. Drop PDFs below or load the sample set.
          </div>
        )}
        <div
          className={`dropzone ${drag ? 'drag' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragEnter={e => { e.preventDefault(); e.stopPropagation(); setDrag(true); }}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDrag(true); }}
          onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDrag(false); }}
          onDrop={e => {
            e.preventDefault(); e.stopPropagation(); setDrag(false);
            if (e.dataTransfer?.files) onAddFiles(e.dataTransfer.files);
          }}
        >
          <b>Drag &amp; drop PDF files here</b> — or click to browse<br />
          <span style={{ fontSize: 11 }}>
            Commercial invoice · packing list · bill of lading · permits · certificates of origin
          </span>
        </div>
        <input ref={fileRef} type="file" accept="application/pdf,.pdf" multiple hidden
          onChange={e => { if (e.target.files) onAddFiles(e.target.files); e.target.value = ''; }} />
        <div className="doc-req">
          {(Object.entries(DOC_TYPES) as [DocTypeKey, DocTypeInfo][]).map(([k, v]) => {
            const ok = present.has(k);
            return (
              <span key={k} className={`req-pill ${ok ? 'ok' : (v.required ? 'no' : '')}`}>
                {ok ? '✓' : '○'} {v.label}{v.required ? ' *' : ''}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   TOTALS CARD
   ══════════════════════════════════════════════════════════ */
interface TotalsCardProps {
  header: Header;
  setHeader: (patch: Partial<Header>) => void;
  totals: Totals;
}
function TotalsCard({ header, setHeader, totals }: TotalsCardProps) {
  const curTag = '(' + header.currency + ')';
  const fxNote = header.currency === 'MYR'
    ? '· all amounts in MYR'
    : '· 1 ' + header.currency + ' = ' + (Number(header.fxRate) || 1).toFixed(4) + ' MYR';
  return (
    <section className="card">
      <div className="card-head"><h3>Duty &amp; Tax Summary</h3><span className="sub">{fxNote}</span></div>
      <div className="totals">
        <div className="trow">
          <span>Total Customs Value <span className="cur">{curTag}</span></span>
          <span>{fmtCur(totals.totalValue, header.currency)}</span>
        </div>
        <div className="trow"><span>Customs Value converted to MYR</span><span>{fmtMYR(totals.valueMYR)}</span></div>
        <div className="trow"><span>Total Import Duty</span><span>{fmtMYR(totals.totalDutyMYR)}</span></div>
        <div className="trow"><span>Tax on (Value + Duty)</span><span>{fmtMYR(totals.tax)}</span></div>
        <div className="trow">
          <span>Other Charges (handling, port)</span>
          <span>
            <NumInput className="mini-input" value={header.otherCharges} min={0} step={0.01}
              onChange={n => setHeader({ otherCharges: n })} /> <span className="cur">MYR</span>
          </span>
        </div>
        <div className="trow grand"><span>Total Payable</span><span>{fmtMYR(totals.grand)}</span></div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   STUDIO VIEW
   ══════════════════════════════════════════════════════════ */
interface StudioViewProps {
  header: Header;
  setHeader: (patch: Partial<Header>) => void;
  importerOptions: string[];
  declNo: string;
  totals: Totals;
  lines: Line[];
  docs: Doc[];
  activeId: number | null;
  flashId: number | null;
  focusLineId: number | null;
  onSelectLine: (id: number) => void;
  onUpdateLine: (id: number, patch: Partial<Line>) => void;
  onRemoveLine: (id: number) => void;
  onDuplicateLine: (id: number) => void;
  onAiLine: (id: number) => void;
  onAddLine: () => void;
  onAutoAll: () => void;
  onLoadSample: () => void;
  onAddFiles: (files: FileList | File[]) => void;
  onRemoveDoc: (id: number) => void;
  onOpenDoc: (doc: Doc) => void;
  onLoadSampleDocs: () => void;
  onFocused: () => void;
  onAudit: (text: string) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
}
function StudioView(props: StudioViewProps) {
  const { header, setHeader, importerOptions, declNo, totals, lines, docs, activeId,
    flashId, focusLineId, onSelectLine, onUpdateLine, onRemoveLine, onDuplicateLine,
    onAiLine, onAddLine, onAutoAll, onLoadSample, onAddFiles, onRemoveDoc, onOpenDoc,
    onLoadSampleDocs, onFocused, onAudit, onToast } = props;
  return (
    <>
      <DeclarationHeaderCard header={header} setHeader={setHeader}
        importerOptions={importerOptions} declNo={declNo} />
      <LineItemsCard
        lines={lines} fx={totals.fx}
        activeId={activeId} flashId={flashId} focusLineId={focusLineId}
        onSelectLine={onSelectLine} onUpdateLine={onUpdateLine} onRemoveLine={onRemoveLine}
        onDuplicateLine={onDuplicateLine} onAiLine={onAiLine}
        onAddLine={onAddLine} onAutoAll={onAutoAll} onLoadSample={onLoadSample}
        onFocused={onFocused} onAudit={onAudit} onToast={onToast}
      />
      <DocumentsCard docs={docs} onAddFiles={onAddFiles}
        onRemoveDoc={onRemoveDoc} onOpenDoc={onOpenDoc} onLoadSampleDocs={onLoadSampleDocs} />
      <TotalsCard header={header} setHeader={setHeader} totals={totals} />
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   RIGHT RAIL
   ══════════════════════════════════════════════════════════ */
interface RightRailProps {
  tab: RailTab;
  setTab: (t: RailTab) => void;
  collapsed: boolean;
  onToggle: () => void;
  classifyInput: string;
  setClassifyInput: (v: string) => void;
  classifyStatus: 'idle' | 'loading' | 'no-input' | 'no-match' | 'done';
  results: ClassResult[];
  onRun: () => void;
  onApplyResult: (r: ClassResult) => void;
  onFlagResult: (r: ClassResult) => void;
  checks: CheckItem[];
  audit: AuditEvent[];
}
function RightRail(props: RightRailProps) {
  const { tab, setTab, collapsed, onToggle, classifyInput, setClassifyInput,
    classifyStatus, results, onRun, onApplyResult, onFlagResult, checks, audit } = props;

  return (
    <aside className="rail">
      <div className="tabs">
        <button className={`tab ${tab === 'classify' ? 'active' : ''}`} onClick={() => setTab('classify')} title="AI Classify">
          <span className="ticon">⚡</span><span className="tlbl">AI Classify</span>
        </button>
        <button className={`tab ${tab === 'checks' ? 'active' : ''}`} onClick={() => setTab('checks')} title="Compliance">
          <span className="ticon">⚖</span><span className="tlbl">Compliance</span>
        </button>
        <button className={`tab ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')} title="Audit Trail">
          <span className="ticon">⏱</span><span className="tlbl">Audit Trail</span>
        </button>
        <button className="rail-toggle" onClick={onToggle}
          title={`${collapsed ? 'Expand' : 'Collapse'} panel`}>⟩</button>
      </div>

      <div className={`tabpane ${tab === 'classify' ? 'active' : ''}`}>
        <p className="hint">Select a line, then run classification. Results are scored against the
          national tariff schedule and prior rulings. <b>Always verify before lodging.</b></p>
        <div className="field" style={{ marginBottom: 10 }}>
          <label>Description to classify</label>
          <textarea
            rows={2}
            value={classifyInput}
            onChange={e => setClassifyInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); onRun(); } }}
            placeholder="e.g. Wireless Bluetooth headphones with charging case"
            style={{
              padding:'8px 9px', border:'1px solid var(--line)', borderRadius:8,
              background:'#fbfcfe', outline:'none', resize:'vertical', fontSize:12.5,
            }}
          />
        </div>
        <button className="btn btn-primary" onClick={onRun} style={{ width:'100%', justifyContent:'center' }}>
          ⚡ Run AI Classification
        </button>

        <div style={{ marginTop: 14 }}>
          {classifyStatus === 'idle' && <div className="empty"><span className="big">⌕</span>No classification run yet.</div>}
          {classifyStatus === 'no-input' && <div className="empty"><span className="big">⌕</span>Enter a product description first.</div>}
          {classifyStatus === 'loading' && <div className="empty" style={{ padding: 16 }}>Analysing description…</div>}
          {classifyStatus === 'no-match' && (
            <div className="empty">
              <span className="big">⚠</span>
              No confident match found.<br />
              <small>Escalate to a licensed classifier or request an advance ruling.</small>
            </div>
          )}
          {classifyStatus === 'done' && results.map((r, i) => {
            const low = r.conf < 60;
            return (
              <div className="result" key={r.code + i}>
                <div className="r-top">
                  <div><div className="r-code">{r.code}</div></div>
                  <div className={`conf ${low ? 'low' : ''}`}>
                    {r.conf}%
                    <span className="bar"><i style={{ width: r.conf + '%' }} /></span>
                  </div>
                </div>
                <div className="r-desc">{r.desc}</div>
                <div className="r-meta">
                  <span>Duty <b>{r.duty}%</b></span>
                  <span>{r.notes.length ? '⚠ ' + r.notes.length + ' compliance note(s)' : '✓ No flags'}</span>
                </div>
                <div style={{ marginTop: 9, display:'flex', gap: 7 }}>
                  <button className="btn btn-sm btn-primary" onClick={() => onApplyResult(r)}>Apply to line</button>
                  <button className="btn btn-sm" onClick={() => onFlagResult(r)}>Flag for review</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`tabpane ${tab === 'checks' ? 'active' : ''}`}>
        <p className="hint">Pre-lodgement validation. All <b>fail</b> items must be resolved before submission.</p>
        <div>
          {checks.map((c, i) => (
            <div className="check" key={i}>
              <div className={`ico ${c.s}`}>{CHECK_ICON[c.s]}</div>
              <div>
                <b>{c.t}</b>
                <small dangerouslySetInnerHTML={{ __html: c.d }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`tabpane ${tab === 'audit' ? 'active' : ''}`}>
        <p className="hint">Every classification decision and edit is timestamped for post-entry audit defence.</p>
        <div className="audit">
          {audit.length
            ? audit.slice(0, 60).map((a, i) => (
                <div className="aevent" key={i}>
                  <span dangerouslySetInnerHTML={{ __html: a.text }} />
                  <time>{a.time}</time>
                </div>
              ))
            : <div className="empty" style={{ padding: 14 }}>No activity recorded yet.</div>}
        </div>
      </div>
    </aside>
  );
}

/* ══════════════════════════════════════════════════════════
   ALTERNATE VIEWS
   ══════════════════════════════════════════════════════════ */
interface QueueViewProps {
  lines: Line[];
  onApplyCode: (id: number, code: string, rate: number, source?: string) => void;
  onOpenLine: (id: number) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  goStudio: () => void;
}
function QueueView({ lines, onApplyCode, onOpenLine, onToast, goStudio }: QueueViewProps) {
  const [suggestions, setSuggestions] = useState<Record<number, ClassResult[] | 'none'>>({});
  const pending = lines.filter(l => !l.code.trim());
  const items = lines.map((l, i) => ({ ...l, idx: i + 1 }));

  const classifyRow = (id: number) => {
    const line = lines.find(l => l.id === id);
    if (!line) return;
    const res = classify(line.desc);
    setSuggestions(s => ({ ...s, [id]: res.length ? res : 'none' }));
  };

  const classifyAll = () => {
    pending.forEach(i => {
      const res = classify(i.desc);
      if (res.length) onApplyCode(i.id, res[0].code, res[0].duty, 'queue auto');
    });
    onToast('Pending lines classified.');
  };

  return (
    <>
      <div className="stat-chips">
        <span className="chip">Lines <b>{items.length}</b></span>
        <span className="chip ok">Classified <b>{items.length - pending.length}</b></span>
        <span className={`chip ${pending.length ? 'warn' : 'ok'}`}>
          Awaiting classification <b>{pending.length}</b>
        </span>
      </div>
      <div className="card">
        <div className="card-head">
          <h3>Classification Queue</h3>
          <span className="sub">
            {pending.length ? 'Lines without an HS code are highlighted below.' : 'All lines classified.'}
          </span>
          <div className="spacer" style={{ flex: 1 }} />
          <button className="btn btn-sm btn-primary" onClick={classifyAll} disabled={!pending.length}>
            ⚡ Classify all pending
          </button>
        </div>
        {items.length ? (
          <div className="tablewrap">
            <table className="mini" style={{ minWidth: 680 }}>
              <thead>
                <tr>
                  <th style={{ width: 38 }}>#</th>
                  <th>Description</th>
                  <th style={{ width: 64 }}>Origin</th>
                  <th style={{ width: 120 }}>HS Code</th>
                  <th style={{ width: 170 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map(i => (
                  <React.Fragment key={i.id}>
                    <tr>
                      <td>{i.idx}</td>
                      <td>{i.desc}</td>
                      <td>{i.origin}</td>
                      <td className="mono">
                        {i.code ? i.code : <span style={{ color:'#b45309' }}>— none —</span>}
                      </td>
                      <td>
                        <button className={`btn btn-sm ${i.code ? '' : 'btn-primary'}`} onClick={() => classifyRow(i.id)}>
                          ⚡ Classify
                        </button>
                        <button className="btn btn-sm" onClick={() => onOpenLine(i.id)}>Open line</button>
                      </td>
                    </tr>
                    {suggestions[i.id] && (
                      <tr className="qres">
                        <td></td>
                        <td colSpan={4}>
                          {suggestions[i.id] === 'none' ? (
                            <span style={{ color:'#b45309' }}>
                              ⚠ No confident match — escalate for manual classification.
                            </span>
                          ) : (
                            <div style={{ display:'flex', flexDirection:'column', gap: 7 }}>
                              {(suggestions[i.id] as ClassResult[]).slice(0, 3).map((r, k) => (
                                <div key={r.code + k} style={{ display:'flex', alignItems:'center', gap: 10, flexWrap:'wrap' }}>
                                  <span className="mono" style={{ minWidth: 90 }}>{r.code}</span>
                                  <span style={{ flex:1, minWidth:180, fontSize:11.5, color:'#475569' }}>{r.desc}</span>
                                  <span style={{ fontSize:11, color:'var(--muted)', whiteSpace:'nowrap' }}>
                                    {r.duty}% · {r.conf}%
                                  </span>
                                  <button
                                    className={`btn btn-sm ${k === 0 ? 'btn-primary' : ''}`}
                                    onClick={() => {
                                      onApplyCode(i.id, r.code, r.duty, 'queue');
                                      onToast(`Applied ${r.code}.`);
                                      setSuggestions(s => { const n = { ...s }; delete n[i.id]; return n; });
                                    }}
                                  >
                                    Apply
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <span className="big">▤</span>No line items in the declaration yet.<br />
            <button className="btn btn-sm btn-primary" style={{ marginTop: 10 }} onClick={goStudio}>
              Go to Declaration Studio
            </button>
          </div>
        )}
      </div>
    </>
  );
}

interface DraftsViewProps {
  header: Header;
  lines: Line[];
  saveDraftNow: () => void;
  onRestore: (d: Draft) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  onAudit: (text: string) => void;
}
function DraftsView({ header, lines, saveDraftNow, onRestore, onToast, onAudit }: DraftsViewProps) {
  const [drafts, setDrafts] = useState<Draft[]>(() => loadDrafts());
  const grand = fmtMYR(computeTotals(lines, header).grand);

  const handleSave = () => { saveDraftNow(); setDrafts(loadDrafts()); };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this draft? This cannot be undone.')) return;
    storeDrafts(loadDrafts().filter(x => x.id !== id));
    onToast('Draft deleted.', 'warn');
    onAudit(`Draft <b>${id}</b> deleted.`);
    setDrafts(loadDrafts());
  };

  return (
    <>
      <div className="stat-chips">
        <span className="chip">Stored drafts <b>{drafts.length}</b></span>
        <span className="chip">Current lines <b>{lines.length}</b></span>
        <span className="chip info">Current payable <b>{grand}</b></span>
      </div>
      <div className="card">
        <div className="card-head">
          <h3>Saved Drafts</h3>
          <span className="sub">Stored in this browser only</span>
          <div className="spacer" style={{ flex: 1 }} />
          <button className="btn btn-sm btn-primary" onClick={handleSave}>＋ Save current declaration</button>
        </div>
        {drafts.length ? (
          <div className="tablewrap">
            <table className="mini" style={{ minWidth: 780 }}>
              <thead>
                <tr>
                  <th style={{ width: 110 }}>Reference</th>
                  <th>Importer</th>
                  <th style={{ width: 170 }}>Saved</th>
                  <th style={{ width: 60 }}>Lines</th>
                  <th style={{ width: 130 }}>Payable</th>
                  <th style={{ width: 170 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drafts.map(d => (
                  <tr key={d.id}>
                    <td className="mono">{d.id}</td>
                    <td>{d.importer || '—'}</td>
                    <td>{new Date(d.savedAt).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}</td>
                    <td>{d.lineCount}</td>
                    <td>{d.total || '—'}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => onRestore(d)}>Restore</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <span className="big">🗂</span>No drafts stored yet.<br />
            Use <b>Save current declaration</b> to store one.
          </div>
        )}
      </div>
    </>
  );
}

interface SubmittedViewProps {
  onOpenInfo: (title: string, body: React.ReactNode) => void;
}
function SubmittedDetail({ r }: { r: SubmittedRecord }) {
  return (
    <div className="info-block">
      <h4>MRN</h4>
      <div className="code-chip" style={{ fontSize: 13, padding:'3px 9px' }}>{r.mrn}</div>
      <h4>Importer</h4><div>{r.importer}</div>
      <h4>Port</h4><div>{r.port || '—'}</div>
      <h4>Submitted</h4><div>{new Date(r.submittedAt).toLocaleString('en-GB')}</div>
      <h4>Total payable</h4><div><b>{r.total}</b></div>
      <h4>Line items</h4>
      <table className="mini">
        <thead>
          <tr><th>#</th><th>Description</th><th>HS code</th><th>Origin</th><th>Qty</th><th>Unit</th><th>Duty</th></tr>
        </thead>
        <tbody>
          {r.items.length ? r.items.map((it, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{it.desc}</td>
              <td className="mono">{it.code || '—'}</td>
              <td>{it.origin}</td>
              <td>{it.qty}</td>
              <td>{it.val.toFixed(2)}</td>
              <td>{it.rate}%</td>
            </tr>
          )) : <tr><td colSpan={7}>No lines recorded.</td></tr>}
        </tbody>
      </table>
      <h4>Documents</h4>
      <div>{r.docs.length ? r.docs.map((d, i) => <div key={i}>• {d}</div>) : 'None attached.'}</div>
    </div>
  );
}

function SubmittedView({ onOpenInfo }: SubmittedViewProps) {
  const list = loadSubmitted();
  return (
    <>
      <div className="stat-chips">
        <span className="chip">Lodged <b>{list.length}</b></span>
      </div>
      <div className="card">
        <div className="card-head">
          <h3>Submitted Declarations</h3>
          <span className="sub">MRNs issued by the Customs Gateway</span>
        </div>
        {list.length ? (
          <div className="tablewrap">
            <table className="mini" style={{ minWidth: 780 }}>
              <thead>
                <tr>
                  <th style={{ width: 200 }}>MRN</th>
                  <th>Declaration</th>
                  <th>Importer</th>
                  <th style={{ width: 170 }}>Submitted</th>
                  <th style={{ width: 130 }}>Payable</th>
                  <th style={{ width: 100 }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r, i) => (
                  <tr key={r.mrn}>
                    <td className="mono">{r.mrn}</td>
                    <td className="mono">{r.declNo}</td>
                    <td>{r.importer}</td>
                    <td>{new Date(r.submittedAt).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}</td>
                    <td>{r.total}</td>
                    <td>
                      <button className="btn btn-sm"
                        onClick={() => onOpenInfo('Declaration ' + r.declNo, <SubmittedDetail r={r} />)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <span className="big">📤</span>No declarations lodged yet.<br />
            Complete validation and press <b>Validate &amp; Lodge</b> to submit.
          </div>
        )}
      </div>
    </>
  );
}

interface TariffViewProps {
  onUseCode: (code: string, rate: number) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
}
function TariffView({ onUseCode, onToast }: TariffViewProps) {
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<'all' | 'free' | 'dutiable'>('all');

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    return HS_DB.filter(h => {
      const txt = (h.code + ' ' + h.desc + ' ' + h.kw.join(' ')).toLowerCase();
      const matchText = !term || txt.includes(term);
      const matchDuty = mode === 'all' || (mode === 'free' && h.duty === 0) || (mode === 'dutiable' && h.duty > 0);
      return matchText && matchDuty;
    });
  }, [q, mode]);

  const copy = (code: string) => {
    if (navigator.clipboard) navigator.clipboard.writeText(code).then(
      () => onToast('Copied ' + code),
      () => onToast('Copy failed — select manually.', 'warn'));
    else onToast(code, 'ok');
  };

  return (
    <div className="card">
      <div className="card-head">
        <h3>National Tariff Schedule</h3>
        <span className="sub">{HS_DB.length} subheadings in this mock extract</span>
      </div>
      <div className="card-body" style={{ paddingBottom: 6 }}>
        <div className="view-toolbar">
          <input type="search" value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search code or description…" style={{ minWidth: 260 }} />
          <select value={mode} onChange={e => setMode(e.target.value as 'all' | 'free' | 'dutiable')}>
            <option value="all">All duty rates</option>
            <option value="free">Free (0%)</option>
            <option value="dutiable">Dutiable (&gt; 0%)</option>
          </select>
          <span className="chip">{filtered.length} of {HS_DB.length} shown</span>
        </div>
      </div>
      <div className="tablewrap">
        <table className="mini" style={{ minWidth: 760 }}>
          <thead>
            <tr>
              <th style={{ width: 130 }}>HS Code</th>
              <th>Description</th>
              <th style={{ width: 64 }}>Duty</th>
              <th style={{ width: 210 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(h => (
              <tr key={h.code}>
                <td className="mono">{h.code}</td>
                <td>
                  {h.desc}
                  {h.notes.length > 0 && (
                    <span title={h.notes[0]} style={{ color:'#b45309' }}> ⚠</span>
                  )}
                </td>
                <td>{h.duty}%</td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => onUseCode(h.code, h.duty)}>
                    Use on selected line
                  </button>
                  <button className="btn btn-sm" onClick={() => copy(h.code)}>Copy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface RulingsViewProps {
  onUseCode: (code: string, rate: number) => void;
}
function RulingsView({ onUseCode }: RulingsViewProps) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    return RULINGS.filter(r => !term || (r.ref + ' ' + r.subject + ' ' + r.code).toLowerCase().includes(term));
  }, [q]);
  return (
    <div className="card">
      <div className="card-head">
        <h3>Rulings &amp; Binding Tariff Information</h3>
        <span className="sub">Indicative only — bind the issuing administration for the stated goods</span>
      </div>
      <div className="card-body" style={{ paddingBottom: 6 }}>
        <div className="view-toolbar">
          <input type="search" value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search reference or subject…" style={{ minWidth: 260 }} />
          <span className="chip">{filtered.length} of {RULINGS.length} rulings</span>
        </div>
      </div>
      <div className="tablewrap">
        <table className="mini" style={{ minWidth: 700 }}>
          <thead>
            <tr><th style={{ width: 150 }}>Reference</th><th>Subject</th><th style={{ width: 120 }}>Code</th><th style={{ width: 200 }}>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map(r => {
              const entry = HS_DB.find(h => h.code === r.code);
              const duty = entry ? entry.duty : 0;
              return (
                <tr key={r.ref}>
                  <td className="mono">{r.ref}</td>
                  <td>{r.subject}</td>
                  <td className="mono">{r.code}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => onUseCode(r.code, duty)}>
                      Apply to selected line
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface FtaViewProps { onAudit: (text: string) => void; }
function FtaView({ onAudit }: FtaViewProps) {
  const [agreementId, setAgreementId] = useState(FTA_AGREEMENTS[0].id);
  const [origin, setOrigin] = useState(ORIGINS[0]);
  const [rvc, setRvc] = useState(0);
  const [cth, setCth] = useState<'no' | 'yes'>('no');
  const [verdict, setVerdict] = useState<{ cls: 'ok' | 'warn' | 'err'; msg: string } | null>(null);

  const check = () => {
    const ag = FTA_AGREEMENTS.find(a => a.id === agreementId)!;
    const member = ag.members.includes(origin);
    const rvcOk = rvc >= ag.threshold;
    let cls: 'ok' | 'warn' | 'err';
    let msg: string;
    if (!member) {
      cls = 'err';
      msg = `Origin ${origin} is not a member of ${ag.id}. Preferential treatment is not available under this agreement.`;
    } else if (rvcOk || cth === 'yes') {
      cls = 'ok';
      msg = `Qualifies under ${ag.id}: ${rvcOk ? `RVC of ${rvc}% meets the ${ag.threshold}% threshold` : 'change in tariff heading is satisfied'}. Attach a valid proof of origin (Form D for ATIGA).`;
    } else {
      cls = 'warn';
      msg = `Origin ${origin} is a member of ${ag.id}, but neither the RVC test (${rvc}% < ${ag.threshold}%) nor a change in tariff heading is satisfied.`;
    }
    setVerdict({ cls, msg });
    onAudit(`FTA origin check — ${ag.id} / ${origin} → ${cls === 'ok' ? 'qualifies' : 'does not qualify'}.`);
  };

  return (
    <>
      <div className="card">
        <div className="card-head">
          <h3>Origin Qualifier</h3>
          <span className="sub">Indicative check — verify against the legal text</span>
        </div>
        <div className="card-body">
          <div className="grid g4">
            <div className="field">
              <label>Agreement</label>
              <select value={agreementId} onChange={e => setAgreementId(e.target.value)}>
                {FTA_AGREEMENTS.map(a => <option key={a.id} value={a.id}>{a.id} — {a.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Origin country</label>
              <select value={origin} onChange={e => setOrigin(e.target.value)}>
                {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Regional value content (%)</label>
              <NumInput value={rvc} min={0} step={1} onChange={setRvc} />
            </div>
            <div className="field">
              <label>Change in tariff heading?</label>
              <select value={cth} onChange={e => setCth(e.target.value as 'no' | 'yes')}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary btn-sm" onClick={check}>Check qualification</button>
          </div>
          {verdict && (
            <div className={`verdict ${verdict.cls}`} style={{ marginTop: 12 }}>{verdict.msg}</div>
          )}
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Agreements in Force</h3></div>
        <div className="tablewrap">
          <table className="mini">
            <thead>
              <tr><th style={{ width: 110 }}>Agreement</th><th>Description</th><th>Members (selection)</th><th style={{ width: 110 }}>RVC threshold</th></tr>
            </thead>
            <tbody>
              {FTA_AGREEMENTS.map(a => (
                <tr key={a.id}>
                  <td className="mono">{a.id}</td>
                  <td>{a.name}</td>
                  <td className="mono">{a.members.join(' · ')}</td>
                  <td>{a.threshold}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

interface RestrictedViewProps { onFlag: (code: string) => void; }
function RestrictedView({ onFlag }: RestrictedViewProps) {
  const [q, setQ] = useState('');
  const entries = useMemo(() => HS_DB.filter(h => h.notes.length), []);
  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    return entries.filter(h => !term || (h.code + ' ' + h.notes[0]).toLowerCase().includes(term));
  }, [entries, q]);
  return (
    <>
      <div className="stat-chips">
        <span className="chip warn">Subheadings with requirements <b>{entries.length}</b></span>
      </div>
      <div className="card">
        <div className="card-head">
          <h3>Restricted Goods &amp; Permit Triggers</h3>
          <span className="sub">Mock schedule notes — verify with the competent authority</span>
        </div>
        <div className="card-body" style={{ paddingBottom: 6 }}>
          <div className="view-toolbar">
            <input type="search" value={q} onChange={e => setQ(e.target.value)}
              placeholder="Filter by code or requirement…" style={{ minWidth: 260 }} />
            <span className="chip">{filtered.length} of {entries.length} shown</span>
          </div>
        </div>
        <div className="tablewrap">
          <table className="mini" style={{ minWidth: 720 }}>
            <thead>
              <tr><th style={{ width: 120 }}>HS Code</th><th>Requirement</th><th style={{ width: 170 }}>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(h => (
                <tr key={h.code}>
                  <td className="mono">{h.code}</td>
                  <td>{h.notes[0]}</td>
                  <td>
                    <button className="btn btn-sm" onClick={() => onFlag(h.code)}>Flag in declaration</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

interface ImportersViewProps {
  onUseImporter: (name: string) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  onAudit: (text: string) => void;
}
function ImportersView({ onUseImporter, onToast, onAudit }: ImportersViewProps) {
  const [custom, setCustom] = useState<Importer[]>(() => loadImporters());
  const [name, setName] = useState('');
  const [reg, setReg] = useState('');
  const [status, setStatus] = useState('Active');
  const list = [...DEFAULT_IMPORTERS, ...custom];

  const handleAdd = () => {
    const n = name.trim();
    const r = reg.trim() || 'ROI-' + Math.floor(100000 + Math.random() * 899999);
    if (!n) { onToast('Enter a company name.', 'warn'); return; }
    const updated = [...loadImporters(), { name: n, reg: r, status }];
    storeImporters(updated);
    setCustom(updated);
    onAudit(`Importer registered: <b>${escapeHtml(n)}</b> (${escapeHtml(r)}).`);
    onToast('Importer added to registry.');
    setName(''); setReg('');
  };

  return (
    <>
      <div className="card">
        <div className="card-head">
          <h3>Importer Registry</h3>
          <span className="sub">{list.length} registered importers</span>
        </div>
        <div className="tablewrap">
          <table className="mini" style={{ minWidth: 720 }}>
            <thead>
              <tr><th>Importer</th><th style={{ width: 150 }}>Registration</th><th>Status</th><th style={{ width: 190 }}>Action</th></tr>
            </thead>
            <tbody>
              {list.map((im, i) => (
                <tr key={im.name + i}>
                  <td><b>{im.name}</b></td>
                  <td className="mono">{im.reg}</td>
                  <td>{im.status}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => onUseImporter(im.name)}>
                      Use on declaration
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Add Importer</h3></div>
        <div className="card-body">
          <div className="grid g3">
            <div className="field">
              <label>Company name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Harbourview Trading Sdn Bhd" />
            </div>
            <div className="field">
              <label>Registration no.</label>
              <input value={reg} onChange={e => setReg(e.target.value)} placeholder="e.g. ROI-445210" />
            </div>
            <div className="field">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option>Active</option>
                <option>Active · bonded warehouse</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-sm btn-primary" onClick={handleAdd}>Add to registry</button>
          </div>
        </div>
      </div>
    </>
  );
}

interface ProductsViewProps {
  lines: Line[];
  onAddProduct: (p: Product) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  onAudit: (text: string) => void;
  goStudio: () => void;
}
function ProductsView({ lines, onAddProduct, onToast, onAudit, goStudio }: ProductsViewProps) {
  const [products, setProducts] = useState<Product[]>(() => loadProducts());

  const saveCurrent = () => {
    const master = loadProducts();
    let added = 0;
    lines.forEach(it => {
      const key = (it.desc + '|' + it.code).toLowerCase();
      if (!master.some(m => (m.desc + '|' + m.code).toLowerCase() === key)) {
        master.push({ desc: it.desc, code: it.code, origin: it.origin, qty: it.qty, val: it.val, rate: it.rate });
        added++;
      }
    });
    storeProducts(master);
    setProducts(master);
    onAudit(`Product master updated — ${added} new product(s).`);
    onToast(added ? `${added} product(s) saved to master.` : 'All current lines already in the master.', added ? 'ok' : 'warn');
  };

  const remove = (idx: number) => {
    const master = loadProducts();
    const [removed] = master.splice(idx, 1);
    storeProducts(master);
    setProducts(master);
    if (removed) onAudit(`Product <b>${escapeHtml(removed.desc)}</b> removed from master.`);
  };

  return (
    <>
      <div className="stat-chips">
        <span className="chip">Products in master <b>{products.length}</b></span>
        <span className="chip">Lines in current declaration <b>{lines.length}</b></span>
      </div>
      <div className="card">
        <div className="card-head">
          <h3>Product Master</h3>
          <div className="spacer" style={{ flex: 1 }} />
          <button className="btn btn-sm btn-primary" onClick={saveCurrent} disabled={!lines.length}>
            ＋ Save current lines to master
          </button>
        </div>
        {products.length ? (
          <div className="tablewrap">
            <table className="mini" style={{ minWidth: 760 }}>
              <thead>
                <tr>
                  <th>Description</th><th style={{ width: 120 }}>HS Code</th>
                  <th style={{ width: 80 }}>Origin</th><th style={{ width: 80 }}>Unit</th>
                  <th style={{ width: 80 }}>Duty</th><th style={{ width: 200 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i}>
                    <td>{p.desc}</td>
                    <td className="mono">{p.code || '—'}</td>
                    <td>{p.origin || '—'}</td>
                    <td>{p.val ? p.val.toFixed(2) : '—'}</td>
                    <td>{p.rate}%</td>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => onAddProduct(p)}>Add as line</button>
                      <button className="btn btn-sm btn-danger" onClick={() => remove(i)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <span className="big">📦</span>Product master is empty.<br />
            Save the current line items, or add products from the declaration.
          </div>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   TARIFF DETAIL MODAL BODY
   ══════════════════════════════════════════════════════════ */
function TariffDetailBody({ h, onApply, onCopy }: { h: HsEntry; onApply: () => void; onCopy: () => void }) {
  return (
    <div className="info-block">
      <div className="code-chip" style={{ fontSize: 14, padding:'4px 10px' }}>{h.code}</div>
      <h4>Description</h4>
      <div>{h.desc}</div>
      <h4>Duty rate</h4>
      <div><b>{h.duty}%</b> (MFN applied rate — verify current gazette)</div>
      <h4>Compliance notes</h4>
      <div>
        {h.notes.length
          ? h.notes.map((n, i) => <div key={i}>⚠ {n}</div>)
          : '✓ No restrictions or permit triggers recorded.'}
      </div>
      <h4>Keywords</h4>
      <div>
        {h.kw.map(k => (
          <span key={k} className="code-chip"
            style={{ marginRight: 5, background:'#f1f5f9', color:'#475569' }}>{k}</span>
        ))}
      </div>
      <div style={{ marginTop: 16, display:'flex', gap: 8 }}>
        <button className="btn btn-sm btn-primary" onClick={onApply}>Apply to selected line</button>
        <button className="btn btn-sm" onClick={onCopy}>Copy code</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════════════════════ */
export default function App() {
  /* ---- UI collapse ---- */
  const [sbCollapsed, setSbCollapsed] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(K_UI);
      if (raw) {
        const ui = JSON.parse(raw);
        setSbCollapsed(!!ui.sb);
        setRailCollapsed(!!ui.rail);
      }
    } catch { /* noop */ }
  }, []);
  useEffect(() => {
    writeStore(K_UI, { sb: sbCollapsed, rail: railCollapsed });
  }, [sbCollapsed, railCollapsed]);

  /* ---- Navigation / tabs ---- */
  const [view, setView] = useState<ViewKey>('studio');
  const [railTab, setRailTab] = useState<RailTab>('classify');

  /* ---- Declaration state ---- */
  const [declNo] = useState('DRF-2026-004418');
  const [header, setHeaderState] = useState<Header>({
    importer: 'Northwind Electronics Sdn Bhd',
    defOrigin: 'CN',
    port: PORT_OPTIONS[0],
    incoterm: 'CIF',
    currency: 'MYR',
    fxRate: 1,
    taxRate: 10,
    declDate: new Date().toISOString().slice(0, 10),
    otherCharges: 0,
  });
  const [lines, setLines] = useState<Line[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [flashId, setFlashId] = useState<number | null>(null);
  const [focusLineId, setFocusLineId] = useState<number | null>(null);

  /* ---- Documents ---- */
  const [docs, setDocs] = useState<Doc[]>([]);
  const [viewerDoc, setViewerDoc] = useState<Doc | null>(null);

  /* ---- Audit ---- */
  const [audit, setAudit] = useState<AuditEvent[]>([]);

  /* ---- Toasts ---- */
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastSeq = useRef(0);

  /* ---- Classification ---- */
  const [classifyInput, setClassifyInput] = useState('');
  const [classifyStatus, setClassifyStatus] = useState<'idle' | 'loading' | 'no-input' | 'no-match' | 'done'>('idle');
  const [results, setResults] = useState<ClassResult[]>([]);

  /* ---- Search ---- */
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchHover, setSearchHover] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);

  /* ---- Submission ---- */
  const [submitted, setSubmitted] = useState(false);
  const [mrn, setMrn] = useState<string | null>(null);
  const [submittedVersion, setSubmittedVersion] = useState(0);

  /* ---- Sample flag ---- */
  const [sampleLoaded, setSampleLoaded] = useState(false);

  /* ---- Info modal ---- */
  const [info, setInfo] = useState<InfoContent | null>(null);

  /* ---- Refs used inside stable callbacks ---- */
  const seqRef = useRef(0);
  const docSeqRef = useRef(0);
  const linesRef = useRef<Line[]>([]);
  const docsRef = useRef<Doc[]>([]);
  const headerRef = useRef<Header>(header);
  const flashTimer = useRef<number | null>(null);

  useEffect(() => { linesRef.current = lines; }, [lines]);
  useEffect(() => { docsRef.current = docs; }, [docs]);
  useEffect(() => { headerRef.current = header; }, [header]);

  /* ---- Derived ---- */
  const totals = useMemo(() => computeTotals(lines, header), [lines, header]);
  const checks = useMemo(() => computeChecks(lines, docs, header), [lines, docs, header]);
  const fails = checks.filter(c => c.s === 'fail').length;

  const importerOptions = (() => {
    const custom = loadImporters();
    const names = [...DEFAULT_IMPORTERS.map(i => i.name), ...custom.map(i => i.name)];
    if (header.importer && !names.includes(header.importer)) names.push(header.importer);
    return names;
  })();

  const searchHits = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return [];
    const digits = q.replace(/[^0-9]/g, '');
    return HS_DB.filter(h => {
      if (digits.length >= 2 && h.code.replace(/[^0-9]/g, '').includes(digits)) return true;
      if (h.desc.toLowerCase().includes(q)) return true;
      return h.kw.some(k => k.includes(q) || q.includes(k));
    }).slice(0, 8);
  }, [search]);

  const statusText = submitted
    ? `Submitted · ${mrn}`
    : fails
      ? `${fails} blocking issue(s)`
      : lines.length ? 'Ready to lodge' : 'Draft';

  /* ---- Helpers ---- */
  const pushToast = useCallback((msg: string, kind: ToastKind = 'ok') => {
    const id = ++toastSeq.current;
    setToasts(t => [...t, { id, msg, kind }]);
    window.setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3400);
  }, []);

  const logAudit = useCallback((text: string) => {
    setAudit(a => [{ text, time: nowTime() }, ...a]);
  }, []);

  const setHeader = useCallback((patch: Partial<Header>) => {
    setHeaderState(prev => ({ ...prev, ...patch }));
  }, []);

  /* ---- Line operations ---- */
  const addLine = useCallback((data: Partial<Line> = {}) => {
    const id = ++seqRef.current;
    const line: Line = {
      id,
      desc: data.desc ?? '',
      code: data.code ?? '',
      origin: data.origin ?? headerRef.current.defOrigin,
      qty: data.qty ?? 1,
      val: data.val ?? 0,
      rate: data.rate ?? 0,
    };
    setLines(ls => [...ls, line]);
    return id;
  }, []);

  const updateLine = useCallback((id: number, patch: Partial<Line>) => {
    setLines(ls => ls.map(l => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  const removeLine = useCallback((id: number) => {
    const idx = linesRef.current.findIndex(l => l.id === id) + 1;
    setLines(ls => ls.filter(l => l.id !== id));
    setActiveId(a => (a === id ? null : a));
    if (idx > 0) logAudit('Line ' + idx + ' removed from declaration.');
  }, [logAudit]);

  const duplicateLine = useCallback((id: number) => {
    const l = linesRef.current.find(x => x.id === id);
    if (!l) return;
    addLine({ desc: l.desc, code: l.code, origin: l.origin, qty: l.qty, val: l.val, rate: l.rate });
    logAudit('Line duplicated.');
    pushToast('Line duplicated.');
  }, [addLine, logAudit, pushToast]);

  const selectLine = useCallback((id: number) => {
    setActiveId(id);
    const l = linesRef.current.find(x => x.id === id);
    if (l) setClassifyInput(l.desc);
  }, []);

  const applyCodeToLine = useCallback((id: number, code: string, rate: number, source?: string) => {
    const line = linesRef.current.find(l => l.id === id);
    if (!line) { pushToast('That line no longer exists.', 'warn'); return false; }
    const idx = linesRef.current.indexOf(line) + 1;
    setLines(ls => ls.map(l => (l.id === id ? { ...l, code, rate } : l)));
    setFlashId(id);
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlashId(null), 1100);
    logAudit(`Applied HS <b>${code}</b> (${rate}% duty) to line ${idx}${source ? ` — ${source}` : ''}.`);
    return true;
  }, [logAudit, pushToast]);

  /* ---- Documents ---- */
  const addDoc = useCallback(({ name, type, blob, pages = 1, source = 'attached' }: {
    name: string; type: DocTypeKey; blob: Blob; pages?: number; source?: 'attached' | 'sample';
  }) => {
    const id = ++docSeqRef.current;
    const url = URL.createObjectURL(blob);
    const doc: Doc = { id, name, type, blob, url, pages, source, size: blob.size, added: nowTime() };
    setDocs(ds => [...ds, doc]);
    logAudit(`Document attached: <b>${escapeHtml(name)}</b> (${DOC_TYPES[type].label}).`);
    return doc;
  }, [logAudit]);

  const removeDoc = useCallback((id: number) => {
    const d = docsRef.current.find(x => x.id === id);
    if (!d) return;
    try { URL.revokeObjectURL(d.url); } catch { /* noop */ }
    setDocs(ds => ds.filter(x => x.id !== id));
    logAudit(`Document removed: <b>${escapeHtml(d.name)}</b>.`);
    pushToast('Document removed.', 'warn');
  }, [logAudit, pushToast]);

  const handleFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (!arr.length) return;
    let added = 0;
    arr.forEach(f => {
      const isPdf = f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
      if (!isPdf) { pushToast(`"${f.name}" is not a PDF — skipped.`, 'err'); return; }
      const guess: DocTypeKey = /inv/i.test(f.name) ? 'invoice'
        : /pack/i.test(f.name) ? 'packing'
        : /(bol|b\/l|awb|lading)/i.test(f.name) ? 'bol'
        : /permit|licen/i.test(f.name) ? 'permit'
        : /coo|origin/i.test(f.name) ? 'coo' : 'invoice';
      addDoc({ name: f.name, type: guess, blob: f, pages: 1, source: 'attached' });
      added++;
    });
    if (added) pushToast(`${added} PDF document(s) attached.`);
  };

  const loadSampleDocs = () => {
    const ctx: DeclCtx = {
      declNo, importer: header.importer, incoterm: header.incoterm, currency: header.currency,
      port: header.port, defOrigin: header.defOrigin, declDate: header.declDate, lines,
    };
    const items: { name: string; type: DocTypeKey; rows: PdfRow[] }[] = [
      { name: 'Invoice_INV-' + declNum(declNo).slice(-6) + '.pdf', type: 'invoice', rows: sampleInvoiceRows(ctx) },
      { name: 'PackingList_PL-' + declNum(declNo).slice(-6) + '.pdf', type: 'packing', rows: samplePackingRows(ctx) },
      { name: 'BillOfLading_MYPKG-88213.pdf', type: 'bol', rows: sampleBolRows(ctx) },
      { name: 'CertificateOfOrigin_COO-' + declNum(declNo).slice(-6) + '.pdf', type: 'coo', rows: sampleCooRows(ctx) },
    ];
    items.forEach(d => {
      const blob = buildPDF(
        d.name.replace(/\.pdf$/i, '').replace(/_/g, ' '),
        'Declaration ' + declNo + '  |  ' + header.importer,
        d.rows,
      );
      addDoc({ name: d.name, type: d.type, blob, pages: 1, source: 'sample' });
    });
    pushToast('Sample document set generated (4 PDFs).');
    logAudit('Sample document set generated for declaration <b>' + declNo + '</b>.');
  };

  /* ---- Classification ---- */
  const runClassification = (textOverride?: string) => {
    const text = textOverride !== undefined ? textOverride : classifyInput;
    if (!text.trim()) { setResults([]); setClassifyStatus('no-input'); return; }
    setClassifyStatus('loading');
    window.setTimeout(() => {
      const res = classify(text);
      setResults(res);
      if (!res.length) {
        setClassifyStatus('no-match');
        logAudit(`Classification attempted — <b>no match</b> for "${escapeHtml(text.slice(0, 60))}"`);
        pushToast('No match found. Manual classification required.', 'warn');
      } else {
        setClassifyStatus('done');
        logAudit(`AI classification run — ${res.length} candidate code(s) returned for "${escapeHtml(text.slice(0, 50))}"`);
      }
    }, 320);
  };

  const applyResult = (r: ClassResult) => {
    if (activeId == null) { pushToast('Select a line item first.', 'warn'); return; }
    const idx = linesRef.current.findIndex(l => l.id === activeId) + 1;
    applyCodeToLine(activeId, r.code, r.duty, 'AI confidence ' + r.conf + '%');
    pushToast(`Applied ${r.code} to line ${idx}.`);
    r.notes.forEach(n => pushToast(n, 'warn'));
  };

  const flagResult = (r: ClassResult) => {
    logAudit(`Code <b>${r.code}</b> flagged for senior review.`);
    pushToast('Flagged for senior classifier review.', 'warn');
  };

  const autoClassifyAll = () => {
    if (!lines.length) { pushToast('Add at least one line first.', 'warn'); return; }
    let applied = 0, unmatched = 0;
    lines.forEach(l => {
      if (!l.desc.trim()) { unmatched++; return; }
      const best = classify(l.desc)[0];
      if (!best) { unmatched++; return; }
      applyCodeToLine(l.id, best.code, best.duty, 'auto-classification');
      applied++;
    });
    logAudit(`Auto-classification sweep completed — ${applied} line(s) classified, ${unmatched} unmatched.`);
    if (applied) pushToast(`${applied} line(s) auto-classified.`);
    if (unmatched) pushToast(`${unmatched} line(s) could not be matched — review manually.`, 'warn');
  };

  /* ---- Sample lines ---- */
  const loadSample = () => {
    if (sampleLoaded) { pushToast('Sample already loaded.', 'warn'); return; }
    const samples: Partial<Line>[] = [
      { desc:'Wireless Bluetooth headphones with charging case', code:'8518.30.00', origin:'CN', qty:500,  val:42.50,  rate:0 },
      { desc:"Men's cotton knitted t-shirts, short sleeve",      code:'6109.10.00', origin:'VN', qty:1200, val:18.90,  rate:10 },
      { desc:'Laptop computer, 14 inch, 1.3 kg, 16GB RAM',       code:'8471.30.00', origin:'CN', qty:75,   val:3150.00, rate:0 },
      { desc:'USB-C charging cable 2m, with connectors',         code:'8544.42.00', origin:'CN', qty:2000, val:6.20,   rate:5 },
    ];
    samples.forEach(s => addLine(s));
    setSampleLoaded(true);
    logAudit('Sample declaration loaded (4 lines).');
    pushToast('Sample declaration loaded.');
  };

  /* ---- Draft save / restore ---- */
  const saveDraft = useCallback(() => {
    const h = headerRef.current;
    const ls = linesRef.current;
    const t = computeTotals(ls, h);
    const draft: Draft = {
      id: 'DRF-' + Date.now().toString(36).toUpperCase().slice(-6),
      declNo,
      savedAt: new Date().toISOString(),
      importer: h.importer,
      currency: h.currency,
      total: fmtMYR(t.grand),
      lineCount: ls.length,
      header: h,
      items: ls.map(({ id: _id, ...rest }) => rest),
    };
    const list = loadDrafts();
    list.unshift(draft);
    if (!storeDrafts(list)) {
      pushToast('Could not save draft — storage unavailable.', 'err');
      return;
    }
    logAudit(`Declaration saved as draft <b>${draft.id}</b> (${draft.lineCount} lines).`);
    pushToast('Draft saved locally.');
  }, [declNo, logAudit, pushToast]);

  const restoreDraft = (d: Draft) => {
    setHeaderState(prev => ({ ...prev, ...(d.header || {}) }));
    const newLines: Line[] = (d.items || []).map(it => ({
      id: ++seqRef.current,
      desc: it.desc === '(no description)' ? '' : it.desc,
      code: it.code || '',
      origin: it.origin || 'CN',
      qty: it.qty ?? 1,
      val: it.val ?? 0,
      rate: it.rate ?? 0,
    }));
    setLines(newLines);
    setActiveId(null);
    setSubmitted(false);
    setMrn(null);
    logAudit(`Draft <b>${d.id}</b> restored (${newLines.length} lines).`);
    pushToast('Draft restored.');
    setView('studio');
  };

  /* ---- Export / clear / lodge ---- */
  const exportDeclaration = () => {
    const h = header;
    const fx = Number(h.fxRate) || 1;
    const payload = {
      declarationNo: declNo,
      header: {
        importer: h.importer, origin: h.defOrigin, port: h.port, incoterm: h.incoterm,
        currency: h.currency, exchangeRate: fx, taxRate: h.taxRate,
        declarationDate: h.declDate, otherCharges: h.otherCharges,
      },
      items: lines.map(i => ({ ...i, dutyAmountMYR: (i.qty * i.val * fx * i.rate) / 100 })),
      totals: {
        customsValue: fmtCur(totals.totalValue, h.currency),
        customsValueMYR: fmtMYR(totals.valueMYR),
        duty: fmtMYR(totals.totalDutyMYR),
        tax: fmtMYR(totals.tax),
        otherCharges: fmtMYR(totals.other),
        payable: fmtMYR(totals.grand),
      },
      documents: docs.map(d => ({ name: d.name, type: d.type, pages: d.pages, size: d.size })),
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = declNo + '.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    logAudit('Declaration exported as JSON.');
    pushToast('Declaration exported.');
  };

  const clearAll = () => {
    if (!confirm('Clear all line items and attached documents from this declaration?')) return;
    setLines([]);
    setActiveId(null);
    setSampleLoaded(false);
    setSubmitted(false);
    setMrn(null);
    docs.forEach(d => { try { URL.revokeObjectURL(d.url); } catch { /* noop */ } });
    setDocs([]);
    setResults([]);
    setClassifyStatus('idle');
    logAudit('Declaration cleared.');
    pushToast('All lines and documents cleared.', 'warn');
  };

  const lodge = () => {
    setRailTab('checks');
    if (fails) { pushToast(`Cannot lodge — ${fails} blocking issue(s).`, 'err'); return; }
    if (!lines.length) { pushToast('Cannot lodge an empty declaration.', 'err'); return; }
    const newMrn = 'MRN-' + new Date().getFullYear() + '-' + String(Math.floor(10000000 + Math.random() * 89999999));
    const record: SubmittedRecord = {
      mrn: newMrn,
      declNo,
      submittedAt: new Date().toISOString(),
      importer: header.importer,
      port: header.port,
      currency: header.currency,
      total: fmtMYR(totals.grand),
      items: lines,
      docs: docs.map(d => d.name),
    };
    const list = loadSubmitted();
    list.unshift(record);
    storeSubmitted(list);
    setSubmitted(true);
    setMrn(newMrn);
    setSubmittedVersion(v => v + 1);
    logAudit(`Declaration <b>${record.declNo}</b> lodged — <b>${newMrn}</b> issued.`);
    pushToast('Declaration lodged. MRN ' + newMrn + ' issued.', 'ok');
  };

  /* ---- Search helpers ---- */
  const openTariffDetail = (h: HsEntry) => {
    setInfo({
      title: 'Tariff detail · ' + h.code,
      body: (
        <TariffDetailBody
          h={h}
          onApply={() => {
            if (activeId == null) { pushToast('Select a line item in the studio first.', 'warn'); return; }
            if (applyCodeToLine(activeId, h.code, h.duty, 'search')) {
              pushToast('Applied ' + h.code + ' to the selected line.');
              setInfo(null);
              setView('studio');
            }
          }}
          onCopy={() => {
            if (navigator.clipboard) navigator.clipboard.writeText(h.code).then(
              () => pushToast('Code copied to clipboard.'),
              () => pushToast('Copy failed — select manually.', 'warn'));
          }}
        />
      ),
    });
  };

  const selectSearchHit = (h: HsEntry) => {
    setSearchOpen(false);
    setSearch('');
    setSearchHover(-1);
    openTariffDetail(h);
  };

  /* ---- Effects ---- */
  useEffect(() => {
    logAudit('Studio session opened. Declaration <b>' + declNo + '</b> initialised.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = window.setTimeout(
      () => pushToast('Tip: Ctrl+K searches tariffs · Ctrl+B toggles the sidebar.', 'ok'),
      800,
    );
    return () => window.clearTimeout(t);
  }, [pushToast]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.searchbox')) setSearchOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e.metaKey;
      if (e.key === 'Escape') {
        if (viewerDoc) { setViewerDoc(null); return; }
        if (info) { setInfo(null); return; }
        if (searchOpen) { setSearchOpen(false); return; }
      }
      if (meta && e.key.toLowerCase() === 'b') { e.preventDefault(); setSbCollapsed(s => !s); }
      if (meta && e.key.toLowerCase() === 's') { e.preventDefault(); saveDraft(); }
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
      if (meta && e.key === 'Enter') { e.preventDefault(); runClassification(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [viewerDoc, info, searchOpen, saveDraft]);

  /* ---- View helpers ---- */
  const goStudio = () => setView('studio');
  const handleAiLine = (id: number) => {
    const line = linesRef.current.find(l => l.id === id);
    if (!line) return;
    setActiveId(id);
    setClassifyInput(line.desc);
    setRailTab('classify');
    setRailCollapsed(false);
    runClassification(line.desc);
  };

  /* ---- Alt view renderer ---- */
  const renderAltView = () => {
    switch (view) {
      case 'queue':
        return <QueueView lines={lines} onApplyCode={applyCodeToLine}
          onOpenLine={id => { selectLine(id); setView('studio'); }}
          onToast={pushToast} goStudio={goStudio} />;
      case 'drafts':
        return <DraftsView header={header} lines={lines} saveDraftNow={saveDraft}
          onRestore={restoreDraft} onToast={pushToast} onAudit={logAudit} />;
      case 'submitted':
        return <SubmittedView key={submittedVersion}
          onOpenInfo={(title, body) => setInfo({ title, body })} />;
      case 'tariff':
        return <TariffView
          onUseCode={(code, rate) => {
            if (activeId == null) { pushToast('Select a line item in the studio first.', 'warn'); return; }
            if (applyCodeToLine(activeId, code, rate, 'tariff schedule')) pushToast(`Applied ${code} to the selected line.`);
          }}
          onToast={pushToast} />;
      case 'rulings':
        return <RulingsView
          onUseCode={(code, rate) => {
            if (activeId == null) { pushToast('Select a line item in the studio first.', 'warn'); return; }
            if (applyCodeToLine(activeId, code, rate, 'ruling')) pushToast(`Applied ${code}.`);
          }} />;
      case 'fta':
        return <FtaView onAudit={logAudit} />;
      case 'restricted':
        return <RestrictedView onFlag={code => {
          logAudit(`Restricted goods flag raised for <b>${code}</b> — permit review required.`);
          pushToast(`Flagged ${code} for permit review.`, 'warn');
          setRailTab('audit');
        }} />;
      case 'importers':
        return <ImportersView
          onUseImporter={name => {
            setHeader({ importer: name });
            logAudit(`Importer set to <b>${escapeHtml(name)}</b>.`);
            pushToast('Importer set on the declaration.');
            setView('studio');
          }}
          onToast={pushToast} onAudit={logAudit} />;
      case 'products':
        return <ProductsView lines={lines}
          onAddProduct={p => {
            addLine({ desc:p.desc, code:p.code, origin:p.origin, qty:1, val:p.val, rate:p.rate });
            logAudit(`Product <b>${escapeHtml(p.desc)}</b> added as a line item.`);
            pushToast('Product added to the declaration.');
            setView('studio');
          }}
          onToast={pushToast} onAudit={logAudit} goStudio={goStudio} />;
      default:
        return null;
    }
  };

  const ALT_TITLES: Record<string, { title: string; sub: string }> = {
    queue:     { title:'Classification Queue', sub:'Every line without a tariff classification, with one-click suggestions from the classification engine.' },
    drafts:    { title:'Draft Declarations', sub:'Locally stored drafts. Restore any draft straight into the studio, or delete ones you no longer need.' },
    submitted: { title:'Submitted / MRN', sub:'Declarations lodged through this session, with the Movement Reference Number issued for each.' },
    tariff:    { title:'Tariff Schedule', sub:'Search the tariff and push a code straight onto the selected line item.' },
    rulings:   { title:'Rulings & BTIs', sub:'Prior rulings you can rely on when classifying similar goods.' },
    fta:       { title:'FTA Origin Rules', sub:'Check whether goods qualify for preferential duty treatment under an FTA.' },
    restricted:{ title:'Restricted Goods', sub:'Subheadings that carry permit, standards or licensing obligations.' },
    importers: { title:'Importer Registry', sub:'Select an importer to populate the declaration header, or register a new consignee.' },
    products:  { title:'Product Master', sub:'Reusable product records — push them straight into the declaration as new lines.' },
  };

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{CSS}</style>
      <div className={`app ${sbCollapsed ? 'sb-collapsed' : ''} ${railCollapsed ? 'rail-collapsed' : ''}`}>
        <Topbar
          search={search} setSearch={setSearch}
          searchOpen={searchOpen} setSearchOpen={setSearchOpen}
          hits={searchHits} hover={searchHover} setHover={setSearchHover}
          onSelect={selectSearchHit} searchRef={searchRef}
        />

        <Sidebar
          collapsed={sbCollapsed}
          view={view}
          onNavigate={k => setView(k)}
          onToggle={() => setSbCollapsed(s => !s)}
        />

        <main className="main">
          {view === 'studio' ? (
            <StudioView
              header={header} setHeader={setHeader}
              importerOptions={importerOptions} declNo={declNo}
              totals={totals} lines={lines} docs={docs}
              activeId={activeId} flashId={flashId} focusLineId={focusLineId}
              onSelectLine={selectLine}
              onUpdateLine={updateLine}
              onRemoveLine={removeLine}
              onDuplicateLine={duplicateLine}
              onAiLine={handleAiLine}
              onAddLine={() => {
                const id = addLine();
                setFocusLineId(id);
                logAudit('New line item added.');
              }}
              onAutoAll={autoClassifyAll}
              onLoadSample={loadSample}
              onAddFiles={handleFiles}
              onRemoveDoc={removeDoc}
              onOpenDoc={d => { setViewerDoc(d); logAudit(`Previewed document <b>${escapeHtml(d.name)}</b>.`); }}
              onLoadSampleDocs={loadSampleDocs}
              onFocused={() => setFocusLineId(null)}
              onAudit={logAudit}
              onToast={pushToast}
            />
          ) : (
            <>
              <div className="view-head">
                <div>
                  <h2>{ALT_TITLES[view]?.title}</h2>
                  <p>{ALT_TITLES[view]?.sub}</p>
                </div>
                <div className="spacer" style={{ flex: 1 }} />
                <button className="btn btn-sm" onClick={goStudio}>← Back to Studio</button>
              </div>
              {renderAltView()}
            </>
          )}
        </main>

        <RightRail
          tab={railTab} setTab={setRailTab}
          collapsed={railCollapsed}
          onToggle={() => setRailCollapsed(s => !s)}
          classifyInput={classifyInput} setClassifyInput={setClassifyInput}
          classifyStatus={classifyStatus} results={results}
          onRun={() => runClassification()}
          onApplyResult={applyResult}
          onFlagResult={flagResult}
          checks={checks}
          audit={audit}
        />

        {/* ACTION BAR */}
        <div className="actionbar">
          <span className="stat">Status: <b style={{
            color: submitted ? 'var(--accent)' : fails ? 'var(--danger)' : lines.length ? 'var(--ok)' : undefined,
          }}>{statusText}</b></span>
          <span className="stat">· Lines: <b>{lines.length}</b></span>
          <span className="stat">· Docs: <b>{docs.length}</b></span>
          <span className="stat">· Payable: <b>{fmtMYR(totals.grand)}</b></span>
          <div className="spacer" style={{ flex: 1 }} />
          <button className="btn btn-sm" onClick={exportDeclaration} title="Export declaration JSON">⤓ Export</button>
          <button className="btn btn-danger btn-sm" onClick={clearAll}>Clear All</button>
          <button className="btn btn-sm" onClick={saveDraft}>Save Draft</button>
          <button className="btn btn-sm btn-primary" onClick={lodge}>Validate &amp; Lodge →</button>
        </div>

        {/* PDF VIEWER MODAL */}
        {viewerDoc && (
          <div className="modal open"
            onClick={e => { if (e.target === e.currentTarget) setViewerDoc(null); }}>
            <div className="modal-shell">
              <div className="modal-bar">
                <div>
                  <div className="mtitle">{viewerDoc.name}</div>
                  <div className="mmeta">
                    {DOC_TYPES[viewerDoc.type].label} · {viewerDoc.pages} page{viewerDoc.pages > 1 ? 's' : ''} · {kb(viewerDoc.size)} · added {viewerDoc.added}
                  </div>
                </div>
                <div className="spacer" style={{ flex: 1 }} />
                <a className="btn btn-sm" href={viewerDoc.url} download={viewerDoc.name}>⤓ Download</a>
                <a className="btn btn-sm" href={viewerDoc.url} target="_blank" rel="noopener noreferrer">↗ Open in tab</a>
                <button className="btn btn-sm btn-primary" onClick={() => setViewerDoc(null)}>Close ✕</button>
              </div>
              <div className="modal-body">
                <iframe id="pdfFrame" title="PDF preview" src={viewerDoc.url} />
              </div>
            </div>
          </div>
        )}

        {/* INFO MODAL */}
        {info && (
          <div className="modal open"
            onClick={e => { if (e.target === e.currentTarget) setInfo(null); }}>
            <div className="modal-shell sm">
              <div className="modal-bar">
                <div className="mtitle">{info.title}</div>
                <div className="spacer" style={{ flex: 1 }} />
                <button className="btn btn-sm btn-primary" onClick={() => setInfo(null)}>Close ✕</button>
              </div>
              <div className="modal-body pad">{info.body}</div>
            </div>
          </div>
        )}

        {/* TOASTS */}
        <div id="toasts">
          {toasts.map(t => (
            <div key={t.id} className={`toast ${t.kind}`}>
              {(t.kind === 'ok' ? '✓ ' : t.kind === 'warn' ? '⚠ ' : '✕ ') + t.msg}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}