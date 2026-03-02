export type GatewayMode = "self-hosted" | "managed";
export type GatewayStatus = "active" | "paused" | "needs-setup" | "error";

export interface Gateway {
  id: string;
  name: string;
  slug: string;
  mode: GatewayMode;
  status: GatewayStatus;
  gatewayUrl: string;
  upstreamUrl: string;
  allowedOrigins: string[];
  enabledServices: string[];
  rateLimit: number;
  strictMode: boolean;
  requestsMonth: number;
  lastCheck: string;
  createdAt: string;
}

export const MOCK_GATEWAYS: Gateway[] = [
  {
    id: "gw-1a2b3c",
    name: "Production App",
    slug: "production-app",
    mode: "self-hosted",
    status: "active",
    gatewayUrl: "https://gw-prod.myapp.workers.dev",
    upstreamUrl: "https://abcdef.supabase.co",
    allowedOrigins: ["https://myapp.com", "https://staging.myapp.com"],
    enabledServices: ["rest", "auth", "storage", "realtime", "functions"],
    rateLimit: 1000,
    strictMode: true,
    requestsMonth: 124853,
    lastCheck: "2 min ago",
    createdAt: "2025-12-01",
  },
  {
    id: "gw-4d5e6f",
    name: "Staging",
    slug: "staging",
    mode: "managed",
    status: "active",
    gatewayUrl: "https://staging.gw.xupastack.com",
    upstreamUrl: "https://ghijkl.supabase.co",
    allowedOrigins: ["*"],
    enabledServices: ["rest", "auth", "storage"],
    rateLimit: 500,
    strictMode: false,
    requestsMonth: 8421,
    lastCheck: "5 min ago",
    createdAt: "2026-01-15",
  },
  {
    id: "gw-7g8h9i",
    name: "Mobile MVP",
    slug: "mobile-mvp",
    mode: "self-hosted",
    status: "needs-setup",
    gatewayUrl: "",
    upstreamUrl: "https://mnopqr.supabase.co",
    allowedOrigins: [],
    enabledServices: ["rest", "auth"],
    rateLimit: 200,
    strictMode: false,
    requestsMonth: 0,
    lastCheck: "Never",
    createdAt: "2026-02-28",
  },
  {
    id: "gw-0j1k2l",
    name: "Demo Project",
    slug: "demo-project",
    mode: "managed",
    status: "paused",
    gatewayUrl: "https://demo.gw.xupastack.com",
    upstreamUrl: "https://stuvwx.supabase.co",
    allowedOrigins: ["https://demo.example.com"],
    enabledServices: ["rest", "auth", "storage", "functions"],
    rateLimit: 100,
    strictMode: false,
    requestsMonth: 312,
    lastCheck: "3 days ago",
    createdAt: "2026-02-10",
  },
];
