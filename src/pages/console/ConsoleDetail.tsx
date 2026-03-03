import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Loader2, Save, Terminal, Clock, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useApp, useDeleteApp, useUpdateApp } from "@/hooks/use-apps";
import DetailHeader from "@/components/console/detail/DetailHeader";
import GatewayUrlCard from "@/components/console/detail/GatewayUrlCard";
import GoLiveChecklist from "@/components/console/detail/GoLiveChecklist";
import IntegrationSnippets from "@/components/console/detail/IntegrationSnippets";
import DiagnosticsCard from "@/components/console/detail/DiagnosticsCard";
import DonationPopup from "@/components/console/DonationPopup";
import CapacityModal from "@/components/console/CapacityModal";
import CopyButton from "@/components/console/CopyButton";
import { api } from "@/lib/api-client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useRef } from "react";

const ConsoleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: gw, isLoading, isError } = useApp(id);
  const deleteApp = useDeleteApp();
  const updateApp = useUpdateApp(id!);
  const [activeTab, setActiveTab] = useState("overview");

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

  // Selfhost with no gateway URL → deploy onboarding
  if (gw.mode === "selfhost" && !gw.gatewayUrl) {
    return (
      <div className="section-container py-10 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <DetailHeader gw={gw} />
          <SelfHostOnboarding appId={gw.id} />
        </motion.div>
        <CapacityModal onSelfHost={() => {}} />
        <DonationPopup />
      </div>
    );
  }

  // Managed or selfhost with gatewayUrl set
  const isManagedMode = gw.mode === "managed";

  return (
    <div className="section-container py-10 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <DetailHeader gw={gw} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="snippets">Snippets</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
            {isManagedMode && <TabsTrigger value="config-export">Config Export</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview">
            {gw.gatewayUrl && <GatewayUrlCard url={gw.gatewayUrl} />}
            <GoLiveChecklist gw={gw} onDelete={handleDelete} isDeleting={deleteApp.isPending} />
          </TabsContent>

          <TabsContent value="snippets">
            <IntegrationSnippets appId={gw.id} gatewayUrl={gw.gatewayUrl} mode={gw.mode} />
          </TabsContent>

          <TabsContent value="diagnostics">
            <DiagnosticsCard appId={gw.id} />
          </TabsContent>

          {isManagedMode && (
            <TabsContent value="config-export">
              <ConfigExportTab appId={gw.id} />
            </TabsContent>
          )}
        </Tabs>
      </motion.div>

      <CapacityModal onSelfHost={() => {}} />
      <DonationPopup />
    </div>
  );
};

// ── Selfhost Onboarding (State 1) ──

const SelfHostOnboarding = ({ appId }: { appId: string }) => {
  const updateApp = useUpdateApp(appId);
  const [config, setConfig] = useState<{ configUrl: string; expiresAt: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [workerUrl, setWorkerUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);

  const clearTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  useEffect(() => () => clearTimer(), []);

  const startCountdown = (expiresAt: string) => {
    clearTimer();
    const update = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(diff);
      if (diff <= 0) { clearTimer(); setConfig(null); }
    };
    update();
    timerRef.current = setInterval(update, 1000);
  };

  const handleGetConfig = async () => {
    setLoading(true); setError(null);
    try {
      const result = await api.getSignedConfigUrl(appId);
      setConfig(result);
      startCountdown(result.expiresAt);
    } catch (err: any) {
      setError(err?.name === "AuthError" ? "Session expired — please log in again." : (err instanceof Error ? err.message : "Failed to get config"));
    } finally { setLoading(false); }
  };

  const handleSaveUrl = () => {
    setUrlError(null);
    try { new URL(workerUrl); } catch { setUrlError("Must be a valid URL"); return; }
    if (!workerUrl.startsWith("https://")) { setUrlError("Must start with https://"); return; }
    updateApp.mutate({ selfhostGatewayUrl: workerUrl });
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const importCmd = config ? `npx create-xupastack@latest import --import "${config.configUrl}"` : "";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
        <h2 className="text-lg font-display font-bold text-foreground mb-2">Deploy your gateway</h2>
        <p className="text-sm text-muted-foreground mb-6">Follow these steps to deploy your self-hosted gateway.</p>

        {/* Step 1 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">1</div>
            <h3 className="text-sm font-semibold text-foreground">Get your config URL</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3 ml-10">Click below to generate your config URL (valid for 10 minutes).</p>
          <div className="ml-10">
            {!config ? (
              <>
                <button onClick={handleGetConfig} disabled={loading} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                  {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {loading ? "Generating…" : "Generate Config URL"}
                </button>
                {error && <p className="text-xs text-destructive mt-2">{error}</p>}
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
                  <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-500 font-medium">Expires in {formatTime(secondsLeft)}</p>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 font-mono text-xs">
                  <Terminal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="flex-1 truncate">{importCmd}</span>
                  <CopyButton text={importCmd} />
                </div>
                <button onClick={handleGetConfig} disabled={loading} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <RefreshCw className="h-3 w-3" /> Regenerate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">2</div>
            <h3 className="text-sm font-semibold text-foreground">Deploy with CLI</h3>
          </div>
          <p className="text-xs text-muted-foreground ml-10 leading-relaxed">
            Run the command above in your terminal. You'll need to be logged in to Cloudflare (<code className="font-mono text-foreground">wrangler login</code>) and have Workers enabled. After deploying, Wrangler will print your Worker URL — copy it.
          </p>
        </div>

        {/* Step 3 */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">3</div>
            <h3 className="text-sm font-semibold text-foreground">Register your gateway URL</h3>
          </div>
          <div className="ml-10 space-y-3">
            <input
              type="text"
              value={workerUrl}
              onChange={(e) => setWorkerUrl(e.target.value)}
              placeholder="https://my-worker.my-subdomain.workers.dev"
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
    </div>
  );
};

// ── Config Export Tab ──

const ConfigExportTab = ({ appId }: { appId: string }) => {
  const [config, setConfig] = useState<{ configUrl: string; expiresAt: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  useEffect(() => () => clearTimer(), []);

  const startCountdown = (expiresAt: string) => {
    clearTimer();
    const update = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(diff);
      if (diff <= 0) { clearTimer(); setConfig(null); }
    };
    update();
    timerRef.current = setInterval(update, 1000);
  };

  const handleGenerate = async () => {
    setLoading(true); setError(null);
    try {
      const result = await api.getSignedConfigUrl(appId);
      setConfig(result);
      startCountdown(result.expiresAt);
    } catch (err: any) {
      setError(err?.name === "AuthError" ? "Session expired — please log in again." : (err instanceof Error ? err.message : "Failed to generate config URL"));
    } finally { setLoading(false); }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="rounded-xl border border-border bg-card/30 p-6">
      <h3 className="text-sm font-semibold text-foreground mb-2">Config Export</h3>
      <p className="text-xs text-muted-foreground mb-4">Use this URL with the XupaStack CLI to configure your gateway.</p>

      {!config ? (
        <>
          <button onClick={handleGenerate} disabled={loading} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {loading ? "Generating…" : "Generate config URL"}
          </button>
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
            <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-500 font-medium">Expires in {formatTime(secondsLeft)}</p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 font-mono text-xs break-all">
            <span className="flex-1">{config.configUrl}</span>
            <CopyButton text={config.configUrl} />
          </div>
          <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="h-3 w-3" /> Regenerate
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsoleDetail;
