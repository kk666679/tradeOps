---
name: custom-agent
description: >
  Scaffold, validate, simulate, and register tenant-defined custom agents.
  A custom agent is a named composition of existing skills with a declared
  scope list and guardrail configuration. This skill never grants a scope
  that is on the forbidden list, never activates an agent without approval,
  and never lets an agent grant scopes to itself.
version: 1.0.0
agent_kinds:
  - ops
  - risk
scopes:
  - agent.list
  - agent.get
  - agent.createDraft
  - agent.updateDraft
  - skill.list
  - skill.get
  - registry.assertCoverage
  - registry.assertNoForbiddenScopes
  - simulation.run
  - audit.write
guardrails:
  - id: mutating-scopes
    kind: custom
    label: Create a custom agent with mutating scopes
    gates: agent.createDraft
    requiresApproval: |
      (input) => input.agent.scopes.some((s) => [
        'create', 'update', 'delete', 'reserve', 'file', 'cancel',
        'amend', 'move', 'approve', 'resolve', 'publish',
      ].some((v) => s.endsWith(v) || s.endsWith(v + 'Draft')))
  - id: high-blast-radius
    kind: custom
    label: Create a custom agent with a broad or sensitive scope set
    gates: agent.createDraft
    requiresApproval: |
      (input) =>
        input.agent.scopes.length > 12 ||
        input.agent.skills.some((s) => [
          'customs.prepareDeclaration',
          'customs.fileDeclaration',
          'zone.updateBondedLedger',
          'zone.issueGatePass',
          'inventory.reserveStock',
          'agent.createDraft',
        ].includes(s))
  - id: first-in-kind
    kind: custom
    label: Create the first custom agent of a new kind for this tenant
    gates: agent.createDraft
    requiresApproval: |
      (input) => input.isFirstOfKind === true
---

# Custom Agent

## Purpose

Given a proposed agent definition — a name, a kind, a list of skills, a
declared scope list, and a guardrail configuration — validate it against the
skill registry, simulate it against a sample input, and create a **draft**
agent. The draft is not active. Activation is a separate, human-gated step.

This skill is a **meta-capability**: it composes existing skills into a new
agent. That makes it more dangerous than any single domain skill, because a
mistake here propagates to every invocation of the resulting agent. The
validation rules and guardrails below exist for that reason.

## When to invoke

- A tenant's administrator wants to define a new agent.
- An existing custom agent needs its skill or scope list revised.
- An agent's definition needs to be re-validated after the skill registry
  changes (a skill was added, removed, or renamed).
- A tenant wants to preview what a proposed agent would do against a sample
  input before activating it.

Do not invoke for:

- Activating a draft agent. That is a separate approval-gated action.
- Modifying the **skill registry** itself. Custom agents compose existing
  skills; they do not define new ones.
- Granting an agent scopes that no skill requires. Declaring an unused scope
  is a validation failure, not a warning, once the agent is activated.
- Cross-tenant agent sharing. Agents are tenant-scoped by construction.

## The forbidden-scope list

Some scopes can **never** be granted to a custom agent, regardless of the
requesting tenant, the approver, or the justification. An agent that could
grant scopes to itself, approve its own actions, or modify the audit log
would defeat every other control in the system.

### Forbidden scopes

