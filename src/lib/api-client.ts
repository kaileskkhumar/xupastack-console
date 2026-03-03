import { Gateway, GatewayMode } from "@/data/gateway-types";

const BASE = (import.meta.env.VITE_API_BASE as string) || "https://api.xupastack.com";

// ---------- helpers ----------

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Request failed: ${res.status}`);
  }
  return res.json();
}

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

export interface SlugCheckResult {
  available: boolean;
  suggestions?: string[];
}

export interface SupabaseUrlValidation {
  ok: boolean;
  error?: string;
}

// ---------- API client ----------

export const api = {
  listApps(): Promise<Gateway[]> {
    return request<Gateway[]>("/apps");
  },

  createApp(payload: CreateAppPayload): Promise<Gateway> {
    return request<Gateway>("/apps", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getApp(id: string): Promise<Gateway> {
    return request<Gateway>(`/apps/${id}`);
  },

  updateApp(id: string, payload: UpdateAppPayload): Promise<Gateway> {
    return request<Gateway>(`/apps/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deactivateApp(id: string): Promise<Gateway> {
    return request<Gateway>(`/apps/${id}/deactivate`, { method: "POST" });
  },

  deleteApp(id: string): Promise<void> {
    return request<void>(`/apps/${id}`, { method: "DELETE" });
  },

  async getSignedConfigUrl(id: string): Promise<string> {
    const { url } = await request<{ url: string }>(`/apps/${id}/config.json`);
    return url;
  },

  verifyApp(id: string): Promise<VerifyResult> {
    return request<VerifyResult>(`/apps/${id}/verify`, { method: "POST" });
  },

  checkSlug(slug: string): Promise<SlugCheckResult> {
    return request<SlugCheckResult>(`/apps/slug-check?slug=${encodeURIComponent(slug)}`);
  },

  validateSupabaseUrl(url: string): Promise<SupabaseUrlValidation> {
    return request<SupabaseUrlValidation>("/validate/supabase-url", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  },
};
