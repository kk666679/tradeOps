import type { WalkthroughDomain, WalkthroughSpec } from './walkthrough-types';

export const WALKTHROUGH_DOMAINS: WalkthroughDomain[] = [
  'admin',
  'bonded',
  'cargo',
  'custom-agents',
  'digital-twin',
  'fcz',
  'fiz',
  'integration',
  'order-management',
  'search',
  'settings',
  'trade-ops',
  'wms',
];

export const WALKTHROUGH_SPECS = {
  admin: {
    domain: 'admin',
    title: 'Administration',
    summary:
      'Administration contains tenant and user management, role reference surfaces, rule-pack routes, audit views, billing, and zone records. User and tenant pages use backend CRUD procedures; several other routes are UI surfaces whose persistence must be confirmed in their own implementation before relying on them.',
    audience: 'admin',
    prerequisites: [
      'Sign in with an account attached to a tenant. tRPC derives the authenticated user and tenant from the bearer token.',
      'Tenant and user lists need persisted records to show rows; create a tenant or user only if the corresponding backend mutation is available to your account.',
      'The application defines SUPER_ADMIN, ADMIN, OPS_MANAGER, WAREHOUSE_STAFF, CUSTOMER, AGENT, and AUDITOR. The UI does not define a universal role-to-route matrix.',
    ],
    keyRoutes: [
      { label: 'Users', href: '/admin/users', description: 'Browse users in the current tenant and open user creation or detail flows.' },
      { label: 'Tenants', href: '/admin/tenants', description: 'Browse tenant records and open tenant creation or detail flows.' },
      { label: 'Roles', href: '/admin/roles', description: 'Inspect role-related administration surfaces.' },
      { label: 'Audit log', href: '/admin/audit-log', description: 'Review the administration audit surface.' },
      { label: 'Rule packs', href: '/admin/rule-packs', description: 'Browse rule-pack records and open a selected record.' },
    ],
    concepts: [
      { term: 'Tenant scope', definition: 'A tenant ID may be attached to API context; individual procedures must enforce authentication and tenant isolation.' },
      { term: 'Global role', definition: 'The persisted user role is one of the GlobalRole enum values in the Prisma schema.' },
      { term: 'Rule pack', definition: 'A configurable rule bundle represented by the rule-pack route family; verify persistence in the page/API before treating edits as saved.' },
    ],
    workflows: [
      {
        title: 'Review and maintain users',
        purpose: 'Use the user list to inspect tenant users and the available create/detail controls.',
        steps: [
          { instruction: 'Open the user list and review the records returned for the active tenant.', href: '/admin/users', routeLabel: 'Users' },
          { instruction: 'Use the new-user flow to submit a record if your role is authorized.', href: '/admin/users/new', routeLabel: 'New user' },
          { instruction: 'Open a listed user to inspect its detail/edit surface.', href: '/admin/users', routeLabel: 'Users' },
        ],
      },
      {
        title: 'Review tenant configuration',
        purpose: 'Inspect tenant records and their individual configuration surfaces.',
        steps: [
          { instruction: 'Open the tenant list and identify the intended tenant record.', href: '/admin/tenants', routeLabel: 'Tenants' },
          { instruction: 'Create a tenant only when authorized and when the backend accepts the operation.', href: '/admin/tenants/new', routeLabel: 'New tenant' },
        ],
      },
      {
        title: 'Trace administrative changes',
        purpose: 'Use the audit route when investigating administrative actions.',
        steps: [
          { instruction: 'Open the audit log and filter or inspect available events.', href: '/admin/audit-log', routeLabel: 'Audit log' },
          { instruction: 'If no events appear, confirm the audit procedure has data and that the signed-in role can read it.', href: '/admin/audit-log', routeLabel: 'Audit log' },
        ],
      },
    ],
    dataSources: [
      'The route components use tRPC user.list/create/update/remove and tenant.list/byId/create/update/delete procedures.',
      'The admin audit component calls customAgents.audit.list; other admin routes do not all share a common data backend.',
      'The backend router is assembled in backend/src/trpc/trpc.router.ts; authenticated context and requireAuth/requireTenant/requireRole middleware are in backend/src/trpc.',
    ],
    permissions: [
      'The user list explicitly requires authentication and tenant context; user create/update/remove additionally require ADMIN or SUPER_ADMIN.',
      'Tenant routes use the generic createCrudRouter; that helper does not attach requireAuth, requireTenant, or requireRole itself. Do not assume the UI or tenant filter is an authorization boundary.',
      'Global roles are SUPER_ADMIN, ADMIN, OPS_MANAGER, WAREHOUSE_STAFF, CUSTOMER, AGENT, and AUDITOR. The schema lists these roles but does not itself assign a universal route matrix.',
    ],
    relatedDomains: [
      { domain: 'settings', label: 'Settings walkthrough', href: '/settings/walkthrough', relationship: 'Settings covers the signed-in user’s account preferences and security surfaces.' },
      { domain: 'custom-agents', label: 'Custom Agents walkthrough', href: '/custom-agents/walkthrough', relationship: 'Agent audit records and registry operations are part of the agent administration surface.' },
    ],
    troubleshooting: [
      { symptom: 'User or tenant list is empty.', check: 'Confirm the active account has tenant context and that records exist; user and tenant list procedures have different middleware.', location: 'backend/src/trpc/trpc.context.ts and app/(app-walkthroughs)/admin/_components/' },
      { symptom: 'A create/update/delete action is forbidden.', check: 'Check the procedure’s role middleware and the current GlobalRole; UI visibility is not authorization.', location: 'backend/src/trpc/trpc.middleware.ts and the matching backend router' },
      { symptom: 'A route shows a shell but no persisted data.', check: 'Some admin routes do not use the user/tenant CRUD procedures; check the page component and router before treating the surface as implemented.', location: 'app/(app-walkthroughs)/admin/' },
    ],
    whereThingsLive: [
      { concept: 'User screens', path: 'app/(app-walkthroughs)/admin/users/' },
      { concept: 'Tenant screens', path: 'app/(app-walkthroughs)/admin/tenants/' },
      { concept: 'User tRPC router', path: 'backend/src/user/user.router.ts' },
      { concept: 'Tenant tRPC router', path: 'backend/src/tenant/tenant.router.ts' },
      { concept: 'Role definitions and tenant relation', path: 'prisma/schema.prisma' },
    ],
    lastUpdated: '2026-10-12',
  },
  bonded: {
    domain: 'bonded',
    title: 'Bonded operations',
    summary:
      'Bonded operations provide a bonded-workflow overview and entry points for movement of goods under customs control. This walkthrough route group does not itself call a tRPC query; the WMS bonded router is the backend domain surface, so verify the linked operational screen before assuming an action is persisted.',
    audience: 'operator',
    prerequisites: [
      'Sign in with a tenant-scoped account and use the tenant whose bonded inventory and movement records you intend to review.',
      'Seed bonded inventory, zone and movement records through their supported operational flows to see populated results.',
      'The applicable customs/bond controls are organization-specific; follow your approved procedure rather than treating this page as a legal instruction.',
    ],
    keyRoutes: [
      { label: 'Bonded overview', href: '/bonded', description: 'Entry point for bonded-zone operations.' },
      { label: 'Bonded workflow', href: '/bonded/bonded-workflow', description: 'Explore the workflow graph used to explain bonded operational stages.' },
      { label: 'WMS bonded ledger', href: '/wms/bonded', description: 'Open the warehouse bonded-ledger route.' },
      { label: 'WMS movement', href: '/wms/movement', description: 'Review warehouse movement flows.' },
    ],
    concepts: [
      { term: 'Bonded goods', definition: 'Goods held under customs control subject to the applicable zone and movement rules.' },
      { term: 'Bonded ledger', definition: 'The WMS route family for bonded inventory and ledger activity.' },
      { term: 'Movement event', definition: 'A recorded transition of goods between locations or operational states; use the ledger and movement screens to investigate it.' },
    ],
    workflows: [
      {
        title: 'Review bonded operations',
        purpose: 'Start with the bonded overview, then move to the ledger for recorded inventory activity.',
        steps: [
          { instruction: 'Open the bonded overview and identify the operation you need to trace.', href: '/bonded', routeLabel: 'Bonded overview' },
          { instruction: 'Open the WMS bonded ledger to inspect available bonded records.', href: '/wms/bonded', routeLabel: 'WMS bonded ledger' },
          { instruction: 'Use the movement route to follow an inventory transition.', href: '/wms/movement', routeLabel: 'WMS movement' },
        ],
      },
      {
        title: 'Understand the bonded process flow',
        purpose: 'Use the workflow explorer as an explanation of process relationships, not a substitute for an official customs filing.',
        steps: [
          { instruction: 'Open the bonded workflow graph and follow the displayed nodes and links.', href: '/bonded/bonded-workflow', routeLabel: 'Bonded workflow' },
          { instruction: 'Return to the WMS ledger to verify actual recorded stock activity.', href: '/wms/bonded', routeLabel: 'WMS bonded ledger' },
        ],
      },
    ],
    dataSources: [
      'The WMS backend mounts a wms.bonded router in backend/src/trpc/trpc.router.ts.',
      'The /bonded and /bonded-workflow route files do not issue direct tRPC queries; use /wms/bonded for the WMS data surface.',
      'No specific bonded database model is claimed here; inspect prisma/schema.prisma and the bonded router when investigating persistence.',
    ],
    permissions: [
      'The API context can include user and tenant values from a bearer token, but guards are applied per procedure. The bonded route page itself has no direct query.',
      'The shared createCrudRouter filters by ctx.tenantId when present but does not itself require authentication or a non-null tenant; verify the particular WMS procedure before relying on isolation.',
      'GlobalRole values are defined in prisma/schema.prisma. No bonded-specific role matrix is encoded in this walkthrough.',
      'Do not release, transfer, or otherwise act on bonded goods without the organization’s authorized operator and customs controls.',
    ],
    relatedDomains: [
      { domain: 'wms', label: 'WMS walkthrough', href: '/wms/walkthrough', relationship: 'WMS contains the bonded ledger, inventory and movement route families.' },
      { domain: 'fiz', label: 'FIZ walkthrough', href: '/fiz/walkthrough', relationship: 'FIZ operations include controlled production inputs and finished-goods flows.' },
      { domain: 'fcz', label: 'FCZ walkthrough', href: '/fcz/walkthrough', relationship: 'FCZ operations handle commercial-zone flows that can intersect bonded movement.' },
    ],
    troubleshooting: [
      { symptom: 'The bonded overview does not show a live record count.', check: 'The overview route has no direct tRPC query; use the WMS bonded ledger and verify that records exist.', location: 'app/(app-walkthroughs)/bonded/page.tsx and app/(app-walkthroughs)/wms/bonded/' },
      { symptom: 'WMS bonded requests are forbidden.', check: 'Confirm the request has a valid bearer token and tenant context, and check any procedure role requirements.', location: 'backend/src/trpc/trpc.context.ts and backend/src/wms/bonded/' },
    ],
    whereThingsLive: [
      { concept: 'Bonded overview', path: 'app/(app-walkthroughs)/bonded/page.tsx' },
      { concept: 'Bonded workflow screen', path: 'app/(app-walkthroughs)/bonded/bonded-workflow/page.tsx' },
      { concept: 'WMS bonded routes', path: 'app/(app-walkthroughs)/wms/bonded/' },
      { concept: 'WMS bonded backend router', path: 'backend/src/wms/bonded/' },
      { concept: 'Backend tRPC router registration', path: 'backend/src/trpc/trpc.router.ts' },
    ],
    lastUpdated: '2026-10-12',
  },
  cargo: {
    domain: 'cargo',
    title: 'Cargo',
    summary:
      'Cargo is the general cargo-record surface with list, create, detail and analytics routes plus specialized bulk, FCZ, FIZ and hazmat views. In this route tree, persisted cargo queries and creation use cargo.main; the existence of other cargo routers does not mean these specialized pages are backed by them.',
    audience: 'operator',
    prerequisites: [
      'Sign in with tenant context. Cargo API calls are made in the authenticated user’s tenant.',
      'Create cargo through the new-cargo form or seed cargo records in the tenant to populate list and analytics views.',
      'Have cargo reference and classification details ready before creating a record; specialized regulatory information must be verified in the relevant operational workflow.',
    ],
    keyRoutes: [
      { label: 'Cargo list', href: '/cargo', description: 'Browse tenant cargo records.' },
      { label: 'New cargo', href: '/cargo/new', description: 'Create a cargo record using the cargo main mutation.' },
      { label: 'Cargo analytics', href: '/cargo/analytics', description: 'Summarize the cargo records available to the page.' },
      { label: 'Bulk cargo', href: '/cargo/bulk', description: 'Open bulk cargo handling views.' },
      { label: 'Hazmat', href: '/cargo/hazmat', description: 'Open hazardous-material cargo views.' },
    ],
    concepts: [
      { term: 'Cargo record', definition: 'The general cargo entity queried through cargo.main.list/byId and created through cargo.main.create in this route family.' },
      { term: 'Bulk cargo', definition: 'Bulk cargo-specific presentation paths (dry, liquid, break-bulk, containerized); these routes must not be mistaken for separate persisted APIs unless wired.' },
      { term: 'Hazmat', definition: 'A hazardous-material view and segregation route; regulatory classifications should be checked against authoritative data.' },
    ],
    workflows: [
      {
        title: 'Create and review a cargo record',
        purpose: 'Create a tenant cargo record, then verify its persisted form in the list or detail route.',
        steps: [
          { instruction: 'Open the new-cargo form and enter the cargo record details.', href: '/cargo/new', routeLabel: 'New cargo' },
          { instruction: 'Return to the cargo list and confirm the record appears.', href: '/cargo', routeLabel: 'Cargo list' },
          { instruction: 'Select the record to open its detail page; the route reads the record by ID.', href: '/cargo', routeLabel: 'Cargo list' },
        ],
      },
      {
        title: 'Review specialized handling views',
        purpose: 'Use the specialized routes for the workflow context while remembering that this route tree persists through the main cargo router.',
        steps: [
          { instruction: 'Open the relevant bulk or hazmat view for operational context.', href: '/cargo/bulk', routeLabel: 'Bulk cargo' },
          { instruction: 'Use cargo analytics to review the records represented by the current data source.', href: '/cargo/analytics', routeLabel: 'Cargo analytics' },
        ],
      },
    ],
    dataSources: [
      'Live UI data calls in this route family use trpc.cargo.main.list, trpc.cargo.main.byId and trpc.cargo.main.create.',
      'The backend also mounts cargo.bulk, cargo.fcz, cargo.fiz and cargo.hazmat routers, but these routes do not use those namespaces as their persistence source.',
      'The authoritative router registration is backend/src/trpc/trpc.router.ts; tenant scoping is supplied by the tRPC context and procedures.',
    ],
    permissions: [
      'The cargo UI expects an authenticated tenant session. The API context derives tenantId from the bearer token, but check whether a procedure applies requireAuth/requireTenant; shared CRUD handlers do not add those guards themselves.',
      'Global role values are defined in prisma/schema.prisma; no cargo-specific role mapping is established by the route UI.',
      'Treat dangerous-goods and customs decisions as controlled operational work; use approved role grants and authoritative classification records.',
    ],
    relatedDomains: [
      { domain: 'wms', label: 'WMS walkthrough', href: '/wms/walkthrough', relationship: 'WMS tracks receipt, inventory, movement and dispatch after cargo is handled.' },
      { domain: 'fcz', label: 'FCZ walkthrough', href: '/fcz/walkthrough', relationship: 'FCZ has dedicated entrepot, transhipment and re-export workflows.' },
      { domain: 'fiz', label: 'FIZ walkthrough', href: '/fiz/walkthrough', relationship: 'FIZ pages cover manufacturing inputs and finished-goods flows.' },
    ],
    troubleshooting: [
      { symptom: 'Cargo list is empty.', check: 'Verify tenant context and that a cargo.main record exists; the specialized route does not create the base record by itself.', location: 'app/(app-walkthroughs)/cargo/_components/ and backend/src/cargo/cargo.router.ts' },
      { symptom: 'A specialized cargo screen looks populated but changes do not persist.', check: 'Confirm which mutation the screen calls; the known list/byId/create connection is cargo.main, not automatically cargo.bulk/fcz/fiz/hazmat.', location: 'app/(app-walkthroughs)/cargo/ and backend/src/trpc/trpc.router.ts' },
      { symptom: 'Detail route cannot find a cargo item.', check: 'Open the row from the list and verify that its ID belongs to the active tenant.', location: 'app/(app-walkthroughs)/cargo/[id]/page.tsx' },
    ],
    whereThingsLive: [
      { concept: 'Cargo screens', path: 'app/(app-walkthroughs)/cargo/' },
      { concept: 'Cargo query and form surface', path: 'app/(app-walkthroughs)/cargo/_components/' },
      { concept: 'Cargo router namespace registration', path: 'backend/src/trpc/trpc.router.ts' },
      { concept: 'Cargo backend procedures', path: 'backend/src/cargo/' },
    ],
    lastUpdated: '2026-10-12',
  },
  'custom-agents': {
    domain: 'custom-agents',
    title: 'Custom agents',
    summary:
      'Custom Agents groups agent authoring, testing and publishing, registry, orchestration, supervision, policy, memory, monitoring, analytics and audit screens. The backend mounts matching customAgents routers, but the route tree does not issue direct tRPC queries; treat screens as UI scaffolding unless their composed component explicitly persists an operation.',
    audience: 'developer',
    prerequisites: [
      'Use an authenticated tenant account. Agent records and execution evidence should belong to that tenant.',
      'Define intended capabilities, data access, delegation boundaries and review policy before authoring an agent.',
      'Seed or create agent definitions and runs using a verified backend workflow; a blank registry or run list can be a valid empty state.',
    ],
    keyRoutes: [
      { label: 'Agent overview', href: '/custom-agents', description: 'Entry point for custom-agent capabilities.' },
      { label: 'Builder', href: '/custom-agents/builder', description: 'Open the agent authoring area.' },
      { label: 'Orchestration', href: '/custom-agents/orchestration', description: 'Review orchestration and run routes.' },
      { label: 'Supervision', href: '/custom-agents/supervision', description: 'Review approval and human-supervision surfaces.' },
      { label: 'Registry', href: '/custom-agents/registry', description: 'Browse registered agents.' },
      { label: 'Policy', href: '/custom-agents/policy', description: 'Inspect policy configuration surfaces.' },
      { label: 'Audit', href: '/custom-agents/audit', description: 'Review agent audit and evidence views.' },
    ],
    concepts: [
      { term: 'Agent definition', definition: 'A configured agent identity, instructions and capability boundary; confirm saving and version semantics in the implementation.' },
      { term: 'Run', definition: 'An execution instance with status and evidence, represented by orchestration run routes.' },
      { term: 'Supervision', definition: 'Human review controls for approvals, escalations, disagreements and interventions.' },
      { term: 'Policy boundary', definition: 'Rules constraining data access, delegation, jurisdiction, guardrails and spending.' },
    ],
    workflows: [
      {
        title: 'Author and verify an agent',
        purpose: 'Move through the authoring routes and verify persistence before publishing.',
        steps: [
          { instruction: 'Open the builder and start a new definition.', href: '/custom-agents/builder/new', routeLabel: 'New agent' },
          { instruction: 'Run the available test flow; do not publish until expected behavior and access boundaries are reviewed.', href: '/custom-agents/builder/test', routeLabel: 'Agent tests' },
          { instruction: 'Inspect the registry to confirm the agent is present before using it.', href: '/custom-agents/registry', routeLabel: 'Registry' },
        ],
      },
      {
        title: 'Review a supervised execution',
        purpose: 'Inspect run activity and human review surfaces.',
        steps: [
          { instruction: 'Open orchestration runs and choose an available run.', href: '/custom-agents/orchestration/runs', routeLabel: 'Runs' },
          { instruction: 'Review outstanding supervision approvals and escalations.', href: '/custom-agents/supervision/approvals', routeLabel: 'Approvals' },
          { instruction: 'Use audit views to inspect evidence and decisions.', href: '/custom-agents/audit', routeLabel: 'Audit' },
        ],
      },
      {
        title: 'Check policy and operational health',
        purpose: 'Review configured controls and the monitoring surfaces before diagnosing an agent issue.',
        steps: [
          { instruction: 'Inspect guardrails and data-access policy routes.', href: '/custom-agents/policy/guardrails', routeLabel: 'Guardrails' },
          { instruction: 'Open monitoring to review the available fleet and incident surfaces.', href: '/custom-agents/monitoring', routeLabel: 'Monitoring' },
        ],
      },
    ],
    dataSources: [
      'The backend mounts customAgents.audit, builder, customsAgents, evals, memory, monitoring, orchestration, policy, registry and supervision routers.',
      'The route pages in app/(app-walkthroughs)/custom-agents do not directly call tRPC hooks; verify composed component behavior before treating any displayed action as persisted.',
      'Router registration is in backend/src/trpc/trpc.router.ts; audit and run-related persistence is in backend/src/custom-agents/.',
    ],
    permissions: [
      'The backend context can derive user and tenant from a bearer token. The custom-agent route files do not call tRPC directly, so each composed control and procedure must be checked for its actual guards.',
      'The backend supports requireRole middleware and the GlobalRole enum; this walkthrough does not infer an agent-author, approver or publisher mapping.',
      'The shared createCrudRouter does not attach authentication or role middleware on its own; a tenant filter is not a substitute for authorization.',
      'Restrict publish, delegation, data access and spend controls to roles approved by your organization; confirm enforcement in each procedure.',
    ],
    relatedDomains: [
      { domain: 'digital-twin', label: 'Digital Twin walkthrough', href: '/digital-twin/walkthrough', relationship: 'Digital Twin includes agent and reasoning views that can inform operational automation.' },
      { domain: 'integration', label: 'Integration walkthrough', href: '/integration/walkthrough', relationship: 'Agent Mesh routes cover integration touchpoints for agents.' },
      { domain: 'admin', label: 'Administration walkthrough', href: '/admin/walkthrough', relationship: 'Administration contains tenant, user and audit-related controls.' },
    ],
    troubleshooting: [
      { symptom: 'Builder or registry changes disappear after navigation.', check: 'The route tree does not directly invoke tRPC; verify the composed component has a mutation and successful response before relying on persistence.', location: 'app/(app-walkthroughs)/custom-agents/ and backend/src/custom-agents/' },
      { symptom: 'A run has no detail view or evidence.', check: 'Confirm a run was created by a connected orchestration procedure and use an actual run ID from the list.', location: 'app/(app-walkthroughs)/custom-agents/orchestration/runs/' },
      { symptom: 'A user cannot approve or publish.', check: 'Inspect the procedure’s requireRole middleware and the account’s tenant role.', location: 'backend/src/custom-agents/ and backend/src/trpc/trpc.middleware.ts' },
    ],
    whereThingsLive: [
      { concept: 'Agent route pages', path: 'app/(app-walkthroughs)/custom-agents/' },
      { concept: 'Builder, orchestration, registry and supervision API modules', path: 'backend/src/custom-agents/' },
      { concept: 'Router registration', path: 'backend/src/trpc/trpc.router.ts' },
      { concept: 'Authentication and authorization middleware', path: 'backend/src/trpc/trpc.middleware.ts' },
    ],
    lastUpdated: '2026-10-12',
  },
  'digital-twin': {
    domain: 'digital-twin',
    title: 'Digital Twin',
    summary:
      'Digital Twin presents simulation, scenario, live state, graph, reasoning, task, zone, agent and analytics routes. The backend exposes a digitalTwin router, but these route files do not directly issue tRPC queries; verify the rendered components and backend contract before treating scenario, simulation or task actions as persisted.',
    audience: 'mixed',
    prerequisites: [
      'Sign in to the intended tenant before opening operational or simulation state.',
      'A useful simulation needs a defined scenario and relevant source data; a route existing does not establish that those inputs are seeded.',
      'Treat live, graph and reasoning displays as illustrative unless their component is connected to a live data source.',
    ],
    keyRoutes: [
      { label: 'Twin overview', href: '/digital-twin', description: 'Start at the digital-twin landing view.' },
      { label: 'Simulation', href: '/digital-twin/simulation', description: 'Open simulation controls and scenario routes.' },
      { label: 'Scenarios', href: '/digital-twin/simulation/scenarios', description: 'Browse simulation scenarios.' },
      { label: 'What-if', href: '/digital-twin/simulation/what-if', description: 'Open the what-if analysis surface.' },
      { label: 'Live', href: '/digital-twin/live', description: 'Open the live twin view.' },
      { label: 'Reasoning', href: '/digital-twin/reasoning', description: 'Open reasoning and trace views.' },
      { label: 'Tasks', href: '/digital-twin/tasks', description: 'Browse twin-related tasks.' },
    ],
    concepts: [
      { term: 'Digital twin', definition: 'A model of operational entities and relationships; freshness depends on the data integration actually connected to the view.' },
      { term: 'Scenario', definition: 'A named set of assumptions used by a simulation or what-if analysis.' },
      { term: 'Run', definition: 'An execution of a simulation; detail routes use a run identifier.' },
      { term: 'Reasoning trace', definition: 'An explanation/evidence surface for how an outcome was derived, when connected.' },
    ],
    workflows: [
      {
        title: 'Explore a scenario',
        purpose: 'Find an existing scenario and inspect its simulation path.',
        steps: [
          { instruction: 'Open scenarios and select an available scenario.', href: '/digital-twin/simulation/scenarios', routeLabel: 'Scenarios' },
          { instruction: 'Open the simulation view to inspect the controls and run state.', href: '/digital-twin/simulation', routeLabel: 'Simulation' },
          { instruction: 'Use the what-if route to compare assumptions only if the view is connected to the simulation service.', href: '/digital-twin/simulation/what-if', routeLabel: 'What-if' },
        ],
      },
      {
        title: 'Inspect twin state and relationships',
        purpose: 'Navigate from live state to the graph representation and zone context.',
        steps: [
          { instruction: 'Open the live view and note its displayed data freshness or connection state.', href: '/digital-twin/live', routeLabel: 'Live' },
          { instruction: 'Inspect relationships in the graph view.', href: '/digital-twin/graph', routeLabel: 'Graph' },
          { instruction: 'Choose a zone view relevant to the operational question.', href: '/digital-twin/zones', routeLabel: 'Zones' },
        ],
      },
      {
        title: 'Trace a decision or task',
        purpose: 'Use reasoning and task pages to locate supporting context.',
        steps: [
          { instruction: 'Open the reasoning trace route for execution evidence.', href: '/digital-twin/reasoning/trace', routeLabel: 'Reasoning trace' },
          { instruction: 'Review the task list and queue for related work.', href: '/digital-twin/tasks', routeLabel: 'Tasks' },
        ],
      },
    ],
    dataSources: [
      'The backend mounts a digitalTwin tRPC router in backend/src/trpc/trpc.router.ts.',
      'The route pages in app/(app-walkthroughs)/digital-twin do not directly call tRPC hooks; the live and simulation source must be checked in the components they compose.',
      'No database table is asserted by this walkthrough; inspect backend/src/digital-twin/ and prisma/schema.prisma for the current implementation.',
    ],
    permissions: [
      'The backend context can derive user and tenant from a bearer token. These route pages do not call tRPC directly; check the composed component and procedure for applied guards.',
      'The shared createCrudRouter does not attach authentication or role middleware on its own; a tenant filter is not a substitute for authorization.',
      'The route group does not define its own role matrix. API procedures remain the authorization source.',
      'Do not use a simulation result as an operational command or compliance determination unless the underlying process and approval controls explicitly support it.',
    ],
    relatedDomains: [
      { domain: 'custom-agents', label: 'Custom Agents walkthrough', href: '/custom-agents/walkthrough', relationship: 'The twin includes agent-related and reasoning routes; custom-agents covers authoring and supervision.' },
      { domain: 'wms', label: 'WMS walkthrough', href: '/wms/walkthrough', relationship: 'Warehouse events are potential operational source data for a twin.' },
      { domain: 'fiz', label: 'FIZ walkthrough', href: '/fiz/walkthrough', relationship: 'FIZ production flows provide zone-specific operational context.' },
    ],
    troubleshooting: [
      { symptom: 'Live view is empty or stale.', check: 'Inspect connection/freshness indicators and verify whether the composed component has a live data provider; route code itself has no direct tRPC query.', location: 'app/(app-walkthroughs)/digital-twin/live/' },
      { symptom: 'No scenario or run is available.', check: 'Confirm scenario/run creation is implemented and data is seeded; do not invent an ID for a dynamic detail route.', location: 'app/(app-walkthroughs)/digital-twin/simulation/' },
      { symptom: 'Graph or trace has no explanation.', check: 'Verify source events and the connected reasoning component; the route existing alone does not guarantee trace generation.', location: 'app/(app-walkthroughs)/digital-twin/graph/ and reasoning/' },
    ],
    whereThingsLive: [
      { concept: 'Digital-twin routes', path: 'app/(app-walkthroughs)/digital-twin/' },
      { concept: 'Digital-twin backend router', path: 'backend/src/digital-twin/' },
      { concept: 'Router registration', path: 'backend/src/trpc/trpc.router.ts' },
      { concept: 'Persisted models, if present', path: 'prisma/schema.prisma' },
    ],
    lastUpdated: '2026-10-12',
  },
  fcz: {
    domain: 'fcz',
    title: 'Free Commercial Zone (FCZ)',
    summary:
      'FCZ organizes commercial-zone work across entrepot, transhipment, break-bulk, re-export, repackaging, value-add, trading houses and analytics. Its route components query dedicated fcz routers for several list/detail views and mutations; confirm the specific resource route before assuming every page has the same persistence support.',
    audience: 'operator',
    prerequisites: [
      'Sign in with the tenant that owns the FCZ records.',
      'Seed or create FCZ transhipment, break-bulk, entrepot, re-export or trading-house records through the supported forms.',
      'Use appropriate broker/operator authority and verified shipment/document references for customs-controlled operations.',
    ],
    keyRoutes: [
      { label: 'FCZ overview', href: '/fcz', description: 'Entry point to FCZ work areas.' },
      { label: 'Transhipment', href: '/fcz/transhipment', description: 'Browse FCZ transhipment records.' },
      { label: 'Break-bulk', href: '/fcz/break-bulk', description: 'Browse break-bulk records and creation flow.' },
      { label: 'Entrepot', href: '/fcz/entrepot', description: 'Review entrepot records and matching route.' },
      { label: 'Re-export', href: '/fcz/reexport', description: 'Browse re-export records and creation flow.' },
      { label: 'Trading houses', href: '/fcz/trading-houses', description: 'Browse trading-house records.' },
      { label: 'Analytics', href: '/fcz/analytics', description: 'Review FCZ summary views.' },
    ],
    concepts: [
      { term: 'Entrepot', definition: 'A commercial-zone flow involving goods held for trading or onward movement; confirm the organization’s customs procedure.' },
      { term: 'Transhipment', definition: 'Movement of cargo through a zone/port en route to another destination.' },
      { term: 'Break-bulk', definition: 'Cargo handled as individual packages or units rather than as one bulk mass.' },
      { term: 'Re-export', definition: 'Export of goods previously imported or held in the zone, subject to the applicable filing and evidence.' },
    ],
    workflows: [
      {
        title: 'Register a transhipment',
        purpose: 'Review the queue, create a record where the form is available, and inspect the selected record.',
        steps: [
          { instruction: 'Open the transhipment list and confirm the target shipment is not already registered.', href: '/fcz/transhipment', routeLabel: 'Transhipment' },
          { instruction: 'Use the new flow to enter verified movement details.', href: '/fcz/transhipment/new', routeLabel: 'New transhipment' },
          { instruction: 'Return to the list and select the record to view its detail.', href: '/fcz/transhipment', routeLabel: 'Transhipment' },
        ],
      },
      {
        title: 'Process commercial-zone stock',
        purpose: 'Use entrepot records and matches as the available cross-reference surfaces.',
        steps: [
          { instruction: 'Review entrepot records for the relevant goods or transaction.', href: '/fcz/entrepot', routeLabel: 'Entrepot' },
          { instruction: 'Open the match view to inspect possible record matches.', href: '/fcz/entrepot/matches', routeLabel: 'Entrepot matches' },
          { instruction: 'Use the re-export route when the approved workflow requires outward movement.', href: '/fcz/reexport', routeLabel: 'Re-export' },
        ],
      },
      {
        title: 'Review value-added work',
        purpose: 'Locate repackaging and value-add routes for work beyond storage and movement.',
        steps: [
          { instruction: 'Open repackaging jobs and create a job only through the supported form.', href: '/fcz/repackaging', routeLabel: 'Repackaging' },
          { instruction: 'Review value-add activity and analytics for the resulting work.', href: '/fcz/value-add', routeLabel: 'Value-add' },
        ],
      },
    ],
    dataSources: [
      'The FCZ UI uses trpc.fcz.breakBulk, entrepot, reexport, transhipment and tradingHouses procedures for list/detail/create/update/delete where implemented.',
      'Dedicated routers are mounted by backend/src/trpc/trpc.router.ts and implemented under backend/src/fcz/.',
      'Routes such as analytics, value-add and repackaging must be checked independently; the presence of an FCZ router does not prove each screen is persisted.',
    ],
    permissions: [
      'The API context can derive tenantId from a bearer token. Check the individual FCZ procedure for requireAuth/requireTenant; the shared CRUD helper does not enforce either guard itself.',
      'The repository defines global roles but no single FCZ role-to-operation matrix in these route pages.',
      'Only authorized operators/brokers should perform customs-controlled movement and declaration-related actions.',
    ],
    relatedDomains: [
      { domain: 'fiz', label: 'FIZ walkthrough', href: '/fiz/walkthrough', relationship: 'FIZ covers industrial-zone production and material flows that can connect to FCZ trade.' },
      { domain: 'bonded', label: 'Bonded walkthrough', href: '/bonded/walkthrough', relationship: 'Bonded operations explain controlled storage and movement context.' },
      { domain: 'trade-ops', label: 'Trade OPS walkthrough', href: '/trade-ops/walkthrough', relationship: 'Trade OPS provides declarations, permits, clearance and compliance routes.' },
    ],
    troubleshooting: [
      { symptom: 'FCZ list is empty.', check: 'Check tenant selection and seed records for the matching FCZ resource; each resource uses its own router.', location: 'app/(app-walkthroughs)/fcz/_components/FczRouteViews.tsx and backend/src/fcz/' },
      { symptom: 'Detail lookup fails.', check: 'Use the selected record ID from the corresponding list; do not mix IDs between transhipment, entrepot and trading houses.', location: 'app/(app-walkthroughs)/fcz/' },
      { symptom: 'An analytics or value-add route has no live metrics.', check: 'Those routes are not proof of persisted FCZ API support; inspect the page’s composed component and router usage.', location: 'app/(app-walkthroughs)/fcz/analytics/ and value-add/' },
    ],
    whereThingsLive: [
      { concept: 'FCZ page routes', path: 'app/(app-walkthroughs)/fcz/' },
      { concept: 'FCZ route queries and mutations', path: 'app/(app-walkthroughs)/fcz/_components/FczRouteViews.tsx' },
      { concept: 'FCZ backend routers', path: 'backend/src/fcz/' },
      { concept: 'Router namespace registration', path: 'backend/src/trpc/trpc.router.ts' },
    ],
    lastUpdated: '2026-10-12',
  },
  fiz: {
    domain: 'fiz',
    title: 'Free Industrial Zone (FIZ)',
    summary:
      'FIZ brings together industrial-zone operators, machinery, production inputs, subcontracting, wastage, finished goods, approvals and analytics. The UI uses dedicated fiz procedures for operator, machinery, production, subcontract and wastage data; route-specific support still varies, so verify each page’s query or mutation.',
    audience: 'operator',
    prerequisites: [
      'Sign in with the tenant that owns the FIZ operator and production records.',
      'Create or seed operator, machinery, production, subcontract or wastage records before expecting lists and analytics to populate.',
      'Keep source references, quantities and approved production/zone evidence available when entering material movements.',
    ],
    keyRoutes: [
      { label: 'FIZ overview', href: '/fiz', description: 'Entry point for industrial-zone activities.' },
      { label: 'Operators', href: '/fiz/operators', description: 'Browse FIZ operators.' },
      { label: 'Raw materials', href: '/fiz/raw-materials', description: 'Review raw-material intake and use routes.' },
      { label: 'Production inputs', href: '/fiz/production-inputs', description: 'Review production input records.' },
      { label: 'Machinery', href: '/fiz/machinery', description: 'Browse machinery and registration flows.' },
      { label: 'Finished goods', href: '/fiz/finished-goods', description: 'Review finished-goods status.' },
      { label: 'Approvals', href: '/fiz/approvals', description: 'Review FIZ approval routes.' },
      { label: 'Analytics', href: '/fiz/analytics', description: 'Review FIZ metrics.' },
    ],
    concepts: [
      { term: 'Operator', definition: 'A business/operator record associated with FIZ activity.' },
      { term: 'Production input', definition: 'Material or resource used in production; in this UI, production procedures back related records.' },
      { term: 'Subcontracting', definition: 'A production activity involving work performed by another party under the applicable controls.' },
      { term: 'Wastage', definition: 'Production material loss or disposal recorded for operational control and reconciliation.' },
    ],
    workflows: [
      {
        title: 'Set up an operator',
        purpose: 'Create or inspect an operator before linking industrial operations to it.',
        steps: [
          { instruction: 'Open the operator list and inspect existing tenant records.', href: '/fiz/operators', routeLabel: 'Operators' },
          { instruction: 'Use the new-operator route to register a record when authorized.', href: '/fiz/operators/new', routeLabel: 'New operator' },
          { instruction: 'Select an operator from the list to inspect its detail.', href: '/fiz/operators', routeLabel: 'Operators' },
        ],
      },
      {
        title: 'Track production material',
        purpose: 'Follow the input, production, and outcome routes to check the data available for an operational period.',
        steps: [
          { instruction: 'Review raw-material records for the input stream.', href: '/fiz/raw-materials', routeLabel: 'Raw materials' },
          { instruction: 'Open production inputs to inspect scheduled or recorded material usage.', href: '/fiz/production-inputs', routeLabel: 'Production inputs' },
          { instruction: 'Review finished goods and wastage to reconcile output and loss.', href: '/fiz/finished-goods', routeLabel: 'Finished goods' },
        ],
      },
      {
        title: 'Review controlled changes',
        purpose: 'Check approval and analytical views after machinery, subcontracting or production changes.',
        steps: [
          { instruction: 'Open approvals and review available approval records.', href: '/fiz/approvals', routeLabel: 'Approvals' },
          { instruction: 'Open analytics to review available summaries.', href: '/fiz/analytics', routeLabel: 'Analytics' },
        ],
      },
    ],
    dataSources: [
      'The FIZ pages call trpc.fiz.operators, machinery, production, subcontract and wastage list/byId/create/update/delete procedures where implemented.',
      'The backend mounts these routers through backend/src/trpc/trpc.router.ts; implementation files live under backend/src/fiz/.',
      'The overview/finished-goods/approval/analytics routes may compose views over those resources; confirm each component’s actual query rather than assuming a dedicated API.',
    ],
    permissions: [
      'The API context can derive tenantId from a bearer token. Check each FIZ procedure for requireAuth/requireTenant; the shared CRUD helper does not enforce either guard itself.',
      'The schema’s GlobalRole values do not by themselves establish which role may approve or edit FIZ records; procedure authorization is authoritative.',
      'Industrial-zone material and customs records should be entered and approved by personnel with organization-granted authority.',
    ],
    relatedDomains: [
      { domain: 'fcz', label: 'FCZ walkthrough', href: '/fcz/walkthrough', relationship: 'FIZ production output and FCZ trade flows may intersect.' },
      { domain: 'wms', label: 'WMS walkthrough', href: '/wms/walkthrough', relationship: 'WMS tracks the warehouse inventory and movement that support production activity.' },
      { domain: 'bonded', label: 'Bonded walkthrough', href: '/bonded/walkthrough', relationship: 'Bonded controls provide context for goods held under customs control.' },
    ],
    troubleshooting: [
      { symptom: 'A FIZ list is empty.', check: 'Confirm the active tenant and seed the matching resource using the corresponding create flow.', location: 'app/(app-walkthroughs)/fiz/_components/FizRouteViews.tsx and backend/src/fiz/' },
      { symptom: 'An operator, machinery or production detail cannot load.', check: 'Use an ID from the corresponding list and check for a byId query on that resource router.', location: 'app/(app-walkthroughs)/fiz/' },
      { symptom: 'Metrics do not match production records.', check: 'Check which resources the analytics component queries and compare its tenant scope and reporting interval.', location: 'app/(app-walkthroughs)/fiz/analytics/' },
    ],
    whereThingsLive: [
      { concept: 'FIZ route pages', path: 'app/(app-walkthroughs)/fiz/' },
      { concept: 'FIZ route queries and mutations', path: 'app/(app-walkthroughs)/fiz/_components/FizRouteViews.tsx' },
      { concept: 'FIZ backend modules', path: 'backend/src/fiz/' },
      { concept: 'Router registration', path: 'backend/src/trpc/trpc.router.ts' },
    ],
    lastUpdated: '2026-10-12',
  },
  integration: {
    domain: 'integration',
    title: 'Integrations',
    summary:
      'Integration routes group ERP, WMS, TMS, customs, EDI/ASYCUDA, FIZ-FCZ, webhook, auth, agent mesh and health surfaces. Several leaf pages explicitly state that their live data is not connected; these are status/design surfaces, not proof of active credentials, deliveries or synchronization.',
    audience: 'developer',
    prerequisites: [
      'Sign in to the tenant whose integrations you are reviewing.',
      'An integration needs an external endpoint/credential and environment configuration before it can exchange data; no secrets or connection should be inferred from a screen shell.',
      'Use test/sandbox endpoints and approved secret-management practice when validating a connector.',
    ],
    keyRoutes: [
      { label: 'Integration overview', href: '/integration', description: 'Browse integration domains and entry points.' },
      { label: 'ERP', href: '/integration/erp', description: 'Open ERP connector surfaces.' },
      { label: 'TMS', href: '/integration/tms', description: 'Open transport connector surfaces.' },
      { label: 'WMS', href: '/integration/wms', description: 'Open WMS integration surfaces.' },
      { label: 'EDI / ASYCUDA', href: '/integration/edi', description: 'Review EDI, segment and ASYCUDA screens.' },
      { label: 'Webhooks', href: '/integration/webhook', description: 'Open webhook delivery and subscription routes.' },
      { label: 'Health', href: '/integration/health', description: 'Open the integration health view.' },
    ],
    concepts: [
      { term: 'Connector', definition: 'An integration endpoint/configuration linking TradeOps with an external platform; it is operational only when configured and exercised.' },
      { term: 'EDI mapping', definition: 'A mapping between external message segments and the application’s data contract.' },
      { term: 'Webhook delivery', definition: 'A delivery attempt of an event to a subscribed endpoint; the delivery page explicitly states its data is not connected.' },
      { term: 'Secret', definition: 'Sensitive integration credential; manage only through an approved secret store and never paste into walkthrough content.' },
    ],
    workflows: [
      {
        title: 'Inspect a connector surface',
        purpose: 'Navigate to the relevant integration and verify the current connection state before relying on it.',
        steps: [
          { instruction: 'Open the integration overview and select the system involved.', href: '/integration', routeLabel: 'Integration overview' },
          { instruction: 'Review its route and confirm whether the page reports connected live data or an explicit unconnected status.', href: '/integration/erp', routeLabel: 'ERP' },
          { instruction: 'Use the health route as an overview, not as a connectivity guarantee when it has no live source.', href: '/integration/health', routeLabel: 'Health' },
        ],
      },
      {
        title: 'Review EDI configuration surfaces',
        purpose: 'Inspect the existing mapping and message layout routes; they may be scaffolds rather than persisted editors.',
        steps: [
          { instruction: 'Open EDI and select the ASYCUDA or mapping surface.', href: '/integration/edi', routeLabel: 'EDI' },
          { instruction: 'Inspect segment and mapping pages; verify persistence before changing production configuration.', href: '/integration/edi/mappings', routeLabel: 'Mappings' },
        ],
      },
      {
        title: 'Investigate webhooks',
        purpose: 'Use the route family to find the delivery/subscription surfaces while accounting for their current disconnected state.',
        steps: [
          { instruction: 'Open webhook overview.', href: '/integration/webhook', routeLabel: 'Webhooks' },
          { instruction: 'Review subscriptions and deliveries; the current pages identify their data as not connected.', href: '/integration/webhook/subscriptions', routeLabel: 'Subscriptions' },
          { instruction: 'Do not treat an empty table as proof of no deliveries until a live data source is connected.', href: '/integration/webhook/deliveries', routeLabel: 'Deliveries' },
        ],
      },
    ],
    dataSources: [
      'The backend mounts agentMesh, customs, edi, erp, fizFcz, tms, webhook and WMS external routers under the integration namespace.',
      'The integration route pages have no direct tRPC calls in this route tree; several leaf pages explicitly report that live data is not connected.',
      'Router registration is in backend/src/trpc/trpc.router.ts; integration implementation files are under backend/src/integration/.',
    ],
    permissions: [
      'The route pages do not call integration tRPC procedures directly. If a composed component later invokes one, inspect its applied middleware; shared CRUD handlers do not add authentication or role checks by themselves.',
      'Credentials and API keys are sensitive; do not expose them in logs, issue reports, or walkthrough content.',
      'Role enforcement belongs to the backend procedures. Confirm specific grants before editing connector settings or triggering external traffic.',
    ],
    relatedDomains: [
      { domain: 'settings', label: 'Settings walkthrough', href: '/settings/walkthrough', relationship: 'Settings exposes account and integration-setting navigation surfaces.' },
      { domain: 'wms', label: 'WMS walkthrough', href: '/wms/walkthrough', relationship: 'WMS is one of the connected-system domains represented here.' },
      { domain: 'trade-ops', label: 'Trade OPS walkthrough', href: '/trade-ops/walkthrough', relationship: 'Trade OPS contains customs, declaration and permit work that integrations may exchange.' },
    ],
    troubleshooting: [
      { symptom: 'Health grid or webhook tables are blank.', check: 'These pages currently pass empty collections or state that live data is unconnected; this is not evidence of zero system events.', location: 'app/(app-walkthroughs)/integration/health/ and webhook/' },
      { symptom: 'ERP/TMS/customs page shows an integration shell only.', check: 'The leaf page explicitly marks live data as unconnected; inspect the backend integration router for actual connection implementation.', location: 'app/(app-walkthroughs)/integration/ and backend/src/integration/' },
      { symptom: 'A credential cannot be used.', check: 'Verify approved secret provisioning and connector setup; do not paste secrets into app logs or walkthrough pages.', location: 'backend/src/integration/ and the organization’s secret-management configuration' },
    ],
    whereThingsLive: [
      { concept: 'Integration routes', path: 'app/(app-walkthroughs)/integration/' },
      { concept: 'Integration router modules', path: 'backend/src/integration/' },
      { concept: 'tRPC registration', path: 'backend/src/trpc/trpc.router.ts' },
      { concept: 'Explicit disconnected state: ERP', path: 'app/(app-walkthroughs)/integration/erp/' },
      { concept: 'Explicit disconnected state: webhooks', path: 'app/(app-walkthroughs)/integration/webhook/' },
    ],
    lastUpdated: '2026-10-12',
  },
  'order-management': {
    domain: 'order-management',
    title: 'Order management',
    summary:
      'Order Management coordinates purchase, manufacturing, fulfilment, customs, trading, transhipment and approval views. The route components use orderManagement procedures and, for some manufacturing/customs flows, FIZ and FCZ procedures; support varies by resource, so follow the specific list/create/detail route.',
    audience: 'operator',
    prerequisites: [
      'Sign in with the tenant that owns the orders and related inventory.',
      'Seed purchase, manufacturing, fulfilment, trading or transhipment records before expecting non-empty lists.',
      'Have supplier, SKU, quantities and required customs/production evidence available before submitting a form.',
    ],
    keyRoutes: [
      { label: 'Order overview', href: '/order-management', description: 'Entry point for order lifecycle areas.' },
      { label: 'Purchase orders', href: '/order-management/purchase', description: 'Browse purchase-order work.' },
      { label: 'Manufacturing', href: '/order-management/manufacturing', description: 'Browse manufacturing orders and production routes.' },
      { label: 'Fulfilment', href: '/order-management/fulfilment', description: 'Open fulfilment planning and queue screens.' },
      { label: 'Customs', href: '/order-management/customs', description: 'Review customs data routes used with orders.' },
      { label: 'Trading', href: '/order-management/trading', description: 'Browse trading orders and entrepot route.' },
      { label: 'Transhipment', href: '/order-management/transhipment', description: 'Browse transhipment and manifest routes.' },
      { label: 'Approvals', href: '/order-management/approvals', description: 'Review the approvals list, queue and escalation surfaces.' },
    ],
    concepts: [
      { term: 'Purchase order', definition: 'A supplier-facing request for goods or services; the purchase router provides list/detail/create operations used by the UI.' },
      { term: 'Manufacturing order', definition: 'An instruction to produce goods, with related BOM and production-input routes.' },
      { term: 'Fulfilment', definition: 'Planning and execution of work to satisfy demand, represented by planner, routing and queue surfaces.' },
      { term: 'Approval', definition: 'A human decision point represented by approval queue and escalation pages.' },
    ],
    workflows: [
      {
        title: 'Create and review a purchase order',
        purpose: 'Start a purchase record and inspect it through the order list/detail surface.',
        steps: [
          { instruction: 'Open purchase and review existing records.', href: '/order-management/purchase', routeLabel: 'Purchase orders' },
          { instruction: 'Create a purchase order with the required fields.', href: '/order-management/purchase/new', routeLabel: 'New purchase order' },
          { instruction: 'Return to the list and open the saved record for detail.', href: '/order-management/purchase', routeLabel: 'Purchase orders' },
        ],
      },
      {
        title: 'Plan manufacturing and fulfilment',
        purpose: 'Review manufacturing structure and route a fulfilment request through available screens.',
        steps: [
          { instruction: 'Review the manufacturing list and BOM route.', href: '/order-management/manufacturing', routeLabel: 'Manufacturing' },
          { instruction: 'Open the fulfilment planner and check routing/queue state.', href: '/order-management/fulfilment/planner', routeLabel: 'Fulfilment planner' },
          { instruction: 'Review production-input data in the manufacturing area.', href: '/order-management/manufacturing/production-input', routeLabel: 'Production inputs' },
        ],
      },
      {
        title: 'Process approvals and customs checks',
        purpose: 'Review pending approval work and the customs context that may block order execution.',
        steps: [
          { instruction: 'Open the approval queue and review escalation items.', href: '/order-management/approvals/queue', routeLabel: 'Approval queue' },
          { instruction: 'Review customs declarations and permit routes before execution.', href: '/order-management/customs/declarations', routeLabel: 'Customs declarations' },
        ],
      },
    ],
    dataSources: [
      'The UI uses orderManagement.approvals, customs, fulfilment, manufacturing, purchase, trading and transhipment tRPC namespaces.',
      'Manufacturing production-input routes also query fiz.production; order flows may create FCZ/FIZ records through their respective procedures.',
      'Router registration is in backend/src/trpc/trpc.router.ts; domain modules live under backend/src/order-management/, backend/src/fiz/ and backend/src/fcz/.',
    ],
    permissions: [
      'The API context can derive tenantId from a bearer token. Check each order procedure for applied authentication, tenant and role guards; shared CRUD handlers do not add these guards themselves.',
      'Approvals, order updates and customs actions may have stricter role gates in their backend procedures; the route structure alone does not grant authority.',
      'GlobalRole values are defined in prisma/schema.prisma; confirm the exact permission with the relevant procedure and tenant administrator.',
    ],
    relatedDomains: [
      { domain: 'trade-ops', label: 'Trade OPS walkthrough', href: '/trade-ops/walkthrough', relationship: 'Trade OPS handles declarations, clearance and permits linked to order execution.' },
      { domain: 'wms', label: 'WMS walkthrough', href: '/wms/walkthrough', relationship: 'Warehouse receipt, inventory and dispatch support order fulfilment.' },
      { domain: 'fiz', label: 'FIZ walkthrough', href: '/fiz/walkthrough', relationship: 'Manufacturing orders connect to FIZ production inputs and wastage.' },
    ],
    troubleshooting: [
      { symptom: 'A list is empty or an order detail is unavailable.', check: 'Confirm the tenant, seed the matching resource, and use the ID from its own list.', location: 'app/(app-walkthroughs)/order-management/' },
      { symptom: 'Create form reports an error.', check: 'Check required form fields and the matching procedure input schema; do not substitute a no-op submit handler.', location: 'backend/src/order-management/ and app/(app-walkthroughs)/order-management/' },
      { symptom: 'Approval cannot be completed.', check: 'Check approval status and procedure-level role authorization; request an authorized approver if needed.', location: 'backend/src/order-management/approvals/ and backend/src/trpc/trpc.middleware.ts' },
    ],
    whereThingsLive: [
      { concept: 'Order-management routes', path: 'app/(app-walkthroughs)/order-management/' },
      { concept: 'Order backend modules', path: 'backend/src/order-management/' },
      { concept: 'Order router registration', path: 'backend/src/trpc/trpc.router.ts' },
      { concept: 'FIZ procedures', path: 'backend/src/fiz/' },
      { concept: 'FCZ procedures', path: 'backend/src/fcz/' },
    ],
    lastUpdated: '2026-10-12',
  },
  search: {
    domain: 'search',
    title: 'Search',
    summary:
      'Search provides a workspace for locating cargo and trade declaration records. The current screen searches the existing cargo.main and tradeOps.declarations list APIs; it is not a global full-text search across every domain.',
    audience: 'mixed',
    prerequisites: [
      'Sign in with access to the tenant containing the records.',
      'Cargo and declaration records must already exist; search only returns data available to the connected list APIs.',
      'Use meaningful references or description terms supported by the current search workspace.',
    ],
    keyRoutes: [
      { label: 'Search workspace', href: '/search', description: 'Search the connected cargo and declaration data sets.' },
      { label: 'Cargo', href: '/cargo', description: 'Open cargo records after locating a match.' },
      { label: 'Declarations', href: '/trade-ops/declarations', description: 'Open the trade declaration list.' },
      { label: 'Order management', href: '/order-management', description: 'Continue operational investigation in order routes.' },
    ],
    concepts: [
      { term: 'Search scope', definition: 'The current implementation searches the cargo and declaration list results, not every application table.' },
      { term: 'Tenant scope', definition: 'The tRPC context may contain a tenant ID; the source procedures must apply the intended tenant filter and guards.' },
      { term: 'Reference', definition: 'An operational identifier that can help locate a cargo or declaration record.' },
    ],
    workflows: [
      {
        title: 'Find a cargo or declaration',
        purpose: 'Search the connected record types and continue from the appropriate domain list.',
        steps: [
          { instruction: 'Open the search workspace and enter a reference or supported text term.', href: '/search', routeLabel: 'Search workspace' },
          { instruction: 'Open the cargo route when the result is a cargo record.', href: '/cargo', routeLabel: 'Cargo' },
          { instruction: 'Open the declarations route when the result is a customs declaration.', href: '/trade-ops/declarations', routeLabel: 'Declarations' },
        ],
      },
      {
        title: 'Investigate a missing result',
        purpose: 'Check whether the record exists in the actual source list before concluding that search failed.',
        steps: [
          { instruction: 'Check the cargo list for the reference.', href: '/cargo', routeLabel: 'Cargo' },
          { instruction: 'Check the declaration list for the reference.', href: '/trade-ops/declarations', routeLabel: 'Declarations' },
          { instruction: 'Return to search and retry using the exact reference.', href: '/search', routeLabel: 'Search workspace' },
        ],
      },
    ],
    dataSources: [
      'SearchWorkspace queries trpc.cargo.main.list and trpc.tradeOps.declarations.list, with a bounded result request.',
      'There is no global search endpoint used by this page; records outside those two sources are not covered.',
      'tRPC routers are registered in backend/src/trpc/trpc.router.ts and are tenant-aware through the request context.',
    ],
    permissions: [
      'The search screen queries cargo and declaration procedures; the API context may derive tenantId from a bearer token, but the shared CRUD helper does not itself require authentication or non-null tenant context.',
      'The screen does not create additional access control. Confirm the specific source procedures apply the intended tenant and role guards.',
      'GlobalRole values are defined in prisma/schema.prisma; there is no separate search role in the route.',
    ],
    relatedDomains: [
      { domain: 'cargo', label: 'Cargo walkthrough', href: '/cargo/walkthrough', relationship: 'Cargo is one of the two live data sources used by search.' },
      { domain: 'trade-ops', label: 'Trade OPS walkthrough', href: '/trade-ops/walkthrough', relationship: 'Trade declarations are the other live search source.' },
      { domain: 'order-management', label: 'Order Management walkthrough', href: '/order-management/walkthrough', relationship: 'Order operations are a related next step after identifying a record.' },
    ],
    troubleshooting: [
      { symptom: 'A record cannot be found.', check: 'Confirm it exists in the cargo or declaration source list, belongs to the active tenant, and falls within the list query limit.', location: 'app/(app-walkthroughs)/search/SearchWorkspace.tsx' },
      { symptom: 'Results from other domains are absent.', check: 'The current page is not global search; only cargo.main and tradeOps.declarations are queried.', location: 'app/(app-walkthroughs)/search/SearchWorkspace.tsx' },
      { symptom: 'One category returns an API error.', check: 'Check the corresponding source router and tenant authorization independently.', location: 'backend/src/cargo/cargo.router.ts and backend/src/trade-ops/declarations/' },
    ],
    whereThingsLive: [
      { concept: 'Search route', path: 'app/(app-walkthroughs)/search/page.tsx' },
      { concept: 'Search query implementation', path: 'app/(app-walkthroughs)/search/SearchWorkspace.tsx' },
      { concept: 'Cargo source API', path: 'backend/src/cargo/cargo.router.ts' },
      { concept: 'Declaration source API', path: 'backend/src/trade-ops/declarations/' },
      { concept: 'Router registration', path: 'backend/src/trpc/trpc.router.ts' },
    ],
    lastUpdated: '2026-10-12',
  },
  settings: {
    domain: 'settings',
    title: 'Settings',
    summary:
      'Settings groups profile, organization, notifications, security, API key and integration preference routes. The live account context comes from auth.me; the other settings routes are navigational surfaces and should be treated as unavailable/scaffolded unless a real save/API operation is shown.',
    audience: 'mixed',
    prerequisites: [
      'Sign in; profile/account context is loaded using the authenticated auth.me query.',
      'Organization settings depend on tenant context and any role checks enforced by the backend.',
      'Do not enter credentials, API keys or MFA recovery material into an unsupported form or issue report.',
    ],
    keyRoutes: [
      { label: 'Settings overview', href: '/settings', description: 'Open the settings landing page.' },
      { label: 'Profile', href: '/settings/profile', description: 'Review the profile route and account context.' },
      { label: 'Organization', href: '/settings/organization', description: 'Open organization/tenant settings.' },
      { label: 'Security', href: '/settings/security', description: 'Open security and authentication settings.' },
      { label: 'Notifications', href: '/settings/notifications', description: 'Open notification preference routes.' },
      { label: 'API keys', href: '/settings/api-keys', description: 'Open API key management surface.' },
      { label: 'Integrations', href: '/settings/integrations', description: 'Link to integration operations.' },
    ],
    concepts: [
      { term: 'Account context', definition: 'The current user’s identity, role and tenant returned by auth.me.' },
      { term: 'Tenant preference', definition: 'A setting that applies to an organization/tenant rather than only one user; require tenant-admin authority.' },
      { term: 'Credential', definition: 'A secret such as an API key or token; only manage through a working, approved secure operation.' },
    ],
    workflows: [
      {
        title: 'Check account context',
        purpose: 'Use the profile page to verify who is signed in and which tenant is active.',
        steps: [
          { instruction: 'Open settings overview.', href: '/settings', routeLabel: 'Settings overview' },
          { instruction: 'Open profile and check the displayed account context.', href: '/settings/profile', routeLabel: 'Profile' },
        ],
      },
      {
        title: 'Review security surfaces',
        purpose: 'Inspect security and key-management routes without assuming an unsupported save action works.',
        steps: [
          { instruction: 'Open the security route and review its current controls/status.', href: '/settings/security', routeLabel: 'Security' },
          { instruction: 'Open API keys only to inspect the implemented management surface; do not expose secret values.', href: '/settings/api-keys', routeLabel: 'API keys' },
        ],
      },
      {
        title: 'Navigate organization and integration settings',
        purpose: 'Distinguish account settings from tenant-wide and connector operations.',
        steps: [
          { instruction: 'Open organization settings and verify tenant scope and role access.', href: '/settings/organization', routeLabel: 'Organization' },
          { instruction: 'Use integration navigation for connector operations; the settings link itself does not configure credentials.', href: '/settings/integrations', routeLabel: 'Integrations' },
        ],
      },
    ],
    dataSources: [
      'The settings route components query trpc.auth.me for authenticated identity/tenant context.',
      'Profile updates, notification preferences, password/MFA/session management, API-key management and integration credentials are not confirmed as wired by these routes.',
      'Authentication router registration and middleware are in backend/src/auth/ and backend/src/trpc/.',
    ],
    permissions: [
      'auth.me requires an authenticated session for account context.',
      'Tenant-wide changes should be restricted to authorized tenant administrators; the route group does not assert that the UI enforces each operation.',
      'Never share or log API keys, passwords, MFA secrets or bearer tokens.',
    ],
    relatedDomains: [
      { domain: 'admin', label: 'Administration walkthrough', href: '/admin/walkthrough', relationship: 'Administration handles broader user and tenant management.' },
      { domain: 'integration', label: 'Integrations walkthrough', href: '/integration/walkthrough', relationship: 'Integration routes contain connector and credential-related surfaces.' },
      { domain: 'search', label: 'Search walkthrough', href: '/search/walkthrough', relationship: 'Search is a user-facing app area accessible from the shared navigation.' },
    ],
    troubleshooting: [
      { symptom: 'Profile or tenant context is missing.', check: 'Verify authentication and the auth.me query result.', location: 'app/(app-walkthroughs)/settings/ and backend/src/auth/' },
      { symptom: 'A settings form has no effect.', check: 'The route is not evidence of a save API; check for a real mutation and report unsupported behavior as a gap.', location: 'app/(app-walkthroughs)/settings/' },
      { symptom: 'A settings page is forbidden.', check: 'Confirm tenant context and backend role middleware; do not infer access from a visible link.', location: 'backend/src/trpc/trpc.middleware.ts' },
    ],
    whereThingsLive: [
      { concept: 'Settings route pages', path: 'app/(app-walkthroughs)/settings/' },
      { concept: 'Account context query', path: 'app/(app-walkthroughs)/settings/' },
      { concept: 'Authentication router', path: 'backend/src/auth/' },
      { concept: 'Role and tenant context middleware', path: 'backend/src/trpc/' },
    ],
    lastUpdated: '2026-10-12',
  },
  'trade-ops': {
    domain: 'trade-ops',
    title: 'Trade operations',
    summary:
      'Trade OPS organizes declarations, clearance, compliance, classification, duty, permits, documents, trade finance and analytics. Its UI uses the tradeOps declaration and trade-finance APIs and mutations for selected workflows; each leaf screen should be checked independently before assuming it submits to a backend.',
    audience: 'broker',
    prerequisites: [
      'Sign in with tenant context and appropriate authorization for customs-related records.',
      'Have accurate shipment, party, tariff, origin, value and supporting-document data ready for declarations.',
      'Seed declarations, permits or finance records through their supported forms before expecting list results.',
    ],
    keyRoutes: [
      { label: 'Trade OPS overview', href: '/trade-ops', description: 'Entry point for trade operations.' },
      { label: 'Declarations', href: '/trade-ops/declarations', description: 'Browse declarations and start a new declaration.' },
      { label: 'Clearance', href: '/trade-ops/clearance', description: 'Review clearance, detention and inspection routes.' },
      { label: 'Compliance', href: '/trade-ops/compliance', description: 'Review audit, origin, screening and valuation routes.' },
      { label: 'HS classification', href: '/trade-ops/hs-classification', description: 'Open classification, tree and rulings routes.' },
      { label: 'Permits', href: '/trade-ops/permits', description: 'Browse permits and create a permit record.' },
      { label: 'Documents', href: '/trade-ops/documents', description: 'Browse and upload trade documents.' },
      { label: 'Trade finance', href: '/trade-ops/trade-finance', description: 'Review trade finance and related routes.' },
    ],
    concepts: [
      { term: 'Declaration', definition: 'A structured customs filing record; its accuracy depends on source documentation and the applicable form/jurisdiction.' },
      { term: 'HS classification', definition: 'Assignment of a goods classification code; verify against authoritative tariff and ruling sources.' },
      { term: 'Clearance', definition: 'The customs review/release process, including inspection and possible detention states.' },
      { term: 'Trade finance', definition: 'Financial records and workflows such as refunds, drawback and letters of credit represented in this domain.' },
    ],
    workflows: [
      {
        title: 'Prepare a declaration',
        purpose: 'Use declaration entry and supporting reference screens before customs review.',
        steps: [
          { instruction: 'Open declarations and review existing records.', href: '/trade-ops/declarations', routeLabel: 'Declarations' },
          { instruction: 'Start a new declaration and enter verified data from the source documents.', href: '/trade-ops/declarations/new', routeLabel: 'New declaration' },
          { instruction: 'Use classification and permit routes to check related records where applicable.', href: '/trade-ops/hs-classification', routeLabel: 'HS classification' },
        ],
      },
      {
        title: 'Track clearance and compliance',
        purpose: 'Locate the operational state and supporting compliance evidence.',
        steps: [
          { instruction: 'Open clearance and review inspection or detention routes as relevant.', href: '/trade-ops/clearance', routeLabel: 'Clearance' },
          { instruction: 'Review compliance screening, origin, valuation and audit pages.', href: '/trade-ops/compliance', routeLabel: 'Compliance' },
          { instruction: 'Open documents to locate the evidence associated with the case.', href: '/trade-ops/documents', routeLabel: 'Documents' },
        ],
      },
      {
        title: 'Review permits or finance records',
        purpose: 'Use the relevant route family after confirming the trade transaction reference.',
        steps: [
          { instruction: 'Review or create the permit record.', href: '/trade-ops/permits', routeLabel: 'Permits' },
          { instruction: 'Open trade finance to review refunds, drawback or letter-of-credit routes.', href: '/trade-ops/trade-finance', routeLabel: 'Trade finance' },
        ],
      },
    ],
    dataSources: [
      'The route tree calls trpc.tradeOps.declarations.list and trpc.tradeOps.tradeFinance.list; selected clearance/compliance forms call their matching tradeOps create mutations.',
      'Backend router namespaces include analytics, clearance, compliance, declarations, documents, duty, hsClassification, hsCodeRulings, permits and tradeFinance.',
      'Router registration lives in backend/src/trpc/trpc.router.ts; implementation modules are under backend/src/trade-ops/.',
    ],
    permissions: [
      'The API context can derive tenantId from a bearer token. Check each trade procedure for applied authentication, tenant and role guards; the shared CRUD helper does not add these guards itself.',
      'The backend may apply role checks to filing, approval or financial actions; the UI role names are not a substitute for procedure authorization.',
      'Only authorized customs brokers/operators should prepare or submit regulated declarations; this walkthrough is operational guidance, not legal advice.',
    ],
    relatedDomains: [
      { domain: 'order-management', label: 'Order Management walkthrough', href: '/order-management/walkthrough', relationship: 'Order data may supply commercial facts required for trade declarations.' },
      { domain: 'integration', label: 'Integrations walkthrough', href: '/integration/walkthrough', relationship: 'EDI, customs and ERP connectors can exchange trade data when configured.' },
      { domain: 'cargo', label: 'Cargo walkthrough', href: '/cargo/walkthrough', relationship: 'Cargo records provide shipment details used in declarations.' },
    ],
    troubleshooting: [
      { symptom: 'Declaration list is empty.', check: 'Confirm tenant scope and whether a declaration record exists; this list uses tradeOps.declarations.', location: 'app/(app-walkthroughs)/trade-ops/declarations/ and backend/src/trade-ops/declarations/' },
      { symptom: 'A form submission fails.', check: 'Validate required reference/type fields against the corresponding procedure schema and inspect the returned API error.', location: 'backend/src/trade-ops/ and app/(app-walkthroughs)/trade-ops/' },
      { symptom: 'Classification or duty result is uncertain.', check: 'Verify source tariff/version, jurisdiction and evidence; do not treat a UI estimate as an official ruling.', location: 'app/(app-walkthroughs)/trade-ops/hs-classification/ and duty-calculator/' },
    ],
    whereThingsLive: [
      { concept: 'Trade OPS page routes', path: 'app/(app-walkthroughs)/trade-ops/' },
      { concept: 'Trade OPS API modules', path: 'backend/src/trade-ops/' },
      { concept: 'tRPC router registration', path: 'backend/src/trpc/trpc.router.ts' },
      { concept: 'Role and tenant middleware', path: 'backend/src/trpc/trpc.middleware.ts' },
    ],
    lastUpdated: '2026-10-12',
  },
  wms: {
    domain: 'wms',
    title: 'Warehouse management (WMS)',
    summary:
      'WMS covers gate entry, inbound receipt and quality control, inventory, movement, outbound picking/packing/dispatch, slotting, bonded stock, exemptions, forecasting and logistics. Its route family maps to dedicated wms tRPC routers; tenant data and procedure authorization determine what an operator can see or change.',
    audience: 'operator',
    prerequisites: [
      'Sign in with an authorized tenant account and select the warehouse/zone associated with the work.',
      'Seed or create an inbound receipt and inventory record before expecting non-empty stock views.',
      'Have an ASN, item/lot identifiers, quantity, location and quality disposition available for inbound operations.',
    ],
    keyRoutes: [
      { label: 'WMS overview', href: '/wms', description: 'Entry point for warehouse operations.' },
      { label: 'Inbound', href: '/wms/inbound', description: 'Browse inbound receipts and related routes.' },
      { label: 'New inbound receipt', href: '/wms/inbound/new', description: 'Create an inbound receipt record.' },
      { label: 'Inventory', href: '/wms/inventory', description: 'Browse inventory and item detail routes.' },
      { label: 'Outbound', href: '/wms/outbound', description: 'Review picking, packing and dispatch routes.' },
      { label: 'Movement', href: '/wms/movement', description: 'Browse and create warehouse movements.' },
      { label: 'Gate', href: '/wms/gate', description: 'Review gate, passes, queue and weighbridge routes.' },
      { label: 'Bonded ledger', href: '/wms/bonded', description: 'Open bonded inventory and ledger routes.' },
      { label: 'Slotting', href: '/wms/slotting', description: 'Review slotting and allocation routes.' },
    ],
    concepts: [
      { term: 'ASN', definition: 'Advance Shipment Notice used to prepare an inbound receipt.' },
      { term: 'QC disposition', definition: 'A quality-control outcome that determines whether received goods can proceed to available inventory.' },
      { term: 'Slot', definition: 'A warehouse storage location used for receiving, movement and picking.' },
      { term: 'Pick/pack/dispatch', definition: 'Outbound stages for selecting stock, preparing it for shipment and recording dispatch.' },
    ],
    workflows: [
      {
        title: 'Receive goods',
        purpose: 'Record an inbound shipment, verify quality, and confirm inventory availability.',
        steps: [
          { instruction: 'Review or create the inbound receipt using the source ASN and shipment reference.', href: '/wms/inbound/new', routeLabel: 'New inbound receipt' },
          { instruction: 'Open inbound QC and record or review the quality disposition.', href: '/wms/inbound/qc', routeLabel: 'Inbound QC' },
          { instruction: 'Check the inventory list and open the relevant inventory item.', href: '/wms/inventory', routeLabel: 'Inventory' },
        ],
      },
      {
        title: 'Fulfil an outbound request',
        purpose: 'Move a request through picking, packing and dispatch screens.',
        steps: [
          { instruction: 'Open outbound and review the current queue.', href: '/wms/outbound', routeLabel: 'Outbound' },
          { instruction: 'Use pick and pack routes to prepare the items.', href: '/wms/outbound/pick', routeLabel: 'Pick' },
          { instruction: 'Open dispatch to record or review the shipment handoff.', href: '/wms/outbound/dispatch', routeLabel: 'Dispatch' },
        ],
      },
      {
        title: 'Investigate a stock movement',
        purpose: 'Review movement records and use the tracker or exceptions view to diagnose discrepancies.',
        steps: [
          { instruction: 'Open the movement list and create a movement only when authorized.', href: '/wms/movement', routeLabel: 'Movement' },
          { instruction: 'Inspect tracker and exception routes for the relevant movement.', href: '/wms/movement/tracker', routeLabel: 'Movement tracker' },
          { instruction: 'Verify resulting stock in the inventory view.', href: '/wms/inventory', routeLabel: 'Inventory' },
        ],
      },
    ],
    dataSources: [
      'The backend mounts wms bonded, exemption, forecasting, gate, inbound, inventory, movement, outbound and slotting routers.',
      'WMS route pages use the typed trpc.wms namespace through their route components; the inbound example renders the WmsCrudSurface for inbound records.',
      'Router registration is in backend/src/trpc/trpc.router.ts; implementation files are under backend/src/wms/.',
    ],
    permissions: [
      'The API context can derive tenantId from a bearer token. Check each WMS procedure for applied authentication, tenant and role guards; the shared CRUD helper does not add these guards itself.',
      'The GlobalRole enum includes WAREHOUSE_STAFF and other roles, but page visibility does not prove authorization for a particular movement or adjustment.',
      'Follow procedure-level role restrictions for stock adjustments, bonded movements, write-offs and approvals.',
    ],
    relatedDomains: [
      { domain: 'cargo', label: 'Cargo walkthrough', href: '/cargo/walkthrough', relationship: 'Cargo records provide shipment context for receipt and dispatch.' },
      { domain: 'bonded', label: 'Bonded walkthrough', href: '/bonded/walkthrough', relationship: 'The WMS bonded ledger implements the bonded operations data surface.' },
      { domain: 'order-management', label: 'Order Management walkthrough', href: '/order-management/walkthrough', relationship: 'Order fulfilment creates demand for warehouse picking and dispatch.' },
    ],
    troubleshooting: [
      { symptom: 'Inventory is empty after an inbound receipt.', check: 'Confirm QC disposition, receipt state and tenant/warehouse scope before expecting available stock.', location: 'app/(app-walkthroughs)/wms/inbound/ and inventory/' },
      { symptom: 'A movement or adjustment is rejected.', check: 'Check source/destination locations, quantity, current inventory and procedure-level role authorization.', location: 'backend/src/wms/movement/ and backend/src/trpc/trpc.middleware.ts' },
      { symptom: 'A detail record cannot load.', check: 'Open detail from the matching resource list and ensure the identifier belongs to the active tenant.', location: 'app/(app-walkthroughs)/wms/inventory/[id]/ and inbound/[id]/' },
    ],
    whereThingsLive: [
      { concept: 'WMS route tree', path: 'app/(app-walkthroughs)/wms/' },
      { concept: 'Inbound receipt surface', path: 'app/(app-walkthroughs)/wms/inbound/new/page.tsx' },
      { concept: 'WMS backend modules', path: 'backend/src/wms/' },
      { concept: 'WMS router registration', path: 'backend/src/trpc/trpc.router.ts' },
    ],
    lastUpdated: '2026-10-12',
  },
} satisfies Record<WalkthroughDomain, WalkthroughSpec>;
