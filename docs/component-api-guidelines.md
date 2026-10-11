# Component API Guidelines

## 1. Data access

- All server-side data access goes through tRPC procedures implemented by the NestJS backend and represented by the frontend type in `lib/trpc/router.ts`.
- Client components use `trpc.<router>.<procedure>.useQuery()` / `.useMutation()` from `@/lib/trpc` (re-exported via `@/providers/TRPCProvider`).
- Never call `db` (Prisma) directly from a component or page. All DB access is in the NestJS backend.
- The current client stores the bearer token in `localStorage` under `cfs.access_token` and injects it in `TRPCProvider`. This is a transport detail, not a route protection mechanism. The current NextAuth credential authorizer is a stub and app routes do not have a shared server session guard; treat authentication/authorization as an open blocker until fixed.

```ts
// Correct
import { trpc } from '@/lib/trpc';
const { data, isLoading, error } = trpc.wms.inventory.list.useQuery({ take: 20 });

// Wrong — never do this in a component
import { db } from '@/lib/db';
const items = await db.inventoryItem.findMany();
```

## 2. Loading / empty / error / forbidden states

Every data-connected component must handle all four states:

```tsx
if (isLoading) return <LoadingSkeleton />;
if (error?.data?.code === 'UNAUTHORIZED') return <PermissionDenied />;
if (error) return <ErrorState message={error.message} onRetry={() => void refetch()} />;
if (!data || data.length === 0) return <EmptyState title="No items" />;
```

Import from `@/components/dashboard/states`:
- `LoadingSkeleton` — animated skeleton
- `ErrorState` — with retry button
- `EmptyState` — with optional CTA
- `PermissionDenied` — for 401/403

## 3. Mutations

```ts
const mutation = trpc.wms.inventory.create.useMutation({
  onSuccess: () => {
    utils.wms.inventory.list.invalidate();
    toast.success('Item created');
  },
  onError: (err) => toast.error(err.message),
});
```

- Always invalidate the relevant list query after a mutation.
- Show a pending state on the submit button (`disabled={mutation.isPending}`).
- Never claim success before `onSuccess` fires.
- For consequential mutations (bonded movements, declarations), show a confirmation dialog before calling `.mutate()`.

## 4. Tenant isolation

- The backend enforces `tenantId` on every query. The frontend does not need to pass `tenantId` explicitly — it is resolved from the JWT in the tRPC context.
- Never filter by `tenantId` on the client side.

## 5. Zone context

- Zone context (`ALL` / `FIZ` / `FCZ`) is managed in `DashboardHeader` via `ZoneSwitcher`.
- Pass zone as a query parameter or prop where the backend supports it.
- Do not use zone context to hide data — use it to filter. The backend enforces zone permissions.

## 6. Role context

- `RoleSwitcher` in `DashboardHeader` is a UI convenience for development. In production, the role comes from the JWT.
- Never use the UI role switcher value to gate security-sensitive operations. Always rely on backend RBAC.

## 7. AI components

- AI confidence scores are estimates. Always label them as such.
- Never present an AI suggestion as a regulatory ruling or confirmed compliance status.
- AI-generated form data must go through a user review step before being committed.
- Chat responses that include citations must only cite documents that were actually retrieved.

## 8. Digital twin

- Simulation state is completely separate from production state.
- Components under `components/digital-twin/` must never call production-mutating tRPC procedures.
- Label all simulated data with a visible "Simulation" badge.

## 9. Formatting conventions

| Data type | Format |
|-----------|--------|
| Currency | `MYR 1,234.56` (always include currency code) |
| Dates | ISO 8601 for storage; `dd MMM yyyy` for display |
| HS codes | 8-digit with dot: `8471.30.10` |
| Quantities | Include unit: `1,200 kg`, `50 units` |
| Percentages | `12.5%` (one decimal) |

## 10. Accessibility

- All interactive elements must have `aria-label` or visible text.
- Dialogs must trap focus and be closeable with Escape.
- Charts must have a tabular alternative (`<caption>` or adjacent table).
- Color alone must not convey status — always pair with text or icon.
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text.

## 11. Shared component props pattern

```ts
// Standard list component props
interface ListProps<T> {
  data: T[];
  isLoading: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onSelect?: (item: T) => void;
  emptyMessage?: string;
}

// Standard detail component props
interface DetailProps<T> {
  id: string;
  data?: T;
  isLoading: boolean;
  error?: Error | null;
  onRetry?: () => void;
}
```

## 12. Navigation

- Use `APP_ROUTES` and `MARKETING_ROUTES` from `config/routes.ts` for primary application and marketing links.
- Never hardcode URLs in components — import from the route registry.
- Use `router.push()` for programmatic navigation after mutations.
- Use `Link` for static navigation.
