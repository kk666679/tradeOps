import { describe, it, expect } from "@jest/globals";
import { uiMeta, asUiResult } from "../../shared/extensions/apps/ui-tool";

describe("MCP Apps extension", () => {
  it("wraps a UI tool result with CSP meta", () => {
    const meta = uiMeta("ui://yard/heatmap", { connectDomains: [], resourceDomains: [] });
    const r = asUiResult({ zones: [] }, meta);
    expect(r._meta.ui.resourceUri).toBe("ui://yard/heatmap");
    expect(r._meta.ui.csp.connectDomains).toEqual([]);
  });
});
