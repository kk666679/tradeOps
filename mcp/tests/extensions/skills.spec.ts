import { describe, it, expect } from "vitest";
import { SkillRegistry, skillUri } from "../../shared/extensions/skills/skill";

describe("Skills extension", () => {
  it("exposes SKILL.md via skill:// URI", () => {
    const reg = new SkillRegistry();
    reg.register({
      id: "pre-clearance",
      name: "Pre-clearance",
      description: "Standard pre-clearance procedure",
      instructions: "# Steps\n1. Verify docs\n2. Classify HS",
      version: "0.1.0",
      baseProtocol: "2026-07-28",
    });
    const uri = skillUri("pre-clearance");
    expect(uri).toBe("skill://pre-clearance/SKILL.md");
    const file = reg.read(uri);
    expect(file?.content).toContain("Verify docs");
  });
});
