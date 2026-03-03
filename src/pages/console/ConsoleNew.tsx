import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, RefreshCw, AlertTriangle, ChevronDown, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useCreateApp, useLegalVersions } from "@/hooks/use-apps";
import { useSlugCheck } from "@/hooks/use-slug-check";
import { useSupabaseUrlValidation } from "@/hooks/use-supabase-url-validation";
import { slugify } from "@/lib/slugify";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { GatewayMode } from "@/data/gateway-types";

const ALL_SERVICES = ["rest", "auth", "storage", "functions", "graphql", "realtime"];

const ConsoleNew = () => {
  const navigate = useNavigate();
  const createApp = useCreateApp();
  const { data: legalVersions } = useLegalVersions();
  const [slugManual, setSlugManual] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    supabaseUrl: "",
    mode: "managed" as GatewayMode,
    origins: "",
    services: [...ALL_SERVICES],
    rateLimit: "600",
    allowCredentials: false,
    strictMode: false,
    rewriteLocationHeaders: true,
  });

  const slug = useSlugCheck(form.slug, form.slug.length >= 3);
  const supabaseValidation = useSupabaseUrlValidation(form.supabaseUrl);

  const updateForm = useCallback((key: string, value: string | string[] | boolean) =>
    setForm((f) => ({ ...f, [key]: value })), []);

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: slugManual ? f.slug : slugify(name),
    }));
  };

  const handleSlugChange = (value: string) => {
    setSlugManual(true);
    updateForm("slug", slugify(value));
  };

  const resetSlug = () => {
    setSlugManual(false);
    updateForm("slug", slugify(form.name));
  };

  const toggleService = (s: string) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s],
    }));

  const originsArray = form.origins.split(",").map((o) => o.trim()).filter(Boolean);
  const hasWildcardOrigin = originsArray.length === 0 || originsArray.includes("*");

  const slugTooShort = form.slug.length > 0 && form.slug.length < 3;

  const canCreate =
    form.name &&
    form.slug &&
    form.slug.length >= 3 &&
    form.supabaseUrl &&
    slug.state === "available" &&
    supabaseValidation.state === "valid" &&
    !!legalVersions;

  const handleCreate = async () => {
    setCreateError(null);
    try {
      const gw = await createApp.mutateAsync({
        name: form.name,
        slug: form.slug,
        mode: form.mode,
        upstreamHost: form.supabaseUrl,
        allowedOrigins: originsArray.length > 0 ? originsArray : ["*"],
        allowCredentials: form.allowCredentials,
        enabledServices: form.services,
        rateLimitPerMin: Number(form.rateLimit) || 600,
        strictMode: form.strictMode,
        rewriteLocationHeaders: form.rewriteLocationHeaders,
        termsAccepted: true,
        termsVersion: legalVersions!.termsVersion,
        privacyVersion: legalVersions!.privacyVersion,
        aupVersion: legalVersions!.aupVersion,
      });
      localStorage.setItem("xupastack_show_donation", "1");
      navigate(`/app/${gw.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      try {
        const parsed = JSON.parse(message);
        if (parsed.code === "slug_taken" || parsed.error === "slug_taken") {
          setCreateError("This slug is already taken. Please choose another.");
        } else if (parsed.code === "invalid_supabase_url" || parsed.error === "invalid_supabase_url") {
          setCreateError("The Supabase URL is invalid or unreachable.");
        } else if (parsed.error === "terms_not_accepted") {
          setCreateError("You must accept the terms to continue.");
        } else if (parsed.code === "unauthorized") {
          setCreateError("You're not authorized. Please log in again.");
        } else {
          setCreateError(parsed.message || parsed.error || message);
        }
      } catch {
        setCreateError(message);
      }
    }
  };

  return (
    <div className="section-container py-10 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Link to="/app" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to gateways
        </Link>

        <h1 className="text-2xl font-display font-bold text-foreground mb-1">Create Gateway</h1>
        <p className="text-sm text-muted-foreground mb-8">Connect your Supabase project in under a minute.</p>

        <div className="glass-card p-6 space-y-5">
          {/* Gateway name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Gateway name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="My App"
              maxLength={64}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Slug</label>
              {slugManual && (
                <button onClick={resetSlug} className="inline-flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors">
                  <RefreshCw className="h-3 w-3" /> Reset
                </button>
              )}
            </div>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="my-app"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {/* URL preview */}
            {form.slug && (
              <div className={`rounded-lg border px-3 py-2.5 font-mono text-sm ${
                slugTooShort ? "border-destructive/30 bg-destructive/5 text-destructive" :
                slug.state === "available" ? "border-primary/30 bg-primary/5 text-primary" :
                slug.state === "taken" ? "border-destructive/30 bg-destructive/5 text-destructive" :
                "border-border bg-secondary/30 text-muted-foreground"
              }`}>
                {slugTooShort ? (
                  <span className="flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Slug must be at least 3 characters
                  </span>
                ) : (
                  <>
                    <span>https://{form.slug}-gw.xupastack.com</span>
                    {slug.state === "available" && <CheckCircle2 className="h-3.5 w-3.5 inline ml-2" />}
                  </>
                )}
              </div>
            )}
            {!slugTooShort && slug.state === "checking" && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Checking availability…
              </p>
            )}
            {!slugTooShort && slug.state === "taken" && (
              <div>
                <p className="text-[11px] text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Slug taken, try another
                </p>
                {slug.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {slug.suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSlugManual(true); updateForm("slug", s); }}
                        className="px-2 py-0.5 rounded text-[11px] border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Supabase project URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Supabase project URL</label>
            <input
              type="text"
              value={form.supabaseUrl}
              onChange={(e) => updateForm("supabaseUrl", e.target.value)}
              placeholder="https://xxxxxxxxxxxxxxxxxxxx.supabase.co"
              className={`w-full h-10 px-3 rounded-lg border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                supabaseValidation.state === "invalid" ? "border-destructive" : "border-border"
              }`}
            />
            <p className="text-[11px] text-muted-foreground">Find this in your Supabase project settings → API</p>
            {supabaseValidation.state === "checking" && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Checking…
              </p>
            )}
            {supabaseValidation.state === "valid" && (
              <p className="text-[11px] text-primary flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Valid Supabase project
              </p>
            )}
            {supabaseValidation.state === "invalid" && supabaseValidation.error && (
              <p className="text-[11px] text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {supabaseValidation.error}
              </p>
            )}
          </div>
        </div>

        {/* Legal line */}
        <p className="text-[11px] text-muted-foreground mt-4 leading-relaxed">
          By creating a gateway, you confirm your use complies with our{" "}
          <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{" "}
          <Link to="/terms" className="text-primary hover:underline">Acceptable Use Policy</Link>.
          All proxied traffic is subject to our{" "}
          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>

        {/* Advanced settings */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen} className="mt-4">
          <CollapsibleTrigger className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
            Advanced settings
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="glass-card p-6 space-y-5">
              {/* Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateForm("mode", "managed")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.mode === "managed" ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                  >
                    Managed (recommended)
                  </button>
                  <button
                    onClick={() => updateForm("mode", "selfhost")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.mode === "selfhost" ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                  >
                    Self-hosted
                  </button>
                </div>
                {form.mode === "selfhost" && (
                  <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 mt-2">
                    <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted-foreground">
                      Self-hosted gateways run on your own Cloudflare account. After creating, you'll deploy with one CLI command.
                    </p>
                  </div>
                )}
              </div>

              {/* Allowed Origins */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Allowed origins (CORS)</label>
                <input
                  type="text"
                  value={form.origins}
                  onChange={(e) => updateForm("origins", e.target.value)}
                  placeholder="https://myapp.com, https://staging.myapp.com"
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-[11px] text-muted-foreground">Comma-separated. Default: * (allow all).</p>
              </div>

              {/* Allow Credentials */}
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Allow credentials</label>
                  <p className="text-[11px] text-muted-foreground">Enable if your frontend uses cookies or auth headers.</p>
                </div>
                <Switch checked={form.allowCredentials} onCheckedChange={(v) => updateForm("allowCredentials", v)} />
              </div>
              {form.allowCredentials && hasWildcardOrigin && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-500">Cannot combine credentials with wildcard (*) origins. Add specific origins above.</p>
                </div>
              )}

              {/* Rate Limit */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Rate limit (requests/min)</label>
                <input
                  type="number"
                  value={form.rateLimit}
                  onChange={(e) => updateForm("rateLimit", e.target.value)}
                  min={1}
                  max={10000}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Enabled Services */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Enabled services</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SERVICES.map((s) => (
                    <button key={s} onClick={() => toggleService(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.services.includes(s) ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strict Mode */}
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Strict mode</label>
                  <p className="text-[11px] text-muted-foreground">Only proxy paths belonging to enabled services.</p>
                </div>
                <Switch checked={form.strictMode} onCheckedChange={(v) => updateForm("strictMode", v)} />
              </div>

              {/* Rewrite Location Headers */}
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Rewrite Location headers</label>
                  <p className="text-[11px] text-muted-foreground">Rewrite upstream Location headers to use the gateway URL.</p>
                </div>
                <Switch checked={form.rewriteLocationHeaders} onCheckedChange={(v) => updateForm("rewriteLocationHeaders", v)} />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Create error */}
        {createError && (
          <div className="flex items-start gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/5 mt-4">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-destructive">{createError}</p>
          </div>
        )}

        <button
          onClick={handleCreate}
          disabled={!canCreate || createApp.isPending}
          className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
        >
          {createApp.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {createApp.isPending ? "Creating…" : "Create Gateway"}
        </button>
      </motion.div>
    </div>
  );
};

export default ConsoleNew;
