

## Plan: Remove Mock Data and Make API Client Production-Ready

### What changes

The app currently has a full mock data fallback baked into the API client. Every API method catches errors and falls back to an in-memory `mockStore` seeded with 4 fake gateways. For production, we need to remove all of this so the app talks exclusively to `https://api.xupastack.com`.

### Files to change

**1. `src/data/mock-gateways.ts`** — Keep the TypeScript types (`Gateway`, `GatewayMode`, `GatewayStatus`), delete the `MOCK_GATEWAYS` array. Rename file to `src/data/gateway-types.ts` for clarity.

**2. `src/lib/api-client.ts`** — Remove mock fallback logic entirely:
- Remove `MOCK_GATEWAYS` import, `USE_MOCK` flag, `delay()` helper, and `mockStore`
- Remove the `if (USE_MOCK) throw new Error("mock")` guard in `request()`
- Strip all `catch` blocks that return mock data — let errors propagate naturally
- Each method becomes a straightforward `request()` call

**3. Update imports across consumers** — Change `@/data/mock-gateways` → `@/data/gateway-types` in:
- `src/components/console/StatusBadge.tsx`
- `src/pages/console/ConsoleDashboard.tsx`
- `src/lib/api-client.ts`

### Technical detail

The cleaned `api-client.ts` will look like:

```text
request()  →  fetch(BASE + path)  →  return JSON or throw

api.listApps()      →  GET    /apps
api.createApp()     →  POST   /apps
api.getApp(id)      →  GET    /apps/:id
api.updateApp(id)   →  PATCH  /apps/:id
api.deactivateApp() →  POST   /apps/:id/deactivate
api.deleteApp(id)   →  DELETE /apps/:id
api.getSignedConfigUrl() → GET /apps/:id/config.json
api.verifyApp(id)   →  POST   /apps/:id/verify
```

`BASE` will default to `https://api.xupastack.com` if `VITE_API_BASE` is not set, matching how `AuthContext.tsx` already works. Error handling stays in the React Query hooks (`use-apps.ts`) via `onError` callbacks — no changes needed there.

### What stays unchanged
- All console page components (Dashboard, Detail, Settings, New, Deploy, Help)
- React Query hooks (`use-apps.ts`)
- Auth context
- StatusBadge and other UI components (just import path update)

