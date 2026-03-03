

## Plan: Fix slow login loading

Two changes to two files.

### 1. `src/App.tsx` — QueryClient retry config + global AuthError redirect

- Import `QueryCache` from `@tanstack/react-query` and `AuthError` from `@/lib/api-client`
- Replace `new QueryClient()` with configured instance:
  - `retry`: skip retries for `AuthError`, allow 2 retries for other errors
  - `staleTime: 30000` to avoid redundant refetches
  - `QueryCache.onError`: on `AuthError`, redirect to `/login?next=...`

### 2. `src/contexts/AuthContext.tsx` — Prefetch apps after /me succeeds

- Import `useQueryClient` from `@tanstack/react-query`
- Import `api` from `@/lib/api-client`
- In `AuthProvider`, get `queryClient` via `useQueryClient()`
- After `fetchMe()` resolves successfully and user is set, call `queryClient.prefetchQuery({ queryKey: ['apps'], queryFn: () => api.listApps() })` — this fires in the background so the data is cached before ConsoleDashboard mounts

This eliminates the sequential waterfall: `/me` and `/apps` data will be ready by the time the dashboard renders.

