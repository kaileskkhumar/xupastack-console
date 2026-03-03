import { Gateway, GatewayMode } from "@/data/gateway-types";

const BASE = (import.meta.env.VITE_API_BASE as string) || "https://api.xupastack.com";

// ---------- capacity event ----------

export const CAPACITY_EVENT = "xupastack:capacity_reached";

// ---------- helpers ----------

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (res.status === 401) {
    throw new AuthError("Unauthorized");
  }

  if (!res.ok) {
    if (res.status === 429) {
      const body = await res.text().catch(() => "");
      try {
        const parsed = JSON.parse(body);
        if (parsed.error === "managed_capacity_reached") {
          window.dispatchEvent(new CustomEvent(CAPACITY_EVENT));
        }
      } catch {}
      throw new Error(body || "Rate limit exceeded");
    }
    const body = await res.text().catch(() => "");
    throw new Error(body || `Request failed: ${res.status}`);
  }

  const text = await res.text();
  if (!text) return undefined as unknown as T;
  return JSON.parse(text);
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

// ---------- public types ----------

export interface CreateAppPayload {
  name: string;
  slug: string;
  mode: GatewayMode;
  upstreamHost: string;
  allowedOrigins: string[];
  allowCredentials: boolean;
  enabledServices: string[];
  rateLimitPerMin: number;
  strictMode: boolean;
  rewriteLocationHeaders: boolean;
  termsAccepted: boolean;
  termsVersion: string;
  privacyVersion: string;
  aupVersion: string;
}

export interface UpdateAppPayload {
  name?: string;
  allowedOrigins?: string[];
  enabledServices?: string[];
  rateLimitPerMin?: number;
  upstreamHost?: string;
  allowCredentials?: boolean;
  strictMode?: boolean;
  rewriteLocationHeaders?: boolean;
  selfhostGatewayUrl?: string;
}

export interface VerifyResult {
  authOk: boolean;
  restOk: boolean;
  storageOk: boolean | null;
  notes: string[];
}

export interface SlugCheckResult {
  available: boolean;
  suggestions?: string[];
}

export interface SupabaseUrlValidation {
  ok: boolean;
  error?: string;
}

export interface LegalVersions {
  termsVersion: string;
  privacyVersion: string;
  aupVersion: string;
}

export interface SnippetsResult {
  snippets: Record<string, string>;
}

export interface DiagnosticsResult {
  authOk: boolean;
  restOk: boolean;
  storageOk: boolean | null;
  notes: string[];
}

export interface ConfigResult {
  configUrl: string;
  expiresAt: string;
}

export interface ProbeResult {
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
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deactivateApp(id: string): Promise<Gateway> {
    return request<Gateway>(`/apps/${id}/deactivate`, { method: "POST" });
  },

  activateApp(id: string): Promise<Gateway> {
    return request<Gateway>(`/apps/${id}/activate`, { method: "POST" });
  },

  deleteApp(id: string): Promise<{ deleted: boolean }> {
    return request<{ deleted: boolean }>(`/apps/${id}`, { method: "DELETE" });
  },

  async getSignedConfigUrl(id: string): Promise<ConfigResult> {
    return request<ConfigResult>(`/apps/${id}/config.json`);
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

  getLegalVersions(): Promise<LegalVersions> {
    return request<LegalVersions>("/legal/versions");
  },

  getSnippets(id: string): Promise<SnippetsResult> {
    return request<SnippetsResult>(`/apps/${id}/snippets`);
  },

  getDiagnostics(id: string): Promise<DiagnosticsResult> {
    return request<DiagnosticsResult>(`/apps/${id}/diagnostics`, { method: "POST" });
  },

  getSnippetByStack(id: string, stack: string): Promise<{ stack: string; snippet: string }> {
    return request<{ stack: string; snippet: string }>(`/apps/${id}/snippets?stack=${encodeURIComponent(stack)}`);
  },

  probeSupabase(url: string): Promise<ProbeResult> {
    // Public endpoint — no credentials needed
    return fetch(`${BASE}/public/probe-supabase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }).then((r) => r.json());
  },
};
