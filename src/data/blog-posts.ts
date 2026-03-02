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
    content: `## The problem\n\nSeveral Indian ISPs — including Jio, Airtel, and BSNL — have begun blocking or throttling connections to \`*.supabase.co\` at the DNS or network level. This means your app's API calls, authentication flows, and realtime connections silently fail for end users.\n\n## Why it happens\n\nThe blocking occurs at the network/DNS layer. Your users' devices never reach the Supabase servers. This isn't something you can fix by changing your code logic — you need to route traffic through a different domain.\n\n## The fix\n\nXupaStack provides a gateway that proxies your Supabase traffic through an unblocked domain. You have two options:\n\n### Option 1: Self-host (recommended)\n\nDeploy a Cloudflare Worker in your own account:\n\n\`\`\`bash\nnpx xupastack deploy --project-ref your-project-ref\n\`\`\`\n\n### Option 2: Managed gateway\n\nSwap your Supabase URL immediately:\n\n\`\`\`javascript\nconst supabase = createClient(\n  'https://your-project.xupastack.dev',\n  'your-anon-key'\n)\n\`\`\`\n\nBoth options keep Auth, Storage, Realtime, and Functions working. The self-hosted option gives you full control over the data plane.`
  },
  {
    slug: "why-dns-change-doesnt-fix-users",
    title: "Why changing DNS doesn't fix your users",
    description: "You switched to 1.1.1.1, but your users are still stuck. Here's why DNS changes on your machine don't help end users.",
    date: "2025-02-25",
    readTime: "3 min",
    category: "Explainer",
    content: `## The misconception\n\nWhen developers discover their Supabase app is blocked, the first instinct is to change DNS settings to Cloudflare (1.1.1.1) or Google (8.8.8.8). It works on your machine — so the problem seems solved.\n\n## Why it doesn't work for users\n\nYour users don't control their DNS settings. Most are on mobile devices using their carrier's default DNS. Even those on desktop rarely change DNS configuration.\n\nMore importantly, some ISPs perform deep packet inspection (DPI) or SNI-based blocking that works regardless of DNS settings. The domain \`supabase.co\` is blocked at the network level, not just DNS.\n\n## The real fix\n\nYou need to route traffic through a domain that isn't blocked. A gateway like XupaStack gives your app a new endpoint that resolves and connects successfully on all Indian ISPs.\n\n\`\`\`javascript\n// Before: blocked\nconst SUPABASE_URL = 'https://abc.supabase.co'\n\n// After: works everywhere\nconst SUPABASE_URL = 'https://abc.your-gateway.dev'\n\`\`\`\n\nYour API keys don't change. Your database doesn't change. Only the URL changes.`
  },
  {
    slug: "oauth-breaks-when-backend-blocked",
    title: "OAuth breaks when your backend domain is blocked — here's the fix",
    description: "OAuth redirect flows fail silently when supabase.co is blocked. Learn how to configure redirect-safe authentication through a gateway.",
    date: "2025-02-22",
    readTime: "5 min",
    category: "Authentication",
    content: `## The OAuth problem\n\nOAuth flows (Google, GitHub, Apple sign-in) involve multiple redirects. The typical flow is:\n\n1. User clicks "Sign in with Google"\n2. Redirect to Google's consent screen\n3. Google redirects back to your Supabase auth endpoint\n4. Supabase redirects to your app with tokens\n\nWhen \`supabase.co\` is blocked, step 3 fails. The user sees a timeout or connection error after granting consent.\n\n## The fix\n\nXupaStack proxies the auth endpoints and rewrites redirect URLs so the entire flow stays on an unblocked domain.\n\n### Setup checklist:\n\n1. **Add your gateway URL as a redirect URL** in your Supabase dashboard under Authentication → URL Configuration\n2. **Update your OAuth provider** (Google Console, GitHub, etc.) to include the gateway callback URL\n3. **Configure your client** to use the gateway URL:\n\n\`\`\`javascript\nconst supabase = createClient(GATEWAY_URL, ANON_KEY, {\n  auth: {\n    redirectTo: 'https://your-app.com/auth/callback'\n  }\n})\n\`\`\`\n\n4. **Test the flow end-to-end** on a network where supabase.co is blocked`
  },
  {
    slug: "realtime-websockets-through-gateway",
    title: "Realtime WebSockets through a gateway: what to verify",
    description: "WebSocket connections need special handling when proxied. Here's how to verify Realtime works through your gateway.",
    date: "2025-02-20",
    readTime: "4 min",
    category: "Realtime",
    content: `## WebSocket proxying\n\nSupabase Realtime uses WebSocket connections for live updates. When routing through a gateway, these connections need proper handling.\n\n## What to verify\n\n### 1. WebSocket upgrade works\n\nThe gateway must support HTTP → WebSocket upgrades. XupaStack handles this automatically for both self-hosted and managed deployments.\n\n### 2. Connection stays alive\n\n\`\`\`javascript\nconst channel = supabase\n  .channel('test')\n  .on('postgres_changes', {\n    event: '*',\n    schema: 'public',\n    table: 'messages'\n  }, (payload) => {\n    console.log('Change received:', payload)\n  })\n  .subscribe((status) => {\n    console.log('Subscription status:', status)\n  })\n\`\`\`\n\n### 3. Run the doctor check\n\n\`\`\`bash\nnpx xupastack doctor --check realtime\n\`\`\`\n\nThis verifies WebSocket connections, heartbeat intervals, and message delivery through the gateway.`
  },
  {
    slug: "production-checklist-cors-strict-mode",
    title: "Production checklist: secure CORS and strict mode",
    description: "Before going live, lock down your gateway with proper CORS configuration and strict mode. Here's the complete checklist.",
    date: "2025-02-18",
    readTime: "5 min",
    category: "Security",
    content: `## Why this matters\n\nA misconfigured gateway can expose your Supabase project to unauthorized access. Before going to production, complete this checklist.\n\n## CORS configuration\n\nRestrict which domains can make requests through your gateway:\n\n\`\`\`javascript\n// xupastack.config.js\nexport default {\n  cors: {\n    allowedOrigins: [\n      'https://your-app.com',\n      'https://staging.your-app.com'\n    ],\n    allowCredentials: true\n  }\n}\n\`\`\`\n\n## Strict mode\n\nEnable strict mode to add extra security checks:\n\n\`\`\`javascript\nexport default {\n  strictMode: true,\n  // Only allow specific Supabase services\n  services: {\n    rest: true,\n    auth: true,\n    storage: true,\n    realtime: true,\n    functions: false // disable if not needed\n  }\n}\n\`\`\`\n\n## Rate limiting\n\n\`\`\`javascript\nexport default {\n  rateLimit: {\n    requests: 100,\n    windowMs: 60000 // 1 minute\n  }\n}\n\`\`\`\n\n## Full checklist\n\n- [ ] CORS origins restricted to your domains\n- [ ] Strict mode enabled\n- [ ] Unused services disabled\n- [ ] Rate limits configured\n- [ ] Admin token rotated from default\n- [ ] Custom domain attached (self-host)\n- [ ] Doctor checks passing`
  },
  {
    slug: "self-hosted-vs-managed-trust-model",
    title: "Self-hosted vs managed gateways: choosing the right trust model",
    description: "Both options fix connectivity. But they come with different security and privacy tradeoffs. Here's an honest comparison.",
    date: "2025-02-15",
    readTime: "6 min",
    category: "Security",
    content: `## The trust question\n\nAny gateway sits between your app and your database. The question isn't whether a gateway is safe — it's who controls it.\n\n## Self-hosted\n\n**You control everything.**\n\n- Deploys to your Cloudflare account\n- Runs on your domain\n- Logs are yours\n- No third-party in the request path\n\nBest for: production apps, apps with sensitive data, compliance requirements.\n\n## Managed\n\n**Fastest to start, different trust model.**\n\n- Instant endpoint, no setup\n- XupaStack infrastructure sits in the request path\n- You trust our logging policy and operational security\n- We don't log payloads by default, but you're taking our word for it\n\nBest for: prototypes, hackathons, emergencies.\n\n## Comparison\n\n| Aspect | Self-hosted | Managed |\n|--------|------------|----------|\n| Setup time | ~5 minutes | Instant |\n| Data control | Full | Trust-based |\n| Custom domain | Yes | Shared |\n| Production-ready | Yes | Use with caution |\n| Cost | Your Cloudflare plan | Free |`
  },
  {
    slug: "custom-domain-gateway",
    title: "How to attach a custom domain to your gateway",
    description: "Route your Supabase traffic through your own domain for better branding and trust. Step-by-step guide.",
    date: "2025-02-12",
    readTime: "3 min",
    category: "Guides",
    content: `## Why use a custom domain\n\nA custom domain means your API calls go through \`api.your-app.com\` instead of a generic gateway URL. This improves trust and makes your infrastructure look professional.\n\n## Setup (self-hosted)\n\n### 1. Add your domain to Cloudflare\n\nIf your domain isn't already on Cloudflare, add it to your account.\n\n### 2. Configure the worker route\n\n\`\`\`bash\nnpx xupastack domain:add api.your-app.com\n\`\`\`\n\n### 3. Update DNS\n\nAdd a CNAME record:\n\n\`\`\`\napi.your-app.com → your-worker.your-subdomain.workers.dev\n\`\`\`\n\n### 4. Update your app\n\n\`\`\`javascript\nconst supabase = createClient(\n  'https://api.your-app.com',\n  'your-anon-key'\n)\n\`\`\`\n\n### 5. Verify\n\n\`\`\`bash\nnpx xupastack doctor --url https://api.your-app.com\n\`\`\``
  },
  {
    slug: "debugging-timeouts-dns-sinkholes",
    title: "Debugging timeouts and DNS sinkholes",
    description: "Your app hangs on API calls. Is it blocked? A timeout? A DNS sinkhole? Here's how to diagnose and fix it.",
    date: "2025-02-10",
    readTime: "5 min",
    category: "Troubleshooting",
    content: `## Symptoms\n\n- API calls hang for 30+ seconds then fail\n- \`fetch\` never resolves\n- Works on some networks, not others\n- Works with VPN on\n\n## Diagnosing\n\n### Step 1: Check DNS resolution\n\n\`\`\`bash\nnslookup your-project.supabase.co\n\`\`\`\n\nIf this returns \`0.0.0.0\`, \`127.0.0.1\`, or times out — you're hitting a DNS sinkhole.\n\n### Step 2: Check connectivity\n\n\`\`\`bash\ncurl -v https://your-project.supabase.co/rest/v1/ \\\n  -H "apikey: your-anon-key"\n\`\`\`\n\nLook for:\n- Connection refused → IP-level blocking\n- SSL handshake failure → SNI-based blocking\n- Timeout → DNS sinkhole or packet dropping\n\n### Step 3: Confirm with doctor\n\n\`\`\`bash\nnpx xupastack doctor --project-ref your-project-ref\n\`\`\`\n\nThis runs diagnostics and tells you exactly what's blocked and what's working.`
  },
  {
    slug: "storage-working-when-origin-blocked",
    title: "How to keep Storage working when the origin is blocked",
    description: "File uploads and downloads fail when supabase.co is blocked. Here's how to route Storage through your gateway.",
    date: "2025-02-08",
    readTime: "3 min",
    category: "Storage",
    content: `## The Storage problem\n\nSupabase Storage uses the same \`*.supabase.co\` domain for file uploads and downloads. When the domain is blocked, your users can't upload or retrieve files.\n\n## The fix\n\nXupaStack proxies Storage API calls automatically. No extra configuration needed.\n\n\`\`\`javascript\n// Upload works through the gateway\nconst { data, error } = await supabase.storage\n  .from('avatars')\n  .upload('user-1/avatar.png', file)\n\n// Download URLs are rewritten automatically\nconst { data: urlData } = supabase.storage\n  .from('avatars')\n  .getPublicUrl('user-1/avatar.png')\n\`\`\`\n\n## Signed URLs\n\nSigned URLs are also rewritten to go through the gateway. This means temporary download links work for your users even on blocked networks.\n\n## Large file uploads\n\nFor files over 6MB, Supabase uses multipart uploads. XupaStack handles these correctly, but you may want to increase your Cloudflare Worker's size limit if you're self-hosting:\n\n\`\`\`toml\n# wrangler.toml\n[limits]\nmax_body_size = "100MB"\n\`\`\``
  },
  {
    slug: "doctor-checks-what-success-looks-like",
    title: "Doctor checks: what success looks like",
    description: "Run the doctor command and understand every check. A visual guide to interpreting gateway diagnostics.",
    date: "2025-02-05",
    readTime: "4 min",
    category: "Diagnostics",
    content: `## Running the doctor\n\n\`\`\`bash\nnpx xupastack doctor --project-ref your-project-ref\n\`\`\`\n\n## What each check means\n\n### ✅ DNS Resolution\nThe gateway domain resolves to a valid IP address.\n\n### ✅ REST API\nGET requests to \`/rest/v1/\` return a valid response.\n\n### ✅ Auth\nThe auth endpoints respond correctly. Token exchange works.\n\n### ✅ Storage\nFile upload and download endpoints are accessible.\n\n### ✅ Realtime\nWebSocket connection establishes and heartbeat works.\n\n### ✅ Functions\nEdge function invocation succeeds.\n\n### ✅ GraphQL\nGraphQL endpoint accepts queries.\n\n## Common failures\n\n### ❌ Realtime: WebSocket upgrade failed\nYour proxy might not support WebSocket upgrades. Check your Cloudflare Worker configuration.\n\n### ❌ Auth: Redirect URL mismatch\nYou need to add your gateway URL to the allowed redirect URLs in your Supabase project settings.\n\n### ❌ CORS: Origin not allowed\nAdd your app's domain to the gateway's CORS configuration.`
  },
];
