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
