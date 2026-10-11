// shared/extensions/index.ts
export { TaskRegistry } from "./tasks/handler";
export type { TaskHandle, TaskStatus } from "./tasks/handler";
export { uiMeta, asUiResult } from "./apps/ui-tool";
export type { UiResourceMeta, UiToolMeta, UiToolResult } from "./apps/ui-tool";
export { SkillRegistry, skillUri } from "./skills/skill";
export type { Skill, SkillFile } from "./skills/skill";
