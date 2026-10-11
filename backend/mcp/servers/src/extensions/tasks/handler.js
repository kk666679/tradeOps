"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRegistry = void 0;
const node_crypto_1 = require("node:crypto");
class TaskRegistry {
    tasks = new Map();
    executors = new Map();
    timers = new Map();
    create(pollIntervalMs = 2000) {
        const now = new Date().toISOString();
        const task = {
            taskId: `task_${(0, node_crypto_1.randomUUID)()}`, status: "pending",
            pollIntervalMs, progress: 0, createdAt: now, updatedAt: now,
        };
        this.tasks.set(task.taskId, task);
        return task;
    }
    register(taskId, executor) {
        this.executors.set(taskId, executor);
        this.schedule(taskId, 0);
    }
    get(taskId) {
        return this.tasks.get(taskId);
    }
    async update(taskId, input) {
        const task = this.require(taskId);
        task._resume = input;
        task.updatedAt = new Date().toISOString();
        if (task.status === "input-required") {
            task.status = "running";
            task.inputRequest = undefined;
            this.schedule(taskId, 0);
        }
        return task;
    }
    async cancel(taskId) {
        const task = this.require(taskId);
        const timer = this.timers.get(taskId);
        if (timer)
            clearTimeout(timer);
        this.timers.delete(taskId);
        task.status = "cancelled";
        task.updatedAt = new Date().toISOString();
    }
    async complete(taskId, result) {
        const task = this.require(taskId);
        task.status = "completed";
        task.result = result;
        task.progress = 100;
        task.updatedAt = new Date().toISOString();
    }
    async fail(taskId, code, message) {
        const task = this.require(taskId);
        task.status = "failed";
        task.error = { code, message };
        task.updatedAt = new Date().toISOString();
    }
    async requestInput(taskId, prompt, schema) {
        const task = this.require(taskId);
        task.status = "input-required";
        task.inputRequest = { prompt, schema };
        task.updatedAt = new Date().toISOString();
    }
    schedule(taskId, delayMs) {
        const timer = setTimeout(async () => {
            this.timers.delete(taskId);
            const task = this.tasks.get(taskId);
            const exec = this.executors.get(taskId);
            if (!task || !exec)
                return;
            if (["cancelled", "completed", "failed"].includes(task.status))
                return;
            if (task.status !== "input-required")
                task.status = "running";
            task.updatedAt = new Date().toISOString();
            try {
                await exec(task);
                if (task.status === "running")
                    this.schedule(taskId, task.pollIntervalMs);
            }
            catch (err) {
                await this.fail(taskId, "EXECUTOR_ERROR", err.message);
            }
        }, delayMs);
        this.timers.set(taskId, timer);
    }
    require(taskId) {
        const t = this.tasks.get(taskId);
        if (!t)
            throw new Error(`unknown task ${taskId}`);
        return t;
    }
}
exports.TaskRegistry = TaskRegistry;
//# sourceMappingURL=handler.js.map