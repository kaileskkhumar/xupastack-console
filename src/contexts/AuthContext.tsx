import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

const API_BASE = import.meta.env.VITE_API_BASE || "https://api.xupastack.com";

function sanitizeNext(value: string | undefined): string {
  if (!value) return "/app";
  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return "/app";
  return trimmed;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGitHub: (next?: string) => void;
  signInWithMagicLink: (email: string, next?: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/me`, { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser({
        id: data.id,
        email: data.email,
        name: data.name || data.email?.split("@")[0] || "User",
        avatarUrl: data.avatar_url || data.avatarUrl,
      });
      // Prefetch apps list so dashboard loads instantly
      queryClient.prefetchQuery({ queryKey: ["apps"], queryFn: () => api.listApps() });
    } catch {
      setUser(null);
    }
  }, [queryClient]);

  useEffect(() => {
    setIsLoading(true);
    fetchMe().finally(() => setIsLoading(false));
  }, [fetchMe]);

  const signInWithGitHub = useCallback((next?: string) => {
    const target = sanitizeNext(next);
    window.location.href = `${API_BASE}/auth/github/start?next=${encodeURIComponent(target)}`;
  }, []);

  const signInWithMagicLink = useCallback(async (email: string, next?: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/email/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, next: sanitizeNext(next) }),
      });

      if (res.status === 429) {
        return { ok: false, error: "Too many attempts. Try again in a minute." };
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return { ok: false, error: body.error || "Couldn't sign in. Please try again." };
      }

      return { ok: true };
    } catch {
      return { ok: false, error: "Couldn't sign in. Please try again." };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
    } catch {
      // proceed even if logout call fails
    }
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchMe();
  }, [fetchMe]);

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGitHub, signInWithMagicLink, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
