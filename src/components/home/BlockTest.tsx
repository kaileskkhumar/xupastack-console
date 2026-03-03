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
        <AnimatedSection className="max-w-xl mx-auto">
          <div className="relative rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl p-5 md:p-6 overflow-hidden">
            {/* Subtle top accent line */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <h2 className="text-sm font-bold text-foreground mb-1 tracking-tight">Test if you're affected</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Paste your Supabase Project URL to check reachability from this network.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setState("idle"); }}
                onKeyDown={(e) => e.key === "Enter" && handleTest()}
                placeholder="https://xxxxx.supabase.co"
                className="flex-1 h-9 px-3 rounded-lg border border-border bg-background/80 text-foreground text-xs font-mono placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
              />
              <button
                onClick={handleTest}
                disabled={state === "testing" || !url.trim()}
                className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1.5 shrink-0"
              >
                {state === "testing" ? <Loader2 className="h-3 w-3 animate-spin" /> : "Test"}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {state === "invalid" && (
                <ResultBanner key="invalid" variant="warn">
                  <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 shrink-0 mt-px" />
                  <span>Enter a valid Supabase URL — <code className="font-mono text-[11px]">https://xxxxx.supabase.co</code></span>
                </ResultBanner>
              )}

              {state === "reachable" && (
                <ResultBanner key="reachable" variant="ok">
                  <div className="space-y-1.5 w-full">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="font-semibold text-foreground text-xs">Reachable from your network</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">Your connection can reach Supabase — but users on Indian ISPs may still be blocked.</p>
                    <Link to="/app/new" className="inline-flex items-center gap-1 text-[11px] text-primary font-medium hover:underline">
                      Set up a gateway anyway <ArrowRight className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                </ResultBanner>
              )}

              {state === "blocked" && (
                <ResultBanner key="blocked" variant="blocked">
                  <div className="space-y-2 w-full">
                    <div className="flex items-center gap-1.5">
                      <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                      <span className="font-semibold text-foreground text-xs">Blocked — ISP is dropping connections</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Your project is unreachable from this network. Fix it now:</p>
                    <div className="flex flex-wrap gap-1.5">
                      <Link
                        to="/app/new"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-[11px] font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Server className="h-2.5 w-2.5" /> Self-host
                      </Link>
                      <Link
                        to="/app/new"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-border text-[11px] font-medium text-foreground hover:bg-secondary/50 transition-colors"
                      >
                        <Zap className="h-2.5 w-2.5" /> Managed gateway
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
  const cls =
    variant === "ok" ? "border-emerald-500/20 bg-emerald-500/[0.04]" :
    variant === "blocked" ? "border-destructive/20 bg-destructive/[0.04]" :
    "border-yellow-500/20 bg-yellow-500/[0.04]";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className={`mt-3 p-3 rounded-lg border flex items-start gap-2 text-xs ${cls}`}
    >
      {children}
    </motion.div>
  );
};

export default BlockTest;
