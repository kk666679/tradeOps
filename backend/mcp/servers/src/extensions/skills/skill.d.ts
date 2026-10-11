export interface SkillFile {
    path: string;
    mediaType: string;
    content: string;
    encoding: "utf8" | "base64";
}
export interface Skill {
    id: string;
    name: string;
    description: string;
    instructions: string;
    files?: SkillFile[];
    version: string;
    baseProtocol: "2026-07-28";
}
export declare function skillUri(skillId: string, path?: string): string;
export declare class SkillRegistry {
    private skills;
    register(skill: Skill): void;
    list(): Skill[];
    get(id: string): Skill | undefined;
    read(uri: string): SkillFile | undefined;
}
