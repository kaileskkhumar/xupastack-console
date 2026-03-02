import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Copy, Check, ExternalLink, Pause, Trash2, Server, Cloud, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import StatusBadge from "@/components/console/StatusBadge";
import StackTabs from "@/components/console/StackTabs";
import ConfirmModal from "@/components/console/ConfirmModal";
import CodeBlock from "@/components/CodeBlock";
import { useApp, useDeactivateApp, useDeleteApp } from "@/hooks/use-apps";

const STACK_TABS = [
  { label: "Next.js", value: "nextjs" },
  { label: "Vite", value: "vite" },
  { label: "Expo", value: "expo" },
  { label: "Flutter", value: "flutter" },
  { label: "Node", value: "node" },
];

const ConsoleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: gw, isLoading, isError } = useApp(id);
  const deactivate = useDeactivateApp(id!);
  const deleteApp = useDeleteApp();

  const [copied, setCopied] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const copyUrl = async () => {
    if (!gw) return;
    await navigator.clipboard.writeText(gw.gatewayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSnippet = (stack: string) => {
    const url = gw?.gatewayUrl || "https://your-gateway.xupastack.dev";
    const snippets: Record<string, string> = {
      nextjs: `// .env.local\nNEXT_PUBLIC_SUPABASE_URL=${url}`,
      vite: `// .env\nVITE_SUPABASE_URL=${url}`,
      expo: `// app.config.js\nextra: {\n  supabaseUrl: "${url}"\n}`,
      flutter: `// lib/supabase.dart\nfinal supabase = Supabase.initialize(\n  url: '${url}',\n  anonKey: 'YOUR_ANON_KEY',\n);`,
      node: `// supabase.js\nconst supabase = createClient(\n  '${url}',\n  process.env.SUPABASE_ANON_KEY\n)`,
    };
    return snippets[stack] || snippets.nextjs;
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

  return (
    <div className="section-container py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Link to="/app" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to gateways
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-display font-bold text-foreground">{gw.name}</h1>
              <StatusBadge status={gw.status} />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {gw.mode === "self-hosted" ? <Server className="h-3 w-3" /> : <Cloud className="h-3 w-3" />}
              {gw.mode === "self-hosted" ? "Self-hosted" : "Managed"} · Created {gw.createdAt}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/app/${gw.id}/settings`} className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
              <Settings className="h-3.5 w-3.5" /> Settings
            </Link>
          </div>
        </div>

        {/* Gateway URL */}
        {gw.gatewayUrl && (
          <div className="glass-card p-4 mb-6 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Gateway URL</p>
              <p className="text-sm font-mono text-foreground truncate">{gw.gatewayUrl}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={copyUrl} className="h-8 px-3 rounded-lg border border-border text-xs font-medium flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <a href={gw.gatewayUrl} target="_blank" rel="noopener" className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {/* Managed mode callout */}
        {gw.mode === "managed" && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 flex items-start gap-3">
            <Server className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium">Consider self-hosted mode</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">For maximum privacy and control, deploy into your own Cloudflare account. Self-hosted mode is free and keeps your data plane under your control.</p>
              <Link to="/app/new" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-2">Create a self-hosted gateway →</Link>
            </div>
          </div>
        )}

        {/* Integration snippet */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-3">Quick integration</h3>
          <StackTabs tabs={STACK_TABS}>
            {(tab) => <CodeBlock code={getSnippet(tab)} language={tab} />}
          </StackTabs>
        </div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Requests this month</p>
            <p className="text-xl font-display font-bold text-foreground">{gw.requestsMonth.toLocaleString()}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Rate limit</p>
            <p className="text-xl font-display font-bold text-foreground">{gw.rateLimit}/min</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Last check</p>
            <p className="text-xl font-display font-bold text-foreground">{gw.lastCheck}</p>
          </div>
        </div>

        {/* Details */}
        <div className="glass-card p-6 mb-8 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Details</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Upstream</p>
              <p className="font-mono text-foreground text-xs">{gw.upstreamUrl}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Allowed Origins</p>
              <p className="font-mono text-foreground text-xs">{gw.allowedOrigins.join(", ") || "None"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Services</p>
              <div className="flex flex-wrap gap-1.5">
                {gw.enabledServices.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded text-[11px] bg-secondary text-foreground font-medium">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Strict Mode</p>
              <p className="text-foreground text-xs">{gw.strictMode ? "Enabled" : "Disabled"}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="glass-card p-6 space-y-4 border-destructive/20">
          <h3 className="text-sm font-semibold text-foreground">Danger Zone</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setDeactivateOpen(true)}
              disabled={deactivate.isPending}
              className="h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {deactivate.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pause className="h-3.5 w-3.5" />}
              {gw.status === "paused" ? "Reactivate" : "Deactivate"}
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              disabled={deleteApp.isPending}
              className="h-9 px-4 rounded-lg border border-destructive/50 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {deleteApp.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Delete
            </button>
          </div>
        </div>
      </motion.div>

      <ConfirmModal
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={() => { deactivate.mutate(); setDeactivateOpen(false); }}
        title={gw.status === "paused" ? "Reactivate gateway?" : "Deactivate gateway?"}
        description={gw.status === "paused" ? "This will resume traffic routing through this gateway." : "Traffic will stop flowing through this gateway. You can reactivate it anytime."}
        confirmLabel={gw.status === "paused" ? "Reactivate" : "Deactivate"}
      />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => { await deleteApp.mutateAsync(gw.id); navigate("/app"); }}
        title="Delete gateway?"
        description="This action is irreversible. All configuration and history for this gateway will be permanently removed."
        confirmLabel="Delete gateway"
        variant="danger"
      />
    </div>
  );
};

export default ConsoleDetail;
