import type { z } from "zod";
export declare function validate<S extends z.ZodTypeAny>(schema: S, input: unknown): z.infer<S>;
