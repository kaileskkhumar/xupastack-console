import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Copy, Check, ChevronDown, Trash2, Terminal, Clock, RefreshCw, AlertTriangle, Power, Info, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useApp, useDeleteApp, useUpdateApp, useActivateApp, useDeactivateApp, useDiagnostics, useSnippetByStack } from "@/hooks/use-apps";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import ConfirmModal from "@/components/console/ConfirmModal";
import StatusBadge from "@/components/console/StatusBadge";
import CopyButton from "@/components/console/CopyButton";
import DonationPopup from "@/components/console/DonationPopup";
import CapacityModal from "@/components/console/CapacityModal";
import { api } from "@/lib/api-client";
import { DiagnosticsResult } from "@/lib/api-client";
import SetupChecklist from "@/components/console/detail/SetupChecklist";

const ALL_SERVICES = ["rest", "auth", "storage", "functions", "graphql", "realtime"];
const STACKS = ["supabase-js", "nextjs", "vite", "node", "python", "flutter", "expo", "emergent", "other"];
const STACK_LABELS: Record<string, string> = {
  "supabase-js": "supabase-js", nextjs: "Next.js", vite: "Vite", node: "Node.js",
  python: "Python", flutter: "Flutter", expo: "Expo", emergent: "Emergent", other: "Other",
};

const ConsoleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: gw, isLoading, isError } = useApp(id);
  const deleteApp = useDeleteApp();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async () => {
    if (!gw) return;
    await deleteApp.mutateAsync(gw.id);
    navigate("/app");
  };

  if (isLoading) {
    return (
      <div className="section-container py-10 flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !gw) {
    return (
      <div className="section-container py-10 text-center">
        <p className="text-sm text-destructive mb-4">Gateway not found or failed to load.</p>
        <Link to="/app" className="text-sm text-primary hover:underline">Back to gateways</Link>
      </div>
    );
  }

  const isSelfhostUndeployed = gw.mode === "selfhost" && !gw.gatewayUrl;
  const gatewayUrl = gw.mode === "selfhost" ? gw.selfhostGatewayUrl || gw.gatewayUrl : gw.gatewayUrl;

  return (
    <div className="section-container py-10 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Header */}
        <Link to="/app" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to gateways
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground">{gw.name}</h1>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary text-muted-foreground">
            {gw.mode === "managed" ? "Managed" : "Self-hosted"}
          </span>
        </div>

        {isSelfhostUndeployed ? (
          <>
            <SelfHostOnboarding appId={gw.id} />
            <SettingsSection gw={gw} />
            <DangerZone deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} handleDelete={handleDelete} isDeleting={deleteApp.isPending} />
          </>
        ) : (
          <>
            {/* Section 1 — Gateway URL */}
            <GatewayUrlSection gw={gw} gatewayUrl={gatewayUrl} />

            {/* Setup Checklist */}
            <SetupChecklist appId={gw.id} gatewayUrl={gatewayUrl || ""} upstreamHost={gw.upstreamHost || gw.upstreamUrl || ""} />

            {/* Section 2 — Quick Integration */}
            <QuickIntegrationSection appId={gw.id} />

            {/* Section 3 — Details */}
            <DetailsSection gw={gw} />

            {/* Section 4 — Diagnostics */}
            <DiagnosticsSection appId={gw.id} />

            {/* Section 5 — Settings */}
            <SettingsSection gw={gw} />

            {/* Section 6 — Danger Zone */}
            <DangerZone deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} handleDelete={handleDelete} isDeleting={deleteApp.isPending} />
          </>
        )}
      </motion.div>

      <CapacityModal onSelfHost={() => {}} />
      <DonationPopup />
    </div>
  );
};

// ── Section 1: Gateway URL ──

const GatewayUrlSection = ({ gw, gatewayUrl }: { gw: any; gatewayUrl: string | null }) => {
  const activateApp = useActivateApp(gw.id);
  const deactivateApp = useDeactivateApp(gw.id);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!gatewayUrl) return;
    await navigator.clipboard.writeText(gatewayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isActive = gw.status === "active";
  const toggling = activateApp.isPending || deactivateApp.isPending;

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h2 className="text-lg font-display font-bold text-foreground">Your Gateway URL</h2>
          <p className="text-sm text-muted-foreground">Replace your Supabase project URL with this in your code</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={gw.status} />
          <button
            onClick={() => isActive ? deactivateApp.mutate() : activateApp.mutate()}
            disabled={toggling}
            className={`h-8 px-3 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              isActive
                ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                : "border-primary/30 text-primary hover:bg-primary/10"
            } disabled:opacity-50`}
          >
            {toggling ? <Loader2 className="h-3 w-3 animate-spin" /> : <Power className="h-3 w-3" />}
            {isActive ? "Deactivate" : "Reactivate"}
          </button>
        </div>
      </div>

      {gw.status === "disabled" && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 mb-3">
          <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
          <p className="text-[11px] text-destructive">This gateway is disabled. All requests will return 403.</p>
        </div>
      )}

      {gatewayUrl && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3">
          <p className="text-base font-mono font-semibold text-foreground truncate">{gatewayUrl}</p>
          <button
            onClick={handleCopy}
            className="h-8 px-3 rounded-lg border border-border text-xs font-medium flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
};

