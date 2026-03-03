export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "supabase-not-working-jio-airtel-bsnl",
    title: "Supabase not working on Jio/Airtel/BSNL? Fix in minutes",
    description: "If your Supabase-powered app stopped working on Indian ISPs, here's why — and how to get it running again in under five minutes.",
    date: "2025-02-28",
    readTime: "4 min",
    category: "Troubleshooting",
    content: `## The problem\n\nSeveral Indian ISPs — including Jio, Airtel, and BSNL — have begun blocking or throttling connections to \`*.supabase.co\` at the DNS or network level. This means your app's API calls, authentication flows, and realtime connections silently fail for end users.\n\n## Why it happens\n\nThe blocking occurs at the network/DNS layer. Your users' devices never reach the Supabase servers. This isn't something you can fix by changing your code logic — you need to route traffic through a different domain.\n\n## The fix\n\nXupaStack provides a gateway that proxies your Supabase traffic through an unblocked domain. You have two options:\n\n### Option 1: Managed gateway (instant)\n\nCreate a gateway in the XupaStack console — no setup required:\n\n1. Sign in at xupastack.com and click **New Gateway**\n2. Enter your Supabase project ref\n3. Swap your \`SUPABASE_URL\` with the gateway URL you receive:\n\n\`\`\`javascript\nconst supabase = createClient(\n  'https://your-ref-gw.xupastack.com',\n  'your-anon-key'\n)\n\`\`\`\n\n### Option 2: Self-host (recommended for production)\n\nDeploy the XupaStack gateway to your own Cloudflare account. Clone the repo, configure your Supabase project ref in \`wrangler.toml\`, and run \`wrangler deploy\`. You get your own Cloudflare Worker on your own infrastructure — no shared capacity, no third-party in the request path.\n\nBoth options keep Auth, Storage, Realtime, and Functions working. The self-hosted option gives you full control over the data plane.`
  },
  {
    slug: "why-dns-change-doesnt-fix-users",
    title: "Why changing DNS doesn't fix your users",
    description: "You switched to 1.1.1.1, but your users are still stuck. Here's why DNS changes on your machine don't help end users.",
    date: "2025-02-25",
    readTime: "3 min",
    category: "Explainer",
    content: `## The misconception\n\nWhen developers discover their Supabase app is blocked, the first instinct is to change DNS settings to Cloudflare (1.1.1.1) or Google (8.8.8.8). It works on your machine — so the problem seems solved.\n\n## Why it doesn't work for users\n\nYour users don't control their DNS settings. Most are on mobile devices using their carrier's default DNS. Even those on desktop rarely change DNS configuration.\n\nMore importantly, some ISPs perform deep packet inspection (DPI) or SNI-based blocking that works regardless of DNS settings. The domain \`supabase.co\` is blocked at the network level, not just DNS.\n\n## The real fix\n\nYou need to route traffic through a domain that isn't blocked. A gateway like XupaStack gives your app a new endpoint that resolves and connects successfully on all Indian ISPs.\n\n\`\`\`javascript\n// Before: blocked on Jio/Airtel/BSNL\nconst SUPABASE_URL = 'https://abc.supabase.co'\n\n// After: works on every network\nconst SUPABASE_URL = 'https://abc-gw.xupastack.com'\n\`\`\`\n\nYour API keys don't change. Your database doesn't change. Your RLS policies don't change. Only the URL changes.`
  },
  {
    slug: "oauth-breaks-when-backend-blocked",
    title: "OAuth breaks when your backend domain is blocked — here's the fix",
    description: "OAuth redirect flows fail silently when supabase.co is blocked. Learn how to configure redirect-safe authentication through a gateway.",
    date: "2025-02-22",
    readTime: "5 min",
    category: "Authentication",
    content: `## The OAuth problem\n\nOAuth flows (Google, GitHub, Apple sign-in) involve multiple redirects. The typical flow is:\n\n1. User clicks "Sign in with Google"\n2. Redirect to Google's consent screen\n3. Google redirects back to your Supabase auth endpoint\n4. Supabase redirects to your app with tokens\n\nWhen \`supabase.co\` is blocked, step 3 fails. The user sees a timeout or connection error after granting consent.\n\n## The fix\n\nXupaStack proxies the auth endpoints and rewrites redirect URLs so the entire flow stays on an unblocked domain.\n\n### Setup checklist:\n\n1. **Add your gateway URL as a redirect URL** in your Supabase dashboard under Authentication → URL Configuration\n2. **Update your OAuth provider** (Google Console, GitHub Apps, etc.) to include the gateway callback URL: \`https://your-ref-gw.xupastack.com/auth/v1/callback\`\n3. **Configure your client** to use the gateway URL:\n\n\`\`\`javascript\nconst supabase = createClient(GATEWAY_URL, ANON_KEY, {\n  auth: {\n    redirectTo: 'https://your-app.com/auth/callback'\n  }\n})\n\`\`\`\n\n4. **Test the full flow** on a network where supabase.co is blocked (Jio mobile data is a reliable test)`
  },
  {
    slug: "realtime-websockets-through-gateway",
    title: "Realtime WebSockets through a gateway: what to verify",
    description: "WebSocket connections need special handling when proxied. Here's how to verify Realtime works through your gateway.",
    date: "2025-02-20",
    readTime: "4 min",
    category: "Realtime",
    content: `## WebSocket proxying\n\nSupabase Realtime uses WebSocket connections for live updates. When routing through a gateway, these connections need proper handling.\n\n## What to verify\n\n### 1. WebSocket upgrade works\n\nThe gateway must support HTTP → WebSocket upgrades. XupaStack handles this automatically for both self-hosted and managed deployments — no extra configuration needed on your part.\n\n### 2. Connection stays alive\n\n\`\`\`javascript\nconst channel = supabase\n  .channel('test')\n  .on('postgres_changes', {\n    event: '*',\n    schema: 'public',\n    table: 'messages'\n  }, (payload) => {\n    console.log('Change received:', payload)\n  })\n  .subscribe((status) => {\n    console.log('Subscription status:', status)\n  })\n\`\`\`\n\nWatch for \`SUBSCRIBED\` in the status callback. If you see \`CHANNEL_ERROR\`, the WebSocket isn't reaching the gateway.\n\n### 3. Verify with browser DevTools\n\nOpen Chrome DevTools → **Network** tab → filter by **WS**. Load your app and you should see a WebSocket connection to your gateway URL with status **101 Switching Protocols**.\n\nIf the connection appears but closes immediately, check that Realtime is enabled in your gateway's service settings in the XupaStack console.`
  },
  {
    slug: "production-checklist-cors-strict-mode",
    title: "Production checklist: secure CORS and strict mode",
    description: "Before going live, lock down your gateway with proper CORS configuration and strict mode. Here's the complete checklist.",
    date: "2025-02-18",
    readTime: "5 min",
    category: "Security",
    content: `## Why this matters\n\nA misconfigured gateway can expose your Supabase project to unauthorized access. Before going to production, complete this checklist.\n\n## CORS configuration\n\nIn the XupaStack console, go to your gateway → **Settings** → **Allowed Origins**. Add only your specific domains:\n\n- \`https://your-app.com\`\n- \`https://staging.your-app.com\`\n\nEnable **Allow Credentials** only if your app uses cookies or HTTP authorization headers. Never set the origin to wildcard (\`*\`) when credentials are enabled — this combination is rejected by the spec and blocked by the gateway.\n\n## Strict mode\n\nEnable **Strict Mode** in gateway settings. This adds extra request validation. Also disable any Supabase services you don't use — if your app doesn't call Edge Functions, uncheck **Functions** in the enabled services list to reduce your attack surface.\n\n## Rate limiting\n\nSet a **Rate Limit** in gateway settings. A reasonable starting point is 600 requests per minute per IP. Lower it if you see abuse from specific IPs.\n\n## Full checklist\n\n- [ ] CORS origins restricted to your specific domains only\n- [ ] Wildcard origin (\`*\`) not used with credentials enabled\n- [ ] Strict mode enabled\n- [ ] Unused Supabase services disabled\n- [ ] Rate limit configured\n- [ ] Gateway URL added to Supabase Dashboard → Authentication → URL Configuration\n- [ ] OAuth provider redirect URIs updated to gateway callback URL\n- [ ] Sign-in flow tested on a blocked network (e.g., Jio mobile data)`
  },
  {
    slug: "self-hosted-vs-managed-trust-model",
    title: "Self-hosted vs managed gateways: choosing the right trust model",
    description: "Both options fix connectivity. But they come with different security and privacy tradeoffs. Here's an honest comparison.",
    date: "2025-02-15",
    readTime: "6 min",
    category: "Security",
    content: `## The trust question\n\nAny gateway sits between your app and your database. The question isn't whether a gateway is safe — it's who controls it.\n\n## Self-hosted\n\n**You control everything.**\n\n- Deploys to your own Cloudflare account\n- Runs under your own domain\n- Logs are yours (or none at all)\n- No third-party infrastructure in the request path\n\nBest for: production apps, apps with sensitive data, compliance requirements.\n\n## Managed\n\n**Fastest to start, different trust model.**\n\n- Instant endpoint, no setup\n- XupaStack infrastructure sits in the request path\n- You trust our logging policy and operational security\n- We don't log request payloads by default, but you're taking our word for it\n\nBest for: prototypes, hackathons, emergencies, and apps without sensitive user data.\n\n## Comparison\n\n| Aspect | Self-hosted | Managed |\n|--------|------------|----------|\n| Setup time | ~5 minutes | Instant |\n| Data control | Full | Trust-based |\n| Custom domain | Yes | Shared (*.gw.xupastack.com) |\n| Production-ready | Yes | Use with caution |\n| Cost | Your Cloudflare plan | Free |`
  },
  {
    slug: "custom-domain-gateway",
    title: "How to attach a custom domain to your self-hosted gateway",
    description: "Route your Supabase traffic through your own domain for better branding and trust. Step-by-step guide.",
    date: "2025-02-12",
    readTime: "3 min",
    category: "Guides",
    content: `## Why use a custom domain\n\nA custom domain means your API calls go through \`api.your-app.com\` instead of a generic gateway URL. This improves trust, looks professional, and keeps your infrastructure details private.\n\n## Setup (self-hosted)\n\n### 1. Add your domain to Cloudflare\n\nIf your domain isn't already on Cloudflare, add it to your account. Cloudflare needs to manage DNS for your domain to assign a custom route to a Worker.\n\n### 2. Configure the custom domain in wrangler.toml\n\nIn your gateway's \`wrangler.toml\`, add a custom domain route:\n\n\`\`\`toml\n[[routes]]\npattern = "api.your-app.com/*"\ncustom_domain = true\n\`\`\`\n\n### 3. Deploy\n\n\`\`\`bash\nwrangler deploy\n\`\`\`\n\nCloudflare automatically provisions an SSL certificate for your custom domain. No certificate management needed.\n\n### 4. Update your app\n\n\`\`\`javascript\nconst supabase = createClient(\n  'https://api.your-app.com',\n  'your-anon-key'\n)\n\`\`\`\n\n### 5. Verify\n\n\`\`\`bash\ncurl -I https://api.your-app.com/rest/v1/ \\\n  -H "apikey: your-anon-key"\n\`\`\`\n\nYou should receive an HTTP 200 response from your Supabase project, routed through your custom domain.`
  },
  {
    slug: "debugging-timeouts-dns-sinkholes",
    title: "Debugging timeouts and DNS sinkholes",
    description: "Your app hangs on API calls. Is it blocked? A timeout? A DNS sinkhole? Here's how to diagnose and fix it.",
    date: "2025-02-10",
    readTime: "5 min",
    category: "Troubleshooting",
    content: `## Symptoms\n\n- API calls hang for 30+ seconds then fail\n- \`fetch\` never resolves\n- Works on some networks, not others\n- Works with VPN on\n\n## Diagnosing\n\n### Step 1: Check DNS resolution\n\n\`\`\`bash\nnslookup your-project.supabase.co\n\`\`\`\n\nIf this returns \`0.0.0.0\`, \`127.0.0.1\`, or times out — you're hitting a DNS sinkhole.\n\n### Step 2: Check connectivity directly\n\n\`\`\`bash\ncurl -v https://your-project.supabase.co/rest/v1/ \\\n  -H "apikey: your-anon-key"\n\`\`\`\n\nLook for:\n- Connection refused → IP-level blocking\n- SSL handshake failure → SNI-based blocking\n- Timeout → DNS sinkhole or packet dropping\n\n### Step 3: Test through your gateway\n\nIf the above confirms a block, verify your XupaStack gateway bypasses it:\n\n\`\`\`bash\ncurl -I https://your-ref-gw.xupastack.com/rest/v1/ \\\n  -H "apikey: your-anon-key"\n\`\`\`\n\nAn HTTP 200 response confirms the gateway is successfully routing around the ISP block.`
  },
  {
    slug: "storage-working-when-origin-blocked",
    title: "How to keep Storage working when the origin is blocked",
    description: "File uploads and downloads fail when supabase.co is blocked. Here's how to route Storage through your gateway.",
    date: "2025-02-08",
    readTime: "3 min",
    category: "Storage",
    content: `## The Storage problem\n\nSupabase Storage uses the same \`*.supabase.co\` domain for file uploads and downloads. When the domain is blocked, your users can't upload or retrieve files.\n\n## The fix\n\nXupaStack proxies Storage API calls automatically. No extra configuration needed — just swap the URL.\n\n\`\`\`javascript\n// Upload works through the gateway\nconst { data, error } = await supabase.storage\n  .from('avatars')\n  .upload('user-1/avatar.png', file)\n\n// Public URL is served through the gateway\nconst { data: urlData } = supabase.storage\n  .from('avatars')\n  .getPublicUrl('user-1/avatar.png')\n\`\`\`\n\n## Signed URLs\n\nSigned URLs are also rewritten to go through the gateway. Temporary download links work for your users even on blocked networks.\n\n## Large file uploads\n\nFor files over 6MB, Supabase uses multipart uploads. XupaStack handles these correctly. If you are self-hosting and need to support large files, configure your Worker size limit in \`wrangler.toml\`:\n\n\`\`\`toml\n# wrangler.toml\n[limits]\nmax_body_size = "100MB"\n\`\`\``
  },
  {
    slug: "doctor-checks-what-success-looks-like",
    title: "How to verify your XupaStack gateway is working",
    description: "A step-by-step checklist to confirm your gateway is correctly routing all Supabase traffic — REST, Auth, Storage, Realtime, and Functions.",
    date: "2025-02-05",
    readTime: "4 min",
    category: "Diagnostics",
    content: `## Verifying each service\n\nAfter creating your gateway, run these checks to confirm traffic is routing correctly. Replace \`your-ref-gw.xupastack.com\` with your actual gateway URL.\n\n### REST API\n\n\`\`\`bash\ncurl -I https://your-ref-gw.xupastack.com/rest/v1/ \\\n  -H "apikey: your-anon-key"\n\`\`\`\n\nExpected: HTTP **200**. A timeout means the gateway URL is wrong or your Supabase project is paused.\n\n### Auth\n\n\`\`\`bash\ncurl https://your-ref-gw.xupastack.com/auth/v1/settings\n\`\`\`\n\nExpected: a JSON response with your project's auth configuration (OAuth providers, email settings, etc.).\n\n### Storage\n\n\`\`\`bash\ncurl https://your-ref-gw.xupastack.com/storage/v1/bucket \\\n  -H "apikey: your-anon-key"\n\`\`\`\n\nExpected: a JSON array listing your storage buckets.\n\n### Realtime (WebSockets)\n\nWebSocket connections can't be tested with curl. Instead, open browser DevTools → **Network** tab → filter by **WS**. Load your app and you should see a connection to your gateway URL with status **101 Switching Protocols**.\n\n### Full client smoke test\n\n\`\`\`javascript\nimport { createClient } from '@supabase/supabase-js'\n\nconst supabase = createClient(\n  'https://your-ref-gw.xupastack.com',\n  'your-anon-key'\n)\n\nconst { data, error } = await supabase\n  .from('your_table')\n  .select('*')\n  .limit(1)\n\nconsole.log('Gateway test:', { data, error })\n\`\`\`\n\nIf \`data\` returns and \`error\` is null, all layers (DNS, HTTP, auth headers) are working.\n\n## Common issues\n\n### ❌ REST times out\nDouble-check your gateway URL in the XupaStack console. Confirm your Supabase project is active and not paused.\n\n### ❌ Auth redirect mismatch\nAdd your gateway URL to **Supabase Dashboard → Authentication → URL Configuration → Redirect URLs**.\n\n### ❌ Realtime shows no WS connection\nCheck that Realtime is enabled in your gateway's service settings in the XupaStack console.`
  },
];
