import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { CheckCircle2, XCircle, Loader2, ArrowRight, Server, Zap, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api-client";

type ProbeState = "idle" | "testing" | "done" | "invalid";

interface ProbeResults {
  browser: { reachable: boolean; status?: number };
  gateway: { ok: boolean; error?: string };
}

const SUPABASE_RE = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i;

const BlockTest = () => {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<ProbeState>("idle");
  const [results, setResults] = useState<ProbeResults | null>(null);

  const handleTest = useCallback(async () => {
    const trimmed = url.trim().replace(/\/+$/, "");
    if (!SUPABASE_RE.test(trimmed)) {
      setState("invalid");
      return;
    }
    setState("testing");

    // Run both probes in parallel
    const [browserResult, gatewayResult] = await Promise.all([
      // Browser probe
      (async (): Promise<ProbeResults["browser"]> => {
        try {
          const res = await fetch(`${trimmed}/rest/v1/`, {
            signal: AbortSignal.timeout(5000),
          });
          // Any HTTP response = reachable
          return { reachable: true, status: res.status };
        } catch {
          return { reachable: false };
        }
      })(),
      // Gateway probe
      (async (): Promise<ProbeResults["gateway"]> => {
        try {
          return await api.probeSupabase(trimmed);
        } catch {
          return { ok: false, error: "Probe failed" };
        }
      })(),
    ]);

    setResults({ browser: browserResult, gateway: gatewayResult });
    setState("done");
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
                onChange={(e) => { setUrl(e.target.value); setState("idle"); setResults(null); }}
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

              {state === "done" && results && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 space-y-3"
                >
                  {/* Two result rows */}
                  <div className="space-y-2">
                    <ProbeRow
                      label="From your network"
                      ok={results.browser.reachable}
                      detail={results.browser.reachable ? `HTTP ${results.browser.status}` : "Connection failed"}
                    />
                    <ProbeRow
                      label="Via XupaStack gateway"
                      ok={results.gateway.ok}
                      detail={results.gateway.ok ? "Reachable" : (results.gateway.error || "Unreachable")}
                    />
                  </div>

                  {/* Interpretation */}
                  <div className={`p-4 rounded-lg border ${getResultBorderClass(results)}`}>
                    {!results.browser.reachable && results.gateway.ok && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Your network is blocked, but XupaStack's gateway can reach Supabase.</p>
                        <p className="text-xs text-muted-foreground">Set up a gateway to fix this.</p>
                        <Link to="/app/new" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity">
                          <Server className="h-3 w-3" /> Set up your gateway →
                        </Link>
                      </div>
                    )}
                    {results.browser.reachable && results.gateway.ok && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Your connection is fine.</p>
                        <p className="text-xs text-muted-foreground">Set up a gateway to protect users on other networks.</p>
                        <Link to="/app/new" className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                          Set up a gateway anyway <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                    {!results.browser.reachable && !results.gateway.ok && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Neither your network nor our gateway can reach this URL.</p>
                        <p className="text-xs text-muted-foreground">Check the Supabase project URL is correct.</p>
                      </div>
                    )}
                    {results.browser.reachable && !results.gateway.ok && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Your network works, but the gateway probe failed.</p>
                        <p className="text-xs text-muted-foreground">This may be a temporary issue. Try again or check the URL.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

const ProbeRow = ({ label, ok, detail }: { label: string; ok: boolean; detail: string }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg border ${ok ? "border-emerald-500/20 bg-emerald-500/[0.04]" : "border-destructive/20 bg-destructive/[0.04]"}`}>
    {ok ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> : <XCircle className="h-4 w-4 text-destructive shrink-0" />}
    <span className="text-sm font-medium text-foreground flex-1">{label}</span>
    <span className={`text-xs ${ok ? "text-emerald-500" : "text-destructive"}`}>{detail}</span>
  </div>
);

const getResultBorderClass = (r: ProbeResults) => {
  if (!r.browser.reachable && r.gateway.ok) return "border-destructive/30 bg-destructive/5";
  if (r.browser.reachable && r.gateway.ok) return "border-emerald-500/30 bg-emerald-500/5";
  return "border-amber-500/30 bg-amber-500/5";
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
      {children}
    </motion.div>
  );
};

export default BlockTest;