// ── Section 2: Quick Integration ──

const QuickIntegrationSection = ({ appId }: { appId: string }) => {
  const [activeStack, setActiveStack] = useState("supabase-js");
  const { data, isLoading } = useSnippetByStack(appId, activeStack);

  return (
    <div className="glass-card p-6 mb-6">
      <h2 className="text-sm font-semibold text-foreground mb-3">Quick Integration</h2>

      {/* Stack tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {STACKS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveStack(s)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              activeStack === s
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-secondary text-muted-foreground hover:text-foreground border border-transparent"
            }`}
          >
            {STACK_LABELS[s] || s}
          </button>
        ))}
      </div>

      {/* Snippet */}
      <div className="relative rounded-lg border bg-background overflow-hidden" style={{ borderColor: "hsl(var(--code-border))", backgroundColor: "hsl(var(--code-bg))" }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : data?.snippet ? (
          <>
            <pre className="p-4 text-sm font-mono overflow-x-auto" style={{ color: "hsl(var(--code-foreground))" }}>
              <code>{data.snippet}</code>
            </pre>
            <div className="absolute top-2 right-2">
              <CopyButton text={data.snippet} />
            </div>
          </>
        ) : (
          <p className="p-4 text-sm text-muted-foreground">No snippet available for this stack.</p>
        )}
      </div>

      {/* Key callout */}
      <div className="flex items-start gap-2 mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Only the URL changes</span> — keep using your original Supabase anon key.
        </p>
      </div>
    </div>
  );
};

// ── Section 3: Details ──

const DetailsSection = ({ gw }: { gw: any }) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 text-center">
          <p className="text-[11px] text-muted-foreground mb-1">Status</p>
          <StatusBadge status={gw.status} />
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-[11px] text-muted-foreground mb-1">Rate Limit</p>
          <p className="text-sm font-semibold text-foreground">{gw.rateLimitPerMin}/min</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-[11px] text-muted-foreground mb-1">Created</p>
          <p className="text-sm font-semibold text-foreground">{new Date(gw.createdAt * 1000).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Detail rows */}
      <div className="glass-card p-4 space-y-3">
        <DetailRow label="Upstream" value={gw.upstreamHost} />
        <DetailRow label="Origins" value={gw.allowedOrigins.join(", ")} />
        <DetailRow label="Services" value={gw.enabledServices.join(", ")} />
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <span className="text-xs text-muted-foreground w-16 shrink-0">{label}</span>
    <span className="text-xs text-foreground font-mono break-all">{value}</span>
  </div>
);

// ── Section 4: Diagnostics ──

