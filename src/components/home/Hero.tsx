import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle, Loader2, AlertTriangle, Search } from "lucide-react";

const SUPABASE_RE = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i;
const API_BASE = import.meta.env.VITE_API_BASE || "https://api.xupastack.com";

type Phase = "idle" | "testing" | "done" | "invalid";
type BrowserResult = { reachable: true; latency: number } | { reachable: false } | null;
type ServerResult = { ok: true } | { ok: false; error: string } | null;

const Hero = () => {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [browserResult, setBrowserResult] = useState<BrowserResult>(null);
  const [serverResult, setServerResult] = useState<ServerResult>(null);

  const resetResults = () => { setBrowserResult(null); setServerResult(null); };

  const handleTest = useCallback(async () => {
    const trimmed = url.trim().replace(/\/+$/, "");
    if (!SUPABASE_RE.test(trimmed + "/") && !SUPABASE_RE.test(trimmed)) {
      setPhase("invalid");
      return;
    }
    setPhase("testing");
    resetResults();

    // Check 1 — Browser fetch (any HTTP response = reachable)
    const browserCheck = (async (): Promise<BrowserResult> => {
      const start = performance.now();
      try {
        await fetch(`${trimmed}/rest/v1/`, {
          method: "GET",
          cache: "no-store",
          signal: AbortSignal.timeout(5000),
        });
        return { reachable: true, latency: Math.round(performance.now() - start) };
      } catch {
        return { reachable: false };
      }
    })();

    // Check 2 — Server probe (no auth needed)
    const serverCheck = (async (): Promise<ServerResult> => {
      try {
        const res = await fetch(`${API_BASE}/public/probe-supabase`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: trimmed }),
        });
        const data = await res.json();
        return data.ok ? { ok: true } : { ok: false, error: data.error || "unknown" };
      } catch {
        return { ok: false, error: "request_failed" };
      }
    })();

    const [br, sr] = await Promise.all([browserCheck, serverCheck]);
    setBrowserResult(br);
    setServerResult(sr);
    setPhase("done");
  }, [url]);

  return (
    <section className="relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="glow-orb absolute w-[600px] h-[600px] -top-[200px] left-1/2 -translate-x-1/2 animate-glow-pulse" />
      <div className="glow-orb absolute w-[300px] h-[300px] top-[100px] left-[15%] opacity-20" />
      <div className="glow-orb absolute w-[200px] h-[200px] top-[200px] right-[10%] opacity-15" />
      <div className="hero-glow absolute inset-0 pointer-events-none" />

      <div className="section-container pt-24 pb-20 md:pt-40 md:pb-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 backdrop-blur-xl text-xs font-bold text-emerald-400 mb-8 shadow-[0_0_24px_-4px_rgba(16,185,129,0.5)]"
          >
            <span className="text-sm">🇮🇳</span>
            Works in India · Open-Source · Free Forever
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-foreground text-balance mb-6">
            Supabase blocked in India?{" "}
            <span className="gradient-text-shimmer">One URL change fixes it.</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 text-balance"
          >
            XupaStack is a free Cloudflare proxy that makes your Supabase app work in India and anywhere else it's restricted.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/app/new"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.4)]"
            >
              Fix My App — Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-xl font-semibold text-sm text-foreground hover:bg-secondary/50 transition-all duration-200"
            >
              How it works ↓
            </a>
          </motion.div>

          {/* Only-change callout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-5 flex items-center justify-center gap-4 text-xs text-muted-foreground"
          >
            <span>Only change the base URL</span>
            <span className="h-3 w-px bg-border" />
            <span>Keys stay the same</span>
            <span className="h-3 w-px bg-border" />
            <span>Rollback = restore original URL</span>
          </motion.div>
        </motion.div>

        {/* Test widget — hidden for now */}
      </div>

      {/* Urgency banner */}
      <div className="border-t border-destructive/20 bg-destructive/[0.06]">
        <div className="section-container py-3 flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground text-center">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse shrink-0" />
          <span>
            Supabase has been blocked by Indian ISPs since Feb 24, 2025.{" "}
            <strong className="text-foreground">365,000+ developers affected.</strong>{" "}
            No official fix timeline.
          </span>
        </div>
      </div>
    </section>
  );
};

const ResultBanner = ({ children, variant }: { children: React.ReactNode; variant: "ok" | "blocked" | "warn" }) => {
  const cls =
    variant === "ok" ? "border-emerald-500/30 bg-emerald-500/5" :
    variant === "blocked" ? "border-destructive/30 bg-destructive/5" :
    "border-yellow-500/30 bg-yellow-500/5";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className={`mt-4 p-4 rounded-lg border ${cls}`}
    >
      {children}
    </motion.div>
  );
};

export default Hero;
