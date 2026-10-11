export type DocPage = {
  slug: string
  title: string
  description: string
  group: string
  keywords: string[]
  sections: { heading: string; body?: string; bullets?: string[]; code?: string }[]
}

export const docPages: DocPage[] = [
  { slug: 'getting-started', title: 'Getting started', description: 'Set up TradeOps and understand the operating model.', group: 'Start here', keywords: ['setup', 'install', 'onboarding'], sections: [
    { heading: 'What is TradeOps?', body: 'TradeOps is an AI-native Container Freight System and warehouse management workspace for Free Industrial Zones (FIZ) and Free Commercial Zones (FCZ). It brings cargo, warehouse, customs, billing, and operational intelligence into one tenant-aware application.' },
    { heading: 'Developer setup', body: 'The web application is a Next.js App Router project. Install dependencies, generate the Prisma client, and start the development server from the repository root.', code: 'npm install\nnpm run prisma:generate\nnpm run dev' },
    { heading: 'Operational onboarding', body: 'Begin with an organization administrator. Configure tenants, zones, users, roles, rule packs, and storage locations before recording cargo. Keep operational onboarding separate from local development configuration.' },
    { heading: 'Core concepts', body: 'Cargo is the unit of freight being received, stored, processed, or dispatched. Zones separate FIZ and FCZ operating contexts. A tenant owns its operational data and configuration; user access is evaluated in that tenant context.' },
  ] },
  { slug: 'platform', title: 'Platform overview', description: 'Understand the modules that make up the TradeOps workspace.', group: 'Platform', keywords: ['overview', 'modules', 'fiz', 'fcz'], sections: [
    { heading: 'Operational workspace', body: 'The application groups work into dashboards, cargo operations, warehouse management, customs, billing, administration, digital twin analysis, and custom agents. Navigation is organized around the work a user performs rather than infrastructure.' },
    { heading: 'Cargo lifecycle', body: 'Cargo records can be created, inspected, analyzed, handled through FIZ and FCZ flows, managed as bulk or hazardous material, and connected to warehouse movements. The exact available action depends on the route and the user’s access.' },
    { heading: 'Implemented areas', body: 'The repository contains screens for cargo, FIZ operations, bulk cargo, hazmat segregation, WMS inbound and outbound flows, slotting, movement tracking, administration, billing, audit logs, and tenant management.' },
  ] },
  { slug: 'architecture', title: 'Architecture', description: 'A practical reference for the verified application structure.', group: 'Platform', keywords: ['next.js', 'nestjs', 'prisma', 'trpc'], sections: [
    { heading: 'Application structure', body: 'The frontend uses Next.js 16 App Router with route groups for marketing and the authenticated application. The backend is a separate NestJS application under backend/. Shared frontend requests use tRPC through the App Router API handler.' },
    { heading: 'Data layer', body: 'Prisma is the database client and schema source of truth. Authentication and operational models live in prisma/schema.prisma. Do not expose database credentials to the browser.' },
    { heading: 'Request flow', body: 'Browser UI → Next.js route and provider → tRPC router → NestJS service or Prisma layer. Authentication context is resolved server-side; user-owned queries must remain scoped to the authenticated user and tenant.' },
    { heading: 'Useful commands', body: 'These scripts are verified from package.json.', code: 'npm run dev\nnpm run build\nnpm run build:backend\nnpm run dev:backend' },
  ] },
  { slug: 'warehouse-management', title: 'Warehouse management', description: 'Manage inbound, outbound, slotting, and stock movement workflows.', group: 'Modules', keywords: ['wms', 'warehouse', 'inbound', 'outbound', 'slotting'], sections: [
    { heading: 'Scope', body: 'The WMS route family includes inbound and outbound work, picking, packing, dispatch, inventory, movement tracking, and slotting views. These screens provide the operational surface for moving cargo through a facility.' },
    { heading: 'Typical sequence', body: 'Receive cargo, validate its record, assign or review a location, record movements, prepare outbound work, pick and pack, then dispatch. Treat each transition as an auditable operational event.' },
    { heading: 'Related routes', bullets: ['/wms/inbound', '/wms/outbound', '/wms/outbound/pick', '/wms/outbound/pack', '/wms/outbound/dispatch', '/wms/slotting', '/wms/movement'] },
  ] },
  { slug: 'cargo-operations', title: 'Cargo operations', description: 'Record and work with cargo across CFS, FIZ, FCZ, bulk, and hazmat flows.', group: 'Modules', keywords: ['cargo', 'cfs', 'hazmat', 'bulk'], sections: [
    { heading: 'Cargo workspace', body: 'The cargo module includes a listing, creation flow, detail pages, analytics, bulk cargo variants, FIZ workflows, FCZ workflows, and hazardous material segregation.' },
    { heading: 'Safety and compliance', body: 'Hazmat and bonded workflows should be handled with the permissions and review controls configured for the tenant. Verify supporting documents and escalation requirements before dispatch.' },
    { heading: 'Related routes', bullets: ['/cargo', '/cargo/new', '/cargo/analytics', '/cargo/hazmat', '/cargo/fiz', '/cargo/fcz', '/cargo/bulk'] },
  ] },
  { slug: 'customs-compliance', title: 'Customs and compliance', description: 'Use the customs and bonded operating surfaces with clear review ownership.', group: 'Modules', keywords: ['customs', 'bonded', 'compliance'], sections: [
    { heading: 'Verified surface', body: 'TradeOps includes customs-focused dashboards and custom-agent surfaces for classification, declarations, filing, origin, permits, tariff, valuation, duty, bonded operations, audit, and screening.' },
    { heading: 'Review discipline', body: 'Treat generated recommendations as reviewable work. Record the source documents and approvals required by your operating procedures; the repository does not establish a regulatory certification claim.' },
  ] },
  { slug: 'users-and-access', title: 'Users and access', description: 'Configure tenants, users, roles, and audit visibility.', group: 'Administration', keywords: ['users', 'roles', 'permissions', 'tenants'], sections: [
    { heading: 'Administration routes', bullets: ['/admin/tenants', '/admin/users', '/admin/roles', '/admin/roles/matrix', '/admin/audit-log', '/admin/zones', '/admin/rule-packs'] },
    { heading: 'Access model', body: 'Access is enforced through authenticated server requests and role-aware application surfaces. Configure the smallest useful permission set for each operator and review audit records when access or data scope is disputed.' },
    { heading: 'Tenant isolation', body: 'TradeOps is designed for multiple tenants. Tenant selection and scoping must be preserved across UI, tRPC, backend services, and database queries. Never use a client-side hidden control as an authorization boundary.' },
  ] },
  { slug: 'api-reference', title: 'API reference', description: 'Find the verified API entry points used by the application.', group: 'Developers', keywords: ['api', 'trpc', 'backend'], sections: [
    { heading: 'tRPC entry point', body: 'Frontend tRPC requests are mounted at /api/trpc/[[...trpc]]. The router composes backend procedures and is the preferred application API surface for the web client.' },
    { heading: 'Authentication endpoint', body: 'Authentication is mounted at /api/auth/[...nextauth]. The route delegates to the project’s configured NextAuth handler. Use the existing client flow rather than posting credentials to an undocumented endpoint.' },
    { heading: 'Finding procedures', body: 'The authoritative procedure names, input schemas, and authorization behavior are in server/trpc/router.ts and backend/src/trpc/. Keep API documentation synchronized with those source files when adding procedures.' },
  ] },
  { slug: 'integrations', title: 'Integrations', description: 'Understand the integrations present in the repository and how to extend them.', group: 'Developers', keywords: ['integrations', 'socket', 'ai'], sections: [
    { heading: 'Runtime integrations', body: 'The project includes Socket.IO providers for realtime UI behavior, Prisma for persistence, and AI SDK dependencies for agent and intelligence surfaces. Configuration is supplied through environment variables; do not commit secrets.' },
    { heading: 'External systems', body: 'No verified customs, carrier, email, or third-party logistics connector is established by the available route and configuration inventory. Document a connector only after its adapter, credentials, failure handling, and tests exist.' },
  ] },
  { slug: 'security', title: 'Security', description: 'Apply the security controls and operational practices supported by the codebase.', group: 'Administration', keywords: ['security', 'auth', 'audit'], sections: [
    { heading: 'Verified controls', bullets: ['NextAuth-based session handling is mounted through the App Router.', 'Prisma keeps database access behind server-side code.', 'Zod schemas are used in request validation paths.', 'An administration audit-log route is present.', 'Tenant-aware access is part of the application design.'] },
    { heading: 'Operational recommendations', body: 'Use strong environment secrets, least-privilege database credentials, protected deployment environments, backups, and regular access reviews. Certification, encryption coverage, and recovery objectives are not asserted here without deployment evidence.' },
  ] },
  { slug: 'troubleshooting', title: 'Troubleshooting', description: 'Diagnose common local development and access problems safely.', group: 'Support', keywords: ['errors', 'debugging', 'setup'], sections: [
    { heading: 'The app does not start', body: 'Confirm dependencies are installed and regenerate Prisma before retrying.', code: 'npm install\nnpm run prisma:generate\nnpm run dev' },
    { heading: 'Database errors', body: 'Check that the configured database URL is available to the server process, then run Prisma generation. Do not paste credentials into issue reports. If migrations are required, inspect the repository migration history before applying changes.' },
    { heading: 'Authentication or permission errors', body: 'Sign out and sign in again, confirm the intended tenant and role, then inspect the server-side request path. A visible menu is not proof of authorization.' },
    { heading: 'Build failures', body: 'Run the frontend and backend builds separately to isolate the failing surface.', code: 'npm run build\nnpm run build:backend' },
  ] },
  { slug: 'faq', title: 'FAQ', description: 'Answers to common questions about the current implementation.', group: 'Support', keywords: ['faq', 'questions'], sections: [
    { heading: 'Is TradeOps a public API?', body: 'The web application exposes an internal tRPC route and a separate NestJS backend. Public API availability should be treated as unverified unless an authenticated contract and deployment are provided.' },
    { heading: 'Does every page represent a finished workflow?', body: 'No. The repository contains a broad operational surface; confirm a route’s connected data and mutations before treating it as production-complete.' },
    { heading: 'Where do I report a mismatch?', body: 'Include the route, tenant context, role, request identifier if available, and a minimal reproduction. Never include passwords, tokens, or private cargo documents.' },
  ] },
  { slug: 'changelog', title: 'Changelog', description: 'Documentation baseline and maintenance guidance.', group: 'Support', keywords: ['changelog', 'release'], sections: [
    { heading: 'Initial documentation baseline', body: 'This documentation center is based on the repository structure and configuration available during implementation. No reliable release metadata or published version history was available to attribute feature dates.' },
    { heading: 'Maintaining this page', body: 'Add an entry when a user-visible route, API contract, schema, permission model, or integration changes. Link the relevant pull request or release source rather than inventing dates or delivery claims.' },
  ] },
]

export const docsBySlug = Object.fromEntries(docPages.map((page) => [page.slug, page])) as Record<string, DocPage>
export const docGroups = [...new Set(docPages.map((page) => page.group))]
export const searchDocs = docPages.map(({ slug, title, description, group, keywords, sections }) => ({ slug, title, description, group, keywords, text: sections.map((section) => `${section.heading} ${section.body} ${(section.bullets ?? []).join(' ')}`).join(' ') }))