const DiagnosticsSection = ({ appId }: { appId: string }) => {
  const [open, setOpen] = useState(false);
  const diagnostics = useDiagnostics(appId);
  const result = diagnostics.data as DiagnosticsResult | undefined;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mb-6">
      <CollapsibleTrigger className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full">
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        Check gateway health
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4">
        <div className="glass-card p-6">
          <button
            onClick={() => diagnostics.mutate()}
            disabled={diagnostics.isPending}
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 mb-4"
          >
            {diagnostics.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {diagnostics.isPending ? "Running…" : "Run diagnostics"}
          </button>

          {result && (
            <div className="space-y-2">
              <DiagRow label="Auth service" ok={result.authOk} />
              <DiagRow label="REST API" ok={result.restOk} />
              <DiagRow label="Storage" ok={result.storageOk} />
              {result.notes.length > 0 && (
                <div className="mt-3 space-y-1">
                  {result.notes.map((n, i) => (
                    <p key={i} className="text-[11px] text-muted-foreground">• {n}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const DiagRow = ({ label, ok }: { label: string; ok: boolean | null }) => (
  <div className="flex items-center gap-2">
    {ok === null ? <MinusCircle className="h-3.5 w-3.5 text-muted-foreground" /> : ok ? <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}
    <span className="text-xs text-foreground">{label}</span>
    <span className="text-[11px] text-muted-foreground">{ok === null ? "N/A" : ok ? "✓" : "✗"}</span>
  </div>
);

// ── Section 5: Settings ──

const SettingsSection = ({ gw }: { gw: any }) => {
  const [open, setOpen] = useState(false);
  const updateApp = useUpdateApp(gw.id);
  const [name, setName] = useState(gw.name);
  const [upstreamHost, setUpstreamHost] = useState(gw.upstreamHost || gw.upstreamUrl || "");
  const [origins, setOrigins] = useState(gw.allowedOrigins.join(", "));
  const [allowCredentials, setAllowCredentials] = useState(gw.allowCredentials ?? false);
  const [services, setServices] = useState([...gw.enabledServices]);
  const [rateLimit, setRateLimit] = useState(String(gw.rateLimitPerMin ?? 600));
  const [strictMode, setStrictMode] = useState(gw.strictMode ?? false);
  const [rewriteLocationHeaders, setRewriteLocationHeaders] = useState(gw.rewriteLocationHeaders ?? true);
  const [selfhostGatewayUrl, setSelfhostGatewayUrl] = useState(gw.selfhostGatewayUrl || "");

  const toggleService = (s: string) =>
    setServices((prev: string[]) => prev.includes(s) ? prev.filter((x: string) => x !== s) : [...prev, s]);

  const handleSave = () => {
    const payload: Record<string, unknown> = {};
    if (name !== gw.name) payload.name = name;
    const newOrigins = origins.split(",").map((o: string) => o.trim()).filter(Boolean);
    if (JSON.stringify(newOrigins) !== JSON.stringify(gw.allowedOrigins)) payload.allowedOrigins = newOrigins;
    if (JSON.stringify(services) !== JSON.stringify(gw.enabledServices)) payload.enabledServices = services;
    const rl = Number(rateLimit) || 600;
    if (rl !== gw.rateLimitPerMin) payload.rateLimitPerMin = rl;
    if (upstreamHost !== (gw.upstreamHost || gw.upstreamUrl)) payload.upstreamHost = upstreamHost;
    if (allowCredentials !== gw.allowCredentials) payload.allowCredentials = allowCredentials;
    if (strictMode !== gw.strictMode) payload.strictMode = strictMode;
    if (rewriteLocationHeaders !== gw.rewriteLocationHeaders) payload.rewriteLocationHeaders = rewriteLocationHeaders;
    if (gw.mode === "selfhost" && selfhostGatewayUrl !== (gw.selfhostGatewayUrl || "")) {
      payload.selfhostGatewayUrl = selfhostGatewayUrl;
    }
    if (Object.keys(payload).length === 0) return;
    updateApp.mutate(payload as any);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mb-6">
      <CollapsibleTrigger className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full">
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        Gateway settings
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4">
        <div className="glass-card p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Supabase project URL</label>
            <input type="text" value={upstreamHost} onChange={(e) => setUpstreamHost(e.target.value)} placeholder="https://xxxxx.supabase.co" className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Allowed origins</label>
            <input type="text" value={origins} onChange={(e) => setOrigins(e.target.value)} placeholder="*, https://myapp.com" className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-foreground">Allow credentials</label>
              <p className="text-[11px] text-muted-foreground">Enable if your frontend uses cookies or auth headers.</p>
            </div>
            <Switch checked={allowCredentials} onCheckedChange={setAllowCredentials} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Rate limit (requests/min)</label>
            <input type="number" value={rateLimit} onChange={(e) => setRateLimit(e.target.value)} min={1} max={10000} className="w-32 h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Enabled services</label>
            <div className="flex flex-wrap gap-2">
              {ALL_SERVICES.map((s) => (
                <button key={s} onClick={() => toggleService(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${services.includes(s) ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
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

          {gw.mode === "selfhost" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Gateway URL (Worker URL)</label>
              <input type="text" value={selfhostGatewayUrl} onChange={(e) => setSelfhostGatewayUrl(e.target.value)} placeholder="https://my-worker.workers.dev" className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          )}

          <button onClick={handleSave} disabled={updateApp.isPending} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
            {updateApp.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {updateApp.isPending ? "Saving…" : "Save settings"}
          </button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// ── Section 6: Danger Zone ──

const DangerZone = ({ deleteOpen, setDeleteOpen, handleDelete, isDeleting }: {
  deleteOpen: boolean;
  setDeleteOpen: (v: boolean) => void;
  handleDelete: () => Promise<void>;
  isDeleting: boolean;
}) => (
  <>
    <div className="glass-card p-6 space-y-4 border-destructive/20">
      <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
      <p className="text-xs text-muted-foreground">Permanently delete this gateway and all its configuration.</p>
      <button onClick={() => setDeleteOpen(true)} disabled={isDeleting} className="h-9 px-4 rounded-lg border border-destructive/50 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2 disabled:opacity-50">
        {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        Delete gateway
      </button>
    </div>
    <ConfirmModal
      open={deleteOpen}
      onClose={() => setDeleteOpen(false)}
      onConfirm={async () => { await handleDelete(); setDeleteOpen(false); }}
      title="Delete gateway?"
      description="This action is irreversible. All configuration and history for this gateway will be permanently removed."
      confirmLabel="Delete gateway"
      variant="danger"
    />
  </>
);

// ── SelfHost Onboarding ──

const SelfHostOnboarding = ({ appId }: { appId: string }) => {
  const updateApp = useUpdateApp(appId);
  const [config, setConfig] = useState<{ configUrl: string; expiresAt: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workerUrl, setWorkerUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleGetConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getSignedConfigUrl(appId);
      setConfig(result);
      setGenerated(true);
    } catch (err: any) {
      setError(err?.name === "AuthError" ? "Session expired — please log in again." : (err instanceof Error ? err.message : "Failed to get config"));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUrl = () => {
    setUrlError(null);
    if (!workerUrl.trim()) { setUrlError("URL is required"); return; }
    if (!workerUrl.startsWith("https://")) { setUrlError("Must start with https://"); return; }
    updateApp.mutate({ selfhostGatewayUrl: workerUrl });
  };

  const importCmd = config
    ? `npx create-xupastack@latest import --import "${config.configUrl}"`
    : null;

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mb-6">
      <h2 className="text-lg font-display font-bold text-foreground mb-1">Deploy your gateway</h2>
      <p className="text-sm text-muted-foreground mb-6">3 steps to get your self-hosted gateway running</p>

      {/* Step 1 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">1</div>
          <h3 className="text-sm font-semibold text-foreground">Generate your config URL</h3>
        </div>
        <div className="ml-10 space-y-3">
          <p className="text-xs text-muted-foreground">This URL contains your gateway configuration. It expires in 10 minutes and can only be used once.</p>
          <button
            onClick={handleGetConfig}
            disabled={loading || generated}
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {loading ? "Generating…" : generated ? "Config URL generated" : "Generate Config URL"}
          </button>
          {error && <p className="text-xs text-destructive">{error}</p>}
          {config && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 font-mono text-xs">
                <span className="flex-1 truncate">{config.configUrl}</span>
                <CopyButton text={config.configUrl} />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Expires at {new Date(config.expiresAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Step 2 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">2</div>
          <h3 className="text-sm font-semibold text-foreground">Deploy to Cloudflare</h3>
        </div>
        <div className="ml-10 space-y-3">
          <p className="text-xs text-muted-foreground">Run this command in your terminal.</p>
          {importCmd ? (
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 font-mono text-xs" style={{ backgroundColor: "hsl(var(--code-bg))", borderColor: "hsl(var(--code-border))" }}>
              <Terminal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="flex-1 truncate" style={{ color: "hsl(var(--code-foreground))" }}>{importCmd}</span>
              <CopyButton text={importCmd} />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">Complete Step 1 first</p>
          )}
          <p className="text-[11px] text-muted-foreground">
            You'll need Node.js 18+ and a Cloudflare account. Run <code className="font-mono text-foreground">npx wrangler login</code> first if you haven't already.
          </p>
        </div>
      </div>

      {/* Step 3 */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">3</div>
          <h3 className="text-sm font-semibold text-foreground">Register your Worker URL</h3>
        </div>
        <div className="ml-10 space-y-3">
          <p className="text-xs text-muted-foreground">
            After deploying, Wrangler will print your Worker URL. It looks like: <code className="font-mono text-foreground">https://my-worker.my-subdomain.workers.dev</code>
          </p>
          <input
            type="text"
            value={workerUrl}
            onChange={(e) => setWorkerUrl(e.target.value)}
            placeholder="https://..."
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {urlError && <p className="text-xs text-destructive">{urlError}</p>}
          <button
            onClick={handleSaveUrl}
            disabled={!workerUrl || updateApp.isPending}
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {updateApp.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Gateway URL
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsoleDetail;
