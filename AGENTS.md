# TradeOps

## Build

```bash
npm run build
# or
pnpm build
```

## Route groups

Route groups like `(marketing)` and `(app)` are stripped from the URL. Only one page may resolve to any given path — keep marketing landing pages under `solutions/` (e.g. `app/(marketing)/solutions/fcz/page.tsx`) and leave the walkthrough entry points at `app/(app)/fcz/page.tsx`.