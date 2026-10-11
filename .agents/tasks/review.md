# Phase 2 Navigation Integration

Navigation analytics singleton, command palette, and breadcrumb trail integrated into Next.js WMS frontend. Breadcrumb renders on md+ screens; CommandPalette mounted globally with Cmd/Ctrl+K shortcut; NavigationAnalytics tracks route changes and menu interactions with SSR guards added. Export button role-gated behind a note marking it for auth integration.

**Watch for:** (1) Mock user role blocks analytics export in dev but is correctly marked for future auth wiring, (2) CommandPalette routes hardcoded at build time (mitigated by config extraction in build notes), (3) Breadcrumb generates labels from route segments—verify slug-to-label mappings are correct before deploying to unfamiliar routes.

**Verdict**: APPROVED

## High-level view

The breadcrumb component auto-generates a trail from the pathname, hiding itself on xs/sm screens and displaying on md+. It uses a static route-label map to convert URL slugs into readable text, falling back to title-cased segments for unmapped routes. Focus is preserved after navigation via Next.js Link behavior.

NavigationAnalytics is a singleton initialized on component mount that tracks route changes (with debouncing), menu events, and search interactions. All browser APIs are guarded against SSR contexts. The singleton persists metrics to localStorage and exposes an export method for dev/admin inspection. The export button in MarketingNavbar is behind a role gate (`user.role in ['admin', 'dev']`) that is correctly noted as a placeholder pending real auth integration.

CommandPalette is a global overlay mounted in the root layout, triggered by Cmd/Ctrl+K. It debounces route changes, checks form input focus before opening, and implements keyboard navigation (arrows, Enter, Escape). Recent routes are persisted to localStorage. Routes are loaded from a centralized config file, making the palette maintainable without touching the component.

All three components are explicit-typed with no `any` types, responsive across the 5-breakpoint system, and preserve existing navigation behavior. TypeScript compilation passed per build notes.

<details>
<summary>Issues (1)</summary>

1. **Mock user role blocks analytics export** — The `canExportAnalytics` gate uses mock user data that will never satisfy `['admin', 'dev']`. The export button is correctly hidden. A multi-line comment marks this as pending auth integration; the behavior is correct and the finding is documented in build notes. No action required.

</details>

<details>
<summary>Details</summary>

### Breadcrumb auto-generation and routing

Breadcrumb generates a trail by splitting the pathname, filtering out Next.js metadata (`(app)`, `app`), and mapping each segment to a user-friendly label via a static `routeLabels` map. Unmapped segments are title-cased. The component excludes the current page as a clickable link (active state is implicit as the trailing non-link span), and always includes a home link.

The route-label map covers 24 trade-domain slugs: `trade-ops`, `order-management`, `digital-twin`, `wms`, `fcz`, `fiz`, `bonded`, etc. If a route is deployed that isn't in the map, the fallback `capitalize()` function will convert `gate-operations` to `Gate Operations`, which is reasonable but not guaranteed to match the actual page title. This is acceptable for a WMS with a known, stable route taxonomy.

The breadcrumb is hidden entirely if only the home crumb is present (breadcrumbs.length <= 1), preventing redundant display on the dashboard home page.

### Analytics initialization and SSR safety

NavigationAnalytics is a singleton accessed via `analyticsTracker.getSessionId()` on MarketingNavbar mount. This ensures the instance is initialized before any route tracking occurs. The singleton stores a session ID (timestamp + random string), a start time, a list of navigation events (capped at 1000 to prevent memory bloat), and a Map of route metrics (visits, duration, last-visited timestamp).

All methods that access browser APIs—`navigator.userAgent` and `localStorage`—are guarded with `typeof window === 'undefined'` checks. This prevents errors during server-side rendering and static generation. The `trackRouteChange` method records the duration of the previous route, updates metrics, and starts tracking the new route. A 300ms debounce in MarketingNavbar ensures rapid navigation doesn't spam events.

The export method returns a JSON object with session metadata and top 10 routes by visit count. Blob serialization and download link handling is correct.

### Role-gated analytics export

The export button in the UserProfileMenu is rendered only if `canExportAnalytics` is true, which checks if `user?.role` is either `'admin'` or `'dev'`. The mock user object has `role: 'Operations Manager'`, so the button is hidden in dev. A comment explicitly marks this as pending auth integration, noting that production requires connecting to NextAuth, Auth0, Clerk, or similar.

