'use client';
import { useMemo, useState, useEffect, useCallback, Fragment, type ReactNode } from "react";
import { Terminal } from "@/components/ai-elements/terminal";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root{
  --bg-app:#0d1117;
  --bg-chrome:#0a0e14;
  --bg-panel:#0f141b;
  --bg-panel-2:#131921;
  --bg-panel-3:#1a2129;
  --bg-input:#0a0e14;
  --bg-hover:#1f2731;
  --bg-active:#233044;
  --bg-selected:#1c3a5e;
  --line:#1f2937;
  --line-2:#2d3748;
  --line-3:#374151;
  --text:#e5e7eb;
  --text-2:#9ca3af;
  --text-3:#6b7280;
  --text-4:#4b5563;
  --blue:#3b82f6;
  --blue-2:#60a5fa;
  --blue-3:#1d4ed8;
  --green:#10b981;
  --green-2:#34d399;
  --amber:#f59e0b;
  --red:#ef4444;
  --purple:#8b5cf6;
  --cyan:#06b6d4;
  --radius:4px;
  --radius-2:6px;
  --font-ui:'Inter',system-ui,sans-serif;
  --font-mono:'JetBrains Mono',ui-monospace,monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
body{
  font:12px/1.45 var(--font-ui);
  background:var(--bg-app);
  color:var(--text);
  -webkit-font-smoothing:antialiased;
}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
input,textarea,select{font:inherit;color:inherit;background:none;border:0;outline:none}
::-webkit-scrollbar{width:8px;height:8px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#2d3748;border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:#4b5563}
.win{display:grid;grid-template-rows:28px 34px 1fr;height:100vh;background:var(--bg-app)}
.win-title{display:flex;align-items:center;padding:0 10px;background:linear-gradient(180deg,#1a2129,#0f141b);border-bottom:1px solid #000;font-size:11px;color:var(--text-2);gap:8px}
.win-title .app-icon{width:14px;height:14px;border-radius:3px;background:linear-gradient(135deg,#3b82f6,#8b5cf6)}
.win-title .spacer{flex:1}
.win-ctrl{display:flex;gap:0;height:28px}
.win-ctrl button{width:44px;height:28px;display:grid;place-items:center;color:var(--text-2);font-size:11px;transition:background .1s}
.win-ctrl button:hover{background:#1f2937}
.win-ctrl .close:hover{background:#dc2626;color:#fff}
.tabbar{display:flex;align-items:center;background:var(--bg-chrome);border-bottom:1px solid var(--line);padding:0 8px;gap:4px;font-size:11px}
.tab{display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:4px 4px 0 0;color:var(--text-2);border:1px solid transparent;border-bottom:0;white-space:nowrap}
.tab.active{background:var(--bg-panel);color:var(--text);border-color:var(--line)}
.tab .dot{width:6px;height:6px;border-radius:50%;background:var(--blue)}
.tab-icon{padding:4px 8px;color:var(--text-3);border-radius:3px}
.tab-icon:hover{background:var(--bg-hover);color:var(--text)}
.tabbar .spacer{flex:1}
.provider-select{display:flex;align-items:center;gap:6px;padding:3px 8px;background:var(--bg-panel-2);border:1px solid var(--line);border-radius:4px;color:var(--text);font-size:11px}
.provider-select:hover{border-color:var(--line-3)}
.provider-select .star{color:var(--amber)}
.model-select{display:flex;align-items:center;gap:6px;padding:3px 8px;background:var(--bg-panel-2);border:1px solid var(--line);border-radius:4px;color:var(--text);font-size:11px}
.ok-btn{padding:3px 10px;background:var(--blue);color:#fff;border-radius:4px;font-size:11px;font-weight:600;letter-spacing:.05em}
.ok-btn:hover{background:var(--blue-3)}
.tabbar-icon{width:26px;height:26px;display:grid;place-items:center;border-radius:3px;color:var(--text-3)}
.tabbar-icon:hover{background:var(--bg-hover);color:var(--text)}
.tabbar-icon.active{color:var(--blue-2)}
.main{display:grid;grid-template-columns:260px 1fr 420px;min-height:0;overflow:hidden;transition:grid-template-columns .2s cubic-bezier(.4,0,.2,1)}
.main.left-collapsed{grid-template-columns:36px 1fr 420px}
.main.right-collapsed{grid-template-columns:260px 1fr 36px}
.main.both-collapsed{grid-template-columns:36px 1fr 36px}
.side{background:var(--bg-panel);border-right:1px solid var(--line);display:flex;flex-direction:column;min-width:0;overflow:hidden}
.side.collapsed .side-body{display:none}
.side.collapsed .side-head{justify-content:center;padding:8px 0}
.side.collapsed .side-title,.side.collapsed .side-tabs-label{display:none}
.side-head{display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--line);flex:none}
.side-title{font-size:11px;font-weight:600;color:var(--text);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.side-toggle{width:22px;height:22px;display:grid;place-items:center;border-radius:3px;color:var(--text-3);flex:none}
.side-toggle:hover{background:var(--bg-hover);color:var(--text)}
.side-tabs{display:flex;gap:2px;padding:4px 6px;border-bottom:1px solid var(--line);flex:none}
.side-tab{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;padding:4px 6px;border-radius:3px;font-size:10.5px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em}
.side-tab:hover{background:var(--bg-hover);color:var(--text-2)}
.side-tab.active{background:var(--bg-active);color:var(--text)}
.side-body{flex:1;overflow-y:auto;overflow-x:hidden;min-height:0}
.side-section{padding:8px 10px;border-bottom:1px solid var(--line)}
.side-section-title{display:flex;align-items:center;justify-content:space-between;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--text-3);margin-bottom:6px}
.side-refresh{display:flex;align-items:center;gap:5px;width:100%;padding:4px 8px;background:var(--bg-panel-2);border:1px solid var(--line);border-radius:3px;color:var(--text-2);font-size:10.5px}
.side-refresh:hover{background:var(--bg-hover)}
.tree{font-size:11px;padding:4px 0}
.tree-row{display:flex;align-items:center;gap:5px;padding:2px 8px 2px 4px;border-radius:2px;cursor:pointer;white-space:nowrap;position:relative}
.tree-row:hover{background:var(--bg-hover)}
.tree-row.selected{background:var(--bg-selected)}
.tree-row .cb{width:11px;height:11px;border:1px solid var(--line-3);border-radius:2px;display:grid;place-items:center;flex:none;background:var(--bg-input)}
.tree-row .cb.checked{background:var(--blue);border-color:var(--blue)}
.tree-row .cb.checked::after{content:'✓';color:#fff;font-size:8px;line-height:1;font-weight:700}
.tree-row .cb.partial{background:var(--blue);border-color:var(--blue)}
.tree-row .cb.partial::after{content:'−';color:#fff;font-size:10px;line-height:1;font-weight:700}
.tree-row .icon{width:12px;text-align:center;color:var(--text-3);font-size:10px;flex:none}
.tree-row .icon.folder{color:var(--amber)}
.tree-row .name{color:var(--text-2);overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}
.tree-row.selected .name{color:var(--text)}
.tree-indent{display:inline-block;width:12px;flex:none}
.mini-list{display:flex;flex-direction:column;gap:3px;font-size:10.5px;color:var(--text-3)}
.mini-list-item{display:flex;align-items:center;gap:6px;padding:3px 6px;border-radius:3px;color:var(--text-2)}
.mini-list-item:hover{background:var(--bg-hover)}
.mini-list-item .badge{padding:1px 5px;font-size:9px;background:var(--bg-panel-3);border-radius:3px;color:var(--text-3)}
.center{display:flex;flex-direction:column;background:var(--bg-panel-2);min-width:0;overflow:hidden}
.center-head{display:flex;align-items:center;gap:6px;padding:6px 10px;background:var(--bg-panel);border-bottom:1px solid var(--line);flex:none;font-size:11px}
.center-head .file-icon{width:14px;height:14px;border-radius:2px;background:linear-gradient(135deg,#3b82f6,#8b5cf6)}
.center-head .filename{color:var(--text);font-weight:500}
.center-head .spacer{flex:1}
.center-head .badge-blue{padding:2px 6px;font-size:9.5px;background:rgba(59,130,246,.15);color:var(--blue-2);border-radius:3px;border:1px solid rgba(59,130,246,.3);font-weight:600;letter-spacing:.04em}
.center-toolbar{display:flex;align-items:center;gap:2px;padding:4px 8px;background:var(--bg-panel);border-bottom:1px solid var(--line);flex:none;overflow-x:auto}
.tool-btn{width:24px;height:24px;display:grid;place-items:center;border-radius:3px;color:var(--text-3);flex:none}
.tool-btn:hover{background:var(--bg-hover);color:var(--text)}
.tool-btn.active{color:var(--blue-2);background:rgba(59,130,246,.1)}
.tool-sep{width:1px;height:16px;background:var(--line-2);margin:0 3px;flex:none}
.tool-text{padding:3px 8px;font-size:11px;color:var(--text-2);border-radius:3px}
.tool-text:hover{background:var(--bg-hover);color:var(--text)}
.center-canvas{flex:1;overflow-y:auto;background:#0b1220;background-image:radial-gradient(circle at 50% 30%,rgba(59,130,246,.08) 0%,transparent 60%),radial-gradient(circle at 50% 80%,rgba(139,92,246,.06) 0%,transparent 60%);position:relative}
.hero{min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 40px;text-align:center}
.hero-eyebrow{font-size:10px;font-weight:700;letter-spacing:.25em;color:var(--blue-2);text-transform:uppercase;margin-bottom:14px;padding:5px 12px;border:1px solid rgba(59,130,246,.3);border-radius:99px;background:rgba(59,130,246,.08)}
.hero-title{font-size:64px;font-weight:700;letter-spacing:-.02em;line-height:1.02;background:linear-gradient(180deg,#fff 40%,#60a5fa 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.hero-subtitle{font-size:20px;font-weight:400;color:var(--text-2);margin-bottom:60px;letter-spacing:.02em}
.hero-icons{display:flex;gap:32px;margin-bottom:40px}
.hero-icon{width:96px;height:96px;display:grid;place-items:center;border-radius:14px;background:rgba(37,41,59,.6);border:1px solid rgba(96,165,250,.35);color:var(--text);position:relative;box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 8px 24px rgba(59,130,246,.15);transition:transform .2s,box-shadow .2s}
.hero-icon:hover{transform:translateY(-2px);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 12px 32px rgba(59,130,246,.25)}
.hero-icon svg{width:38px;height:38px}
.hero-icon::before{content:'';position:absolute;inset:-4px;border-radius:18px;border:1px solid rgba(96,165,250,.15);pointer-events:none}
.hero-icon::after{content:'';position:absolute;inset:-9px;border-radius:22px;border:1px solid rgba(96,165,250,.08);pointer-events:none}
.hero-captions{display:grid;grid-template-columns:repeat(4,1fr);gap:32px;max-width:760px;margin-bottom:40px}
.hero-caption{font-size:12px;line-height:1.5;color:var(--text-2);text-align:center}
.hero-caption b{color:var(--text);font-weight:600;display:block;margin-bottom:2px}
.hero-tagline{font-size:15px;color:var(--text-2);margin-bottom:20px}
.hero-url{font-family:var(--font-mono);font-size:16px;font-weight:500;color:#93c5fd;letter-spacing:.02em}
.right{background:var(--bg-panel);border-left:1px solid var(--line);display:flex;flex-direction:column;min-width:0;overflow:hidden}
.right.collapsed .right-body{display:none}
.right.collapsed .right-head{justify-content:center;padding:8px 0}
.right-collapsed .right-head .right-title,.right-collapsed .right-head .right-sub{display:none}
.right-head{display:flex;align-items:center;gap:6px;padding:6px 8px;background:var(--bg-panel);border-bottom:1px solid var(--line);flex:none}
.right-toggle{width:22px;height:22px;display:grid;place-items:center;border-radius:3px;color:var(--text-3);flex:none}
.right-toggle:hover{background:var(--bg-hover);color:var(--text)}
.right-title{font-size:11px;font-weight:600;color:var(--text);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.right-body{flex:1;display:flex;flex-direction:column;min-height:0;overflow:hidden}
.info-banner{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;background:rgba(59,130,246,.08);border-bottom:1px solid rgba(59,130,246,.2);font-size:10.5px;color:var(--text-2);line-height:1.5;flex:none}
.info-banner .ico{color:var(--blue-2);flex:none;margin-top:1px}
.info-banner b{color:var(--text);font-weight:600}
.chat-head{display:flex;align-items:center;gap:6px;padding:6px 10px;background:var(--bg-panel-2);border-bottom:1px solid var(--line);font-size:11px;font-weight:600;flex:none}
.chat-head .spacer{flex:1}
.chat-head .chat-icon{width:20px;height:20px;display:grid;place-items:center;border-radius:3px;color:var(--text-3)}
.chat-head .chat-icon:hover{background:var(--bg-hover);color:var(--text)}
.chat-thread{flex:1;overflow-y:auto;padding:8px;display:flex;flex-direction:column;gap:10px;min-height:0;background:var(--bg-panel-2)}
.msg{display:flex;flex-direction:column;gap:4px;max-width:100%}
.msg-bubble{padding:8px 10px;border-radius:6px;background:#0f2a4a;border:1px solid #1e4976;font-size:11.5px;line-height:1.55;color:var(--text);word-wrap:break-word}
.msg.system .msg-bubble{background:rgba(59,130,246,.06);border-color:rgba(59,130,246,.2);color:var(--text-2)}
.msg-meta{display:flex;align-items:center;gap:8px;font-size:10px;color:var(--text-4);padding:0 4px}
.msg-meta .spacer{flex:1}
.msg-actions{display:flex;gap:2px}
.msg-action{width:18px;height:18px;display:grid;place-items:center;border-radius:3px;color:var(--text-4);font-size:10px}
.msg-action:hover{background:var(--bg-hover);color:var(--text-2)}
.msg-action.liked{color:var(--green-2)}
.chat-input-wrap{padding:8px;background:var(--bg-panel);border-top:1px solid var(--line);flex:none}
.chat-input{background:var(--bg-input);border:1px solid var(--line-2);border-radius:5px;padding:6px 8px;font-size:11.5px;color:var(--text);min-height:60px;resize:none;width:100%;font-family:var(--font-ui);line-height:1.5;outline:none;transition:border-color .15s}
.chat-input:focus{border-color:var(--blue)}
.chat-input::placeholder{color:var(--text-4)}
.chat-footer{display:flex;align-items:center;gap:6px;padding:8px;background:var(--bg-panel);border-top:1px solid var(--line);flex:none}
.approve-toggle{display:flex;align-items:center;gap:6px;padding:5px 10px;border:1px solid var(--line-2);border-radius:5px;font-size:11px;font-weight:600;color:var(--text-2);background:var(--bg-panel-2)}
.approve-toggle.on{border-color:var(--green);color:var(--green-2);background:rgba(16,185,129,.08)}
.approve-toggle .switch{width:24px;height:14px;border-radius:99px;background:var(--line-3);position:relative;transition:.2s}
.approve-toggle .switch::after{content:'';position:absolute;width:10px;height:10px;border-radius:50%;background:#fff;top:2px;left:2px;transition:.2s}
.approve-toggle.on .switch{background:var(--green)}
.approve-toggle.on .switch::after{left:12px}
.send-btn{width:34px;height:34px;display:grid;place-items:center;border-radius:5px;background:var(--blue);color:#fff;flex:none}
.send-btn:hover{background:var(--blue-3)}
.favorite-btn{display:flex;align-items:center;gap:5px;padding:5px 10px;border:1px solid var(--line-2);border-radius:5px;font-size:11px;font-weight:600;color:var(--text-2);background:var(--bg-panel-2)}
.favorite-btn .star{color:var(--amber)}
.favorite-btn .count{color:var(--text-3);font-size:10px}
.action-row{display:grid;grid-template-columns:repeat(5,1fr);gap:2px;padding:6px 8px;background:var(--bg-panel-2);border-top:1px solid var(--line);flex:none}
.action-btn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:5px 2px;border-radius:4px;font-size:9.5px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.04em}
.action-btn:hover{background:var(--bg-hover);color:var(--text)}
.action-btn .ico{font-size:14px;line-height:1;color:var(--text-2)}
.action-btn:hover .ico{color:var(--blue-2)}
.tips{padding:8px 10px;background:var(--bg-panel);border-top:1px solid var(--line);font-size:10.5px;color:var(--text-3);line-height:1.6;flex:none}
.tips b{color:var(--text-2);font-weight:600}
.tips .tip-num{color:var(--blue-2);font-weight:700;margin-right:4px}
.bottom-controls{display:flex;align-items:center;gap:6px;padding:6px 8px;background:var(--bg-panel);border-top:1px solid var(--line);flex:none;font-size:10.5px;flex-wrap:wrap}
.ctrl-pill{display:flex;align-items:center;gap:5px;padding:4px 8px;border:1px solid var(--line-2);border-radius:5px;background:var(--bg-panel-2);color:var(--text-2);font-weight:600;font-size:10.5px}
.ctrl-pill .switch{width:20px;height:12px;border-radius:99px;background:var(--line-3);position:relative;transition:.2s;flex:none}
.ctrl-pill .switch::after{content:'';position:absolute;width:8px;height:8px;border-radius:50%;background:#fff;top:2px;left:2px;transition:.2s}
.ctrl-pill.on{border-color:var(--green);color:var(--green-2);background:rgba(16,185,129,.08)}
.ctrl-pill.on .switch{background:var(--green)}
.ctrl-pill.on .switch::after{left:10px}
.ctrl-pill.blue{border-color:var(--blue);color:var(--blue-2);background:rgba(59,130,246,.08)}
.ctrl-pill.blue .switch{background:var(--blue)}
.ctrl-pill.blue .switch::after{left:10px}
svg.i{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:none}
svg.i-14{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:none}
svg.i-16{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:none}
svg.i-18{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
@media (max-width:1280px){.main{grid-template-columns:230px 1fr 380px}.main.left-collapsed{grid-template-columns:36px 1fr 380px}.main.right-collapsed{grid-template-columns:230px 1fr 36px}.hero-title{font-size:48px}.hero-icon{width:80px;height:80px}.hero-icon svg{width:32px;height:32px}}
@media (max-width:1024px){.main{grid-template-columns:220px 1fr 340px}.hero-icons{gap:20px}.hero-captions{grid-template-columns:repeat(2,1fr);gap:20px}}
@media (max-width:820px){.main{grid-template-columns:36px 1fr 36px}.side:not(.collapsed),.right:not(.collapsed){position:absolute;top:0;bottom:0;z-index:30;box-shadow:0 0 32px rgba(0,0,0,.6)}.side:not(.collapsed){left:0;width:260px}.right:not(.collapsed){right:0;width:340px}}
`;

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  initialChecked?: boolean;
  children?: TreeNode[];
}

interface ConsoleLine {
  time: string;
  level: string;
  msg: string;
}

const TREE_DATA: TreeNode[] = [
  {
    id: 'generated_twin_graph',
    name: '1/4 generated_twin_graph',
    type: 'folder',
    children: [
      { id: 'asset_zone_fiz_01', name: 'asset_zone_fiz_01.twin', type: 'file' },
      { id: 'gateway_mqtt_ingest', name: 'gateway_mqtt_ingest.twin', type: 'file', initialChecked: true },
      { id: 'customs_smk_bridge', name: 'customs_smk_bridge.twin', type: 'file', initialChecked: true },
      { id: 'simulation_fmi_pack', name: 'simulation_fmi_pack.twin', type: 'file' },
      { id: 'ledger_audit_chain', name: 'ledger_audit_chain.twin', type: 'file' },
    ],
  },
  { id: '02fe040f_asset', name: '02fe040f_asset.twin', type: 'file' },
  { id: '07528cdd_zone', name: '07528cdd_zone.twin', type: 'file' },
  { id: '17cffb27_edge', name: '17cffb27_edge.twin', type: 'file' },
  { id: '1e17f511_run', name: '1e17f511_run.twin', type: 'file' },
  { id: '24572922_iter', name: '24572922_iter.twin', type: 'file' },
  { id: '285cb65b_log', name: '285cb65b_log.twin', type: 'file' },
  { id: '2a4f8302_metric', name: '2a4f8302_metric.twin', type: 'file' },
  { id: '30218b0b_alert', name: '30218b0b_alert.twin', type: 'file' },
  { id: '31042af6_ledger', name: '31042af6_ledger.twin', type: 'file' },
  { id: '3a4e65ac_sensor', name: '3a4e65ac_sensor.twin', type: 'file' },
  { id: '3a8722c7_gateway', name: '3a8722c7_gateway.twin', type: 'file' },
  { id: '3d175cbd_customs', name: '3d175cbd_customs.twin', type: 'file' },
  { id: '40acf2fa_sim', name: '40acf2fa_sim.twin', type: 'file' },
  { id: '4df38c38_ai', name: '4df38c38_ai.twin', type: 'file' },
  { id: '4f7239b0_xr', name: '4f7239b0_xr.twin', type: 'file' },
  { id: '504c760b_outcome', name: '504c760b_outcome.twin', type: 'file' },
  { id: '51a5b020_bonded', name: '51a5b020_bonded.twin', type: 'file' },
  { id: '6345362a_manifest', name: '6345362a_manifest.twin', type: 'file' },
];

const WEB_SOURCES = [
  { name: 'twinforge.io/blueprints', badge: '2' },
  { name: 'brokerdesk.my/schemas', badge: '1' },
];

const LAST_CHANGES = [
  { name: 'Filter: model or te…' },
  { name: '(no recent changes)' },
];

const INITIAL_CONSOLE: ConsoleLine[] = [
  { time: '14:48:19', level: 'INFO', msg: '[Chat] Dynamic max_tokens: reset=32314 reserve=1200 ==> max_tokens=31114' },
  { time: '14:48:19', level: 'DEBUG', msg: '[Chat] Request: model=twinforge/brokerdesk-3.5-flash provider=auto mode=Studio ctx_msgs=8 ws_mode=messageOnly ws_files=0 ws_chars=0 web_sources=0 reserve=1200 cap_out=-- max_tokens=31114 temperature=-- messages=8 provider_only=-- provider_ignore=-- provider_ignore_count=-- allow_plugins=-- tools=-- tool_choice=-- reasoning=--' },
  { time: '14:48:19', level: 'DEBUG', msg: '[Chat] Estimated cost: 20259 in · 31114 out = 9225 Torrents' },
  { time: '14:48:21', level: 'DEBUG', msg: '[Chat] Payload (call): correlation_id=twinforge-1773969011976-1245777303 timeout_ms=60000 model=twinforge/brokerdesk-3.5-flash stream=false max_tokens=31114 temperature=-- messages=8 provider_only=-- provider_ignore=-- provider_ignore_count=-- allow_plugins=-- tools=-- tool_choice=-- reasoning=--' },
  { time: '14:48:26', level: 'INFO', msg: '[Chat] Response headers: correlation_id=twinforge-1773969011976-1245777303 cf-ray=9dc5d93aede40ba0-EZE' },
];

const STREAM_EVENTS: [string, string][] = [
  ['INFO', 'Heartbeat: twin-runtime alive, 3 executions queued'],
  ['DEBUG', 'Ledger sync: 12 edges committed, chain height=4471'],
  ['INFO', 'Customs SMK bridge: pre-clearance latency p95=142ms'],
  ['DEBUG', 'Gateway MQTT: 2411 msgs/min, queue=0, lag=2ms'],
  ['WARN', 'Simulation pack: FMI step budget at 78% — consider scaling'],
  ['INFO', 'BrokerDesk: manifest MDL-8842 validated against v4.2 schema'],
];

const CHAT_MESSAGES: { from: 'user' | 'assistant' | 'system'; time: string; extra?: string; content: ReactNode }[] = [
  {
    from: 'user',
    time: '15/03/2026 14:42:47',
    content: 'Connect the FIZ-01 asset zone to the SMK customs bridge and register the ledger edge for audit.',
  },
  {
    from: 'assistant',
    time: '15/03/2026 14:42:47',
    extra: '· 11s',
    content: (
      <>
        ✓ Done. FIZ-01 → SMK bridge created. Ledger edge tagged <strong>audit:v3</strong>.
        Manifest schema validated against <strong>brokerdesk/schemas</strong>.
      </>
    ),
  },
  {
    from: 'user',
    time: '15/03/2026 14:44:39',
    extra: '· 4s',
    content: 'Perfect — now expose the BrokerDesk clearance workflow view with the attached ledger overlay.',
  },
  {
    from: 'assistant',
    time: '15/03/2026 14:48:19',
    extra: '· 14s',
    content: (
      <>
        ✓ BrokerDesk view rendered. Pre-clearance latency now streams live from the SMK bridge.
        Please verify the schema version — the field <strong>consignee.tin</strong> is now required.
      </>
    ),
  },
  {
    from: 'user',
    time: '15/03/2026 14:49:02',
    extra: '· 6s',
    content: (
      <>
        Corrected the schema. The manifest now requires <strong>consignee.tin</strong> and{' '}
        <strong>consignee.address</strong>. Re-validated against brokerdesk/schemas v4.2.
      </>
    ),
  },
  {
    from: 'system',
    time: '',
    content: <span style={{ color: 'var(--amber)' }}>⚠ Alert</span>,
  },
];

export function WorkflowStudioDesktop() {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [checkedNodes, setCheckedNodes] = useState<Set<string>>(
    new Set(TREE_DATA.flatMap((n) => n.children?.filter((c) => c.initialChecked).map((c) => c.id) ?? [])),
  );
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>(INITIAL_CONSOLE);
  const [approveOn, setApproveOn] = useState(true);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      const evt = STREAM_EVENTS[idx % STREAM_EVENTS.length]; const level = evt?.[0] ?? "INFO"; const msg = evt?.[1] ?? "";
      idx++;
      const now = new Date();
      const time = now.toTimeString().slice(0, 8);
      setConsoleLines((prev) => {
        const updated = [...prev, { time, level, msg }];
        return updated.length > 100 ? updated.slice(-100) : updated;
      });
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setLeftCollapsed((v) => !v);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setRightCollapsed((v) => !v);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const toggleLeft = useCallback(() => setLeftCollapsed((v) => !v), []);
  const toggleRight = useCallback(() => setRightCollapsed((v) => !v), []);
  const toggleNode = useCallback((id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const toggleCheckbox = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const mainClasses = useMemo(() => {
    const cls = ['main'];
    if (leftCollapsed) cls.push('left-collapsed');
    if (rightCollapsed) cls.push('right-collapsed');
    if (leftCollapsed && rightCollapsed) cls.push('both-collapsed');
    return cls.join(' ');
  }, [leftCollapsed, rightCollapsed]);

  const renderTreeNode = useCallback(
    (node: TreeNode, depth: number) => {
      const isExpanded = expandedNodes.has(node.id);
      const isChecked = checkedNodes.has(node.id);
      const isSelected = selectedNode === node.id;
      const paddingLeft = depth === 0 ? '4px' : `${22 + (depth - 1) * 14}px`;

      return (
        <Fragment key={node.id}>
          <div
            className={`tree-row${isSelected ? ' selected' : ''}`}
            style={{ paddingLeft }}
            onClick={() => {
              setSelectedNode(node.id);
              if (node.type === 'folder') toggleNode(node.id);
            }}
          >
            {node.type === 'folder' && (
              <svg
                className="i"
                viewBox="0 0 24 24"
                style={{
                  transform: isExpanded ? 'rotate(-90deg)' : 'none',
                  transition: 'transform .15s',
                }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
            <span className="icon folder">{node.type === 'folder' ? '▸' : ''}</span>
            <span className="name">{node.name}</span>
            {node.type === 'file' && (
              <span
                className={`cb${isChecked ? ' checked' : ''}`}
                onClick={(e) => toggleCheckbox(node.id, e)}
              />
            )}
          </div>
          {node.type === 'folder' && isExpanded && node.children &&
            node.children.map((child) => renderTreeNode(child, depth + 1))}
        </Fragment>
      );
    },
    [expandedNodes, checkedNodes, selectedNode, toggleNode, toggleCheckbox],
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="win">

        <div className="win-title">
          <div className="app-icon"></div>
          <span>twinforge_studio__brokerdesk_v4</span>
          <div className="spacer"></div>
          <div className="win-ctrl">
            <button title="Minimize">─</button>
            <button title="Maximize">□</button>
            <button className="close" title="Close">✕</button>
          </div>
        </div>

        <div className="tabbar">
          <div className="tab active">
            <span className="dot"></span>
            <span>studio</span>
            <span style={{ color: 'var(--text-3)', marginLeft: '2px' }}>✕</span>
          </div>
          <button className="tab-icon" title="New tab">＋</button>
          <div style={{ width: '10px' }}></div>
          <button className="provider-select" title="Provider">
            <span className="star">★</span>
            <span>Provider: twinforge</span>
            <svg className="i" viewBox="0 0 24 24" style={{ color: 'var(--text-3)' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button className="model-select" title="Model">
            <span>Model: brokerdesk/twin-3.5</span>
            <svg className="i" viewBox="0 0 24 24" style={{ color: 'var(--text-3)' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button className="ok-btn">OK</button>
          <div className="spacer"></div>
          <button className="tabbar-icon" title="Layout">
            <svg className="i-14" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
            </svg>
          </button>
          <button className="tabbar-icon active" title="Theme">
            <svg className="i-14" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <button className="tabbar-icon" title="Notifications" style={{ position: 'relative' }}>
            <svg className="i-14" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span style={{ position: 'absolute', top: '3px', right: '3px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red)' }}></span>
          </button>
        </div>

        <div className={mainClasses} id="main">

          <aside className={`side${leftCollapsed ? ' collapsed' : ''}`} id="leftSide">
            <div className="side-head">
              <span className="side-title">Tree</span>
              <button className="side-toggle" onClick={toggleLeft} title="Toggle sidebar">
                <svg className="i-14" viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            </div>
            <div className="side-body">
              <div className="side-tabs">
                <button className="side-tab active">
                  <svg className="i" viewBox="0 0 24 24">
                    <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
                  </svg>
                  <span className="side-tabs-label">Tree</span>
                </button>
                <button className="side-tab">
                  <svg className="i" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="side-tabs-label">Files</span>
                </button>
              </div>

              <div className="side-section">
                <button className="side-refresh">
                  <svg className="i" viewBox="0 0 24 24">
                    <path d="M23 4v6h-6" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>

              <div className="tree" id="fileTree">
                {TREE_DATA.map((node) => renderTreeNode(node, 0))}
              </div>

              <div className="side-section">
                <div className="side-section-title">
                  <span>Web Sources</span>
                  <svg className="i" viewBox="0 0 24 24" style={{ color: 'var(--text-4)' }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
                <div className="mini-list">
                  {WEB_SOURCES.map((source) => (
                    <div className="mini-list-item" key={source.name}>
                      <span>{source.name}</span>
                      <span className="badge">{source.badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="side-section">
                <div className="side-section-title">
                  <span>Last changes</span>
                  <svg className="i" viewBox="0 0 24 24" style={{ color: 'var(--text-4)' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="mini-list">
                  {LAST_CHANGES.map((change) => (
                    <div className="mini-list-item" key={change.name}>
                      <span style={{ color: 'var(--text-4)', fontStyle: 'italic' }}>{change.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="center">
            <div className="center-head">
              <div className="file-icon"></div>
              <span className="filename">generated_2026-03-15_twinforge_studio</span>
              <div className="spacer"></div>
              <button className="tabbar-icon" title="Close">✕</button>
            </div>

            <div className="center-toolbar">
              <button className="tool-btn" title="Back">
                <svg className="i-14" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button className="tool-btn" title="Forward">
                <svg className="i-14" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
              <div className="tool-sep"></div>
              <button className="tool-btn" title="Undo">
                <svg className="i-14" viewBox="0 0 24 24"><path d="M3 7v6h6" /><path d="M3 13a9 9 0 1 1 9-9" /></svg>
              </button>
              <button className="tool-btn" title="Redo">
                <svg className="i-14" viewBox="0 0 24 24"><path d="M21 7v6h-6" /><path d="M21 13a9 9 0 1 0-9-9" /></svg>
              </button>
              <div className="tool-sep"></div>
              <button className="tool-btn" title="Zoom">
                <svg className="i-14" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              </button>
              <div className="tool-sep"></div>
              <button className="tool-btn" title="Add node">
                <svg className="i-14" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
              </button>
              <button className="tool-btn" title="Copy">
                <svg className="i-14" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              </button>
              <button className="tool-btn" title="Grid">
                <svg className="i-14" viewBox="0 0 24 24"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" /></svg>
              </button>
              <div className="tool-sep"></div>
              <button className="tool-btn active" title="Alerts">
                <svg className="i-14" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h14.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </button>
              <button className="tool-btn" title="Node library">
                <svg className="i-14" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
              </button>
              <button className="tool-btn" title="Template">
                <svg className="i-14" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
              </button>
              <button className="tool-btn" title="Ledger">
                <svg className="i-14" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
              </button>
              <div className="tool-sep"></div>
              <button className="tool-btn" title="Link">
                <svg className="i-14" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              </button>
              <button className="tool-btn" title="Split">
                <svg className="i-14" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" /></svg>
              </button>
            </div>

            <div className="center-canvas">
              <div className="hero">
                <div className="hero-eyebrow">TwinForge · BrokerDesk</div>
                <h1 className="hero-title">DIGITAL TWIN &amp; BROKERDESK</h1>
                <p className="hero-subtitle">Unified orchestration for FIZ, FCZ &amp; customs workflows</p>

                <div className="hero-icons">
                  <div className="hero-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <path d="M8 10h.01M12 10h.01M16 10h.01" />
                    </svg>
                  </div>
                  <div className="hero-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <div className="hero-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="hero-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" />
                    </svg>
                  </div>
                </div>

                <div className="hero-captions">
                  <div className="hero-caption"><b>Compose</b>Hundreds of twin node types from your studio.</div>
                  <div className="hero-caption"><b>Connect</b>IoT, ERP, customs &amp; ledger integrations.</div>
                  <div className="hero-caption"><b>Simulate</b>Physics co-simulation &amp; what-if scenarios.</div>
                  <div className="hero-caption"><b>Govern</b>Immutable audit trail on every decision.</div>
                </div>

                <p className="hero-tagline">Supports assets, manifests, sensor streams, and video.</p>
                <p className="hero-url">https://twinforge.brokerdesk.my/studio</p>
              </div>
            </div>
          </section>

          <aside className={`right${rightCollapsed ? ' collapsed' : ''}`} id="rightSide">
            <div className="right-head">
              <button className="right-toggle" onClick={toggleRight} title="Toggle sidebar">
                <svg className="i-14" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
              <span className="right-title">Studio Assistant</span>
            </div>

            <div className="right-body">
              <div className="info-banner">
                <svg className="i-14 ico" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>When the model replies with code, use <b>Convert</b> (to files) or <b>Create</b> (review first).</span>
              </div>

              <div className="chat-head">
                <span>Chat</span>
                <div className="spacer"></div>
                <button className="chat-icon" title="Expand">
                  <svg className="i" viewBox="0 0 24 24">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                  </svg>
                </button>
                <button className="chat-icon" title="History">
                  <svg className="i" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </button>
              </div>

              <div className="chat-thread">
                {CHAT_MESSAGES.map((msg, i) => {
                  const isSystem = msg.from === 'system';
                  const isAssistant = msg.from === 'assistant';
                  return (
                    <div className={`msg${isSystem ? ' system' : ''}`} key={i}>
                      <div className="msg-bubble">{msg.content}</div>
                      {!isSystem && (
                        <div className="msg-meta">
                          <span>{msg.time}</span>
                          {msg.extra && <span>·</span>}
                          {msg.extra && <span>{msg.extra}</span>}
                          <div className="spacer"></div>
                          <div className="msg-actions">
                            {!isAssistant && (
                              <button className="msg-action">
                                <svg className="i" viewBox="0 0 24 24">
                                  <polyline points="9 11 12 14 22 4" />
                                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                </svg>
                              </button>
                            )}
                            <button className={`msg-action${isAssistant ? ' liked' : ''}`}>
                              {isAssistant ? (
                                <svg className="i" viewBox="0 0 24 24">
                                  <path d="M14 9V5a3 3 0 0 0-3 3l4 9V9h0zM4 11.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zM4 9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" />
                                </svg>
                              ) : (
                                <svg className="i" viewBox="0 0 24 24">
                                  <line x1="12" y1="19" x2="12" y2="12" />
                                  <line x1="12" y1="5" x2="12.01" y2="5" />
                                </svg>
                              )}
                            </button>
                            <button className="msg-action">
                              <svg className="i" viewBox="0 0 24 24">
                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="chat-input-wrap">
                <textarea
                  className="chat-input"
                  placeholder="Write your message here for twinforge · brokerdesk-3.5-flash-studio.&#10;The prompt will include: message only.&#10;Vision enabled.&#10;Image generation enabled."
                />
              </div>

              <div className="chat-footer">
                <button
                  className={`approve-toggle${approveOn ? ' on' : ''}`}
                  onClick={() => setApproveOn((v) => !v)}
                >
                  <span>Approve</span>
                  <span className="switch"></span>
                </button>
                <button className="send-btn" title="Send">
                  <svg className="i-16" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
                <button className="favorite-btn">
                  <svg className="i" viewBox="0 0 24 24" style={{ color: 'var(--amber)', fill: 'currentColor' }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="count">7</span>
                  <span>Favorites</span>
                </button>
              </div>

              <div className="action-row">
                <button className="action-btn"><span className="ico">＋</span><span>Create</span></button>
                <button className="action-btn"><span className="ico">⇄</span><span>Convert</span></button>
                <button className="action-btn"><span className="ico">⊳</span><span>Apply</span></button>
                <button className="action-btn"><span className="ico">↓</span><span>Save</span></button>
                <button className="action-btn"><span className="ico">↻</span><span>Retry</span></button>
              </div>

              <div className="tips">
                <div><span className="tip-num">1.</span>Reply has code → <b>Create</b> or <b>Convert</b>.</div>
                <div><span className="tip-num">2.</span>Changes in panel → <b>Apply</b> to write to files.</div>
              </div>

              <div className="bottom-controls">
                <button className="ctrl-pill on">
                  <span>MaxTokens</span>
                  <span className="switch"></span>
                </button>
                <button className="ctrl-pill blue">
                  <span>Auto model</span>
                  <span className="switch"></span>
                </button>
                <div style={{ flex: '1' }}></div>
                <button className="ctrl-pill"><span>Reasoning</span></button>
                <button className="ctrl-pill on"><span>Vision</span></button>
                <button className="ctrl-pill"><span>Audio</span></button>
                <button className="ctrl-pill on"><span>Image</span></button>
                <button className="ctrl-pill"><span>Search</span></button>
                <button className="ctrl-pill"><span>Cache</span></button>
              </div>
            </div>
          </aside>
        </div>

        <Terminal
          className="mt-0 border-t border-[var(--line)] rounded-none"
          output={consoleLines.map((line) => `[${line.time}] ${line.level} ${line.msg}`).join('\n')}
          isStreaming={false}
          onClear={() => setConsoleLines([])}
        />
      </div>
    </>
  );
}

export default WorkflowStudioDesktop;
