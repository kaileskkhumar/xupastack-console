import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { CheckCircle2, XCircle, Loader2, ArrowRight, Server, Zap, AlertTriangle } from "lucide-react";

type TestState = "idle" | "testing" | "reachable" | "blocked" | "invalid";

const SUPABASE_RE = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i;

const BlockTest = () => {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<TestState>("idle");

  const handleTest = useCallback(async () => {
    const trimmed = url.trim().replace(/\/+$/, "");
    if (!SUPABASE_RE.test(trimmed)) {
      setState("invalid");
      return;
    }
    setState("testing");
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      await fetch(`${trimmed}/rest/v1/`, {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal,
      });
      clearTimeout(timeout);
      setState("reachable");
    } catch {
      setState("blocked");
    }
  }, [url]);

  return (
    <section className="py-10 md:py-14">
      <div className="section-container">
        <AnimatedSection className="max-w-2xl mx-auto">
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-base font-bold text-foreground mb-1">Test if you're affected</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Paste your Supabase Project URL to check if your ISP is blocking it.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setState("idle"); }}
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
                  <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-px" />
                  <span>Must be a valid Supabase URL (e.g. <code className="font-mono">https://xxxxx.supabase.co</code>)</span>
                </ResultBanner>
              )}

              {state === "reachable" && (
                <ResultBanner key="reachable" variant="ok">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="font-semibold text-foreground text-sm">Reachable from your network</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Your current connection can reach Supabase. Note: your users on Indian ISPs may still be blocked. Set up a gateway to protect all users.</p>
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
                      <span className="font-semibold text-foreground text-sm">Blocked — your ISP is dropping connections</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Your Supabase project is unreachable from this network. Fix it now:</p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/app/new"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Server className="h-3 w-3" /> Self-host (recommended)
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
        </AnimatedSection>
      </div>
    </section>
  );
};

const ResultBanner = ({ children, variant }: { children: React.ReactNode; variant: "ok" | "blocked" | "warn" }) => {
  const borderClass = variant === "ok" ? "border-emerald-500/30 bg-emerald-500/5" : variant === "blocked" ? "border-destructive/30 bg-destructive/5" : "border-yellow-500/30 bg-yellow-500/5";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className={`mt-4 p-4 rounded-lg border flex items-start gap-2 ${borderClass}`}
    >
      {variant === "warn" ? (
        <>{children}</>
      ) : (
        children
      )}
    </motion.div>
  );
};

export default BlockTest;