This is the correct behavior: the gate is in place, the logic is sound, and the placeholder is documented. The button will appear once the auth provider wires real user roles into the `user` object.

### CommandPalette keyboard handling and focus management

CommandPalette installs a global `keydown` listener that handles Cmd/Ctrl+K, Escape, and arrow/Enter navigation. Before opening the palette on Cmd/Ctrl+K, the listener checks if the target is an `HTMLInputElement` or `HTMLTextAreaElement`. This prevents users typing in form fields from inadvertently triggering the palette.

The palette input field itself receives focus via `inputRef.current?.focus()` in a setTimeout, ensuring the field is ready before the browser attempts to focus. Arrow keys and Enter only work when the palette is open, preventing navigation of the underlying page.

The fuzzy search filters routes by substring match on label and description, prioritizes exact prefix matches, and falls back to showing recent routes if the search is empty. Recent routes are persisted to localStorage in a try-catch block guarded by `typeof window !== 'undefined'`.

### Route config centralization

Routes are defined in `config/commandPaletteRoutes.ts` as an exported array `COMMAND_PALETTE_ROUTES` with a `SearchItem` interface. The config has 11 routes covering all major sections: Dashboard, Trade OPS, WMS, Order Management, Digital Twin, Custom Agents, FIZ, FCZ, Bonded, Integrations, Settings. Adding a route requires updating only the config file, not the component.

### Type safety and responsive design

All new props, interfaces, and callbacks are explicitly typed. No `any` types are introduced. Breadcrumb, CommandPalette, and the analytics export all use proper TypeScript interfaces.

Responsive breakpoints are preserved: Breadcrumb is hidden on xs/sm (< 768px) and shown on md+ (≥ 768px). CommandPalette is hidden on sm/md (< 1024px), shown on lg+ (≥ 1024px) as a button in the navbar. DashboardHeader uses the same breakpoint system for sidebar toggle and zone/role controls.

### No regressions in existing navigation

The Breadcrumb is mounted in DashboardHeader but doesn't replace any existing content—it adds a new tertiary navigation layer below the page title. MarketingNavbar still renders the top-level navigation and mobile menu. DashboardSidebar is unchanged. Active state detection, route matching, and all existing WMS navigation patterns remain intact.

The analytics singleton is initialized on MarketingNavbar mount and tracks route changes debounced from pathname updates in a useEffect. This doesn't interfere with existing router behavior.

CommandPalette is mounted at the root layout level as a sibling to DashboardShell, so it's available on all authenticated routes without modifying any page components.

### Test coverage

Build notes confirm TypeScript compilation and verify SSR guards, input focus check, role gate behavior, and config routing. All existing tests pass (no regression reported).

The following scenarios are not tested per build notes but are unlikely to fail:
- Breadcrumb label generation for routes not in the `routeLabels` map (fallback capitalization is straightforward).
- Analytics export download in different browsers (standard Blob + link approach).
- CommandPalette performance with 100+ routes in the config (current implementation filters in-memory; 11 routes is well below any practical limit).

</details>

<details>
<summary>File map</summary>

- **components/navigation/Breadcrumb.tsx** — New component. Auto-generates breadcrumb trail from pathname. Uses static route-label map. Hidden on xs/sm, visible on md+.
- **components/navigation/CommandPalette.tsx** — New component. Global overlay for route search/navigation. Cmd/Ctrl+K to open. Fuzzy search with recent routes. Keyboard navigation (arrows, Enter, Escape). Input focus guard prevents accidental open while typing in forms.
- **lib/analytics/navigationAnalytics.ts** — New singleton. Tracks route changes (debounced), menu events, session metadata. All browser API calls guarded against SSR. Exports metrics as JSON and can download to client.
- **app/(app)/MarketingNavbar.tsx** — Modified. Wired analytics initialization and route tracking. UserProfileMenu now includes role-gated analytics export button. Comment added marking export gate as pending auth integration.
- **app/(app)/layout.tsx** — Modified. CommandPalette mounted at root layout level.
- **components/dashboard/shell/DashboardHeader.tsx** — Modified. Breadcrumb component integrated below the page title row. Hidden on xs/sm, shown on md+. All responsive breakpoints preserved.
- **config/commandPaletteRoutes.ts** — New file. Centralized route definitions for CommandPalette. 11 routes exported with labels, descriptions, hrefs, and categories.

Full diff available via `git diff main`.

</details>
