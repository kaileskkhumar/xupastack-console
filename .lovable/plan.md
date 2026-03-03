

## Plan: Backend API Integration Updates

This is a substantial update touching 8 areas. Here's the implementation plan organized by file changes.

---

### 1. Fix Gateway URL Format Everywhere

**Old format:** `https://{slug}.gw.xupastack.com`
**New format:** `https://{slug}-gw.xupastack.com`

Files to update:
- `src/pages/console/ConsoleNew.tsx` (line 213 slug preview)
- `src/data/isp-data.ts` (all snippet references)
- `src/data/blog-posts.ts` (blog content references)
- `src/pages/Guides.tsx` (guide snippets)
- `src/components/home/StackSnippets.tsx` (if applicable)
- `src/pages/Quickstart.tsx` / `src/pages/Docs.tsx` (if applicable)

Search for all occurrences of `.gw.xupastack.com` and replace with `-gw.xupastack.com`.

---

### 2. Create App — Add Legal Versions Fetch + Consent Fields

**`src/lib/api-client.ts`:**
- Add `getLegalVersions()` endpoint: `GET /legal/versions` → `{ terms: string, privacy: string, aup: string }`
- Update `CreateAppPayload` to include `termsAccepted`, `termsVersion`, `privacyVersion`, `aupVersion`

**`src/hooks/use-apps.ts`:**
- Add `useLegalVersions()` hook using `useQuery`

**`src/pages/console/ConsoleNew.tsx`:**
- Fetch legal versions on mount via the new hook
- Pass `termsAccepted: true`, `termsVersion`, `privacyVersion`, `aupVersion` in the `handleCreate` payload

---

### 3. Revamp App Detail Page — Setup Checklist

**Replace `src/components/console/detail/SetupChecklist.tsx`** with a new 3-item checklist:
1. Update frontend URL (copyable `SUPABASE_URL=https://{slug}-gw.xupastack.com`)
2. Add gateway to Supabase Auth redirect URLs (with the two URLs to add)
3. (Optional) Disable email confirmations

Each item checkable, state persisted in localStorage per app ID.

---

### 4. Integration Snippets Section

**`src/lib/api-client.ts`:**
- Add `getSnippets(id: string)` endpoint: `GET /apps/:id/snippets`

**`src/hooks/use-apps.ts`:**
- Add `useSnippets(id: string)` hook

**Create `src/components/console/detail/IntegrationSnippets.tsx`:**
- Tabbed code block (one tab per language from API response)
- Copy button per snippet
- Uses existing `CodeBlock` and `CopyButton` components

**`src/pages/console/ConsoleDetail.tsx`:**
- Add `IntegrationSnippets` component below setup checklist

---

### 5. Diagnostics Section (Server-Side)

**`src/lib/api-client.ts`:**
- Add `getDiagnostics(id: string)` endpoint: `GET /apps/:id/diagnostics`
- Returns `{ upstreamReachable, services: { rest, auth, storage, realtime }, latencyMs }`

**`src/hooks/use-apps.ts`:**
- Add `useDiagnostics(id: string)` hook (with `enabled: false` for on-demand)

**Create `src/components/console/detail/DiagnosticsCard.tsx`:**
- Status grid with green/red indicators per service
- Upstream reachability + latency display
- "Run Diagnostics" button triggers refetch

**`src/pages/console/ConsoleDetail.tsx`:**
- Add `DiagnosticsCard` below snippets

---

### 6. Self-Host Tab

**`src/lib/api-client.ts`:**
- Update `getSignedConfigUrl` to return `{ configUrl, expiresAt }` (already partially exists)

**Create `src/components/console/detail/SelfHostTab.tsx`:**
- 4-step flow: explanation → Get Config button → show CLI command → doctor command
- Shows expiry warning

**`src/pages/console/ConsoleDetail.tsx`:**
- Add tabs (Overview / Self-Host) wrapping the detail content
- Self-Host tab renders `SelfHostTab`

---

### 7. Managed Capacity Warning (HTTP 429)

**`src/lib/api-client.ts`:**
- In the `request()` helper, detect 429 with `managed_capacity_reached` error
- Dispatch a custom event or set a global state

**Create `src/components/console/CapacityModal.tsx`:**
- Full-screen modal with title, explanation, and "Self-Host for Free →" CTA
- Listens for the capacity event

**`src/pages/console/ConsoleDetail.tsx`:**
- Include `CapacityModal` component

---

### 8. Auth Callback URL

**`src/contexts/AuthContext.tsx`:**
- The GitHub OAuth flow already redirects via the API (`/auth/github/start`). The callback URL is server-side configuration, not a frontend change. No code change needed — this is a backend config note.

---

### Summary of New Files
- `src/components/console/detail/IntegrationSnippets.tsx`
- `src/components/console/detail/DiagnosticsCard.tsx`
- `src/components/console/detail/SelfHostTab.tsx`
- `src/components/console/CapacityModal.tsx`

### Summary of Modified Files
- `src/lib/api-client.ts` — new endpoints + 429 handling
- `src/hooks/use-apps.ts` — new hooks
- `src/pages/console/ConsoleNew.tsx` — legal versions fetch + payload
- `src/pages/console/ConsoleDetail.tsx` — tabs, new sections
- `src/components/console/detail/SetupChecklist.tsx` — rewritten with 3 items
- `src/data/isp-data.ts` — URL format fix
- `src/data/blog-posts.ts` — URL format fix
- `src/pages/Guides.tsx` — URL format fix
- Any other files containing `.gw.xupastack.com` → `-gw.xupastack.com`

