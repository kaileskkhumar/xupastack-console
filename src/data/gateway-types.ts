export type GatewayMode = "managed" | "selfhost";
export type GatewayStatus = "active" | "disabled" | "needs-setup" | "error";

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
  rateLimitPerMin: number;
  strictMode: boolean;
  requestsMonth: number;
  lastCheck: string;
  createdAt: string;
}
