export type TaskStatus = "pending" | "running" | "input-required" | "completed" | "failed" | "cancelled";
export interface TaskHandle<TResult = unknown, TInput = unknown> {
    taskId: string;
    status: TaskStatus;
    pollIntervalMs: number;
    progress?: number;
    inputRequest?: {
        prompt: string;
        schema?: Record<string, unknown>;
    };
    result?: TResult;
    error?: {
        code: string;
        message: string;
    };
    createdAt: string;
    updatedAt: string;
    _resume?: TInput;
}
type Executor<TResult, TInput> = (task: TaskHandle<TResult, TInput>) => Promise<void>;
export declare class TaskRegistry<TResult = unknown, TInput = unknown> {
    private tasks;
    private executors;
    private timers;
    create(pollIntervalMs?: number): TaskHandle<TResult, TInput>;
    register(taskId: string, executor: Executor<TResult, TInput>): void;
    get(taskId: string): TaskHandle<TResult, TInput> | undefined;
    update(taskId: string, input: TInput): Promise<TaskHandle<TResult, TInput>>;
    cancel(taskId: string): Promise<void>;
    complete(taskId: string, result: TResult): Promise<void>;
    fail(taskId: string, code: string, message: string): Promise<void>;
    requestInput(taskId: string, prompt: string, schema?: Record<string, unknown>): Promise<void>;
    private schedule;
    private require;
}
export {};
