

## Plan: Align Console with Backend API Spec

After auditing the entire codebase against the spec, most things are already correctly implemented. Here are the gaps that need fixing:

---

### 1. Update Gateway type to match API response (Section 8)

**File: `src/data/gateway-types.ts`**

The `Gateway` interface is missing several fields from the spec. Update to include:
- `upstreamHost: string`
- `allowCredentials: boolean`
- `rewriteLocationHeaders: boolean`
- `proxyUrl: string | null`
- `selfhostGatewayUrl: string | null`
- `updatedAt: number`
- Change `createdAt` from `string` to `number`
- Change `gatewayUrl` to `string | null` (nullable for undeployed selfhost)
- Remove `requestsMonth` and `lastCheck` (not in API)
- Remove `"needs-setup" | "error"` from GatewayStatus (API only returns `"active" | "disabled"`)

---

### 2. Update `CreateAppPayload` to include new fields (Section 5)

**File: `src/lib/api-client.ts`**

Add missing fields to `CreateAppPayload`:
- `allowCredentials: boolean`
- `strictMode: boolean`
- `rewriteLocationHeaders: boolean`

Update `UpdateAppPayload` to accept all mutable fields:
- `selfhostGatewayUrl?: string`
- `allowCredentials?: boolean`
- `strictMode?: boolean`
- `rewriteLocationHeaders?: boolean`
- `upstreamHost?: string`

Add `getLegalVersions` to use public request (no credentials needed) — currently it uses `request()` which adds credentials. This isn't broken but is unnecessary for a public endpoint. Low priority, keep as-is since it works.

---

### 3. Create Gateway form — add missing fields (Section 5)

**File: `src/pages/console/ConsoleNew.tsx`**

Add form fields for:
- `allowCredentials` toggle (default: false) with warning when combined with wildcard origins
- `strictMode` toggle (default: false)
- `rewriteLocationHeaders` toggle (default: true)

Include these in the POST payload.

---

### 4. App Detail page — redesign for managed vs selfhost (Sections 6A/6B)

**File: `src/pages/console/ConsoleDetail.tsx`**

The current page shows Overview + Self-Host tabs for all apps. Per spec:
- **Managed apps**: Show tabs: Overview, Snippets, Diagnostics, Config Export. No Self-Host tab.
- **Selfhost apps with `gatewayUrl === null`**: Show the deploy onboarding card (State 1 from Section 6B)
- **Selfhost apps with `gatewayUrl` set**: Same as managed layout

Changes:
- Replace the current tab structure with mode-aware tabs
- For selfhost with no gatewayUrl: show deploy onboarding UI with config URL generation, CLI command, and Worker URL registration input (PUT /apps/:id with `{ selfhostGatewayUrl }`)
- Add Config Export tab for managed apps
- Move Snippets and Diagnostics to their own tabs instead of being inline in Overview

---

### 5. Settings page — add missing fields (Section 6A)

**File: `src/pages/console/ConsoleSettings.tsx`**

Add settings for:
- `upstreamHost` (editable)
- `allowCredentials` toggle
- `strictMode` toggle  
- `rewriteLocationHeaders` toggle
- For selfhost: `selfhostGatewayUrl` field

Fix: default rate limit fallback from 60 to 600 (line 28 and 41).

---

### 6. Add Auth Error page (Section 2C)

**New file: `src/pages/AuthError.tsx`**

Route: `/auth/error?reason=<reason>`

Display friendly messages for each reason code. Add "Try again" button linking to `/login`.

**File: `src/App.tsx`** — Add the route.

---

### 7. Login page — redirect if already logged in (Section 2D)

**File: `src/pages/Login.tsx`**

If user is already logged in (from AuthContext), redirect to `/app` immediately.

---

### 8. Dashboard — show `createdAt` formatted (Section 4)

**File: `src/pages/console/ConsoleDashboard.tsx`**

Currently not showing createdAt. The spec says to show it. Add a formatted date to each gateway card.

---

### Summary of files to create/modify

| File | Action |
|------|--------|
| `src/data/gateway-types.ts` | Update Gateway interface |
| `src/lib/api-client.ts` | Update payload types |
| `src/pages/console/ConsoleNew.tsx` | Add allowCredentials, strictMode, rewriteLocationHeaders fields |
| `src/pages/console/ConsoleDetail.tsx` | Redesign tabs for managed vs selfhost, add config export tab, selfhost deploy onboarding |
| `src/pages/console/ConsoleSettings.tsx` | Add missing settings fields, fix default 60→600 |
| `src/pages/AuthError.tsx` | New — auth error page |
| `src/pages/Login.tsx` | Redirect if already authed |
| `src/pages/console/ConsoleDashboard.tsx` | Show createdAt |
| `src/App.tsx` | Add /auth/error route |

