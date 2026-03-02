import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useApp, useUpdateApp } from "@/hooks/use-apps";

const ALL_SERVICES = ["rest", "auth", "storage", "realtime", "functions", "graphql"];

const ConsoleSettings = () => {
  const { id } = useParams();
  const { data: gw, isLoading } = useApp(id);
  const updateApp = useUpdateApp(id!);

  const [origins, setOrigins] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [rateLimit, setRateLimit] = useState("");
  const [strictMode, setStrictMode] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Sync form state when data arrives
  if (gw && !initialized) {
    setOrigins(gw.allowedOrigins.join(", "));
    setServices([...gw.enabledServices]);
    setRateLimit(String(gw.rateLimit));
    setStrictMode(gw.strictMode);
    setInitialized(true);
  }

  const toggleService = (s: string) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleSave = () => {
    updateApp.mutate({
      allowedOrigins: origins.split(",").map((o) => o.trim()).filter(Boolean),
      enabledServices: services,
      rateLimit: Number(rateLimit) || 1000,
      strictMode,
    });
  };

  if (isLoading || !gw) {
    return (
      <div className="section-container py-10 flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="section-container py-10 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Link to={`/app/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to gateway
        </Link>

        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Settings</h1>
        <p className="text-sm text-muted-foreground mb-8">Configure CORS, rate limits, and service toggles for {gw.name}.</p>

        <div className="space-y-6">
          {/* Origins */}
          <div className="glass-card p-6 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Allowed Origins (CORS)</h3>
            <input
              type="text"
              value={origins}
              onChange={(e) => setOrigins(e.target.value)}
              placeholder="https://myapp.com, https://staging.myapp.com"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-[11px] text-muted-foreground">Comma-separated. Use * for development only — never in production.</p>
          </div>

          {/* Services */}
          <div className="glass-card p-6 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Enabled Services</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_SERVICES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleService(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    services.includes(s)
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">Disable unused services to reduce attack surface.</p>
          </div>

          {/* Rate limit */}
          <div className="glass-card p-6 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Rate Limit</h3>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                className="w-32 h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm text-muted-foreground">requests / minute</span>
            </div>
          </div>

          {/* Strict mode */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Strict Mode</h3>
                <p className="text-xs text-muted-foreground mt-1">Block requests without a valid origin header</p>
              </div>
              <button
                onClick={() => setStrictMode(!strictMode)}
                className={`w-11 h-6 rounded-full relative transition-colors ${
                  strictMode ? "bg-primary" : "bg-secondary border border-border"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                    strictMode ? "left-[22px] bg-primary-foreground" : "left-1 bg-muted-foreground"
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={updateApp.isPending}
            className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {updateApp.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {updateApp.isPending ? "Saving…" : "Save settings"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConsoleSettings;
