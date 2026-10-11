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
export declare function uiMeta(resourceUri: string, csp: UiResourceMeta): UiToolMeta;
export declare function asUiResult<TData>(data: TData, meta: UiToolMeta, initialState?: Record<string, unknown>): {
    data: TData;
    initialState: Record<string, unknown> | undefined;
    _meta: UiToolMeta;
};
