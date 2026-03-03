import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";

const SUPABASE_URL_REGEX = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/;
const DASHBOARD_URL_REGEX = /supabase\.com\/project\//;

export type UrlValidationState = "idle" | "checking" | "valid" | "invalid";

export function useSupabaseUrlValidation(url: string) {
  const [state, setState] = useState<UrlValidationState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setState("idle");
      setError(null);
      return;
    }

    // Client-side checks first
    if (DASHBOARD_URL_REGEX.test(url)) {
      setState("invalid");
      setError("That looks like a dashboard URL. Paste your Project URL from Supabase → Settings → API.");
      return;
    }

    if (!url.startsWith("https://")) {
      setState("invalid");
      setError("URL must start with https://");
      return;
    }

    if (!SUPABASE_URL_REGEX.test(url)) {
      setState("invalid");
      setError("Must be a valid Supabase Project URL (e.g. https://xxxx.supabase.co)");
      return;
    }

    // Client-side OK → hit backend
    setState("checking");
    const timer = setTimeout(async () => {
      try {
        const res = await api.validateSupabaseUrl(url);
        if (res.ok) {
          setState("valid");
          setError(null);
        } else {
          setState("invalid");
          setError(res.error || "Could not reach this Supabase project.");
        }
      } catch {
        setState("invalid");
        setError("Validation request failed. Please try again.");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [url]);

  return { state, error };
}