| Scope prefix | Why forbidden |
| ------------ | ------------- |
| `agent.*` | An agent may not create, update, delete, or list other agents. Self-modification is a privilege-escalation vector. |
| `approval.*` | An agent may not approve, reject, or resolve an approval request, including its own. |
| `audit.update` | The audit log is append-only. No application code path may modify it. |
| `audit.delete` | Same. |
| `tenant.*` | Tenant management is a SUPER_ADMIN capability, not an agent capability. |
| `user.create`, `user.delete`, `user.updateRole` | Identity management is an administrative capability. |
| `auth.*` | Authentication is not an agent concern. |
| `registry.*` (except the two assertion calls in this skill's own scopes) | An agent may not modify the skill registry. |
| `key.rotate`, `secret.*` | Key and secret management is out of scope for agents. |
| `feature.flag.*` | Agents may not enable features for themselves. |

An agent that attempts to declare a forbidden scope is **rejected**, and the
attempt is written to the audit log with the requesting user's identity.

### Reserved names

The following names are reserved and cannot be used as a custom agent's `id`
or `name`:

`admin`, `super-admin`, `root`, `system`, `internal`, `platform`, `registry`,
`audit`, `approval`, and any name beginning with the reserved prefix
`_system.`.

## Inputs

```ts
{
  agentId: string;              // slug, tenant-namespaced
  name: string;                 // display name
  description: string;          // plain language, shown in the admin UI
  kind: string;                 // 'ops' | 'risk' | tenant-defined
  skills: string[];             // skill ids this agent may invoke
  scopes: string[];             // union of the skills' scopes, declared explicitly
  guardrails: Array<{
    id: string;
    kind: 'always' | 'value-threshold' | 'control-list' | 'custom';
    label: string;
    gates: string;
  }>;
  isFirstOfKind: boolean;
  sampleInput?: unknown;
  requestedBy: string;
  idempotencyKey?: string;
}
```

## Outputs

```ts
{
  decision: 'accepted' | 'rejected' | 'held' | 'duplicate';
  reason?: string;

  agent?: {
    id: string;
    status: 'draft';
    kind: string;
    skills: string[];
    scopes: string[];
  };

  validation: {
    unknownSkills: string[];
    missingScopes: string[];
    unusedScopes: string[];
    forbiddenScopes: string[];
    collidingIds: string[];
    reservedNames: string[];
    unknownGuardrailGates: string[];
  };

  simulation?: {
    ran: boolean;
    sampleOutput?: unknown;
    errors?: string[];
  };

  handoffs: string[];
  audit: {
    skillId: 'custom-agent';
    rulesApplied: string[];
  };
}
```

## Operating procedure

1. **Idempotency check.** If `idempotencyKey` is present and matches a prior
   submission by the same user in the same tenant, return the prior decision
   with `decision: 'duplicate'`.

2. **Reserved-name check.** If `agentId` or `name` matches a reserved name or
   begins with the reserved prefix, reject with `reserved-name`.

3. **Forbidden-scope check.** Call `registry.assertNoForbiddenScopes` with
   the declared `scopes`. If any scope is on the forbidden list, reject with
   `forbidden-scope`, listing every offender. Do not continue.

4. **Skill existence check.** Call `skill.list`. Any id in `skills` not in
   the registry is recorded in `unknownSkills`. Reject with `unknown-skill`.

5. **Skill-scope coverage check.** Call `registry.assertCoverage` with the
   agent's `kind` and `scopes`. Missing scopes are recorded in
   `missingScopes`. Reject with `missing-scope`.

6. **Unused-scope check.** Any declared scope required by no declared skill
   is recorded in `unusedScopes`. Warning at draft; blocking at activation.

7. **Guardrail-gate check.** Every guardrail's `gates` must name a declared
   scope. Otherwise record in `unknownGuardrailGates` and reject with
   `guardrail-gate-not-in-scopes`.

8. **Collision check.** Call `agent.list` for the tenant. On `agentId`
   collision: allow update if the existing agent is `draft`; reject with
   `id-collision-active` if it is `active`.

9. **Description hygiene.** Scan `description` for instruction-like content.
   Reject with `description-hygiene` if found.

10. **Simulation (optional).** If `sampleInput` is provided, call
    `simulation.run`. Record `sampleOutput` and `errors`.

11. **Draft creation.** Call `agent.createDraft`. Status is always `draft`.

12. **Audit.** Call `audit.write` with the decision, validation result,
    guardrails that fired, and requester identity.

13. **Return.** Return the decision, validation result, and, if accepted,
    the draft agent's id and status.

## Rules

### Validation rules

| Rule | Condition | Outcome |
| ---- | --------- | ------- |
| `reserved-name` | `agentId` or `name` matches a reserved token | Reject |
| `forbidden-scope` | Any declared scope is on the forbidden list | Reject |
| `unknown-skill` | Any declared skill is not in the registry | Reject |
| `missing-scope` | Any scope required by a declared skill is not declared | Reject |
| `unused-scope` | Any declared scope is required by no skill | Warning; blocks at activation |
| `guardrail-gate-not-in-scopes` | A guardrail gates a scope not in the declared list | Reject |
| `id-collision-active` | `agentId` collides with an active agent | Reject |
| `id-collision-draft` | `agentId` collides with a draft agent | Update the draft |
| `description-hygiene` | Description contains instruction-like content | Reject |
| `duplicate-submission` | `idempotencyKey` matches a prior submission | Return prior decision |
| `no-skills` | `skills` is empty | Reject |

### Sensitivity rules

A skill is "sensitive" if it can move bonded goods, file or amend a
declaration, issue a gate pass, reserve inventory, or create another agent.
An agent that includes any sensitive skill triggers the `high-blast-radius`
guardrail regardless of its scope count.

### Guardrails (applied by the runtime, not by this skill)

- **`mutating-scopes`** — the agent declares any scope whose verb implies a
  mutation. Nearly every useful custom agent trips this; requires an ADMIN.
- **`high-blast-radius`** — more than twelve scopes, or any sensitive skill.
  Requires an ADMIN and a written justification in the approval request.
- **`first-in-kind`** — first agent of a declared kind. Requires an ADMIN.

When a guardrail fires, the runtime raises an approval request and returns
control to the caller with a `GUARDRAIL_PENDING` error.

## Simulation

`simulation.run` executes the proposed agent against `sampleInput` with all
procedures stubbed. The simulation tests the agent's logic, not its ability
to reach real data. This is intentional: a simulation that could read real
tenant data would be a data-exfiltration vector disguised as a preview.

The simulation output is a preview, not a guarantee. Activation includes a
mandatory dry-run against the tenant's staging environment before an agent
is promoted to active.

## Handoffs

| Next skill | Triggered when |
| ---------- | -------------- |
| `ops.requestActivation` | A draft agent is ready to be activated |
| `risk.assessAgent` | The `high-blast-radius` guardrail fired |
| `custom-agent.simulate` | The requester wants a deeper simulation |

## Refusal cases

The skill refuses and returns an exception rather than proceeding when:

- Any declared scope is on the forbidden list.
- The description contains instruction-like content.
- An agent is declared with no skills.
- A guardrail gates a scope the agent cannot call.
- An active agent would be shadowed by an update.

## Examples

See `reference/golden.jsonl` for the full evaluation set.

## Evaluation

```bash
pnpm skills:eval --skill custom-agent
```
