

## Fix: API expects `upstreamHost`, client sends `supabaseUrl`

The error is clear: `{"path":["upstreamHost"],"message":"Required"}`. Your backend API expects a field called `upstreamHost` but the client is sending `supabaseUrl`.

### Changes

**`src/lib/api-client.ts`** — Rename `supabaseUrl` to `upstreamHost` in the `CreateAppPayload` interface.

**`src/pages/console/ConsoleNew.tsx`** — Change the key in the `createApp.mutateAsync()` call from `supabaseUrl` to `upstreamHost`, mapping `form.supabaseUrl` to it.

This is a one-line rename in each file. The form field name (`supabaseUrl`) stays the same internally — only the API payload key changes to match what the backend expects.

