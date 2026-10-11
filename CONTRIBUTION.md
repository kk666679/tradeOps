# Contributing to CFS WMS

Thank you for your interest in improving CFS WMS. This project handles customs
documentation and, in some deployments, bonded goods. Contributions are held
to a standard appropriate to that responsibility. Please read this document in
full before opening a pull request.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Ways to Contribute](#ways-to-contribute)
3. [The Golden Rules](#the-golden-rules)
4. [Development Setup](#development-setup)
5. [Branch and Commit Conventions](#branch-and-commit-conventions)
6. [Pull Request Process](#pull-request-process)
7. [Review Criteria](#review-criteria)
8. [Contributing Tariff Data](#contributing-tariff-data)
9. [Contributing Agents and Skills](#contributing-agents-and-skills)
10. [Contributing Routers and Procedures](#contributing-routers-and-procedures)
11. [Contributing Schema Migrations](#contributing-schema-migrations)
12. [Contributing AI Pipelines](#contributing-ai-pipelines)
13. [Testing Requirements](#testing-requirements)
14. [Release Process](#release-process)
15. [Reporting Security Issues](#reporting-security-issues)
16. [Getting Help](#getting-help)

---

## Code of Conduct

By participating you agree to abide by our
[Code of Conduct](./CODE_OF_CONDUCT.md). Report unacceptable behaviour to
`contact@chemmara.xyz` `kk@kurnia-kadir.xyz`.

---

## Ways to Contribute

- **Fix a bug.** Use the issue tracker to confirm it is not already known.
- **Correct or add tariff data.** See the dedicated section below; the rules
  are stricter than for code.
- **Add or improve an agent skill.** With scope tests and guardrail tests.
- **Improve a router.** With an updated authorisation matrix test.
- **Write tests.** Coverage of isolation, auth, and tariff paths is the
  highest-value contribution we receive.
- **Improve documentation.** Including this file.
- **Report a security issue.** Privately. See SECURITY.md.

---

## The Golden Rules

Three rules govern every non-trivial change. A pull request that violates any
of them will be returned without merge.

### 1. Source every tariff figure

Any change to a duty rate, sales tax rate, excise rate, control flag, quota
flag, or hazardous flag **must cite a primary source**. Acceptable sources, in
order of authority:

1. The Federal Gazette instrument — e.g. `P.U.(A) 114/2022`,
   `P.U.(A) 349/2025`, `P.U.(A) 117/2023`.
2. The JKDM HS Explorer, with the full URL and the date you retrieved it.
3. An agency control list — MAQIS, SIRIM, MITI, MDA, Drug Control Authority.
4. A MITI FTA schedule, noting the HS version it uses (ATIGA uses HS2017,
   RCEP uses HS2022, CPTPP uses HS2012).

**Not acceptable:** commercial tariff aggregators, blog posts, LLM output,
Wikipedia, or another copy of this dataset. Use them to find a lead; confirm
against a primary source before citing.

Every rate change must include a `Source:` line in the commit body and an
entry in `CHANGELOG-tariff.md`.

### 2. Test every isolation and authorisation path

A change to any router, worker, or agent that reads or writes tenant-scoped
data must come with a test demonstrating that:

- A request from tenant A cannot read or write tenant B's data.
- A role without the required permission is rejected.
- An agent cannot call a procedure outside its declared scope.

These live in `test/isolation/`, `test/auth/`, and `test/agents/`. If you add
a router, add a row to the authorisation matrix in `test/auth/matrix.test.ts`.

### 3. Never let the model select a procedure

LLM output is data, never instruction. A procedure is invoked because
middleware decided to invoke it, never because a model returned its name. If
you find yourself parsing a model response to choose a tool, stop and
reconsider the design. This rule exists because of prompt injection, and it
is the single most important invariant in the agent framework.

---

## Development Setup

### Prerequisites

- Node 20 LTS or newer
- pnpm 9 or newer
- Docker and Docker Compose

### Local environment

```bash
git clone https://github.com/<your-org>/cfs-wms.git
cd cfs-wms
pnpm install

cp .env.example .env
# Edit .env. At minimum set DATABASE_URL, REDIS_URL, WEAVIATE_URL, JWT_SECRET,
# JWT_REFRESH_SECRET, ENCRYPTION_KEY.

docker compose up -d
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev