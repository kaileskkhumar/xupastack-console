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

        {/* Test widget */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-primary" />
              <h2 className="text-base font-bold text-foreground">Test if you're affected</h2>
            </div>

            <label className="block text-sm text-muted-foreground mb-3">
              Supabase Project URL{" "}
              <span className="text-muted-foreground/60 font-mono text-xs">(https://xxxxx.supabase.co)</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setPhase("idle"); resetResults(); }}
                onKeyDown={(e) => e.key === "Enter" && handleTest()}
                placeholder="https://xxxxx.supabase.co"
                className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={handleTest}
                disabled={phase === "testing" || !url.trim()}
                className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {phase === "testing" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Test"}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {phase === "invalid" && (
                <ResultBanner key="invalid" variant="warn">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-500">
                    Must be a valid Supabase URL (e.g.{" "}
                    <code className="font-mono text-xs">https://xxxxx.supabase.co</code>)
                  </p>
                </ResultBanner>
              )}

              {phase === "done" && browserResult && serverResult && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 space-y-3"
                >
                  {/* Row 1 — Browser result */}
                  <div className={`p-3 rounded-lg border flex items-center gap-2 ${browserResult.reachable ? "border-emerald-500/30 bg-emerald-500/5" : "border-destructive/30 bg-destructive/5"}`}>
                    {browserResult.reachable ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="text-sm text-foreground font-medium">From your network: <span className="font-semibold">Reachable</span> ({browserResult.latency} ms)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-destructive shrink-0" />
                        <span className="text-sm text-foreground font-medium">From your network: <span className="font-semibold">Blocked or unreachable</span></span>
                      </>
                    )}
                  </div>

                  {/* Row 2 — Server probe result */}
                  <div className={`p-3 rounded-lg border flex items-center gap-2 ${serverResult.ok ? "border-emerald-500/30 bg-emerald-500/5" : "border-destructive/30 bg-destructive/5"}`}>
                    {serverResult.ok ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="text-sm text-foreground font-medium">Via XupaStack gateway: <span className="font-semibold">Gateway can reach Supabase</span></span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-destructive shrink-0" />
                        <span className="text-sm text-foreground font-medium">Via XupaStack gateway: <span className="font-semibold">Gateway cannot reach Supabase</span></span>
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="pt-1 space-y-2">
                    {browserResult.reachable && serverResult.ok && (
                      <>
                        <p className="text-xs text-muted-foreground">Your connection is fine. You can set up a gateway to protect users on other networks.</p>
                        <Link to="/app/new" className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                          Set up a gateway anyway <ArrowRight className="h-3 w-3" />
                        </Link>
                      </>
                    )}
                    {!browserResult.reachable && serverResult.ok && (
                      <>
                        <p className="text-xs text-muted-foreground">Your network is blocked, but XupaStack's gateway can reach Supabase. A gateway will fix this.</p>
                        <Link
                          to="/app/new"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                        >
                          Set up your gateway <ArrowRight className="h-3 w-3" />
                        </Link>
                      </>
                    )}
                    {!browserResult.reachable && !serverResult.ok && (
                      <p className="text-xs text-muted-foreground">Neither your network nor the gateway can reach this URL. Check that the Supabase project URL is correct and the project is active.</p>
                    )}
                    {browserResult.reachable && !serverResult.ok && (
                      <p className="text-xs text-muted-foreground">XupaStack's gateway cannot reach this Supabase project. Check that the URL is correct.</p>
                    )}
                    <p className="text-[11px] text-muted-foreground/70 italic">
                      This test runs from your device. Server probe runs from Cloudflare's network.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
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
