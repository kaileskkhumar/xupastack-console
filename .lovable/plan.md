## Plan: Redesign Create Gateway Form & App Detail Page

4 files to modify, 0 new files.

---

### 1. `src/lib/api-client.ts` — Add `getSnippetByStack` method

Add to the `api` object:

```ts
getSnippetByStack(id: string, stack: string): Promise<{ stack: string; snippet: string }> {
  return request<{ stack: string; snippet: string }>(`/apps/${id}/snippets?stack=${encodeURIComponent(stack)}`);
}
```

### 2. `src/hooks/use-apps.ts` — Add `useSnippetByStack` hook

```ts
export function useSnippetByStack(id: string, stack: string) {
  return useQuery<{ stack: string; snippet: string }>({
    queryKey: ["snippet", id, stack],
    queryFn: () => api.getSnippetByStack(id, stack),
    enabled: !!id && !!stack,
  });
}
```

### 3. `src/pages/console/ConsoleNew.tsx` — Full rewrite

**Remove:** 2-step wizard, step indicators, AnimatePresence, mode selection as step 1, all advanced fields shown by default, consent checkbox.

**New layout — single page, no steps:**

3 visible fields stacked vertically:

1. **Gateway name** — `placeholder="My App"`, `maxLength={64}`. `onChange` auto-derives slug via `slugify(name)` unless user has manually edited slug.
2. **Slug** — auto-filled, editable. Below it, prominent URL preview:
  - `https://{slug}-gw.xupastack.com` in a styled box
  - Green text + checkmark when `slug.state === "available"`
  - Red text when taken or invalid
  - **Client-side check**: if `slug.length < 3`, show "Slug must be at least 3 characters" in red, do NOT call API. Pass `form.slug.length >= 3` to `useSlugCheck` enabled param (fix from current `>= 2`).
3. **Supabase project URL** — `placeholder="https://xxxxxxxxxxxxxxxxxxxx.supabase.co"`, helper text: "Find this in your Supabase project settings → API". Validated on change via existing `useSupabaseUrlValidation` hook.

**Legal line** (replaces checkbox):

```
By creating a gateway, you confirm your use complies with our
Terms of Service and Acceptable Use Policy.
All proxied traffic is subject to our Privacy Policy.
```

Each term is a Link. No checkbox state — `termsAccepted: true` always sent.

**Remove `consent` state entirely.** Update `canCreate` to remove `consent` check.

**"Advanced settings" collapsible** (collapsed by default, using Collapsible from `@radix-ui/react-collapsible`):

- Mode selector: "Managed (recommended)" / "Self-hosted". Default: `"managed"`. If selfhost selected, show info text.
- Allowed origins input (default: empty → sends `["*"]`)
- Allow credentials toggle (default: off) with wildcard warning
- Rate limit input (default: 600)
- Enabled services multi-select (all 6 checked)
- Strict mode toggle (default: off)
- Rewrite Location headers toggle (default: on)

**"Create Gateway" button** — full width. On success: `navigate(`/app/${gw.id}`)` for both modes (remove the `/deploy` path for selfhost).

### 4. `src/pages/console/ConsoleDetail.tsx` — Full rewrite

**Remove:** All tab imports/usage (Tabs, TabsList, TabsTrigger, TabsContent), DetailHeader, GoLiveChecklist, IntegrationSnippets component import, ConfigExportTab inline component.

**New single-scroll layout:**

**Header area:** Back link to `/app`, app name, mode badge ("Managed"/"Self-hosted"), settings link to `/app/:id/settings`.

**Branch: selfhost with no gatewayUrl** → Show SelfHostOnboarding + Settings collapsible + Danger Zone.

**Branch: deployed (managed or selfhost with gatewayUrl):**

**Section 1 — Gateway URL** (most prominent):

- Large "Your Gateway URL" heading
- Subtext: "Replace your Supabase project URL with this in your code"
- URL in a large styled box with CopyButton
- Status badge (green "Active" / gray "Disabled")
- Activate/Deactivate button using `useActivateApp`/`useDeactivateApp`

**Section 2 — Quick Integration:**

- Stack selector tabs (horizontal row of small buttons): `supabase-js | nextjs | vite | node | python | flutter | expo | emergent | other`
- Default `activeStack = "supabase-js"`, fetched on mount via `useSnippetByStack(id, activeStack)`
- Code block with copy button showing `data.snippet`
- Callout below: "Only the URL changes — keep using your original Supabase anon key."

**Section 3 — Details** (read-only):

- 3 stat cards: Status, Rate Limit (`{rateLimitPerMin}/min`), Created (`new Date(createdAt * 1000).toLocaleDateString()`)
- Details rows: Upstream (`upstreamHost`), Origins (`allowedOrigins.join(", ")`), Services (`enabledServices.join(", ")`)

**Section 4 — Diagnostics** (Collapsible, collapsed):

- Trigger: "Check gateway health"
- Content: "Run diagnostics" button using `useDiagnostics(id)` mutation
- Results: Auth ✓/✗, REST ✓/✗, Storage ✓/✗/N/A, notes list

**Section 5 — Settings** (Collapsible, collapsed):

- All fields from ConsoleSettings inline: name, upstreamHost, origins, allowCredentials, services, rateLimit, strictMode, rewriteLocationHeaders
- For selfhost: selfhostGatewayUrl field
- Save button → `useUpdateApp(id)`

**Section 6 — Danger Zone:**

- Delete button with ConfirmModal

**SelfHostOnboarding — re-implemented per spec:**

Step 1: "Generate your config URL"

- Button calls `api.getSignedConfigUrl(appId)`, shows configUrl in copyable box
- Shows "Expires at `<expiresAt formatted as local time>`"
- Button disabled after click (single-use token), with "Regenerate" link
- 401 error: "Session expired — please log in again."

Step 2: "Deploy to Cloudflare"

- If config generated: show `npx create-xupastack@latest import --import <configUrl>` with actual URL in copyable code block
- If not generated: show placeholder "Complete Step 1 first"
- Below: "You'll need Node.js 18+ and a Cloudflare account. Run 'npx wrangler login' first if you haven't already."

Step 3: "Register your Worker URL"

- Text explaining what to look for
- Input with `https://...` placeholder
- Validate: non-empty, starts with `https://`
- Save button: `PUT /apps/:id` with `{ selfhostGatewayUrl }` via `useUpdateApp`
- On success: invalidate app query → page auto-transitions to deployed state  
  
 Plan is approved. One addition:                                                                                                                                                                                    
     
    In SelfHostOnboarding Step 1, the plan calls api.getSignedConfigUrl(appId).                                                                                                                                        
    Make sure this method exists in api-client.ts. If it doesn't already exist,
    add it to the api object alongside getSnippetByStack:
  &nbsp;
      getSignedConfigUrl(id: string): Promise<{ configUrl: string; expiresAt: string }> {
        return request<{ configUrl: string; expiresAt: string }>`/apps/${id}/config.json`);
      }
  &nbsp;
    This maps to: GET [https://api.xupastack.com/apps/:id/config.json](https://api.xupastack.com/apps/:id/config.json)
    (auth required, credentials: 'include' already handled by request())
  &nbsp;
    Everything else in the plan is correct. Proceed.

---

### Files NOT changed

- `ConsoleSettings.tsx` — kept as standalone route `/app/:id/settings`
- `DiagnosticsCard.tsx` — logic reused inline in detail page (component still exists for other uses)
- All other files unchanged