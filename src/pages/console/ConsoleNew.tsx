import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Server, Cloud, Check, Shield, Loader2, AlertCircle, CheckCircle2, RefreshCw, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateApp, useLegalVersions } from "@/hooks/use-apps";
import { useSlugCheck } from "@/hooks/use-slug-check";
import { useSupabaseUrlValidation } from "@/hooks/use-supabase-url-validation";
import { slugify } from "@/lib/slugify";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

const ALL_SERVICES = ["rest", "auth", "storage", "functions", "graphql", "realtime"];

const ConsoleNew = () => {
  const navigate = useNavigate();
  const createApp = useCreateApp();
  const { data: legalVersions } = useLegalVersions();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"selfhost" | "managed">("selfhost");
  const [slugManual, setSlugManual] = useState(false);
  const [consent, setConsent] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    supabaseUrl: "",
    origins: "",
    services: [...ALL_SERVICES],
    rateLimit: "600",
    allowCredentials: false,
    strictMode: false,
    rewriteLocationHeaders: true,
  });

  const slug = useSlugCheck(form.slug, form.slug.length >= 2);
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

  const canCreate =
    form.name &&
    form.slug &&
    form.supabaseUrl &&
    slug.state === "available" &&
    supabaseValidation.state === "valid" &&
    consent &&
    !!legalVersions;

  const handleCreate = async () => {
    setCreateError(null);
    try {
      const gw = await createApp.mutateAsync({
        name: form.name,
        slug: form.slug,
        mode,
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
      if (mode === "selfhost") {
        navigate(`/app/${gw.id}/deploy`);
      } else {
        navigate(`/app/${gw.id}`);
      }
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
        <p className="text-sm text-muted-foreground mb-8">Set up a new XupaStack gateway in two steps.</p>

        {/* Step indicators */}
        <div className="flex items-center gap-3 mb-8">
          {["Choose mode", "Configure"].map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${done ? "bg-primary text-primary-foreground" : active ? "bg-primary/20 text-primary border border-primary/50" : "bg-secondary text-muted-foreground"}`}>
                  {done ? <Check className="h-3.5 w-3.5" /> : n}
                </div>
                <span className={`text-xs font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                {i === 0 && <div className={`w-10 h-px ${done ? "bg-primary/50" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }} className="space-y-4">
              {/* Self-hosted card */}
              <button onClick={() => setMode("selfhost")} className={`w-full text-left p-5 rounded-xl border-2 transition-all ${mode === "selfhost" ? "border-primary bg-primary/5" : "border-border hover:border-border/80"}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Server className="h-5 w-5 text-primary" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">Self-host</p>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/15 text-primary">Recommended</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Deploy into your Cloudflare account. You control the data plane — no third-party infrastructure in the request path.</p>
                    <div className="flex items-center gap-1.5 mt-2"><Shield className="h-3 w-3 text-primary" /><span className="text-[11px] text-muted-foreground">Recommended for production</span></div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${mode === "selfhost" ? "border-primary" : "border-border"}`}>{mode === "selfhost" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}</div>
                </div>
              </button>

              {/* Managed card */}
              <button onClick={() => setMode("managed")} className={`w-full text-left p-5 rounded-xl border-2 transition-all ${mode === "managed" ? "border-primary bg-primary/5" : "border-border hover:border-border/80"}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0"><Cloud className="h-5 w-5 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Managed</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Instant endpoint. Different trust model: a third-party gateway sits in the request path.</p>
                    <span className="text-[11px] text-muted-foreground mt-2 inline-block">Best for prototyping &amp; quick unblocking</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${mode === "managed" ? "border-primary" : "border-border"}`}>{mode === "managed" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}</div>
                </div>
              </button>

              <button onClick={() => setStep(2)} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2">
                Continue <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-5">
              <button onClick={() => setStep(1)} className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-2">← Change mode</button>

              <div className="glass-card p-6 space-y-5">
                {/* Name + Slug */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Gateway name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="My Production App"
                      maxLength={64}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Gateway slug</label>
                      {slugManual && (
                        <button
                          onClick={resetSlug}
                          className="inline-flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors"
                        >
                          <RefreshCw className="h-3 w-3" /> Reset slug
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="my-production-app"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="space-y-1">
                      {form.slug && (
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {mode === "managed"
                            ? `https://${form.slug}-gw.xupastack.com`
                            : "(will be set after deploy)"}
                        </p>
                      )}
                      {slug.state === "checking" && (
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> Checking…
                        </p>
                      )}
                      {slug.state === "available" && (
                        <p className="text-[11px] text-primary flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Available
                        </p>
                      )}
                      {slug.state === "taken" && (
                        <div>
                          <p className="text-[11px] text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Already taken
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
                  </div>
                </div>

                {/* Supabase URL */}
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
                  {supabaseValidation.state === "checking" && (
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" /> Checking…
                    </p>
                  )}
                  {supabaseValidation.state === "valid" && (
                    <p className="text-[11px] text-primary flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Valid Supabase URL
                    </p>
                  )}
                  {supabaseValidation.state === "invalid" && supabaseValidation.error && (
                    <p className="text-[11px] text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {supabaseValidation.error}
                    </p>
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
                  <Switch
                    checked={form.allowCredentials}
                    onCheckedChange={(v) => updateForm("allowCredentials", v)}
                  />
                </div>
                {form.allowCredentials && hasWildcardOrigin && (
                  <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-500">Cannot combine credentials with wildcard (*) origins. Add specific origins above.</p>
                  </div>
                )}

                {/* Enabled Services */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Enabled Services</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SERVICES.map((s) => (
                      <button key={s} onClick={() => toggleService(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.services.includes(s) ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

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
                  <p className="text-[11px] text-muted-foreground">Per-client rate limit enforced by the gateway.</p>
                </div>

                {/* Strict Mode */}
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Strict mode</label>
                    <p className="text-[11px] text-muted-foreground">Only proxy paths belonging to enabled services; block all other paths with 404.</p>
                  </div>
                  <Switch
                    checked={form.strictMode}
                    onCheckedChange={(v) => updateForm("strictMode", v)}
                  />
                </div>

                {/* Rewrite Location Headers */}
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Rewrite Location headers</label>
                    <p className="text-[11px] text-muted-foreground">Rewrite upstream Location headers to use the gateway URL.</p>
                  </div>
                  <Switch
                    checked={form.rewriteLocationHeaders}
                    onCheckedChange={(v) => updateForm("rewriteLocationHeaders", v)}
                  />
                </div>
              </div>

              {/* Consent */}
              <label className="flex items-start gap-3 p-4 rounded-lg border border-border bg-secondary/30 cursor-pointer select-none">
                <Checkbox
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  className="mt-0.5"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I accept the{" "}
                  <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>,{" "}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, and{" "}
                  <Link to="/terms" className="text-primary hover:underline">Acceptable Use Policy</Link>.
                </span>
              </label>

              {/* Create error */}
              {createError && (
                <div className="flex items-start gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive">{createError}</p>
                </div>
              )}

              <button
                onClick={handleCreate}
                disabled={!canCreate || createApp.isPending}
                className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {createApp.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {createApp.isPending ? "Creating…" : `Create ${mode === "selfhost" ? "& deploy" : "gateway"}`}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ConsoleNew;
