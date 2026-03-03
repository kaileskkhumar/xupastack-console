import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, CheckCircle2, XCircle, Loader2, AlertTriangle, Search } from "lucide-react";

const SUPABASE_RE = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i;

type TestState = "idle" | "testing" | "reachable" | "blocked" | "invalid";

const Hero = () => {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<TestState>("idle");
  const [latency, setLatency] = useState<number | null>(null);

  const handleTest = useCallback(async () => {
    const trimmed = url.trim().replace(/\/+$/, "");
    if (!SUPABASE_RE.test(trimmed + "/")) {
      // re-check without trailing slash
      if (!SUPABASE_RE.test(trimmed)) {
        setState("invalid");
        return;
      }
    }
    setState("testing");
    setLatency(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const start = performance.now();

    const probe = (path: string) =>
      fetch(`${trimmed}${path}`, {
        method: "GET",
        mode: "no-cors",
        cache: "no-store",
        signal: controller.signal,
      });

    try {
      // Race: first successful probe wins
      await new Promise<void>((resolve, reject) => {
        let failures = 0;
        const onFail = () => { failures++; if (failures >= 2) reject(); };
        probe("/rest/v1/").then(() => resolve(), onFail);
        probe("/auth/v1/health").then(() => resolve(), onFail);
      });
      clearTimeout(timeout);
      const ms = Math.round(performance.now() - start);
      setLatency(ms);
      setState("reachable");
    } catch {
      clearTimeout(timeout);
      setState("blocked");
    }
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
            XupaStack routes your Supabase traffic through Cloudflare — not blocked on Jio, Airtel, or ACT Fibernet. Works with every Supabase SDK. Free to start.
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
              Fix it now — it's free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/app/new"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-xl font-semibold text-sm text-foreground hover:bg-secondary/50 transition-all duration-200"
            >
              <Zap className="h-4 w-4" />
              Use managed gateway (fastest)
            </Link>
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
                onChange={(e) => { setUrl(e.target.value); setState("idle"); setLatency(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleTest()}
                placeholder="https://xxxxx.supabase.co"
                className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={handleTest}
                disabled={state === "testing" || !url.trim()}
                className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {state === "testing" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Test"}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {state === "invalid" && (
                <ResultBanner key="invalid" variant="warn">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-500">
                    Must be a valid Supabase URL (e.g.{" "}
                    <code className="font-mono text-xs">https://xxxxx.supabase.co</code>)
                  </p>
                </ResultBanner>
              )}

              {state === "reachable" && (
                <ResultBanner key="reachable" variant="ok">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="font-semibold text-foreground text-sm">
                        Reachable from your network{latency !== null && ` (fastest: ${latency} ms)`}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your current connection can reach Supabase. Note: your users on Indian ISPs may still be blocked. Set up a gateway to protect all users.
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 italic">
                      This test runs from your device. Your users may be on different ISPs.
                    </p>
                    <Link to="/app/new" className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                      Set up a gateway anyway <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </ResultBanner>
              )}

              {state === "blocked" && (
                <ResultBanner key="blocked" variant="blocked">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0" />
                      <span className="font-semibold text-foreground text-sm">
                        Likely blocked or misrouted on your ISP
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Both probes timed out after 5 seconds. Your Supabase project is unreachable from this network. Fix it now:
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 italic">
                      This test runs from your device. Your users may be on different ISPs.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/app/new"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                      >
                        Fix it now — it's free
                      </Link>
                      <Link
                        to="/app/new"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary/50 transition-colors"
                      >
                        <Zap className="h-3 w-3" /> Use managed gateway
                      </Link>
                    </div>
                  </div>
                </ResultBanner>
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
