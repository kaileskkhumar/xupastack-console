import { useEffect, useState } from "react";
import { api, SlugCheckResult } from "@/lib/api-client";

export function useSlugCheck(slug: string, enabled: boolean) {
  const [state, setState] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!slug || !enabled) {
      setState("idle");
      setSuggestions([]);
      return;
    }

    setState("checking");
    const timer = setTimeout(async () => {
      try {
        const res: SlugCheckResult = await api.checkSlug(slug);
        if (res.available) {
          setState("available");
          setSuggestions([]);
        } else {
          setState("taken");
          setSuggestions(res.suggestions ?? [`${slug}-1`, `${slug}-2`, `${slug}-app`]);
        }
      } catch {
        // On network error, don't block — just reset
        setState("idle");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [slug, enabled]);

  return { state, suggestions };
}
