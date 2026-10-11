// shared/extensions/apps/ui-tool.ts
// MCP Apps extension (io.modelcontextprotocol/ui).

export interface UiResourceMeta {
  connectDomains: string[];
  resourceDomains: string[];
  preferredHeight?: number;
}

export interface UiToolMeta {
  ui: {
    resourceUri: string;
    csp: UiResourceMeta;
  };
}

export interface UiToolResult<TData> {
  data: TData;
  initialState?: Record<string, unknown>;
}

export function uiMeta(resourceUri: string, csp: UiResourceMeta): UiToolMeta {
  return { ui: { resourceUri, csp } };
}

export function asUiResult<TData>(
  data: TData,
  meta: UiToolMeta,
  initialState?: Record<string, unknown>,
): UiToolResult<TData> & { _meta: UiToolMeta } {
  return { data, initialState, _meta: meta };
}
