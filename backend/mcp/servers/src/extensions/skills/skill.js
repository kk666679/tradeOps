"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillRegistry = void 0;
exports.skillUri = skillUri;
function skillUri(skillId, path = "SKILL.md") {
    return `skill://${skillId}/${path}`;
}
class SkillRegistry {
    skills = new Map();
    register(skill) { this.skills.set(skill.id, skill); }
    list() { return [...this.skills.values()]; }
    get(id) { return this.skills.get(id); }
    read(uri) {
        const m = /^skill:\/\/([^/]+)\/(.+)$/.exec(uri);
        if (!m)
            return undefined;
        const skill = this.skills.get(m[1]);
        if (!skill)
            return undefined;
        const path = m[2];
        if (path === "SKILL.md") {
            return { path: "SKILL.md", mediaType: "text/markdown", content: skill.instructions, encoding: "utf8" };
        }
        return skill.files?.find((f) => f.path === path);
    }
}
exports.SkillRegistry = SkillRegistry;
//# sourceMappingURL=skill.js.map