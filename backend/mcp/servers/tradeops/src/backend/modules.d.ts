export interface Module {
    id: string;
    tools: string[];
    resources: string[];
}
export declare const MODULES: Module[];
export declare function moduleFor(tool: string): Module | undefined;
