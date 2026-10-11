import { describe, it, expect } from "@jest/globals";
import { TaskRegistry } from "../../shared/extensions/tasks/handler";

describe("Tasks extension", () => {
  it("completes a task", async () => {
    const reg = new TaskRegistry<{ ok: boolean }>();
    const t = reg.create(10);
    reg.register(t.taskId, async (task) => {
      await reg.complete(task.taskId, { ok: true });
    });
    await new Promise((r) => setTimeout(r, 60));
    expect(reg.get(t.taskId)?.status).toBe("completed");
    expect(reg.get(t.taskId)?.result).toEqual({ ok: true });
  });
});
