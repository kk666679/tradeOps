export type Middleware<T> = (ctx: T) => Promise<void> | void;
export declare function runPipeline<T>(ctx: T, middlewares: Array<Middleware<T>>): Promise<void>;
