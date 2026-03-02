import { Gateway, GatewayMode, MOCK_GATEWAYS } from "@/data/mock-gateways";

const BASE = import.meta.env.VITE_API_BASE as string | undefined;
const USE_MOCK = !BASE;

// ---------- helpers ----------

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (USE_MOCK) throw new Error("mock");
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Request failed: ${res.status}`);
  }
  return res.json();
}

// deep-clone so mutations don't leak
let mockStore: Gateway[] = JSON.parse(JSON.stringify(MOCK_GATEWAYS));

// ---------- public types ----------

export interface CreateAppPayload {
  name: string;
  slug: string;
  mode: GatewayMode;
  supabaseUrl: string;
  allowedOrigins: string[];
  enabledServices: string[];
  rateLimit: number;
}

export interface UpdateAppPayload {
  allowedOrigins?: string[];
  enabledServices?: string[];
  rateLimit?: number;
  strictMode?: boolean;
}

export interface VerifyResult {
  services: { name: string; ok: boolean }[];
  allHealthy: boolean;
}

// ---------- API client ----------

export const api = {
  async listApps(): Promise<Gateway[]> {
    try {
      return await request<Gateway[]>("/apps");
    } catch {
      await delay(400);
      return [...mockStore];
    }
  },

  async createApp(payload: CreateAppPayload): Promise<Gateway> {
    try {
      return await request<Gateway>("/apps", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      await delay(600);
      const gw: Gateway = {
        id: `gw-${Math.random().toString(36).slice(2, 8)}`,
        name: payload.name,
        slug: payload.slug,
        mode: payload.mode,
        status: payload.mode === "managed" ? "active" : "needs-setup",
        gatewayUrl: payload.mode === "managed" ? `https://${payload.slug}.xupastack.dev` : "",
        upstreamUrl: payload.supabaseUrl,
        allowedOrigins: payload.allowedOrigins,
        enabledServices: payload.enabledServices,
        rateLimit: payload.rateLimit,
        strictMode: false,
        requestsMonth: 0,
        lastCheck: "Never",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      mockStore.push(gw);
      return gw;
    }
  },

  async getApp(id: string): Promise<Gateway> {
    try {
      return await request<Gateway>(`/apps/${id}`);
    } catch {
      await delay(300);
      const gw = mockStore.find((g) => g.id === id);
      if (!gw) throw new Error("Gateway not found");
      return { ...gw };
    }
  },

  async updateApp(id: string, payload: UpdateAppPayload): Promise<Gateway> {
    try {
      return await request<Gateway>(`/apps/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    } catch {
      await delay(400);
      const idx = mockStore.findIndex((g) => g.id === id);
      if (idx === -1) throw new Error("Gateway not found");
      mockStore[idx] = { ...mockStore[idx], ...payload };
      return { ...mockStore[idx] };
    }
  },

  async deactivateApp(id: string): Promise<Gateway> {
    try {
      return await request<Gateway>(`/apps/${id}/deactivate`, { method: "POST" });
    } catch {
      await delay(400);
      const idx = mockStore.findIndex((g) => g.id === id);
      if (idx === -1) throw new Error("Gateway not found");
      mockStore[idx].status = mockStore[idx].status === "paused" ? "active" : "paused";
      return { ...mockStore[idx] };
    }
  },

  async deleteApp(id: string): Promise<void> {
    try {
      await request<void>(`/apps/${id}`, { method: "DELETE" });
    } catch {
      await delay(500);
      mockStore = mockStore.filter((g) => g.id !== id);
    }
  },

  async getSignedConfigUrl(id: string): Promise<string> {
    try {
      const { url } = await request<{ url: string }>(`/apps/${id}/config.json`);
      return url;
    } catch {
      await delay(200);
      return `${BASE || "https://api.xupastack.dev"}/apps/${id}/config.json?token=mock-token`;
    }
  },

  async verifyApp(id: string): Promise<VerifyResult> {
    try {
      return await request<VerifyResult>(`/apps/${id}/verify`, { method: "POST" });
    } catch {
      await delay(800);
      return {
        services: ["REST", "Auth", "Storage", "Realtime", "Functions"].map((name) => ({
          name,
          ok: true,
        })),
        allHealthy: true,
      };
    }
  },
};
