// shared/extensions/skills/skill.ts
// Skills extension (io.modelcontextprotocol/skills).

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

export function skillUri(skillId: string, path = "SKILL.md"): string {
  return `skill://${skillId}/${path}`;
}

export class SkillRegistry {
  private skills = new Map<string, Skill>();

  register(skill: Skill): void {
    this.skills.set(skill.id, skill);
  }

  list(): Skill[] {
    return [...this.skills.values()];
  }

  get(id: string): Skill | undefined {
    return this.skills.get(id);
  }

  read(uri: string): SkillFile | undefined {
    const m = /^skill:\/\/([^/]+)\/(.+)$/.exec(uri);
    if (!m) return undefined;
    const [, id, path] = m;
    const skill = this.skills.get(id);
    if (!skill) return undefined;
    if (path === "SKILL.md") {
      return {
        path: "SKILL.md",
        mediaType: "text/markdown",
        content: skill.instructions,
        encoding: "utf8",
      };
    }
    return skill.files?.find((f) => f.path === path);
  }
}
