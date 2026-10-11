// backend/mcp/servers/src/extensions/tasks/handler.ts

import { randomUUID } from "node:crypto";

export type TaskStatus =
  | "pending" | "running" | "input-required"
  | "completed" | "failed" | "cancelled";

export interface TaskHandle<TResult = unknown, TInput = unknown> {
  taskId: string;
  status: TaskStatus;
  pollIntervalMs: number;
  progress?: number;
  inputRequest?: { prompt: string; schema?: Record<string, unknown> };
  result?: TResult;
  error?: { code: string; message: string };
  createdAt: string;
  updatedAt: string;
  _resume?: TInput;
}

type Executor<TResult, TInput> = (task: TaskHandle<TResult, TInput>) => Promise<void>;

export class TaskRegistry<TResult = unknown, TInput = unknown> {
  private tasks = new Map<string, TaskHandle<TResult, TInput>>();
  private executors = new Map<string, Executor<TResult, TInput>>();
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  create(pollIntervalMs = 2000): TaskHandle<TResult, TInput> {
    const now = new Date().toISOString();
    const task: TaskHandle<TResult, TInput> = {
      taskId: `task_${randomUUID()}`, status: "pending",
      pollIntervalMs, progress: 0, createdAt: now, updatedAt: now,
    };
    this.tasks.set(task.taskId, task);
    return task;
  }

  register(taskId: string, executor: Executor<TResult, TInput>): void {
    this.executors.set(taskId, executor);
    this.schedule(taskId, 0);
  }

  get(taskId: string): TaskHandle<TResult, TInput> | undefined {
    return this.tasks.get(taskId);
  }

  async update(taskId: string, input: TInput): Promise<TaskHandle<TResult, TInput>> {
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

  async cancel(taskId: string): Promise<void> {
    const task = this.require(taskId);
    const timer = this.timers.get(taskId);
    if (timer) clearTimeout(timer);
    this.timers.delete(taskId);
    task.status = "cancelled";
    task.updatedAt = new Date().toISOString();
  }

  async complete(taskId: string, result: TResult): Promise<void> {
    const task = this.require(taskId);
    task.status = "completed"; task.result = result;
    task.progress = 100; task.updatedAt = new Date().toISOString();
  }

  async fail(taskId: string, code: string, message: string): Promise<void> {
    const task = this.require(taskId);
    task.status = "failed"; task.error = { code, message };
    task.updatedAt = new Date().toISOString();
  }

  async requestInput(taskId: string, prompt: string, schema?: Record<string, unknown>): Promise<void> {
    const task = this.require(taskId);
    task.status = "input-required";
    task.inputRequest = { prompt, schema };
    task.updatedAt = new Date().toISOString();
  }

  private schedule(taskId: string, delayMs: number): void {
    const timer = setTimeout(async () => {
      this.timers.delete(taskId);
      const task = this.tasks.get(taskId);
      const exec = this.executors.get(taskId);
      if (!task || !exec) return;
      if (["cancelled", "completed", "failed"].includes(task.status)) return;
      if (task.status !== "input-required") task.status = "running";
      task.updatedAt = new Date().toISOString();
      try {
        await exec(task);
        if (task.status === "running") this.schedule(taskId, task.pollIntervalMs);
      } catch (err) {
        await this.fail(taskId, "EXECUTOR_ERROR", (err as Error).message);
      }
    }, delayMs);
    this.timers.set(taskId, timer);
  }

  private require(taskId: string): TaskHandle<TResult, TInput> {
    const t = this.tasks.get(taskId);
    if (!t) throw new Error(`unknown task ${taskId}`);
    return t;
  }
}
