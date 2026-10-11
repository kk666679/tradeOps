// backend/mcp/servers/src/extensions/apps/ui-tool.ts

export interface UiResourceMeta {
  connectDomains: string[];
  resourceDomains: string[];
  preferredHeight?: number;
}

export interface UiToolMeta {
  ui: { resourceUri: string; csp: UiResourceMeta };
}

export function uiMeta(resourceUri: string, csp: UiResourceMeta): UiToolMeta {
  return { ui: { resourceUri, csp } };
}

export function asUiResult<TData>(
  data: TData, meta: UiToolMeta, initialState?: Record<string, unknown>,
) {
  return { data, initialState, _meta: meta };
}
