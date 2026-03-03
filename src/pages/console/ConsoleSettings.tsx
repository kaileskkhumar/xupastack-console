import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useApp, useUpdateApp, useDeleteApp } from "@/hooks/use-apps";
import ConfirmModal from "@/components/console/ConfirmModal";
import { Switch } from "@/components/ui/switch";

const ALL_SERVICES = ["rest", "auth", "storage", "functions", "graphql", "realtime"];

const ConsoleSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: gw, isLoading } = useApp(id);
  const updateApp = useUpdateApp(id!);
  const deleteApp = useDeleteApp();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [name, setName] = useState("");
  const [origins, setOrigins] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [rateLimit, setRateLimit] = useState("");
  const [upstreamHost, setUpstreamHost] = useState("");
  const [allowCredentials, setAllowCredentials] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [rewriteLocationHeaders, setRewriteLocationHeaders] = useState(true);
  const [selfhostGatewayUrl, setSelfhostGatewayUrl] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (gw && !initialized) {
    setName(gw.name);
    setOrigins(gw.allowedOrigins.join(", "));
    setServices([...gw.enabledServices]);
    setRateLimit(String(gw.rateLimitPerMin ?? 600));
    setUpstreamHost(gw.upstreamHost || gw.upstreamUrl || "");
    setAllowCredentials(gw.allowCredentials ?? false);
    setStrictMode(gw.strictMode ?? false);
    setRewriteLocationHeaders(gw.rewriteLocationHeaders ?? true);
    setSelfhostGatewayUrl(gw.selfhostGatewayUrl || "");
    setInitialized(true);
  }

  const toggleService = (s: string) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleSave = () => {
    const payload: Record<string, unknown> = {};
    if (name !== gw?.name) payload.name = name;
    const newOrigins = origins.split(",").map((o) => o.trim()).filter(Boolean);
    if (JSON.stringify(newOrigins) !== JSON.stringify(gw?.allowedOrigins)) payload.allowedOrigins = newOrigins;
    if (JSON.stringify(services) !== JSON.stringify(gw?.enabledServices)) payload.enabledServices = services;
    const rl = Number(rateLimit) || 600;
    if (rl !== gw?.rateLimitPerMin) payload.rateLimitPerMin = rl;
    if (upstreamHost !== (gw?.upstreamHost || gw?.upstreamUrl)) payload.upstreamHost = upstreamHost;
    if (allowCredentials !== gw?.allowCredentials) payload.allowCredentials = allowCredentials;
    if (strictMode !== gw?.strictMode) payload.strictMode = strictMode;
    if (rewriteLocationHeaders !== gw?.rewriteLocationHeaders) payload.rewriteLocationHeaders = rewriteLocationHeaders;
    if (gw?.mode === "selfhost" && selfhostGatewayUrl !== (gw?.selfhostGatewayUrl || "")) {
      payload.selfhostGatewayUrl = selfhostGatewayUrl;
    }
    if (Object.keys(payload).length === 0) return;
    updateApp.mutate(payload as any);
  };

  const handleDelete = async () => {
    if (!gw) return;
    await deleteApp.mutateAsync(gw.id);
    navigate("/app");
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
        <p className="text-sm text-muted-foreground mb-8">Configure {gw.name}.</p>

        <div className="space-y-6">
          {/* Name */}
          <div className="glass-card p-6 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Name</h3>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          {/* Upstream Host */}
          <div className="glass-card p-6 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Supabase project URL</h3>
            <input type="text" value={upstreamHost} onChange={(e) => setUpstreamHost(e.target.value)} placeholder="https://xxxxx.supabase.co" className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          {/* Rate Limit */}
          <div className="glass-card p-6 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Rate Limit</h3>
            <div className="flex items-center gap-3">
              <input type="number" value={rateLimit} onChange={(e) => setRateLimit(e.target.value)} min={1} max={10000} className="w-32 h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <span className="text-sm text-muted-foreground">requests / minute</span>
            </div>
          </div>

          {/* Origins */}
          <div className="glass-card p-6 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Allowed Origins (CORS)</h3>
            <input type="text" value={origins} onChange={(e) => setOrigins(e.target.value)} placeholder="*, https://myapp.com" className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <p className="text-[11px] text-muted-foreground">Comma-separated. Default: *</p>
          </div>

          {/* Toggles */}
          <div className="glass-card p-6 space-y-5">
            <h3 className="text-sm font-semibold text-foreground">Advanced</h3>

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-foreground">Allow credentials</label>
                <p className="text-[11px] text-muted-foreground">Enable if your frontend uses cookies or auth headers.</p>
              </div>
              <Switch checked={allowCredentials} onCheckedChange={setAllowCredentials} />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-foreground">Strict mode</label>
                <p className="text-[11px] text-muted-foreground">Only proxy paths belonging to enabled services.</p>
              </div>
              <Switch checked={strictMode} onCheckedChange={setStrictMode} />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-foreground">Rewrite Location headers</label>
                <p className="text-[11px] text-muted-foreground">Rewrite upstream Location headers to use the gateway URL.</p>
              </div>
              <Switch checked={rewriteLocationHeaders} onCheckedChange={setRewriteLocationHeaders} />
            </div>
          </div>

          {/* Services */}
          <div className="glass-card p-6 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Enabled Services</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_SERVICES.map((s) => (
                <button key={s} onClick={() => toggleService(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${services.includes(s) ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Selfhost gateway URL */}
          {gw.mode === "selfhost" && (
            <div className="glass-card p-6 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Gateway URL (Worker URL)</h3>
              <input type="text" value={selfhostGatewayUrl} onChange={(e) => setSelfhostGatewayUrl(e.target.value)} placeholder="https://my-worker.workers.dev" className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <p className="text-[11px] text-muted-foreground">Your deployed Cloudflare Worker URL.</p>
            </div>
          )}

          <button onClick={handleSave} disabled={updateApp.isPending} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
            {updateApp.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {updateApp.isPending ? "Saving…" : "Save settings"}
          </button>

          {/* Danger Zone */}
          <div className="glass-card p-6 space-y-4 border-destructive/20">
            <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
            <p className="text-xs text-muted-foreground">Permanently delete this gateway and all its configuration.</p>
            <button onClick={() => setDeleteOpen(true)} disabled={deleteApp.isPending} className="h-9 px-4 rounded-lg border border-destructive/50 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2 disabled:opacity-50">
              {deleteApp.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Delete gateway
            </button>
          </div>
        </div>
      </motion.div>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => { await handleDelete(); setDeleteOpen(false); }}
        title="Delete gateway?"
        description="This action is irreversible. All configuration and history for this gateway will be permanently removed."
        confirmLabel="Delete gateway"
        variant="danger"
      />
    </div>
  );
};

export default ConsoleSettings;
