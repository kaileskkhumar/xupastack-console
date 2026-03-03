export interface ISPData {
  slug: string;
  name: string;
  fullName: string;
  region: string;
  whatsHappening: string[];
  dnsNote: string;
  nslookupDomain: string;
  faqExtra?: { q: string; a: string }[];
}

export const ISP_DATA: Record<string, ISPData> = {
  jio: {
    slug: "jio",
    name: "Jio",
    fullName: "Reliance Jio",
    region: "India",
    whatsHappening: [
      "Jio's DNS resolvers block or throttle requests to Supabase domains.",
      "This is an ISP-level restriction — not a Supabase outage.",
      "Supabase has acknowledged this affects users in India (see their status page).",
      "Your code is fine. Your project is fine. The network is the problem.",
    ],
    dnsNote:
      "Switching to 1.1.1.1 or 8.8.8.8 may work on your dev machine, but it won't fix the issue for your users. Their devices still use Jio's default DNS.",
    nslookupDomain: "your-ref.supabase.co",
    faqExtra: [
      {
        q: "Will a VPN fix this?",
        a: "For you, yes. For your users, no. You can't ask every user to install a VPN.",
      },
    ],
  },
  airtel: {
    slug: "airtel",
    name: "Airtel",
    fullName: "Bharti Airtel",
    region: "India",
    whatsHappening: [
      "Airtel's network intermittently blocks connections to Supabase endpoints.",
      "Users report timeouts on REST, Auth, and Realtime connections.",
      "This is a DNS/routing issue on Airtel's side — not a code bug.",
      "The block is inconsistent: it may work sometimes, then fail randomly.",
    ],
    dnsNote:
      "Custom DNS (like Google or Cloudflare DNS) helps during development but doesn't fix production. Your end users will still hit Airtel's default resolvers.",
    nslookupDomain: "your-ref.supabase.co",
    faqExtra: [
      {
        q: "It works on WiFi but not on mobile data — why?",
        a: "Your WiFi may use a different ISP or custom DNS. Airtel mobile data uses their own resolvers, which are the ones blocking Supabase.",
      },
    ],
  },
  act: {
    slug: "act",
    name: "ACT Fibernet",
    fullName: "ACT Fibernet (Atria Convergence Technologies)",
    region: "India",
    whatsHappening: [
      "ACT Fibernet's DNS resolvers fail to resolve Supabase domains correctly.",
      "Users experience ERR_CONNECTION_TIMED_OUT or slow connections.",
      "This is a network-level issue — your Supabase project is working fine.",
      "ACT's DNS infrastructure has known issues with certain cloud providers.",
    ],
    dnsNote:
      "Changing DNS on your router helps you, but won't help users on other ACT connections. A gateway proxy is the only reliable production fix.",
    nslookupDomain: "your-ref.supabase.co",
    faqExtra: [
      {
        q: "I changed my router DNS and it works now — am I good?",
        a: "Only for your household. Every ACT user visiting your app will still experience the block unless you proxy through a gateway.",
      },
    ],
  },
};

export const STACK_SNIPPETS: Record<string, { label: string; env: string; file: string }> = {
  lovable: {
    label: "Lovable",
    env: `# In Lovable's Supabase integration settings,\n# replace the Supabase URL with your gateway URL:\nhttps://your-ref.gw.xupastack.com`,
    file: "Supabase Settings",
  },
  emergent: {
    label: "Emergent (Bolt)",
    env: `# Update the Supabase URL in your project settings\n# or .env file:\nSUPABASE_URL=https://your-ref.gw.xupastack.com\nSUPABASE_ANON_KEY=your-anon-key`,
    file: ".env",
  },
  nextjs: {
    label: "Next.js",
    env: `# .env.local\nNEXT_PUBLIC_SUPABASE_URL=https://your-ref.gw.xupastack.com\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`,
    file: ".env.local",
  },
  vite: {
    label: "Vite",
    env: `# .env\nVITE_SUPABASE_URL=https://your-ref.gw.xupastack.com\nVITE_SUPABASE_ANON_KEY=your-anon-key`,
    file: ".env",
  },
  node: {
    label: "Node.js",
    env: `# .env\nSUPABASE_URL=https://your-ref.gw.xupastack.com\nSUPABASE_SERVICE_ROLE_KEY=your-service-role-key`,
    file: ".env",
  },
  python: {
    label: "Python",
    env: `# .env\nSUPABASE_URL=https://your-ref.gw.xupastack.com\nSUPABASE_KEY=your-anon-key\n\n# Or in code:\n# supabase = create_client(\n#   "https://your-ref.gw.xupastack.com",\n#   "your-anon-key"\n# )`,
    file: ".env",
  },
  flutter: {
    label: "Flutter",
    env: `// lib/constants.dart\nconst supabaseUrl = 'https://your-ref.gw.xupastack.com';\nconst supabaseAnonKey = 'your-anon-key';`,
    file: "lib/constants.dart",
  },
  expo: {
    label: "Expo",
    env: `// app.config.js\nexport default {\n  extra: {\n    supabaseUrl: 'https://your-ref.gw.xupastack.com',\n    supabaseAnonKey: 'your-anon-key',\n  },\n};`,
    file: "app.config.js",
  },
  other: {
    label: "Other",
    env: `# Find where you initialize the Supabase client.\n# Replace the URL parameter:\n\n# Before:\n# createClient("https://abc.supabase.co", "your-key")\n\n# After:\n# createClient("https://abc.gw.xupastack.com", "your-key")`,
    file: "supabase client init",
  },
};

export const COMMON_FAQ = [
  {
    q: "Is this a Supabase bug?",
    a: "No. Supabase works fine. The issue is your ISP blocking or throttling connections to Supabase's servers.",
  },
  {
    q: "Will Supabase fix this?",
    a: "Supabase can't control ISP-level DNS policies. A proxy gateway is the standard workaround.",
  },
  {
    q: "Is XupaStack free?",
    a: "Yes. XupaStack is open-source and free forever. You can self-host or use our managed gateway.",
  },
  {
    q: "Does this add latency?",
    a: "Negligible. The gateway runs on Cloudflare's edge network. Most users see no measurable difference.",
  },
  {
    q: "Does this work with Realtime / WebSockets?",
    a: "Yes. All Supabase services (REST, Auth, Storage, Realtime, Functions) are proxied automatically.",
  },
  {
    q: "Is my data safe?",
    a: "The gateway is a transparent proxy. It doesn't store, log, or inspect your data. See our security page for details.",
  },
];
