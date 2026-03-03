export type GatewayMode = "managed" | "selfhost";
export type GatewayStatus = "active" | "disabled";

export interface Gateway {
  id: string;
  userId: string;
  name: string;
  slug: string;
  mode: GatewayMode;
  status: GatewayStatus;
  upstreamHost: string;
  upstreamUrl: string;
  gatewayUrl: string | null;
  allowedOrigins: string[];
  allowCredentials: boolean;
  enabledServices: string[];
  rateLimitPerMin: number;
  strictMode: boolean;
  rewriteLocationHeaders: boolean;
  proxyUrl: string | null;
  selfhostGatewayUrl: string | null;
  createdAt: number;
  updatedAt: number;
}
