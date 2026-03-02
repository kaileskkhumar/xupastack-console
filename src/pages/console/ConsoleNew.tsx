import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Server, Cloud, Check, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ALL_SERVICES = ["rest", "auth", "storage", "realtime", "functions", "graphql"];

const ConsoleNew = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"self-hosted" | "managed">("self-hosted");
  const [form, setForm] = useState({
    name: "",
    slug: "",
    supabaseUrl: "",
    origins: "",
    services: [...ALL_SERVICES],
    rateLimit: "1000",
  });

  const updateForm = (key: string, value: string | string[]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleService = (s: string) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s],
    }));

  const handleCreate = () => {
    const id = `gw-${Math.random().toString(36).slice(2, 8)}`;
    if (mode === "self-hosted") {
      navigate(`/app/${id}/deploy`);
    } else {
      navigate(`/app/${id}`);
    }
  };

  const canCreate = form.name && form.supabaseUrl;

  return (
    <div className="section-container py-10 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Link
          to="/app"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
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
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                    done ? "bg-primary text-primary-foreground" : active ? "bg-primary/20 text-primary border border-primary/50" : "bg-secondary text-muted-foreground"
                  }`}
                >
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
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Self-hosted card */}
              <button
                onClick={() => setMode("self-hosted")}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  mode === "self-hosted"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border/80"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Server className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">Self-hosted</p>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/15 text-primary">Recommended</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Deploy into your Cloudflare account. You control the data plane — no third-party infrastructure in the request path.
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Shield className="h-3 w-3 text-primary" />
                      <span className="text-[11px] text-muted-foreground">Recommended for production</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${mode === "self-hosted" ? "border-primary" : "border-border"}`}>
                    {mode === "self-hosted" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </div>
              </button>

              {/* Managed card */}
              <button
                onClick={() => setMode("managed")}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  mode === "managed"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border/80"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Cloud className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Managed</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Instant endpoint. Different trust model: a third-party gateway sits in the request path.
                    </p>
                    <span className="text-[11px] text-muted-foreground mt-2 inline-block">Best for prototyping &amp; quick unblocking</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${mode === "managed" ? "border-primary" : "border-border"}`}>
                    {mode === "managed" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setStep(2)}
                className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2"
              >
                Continue <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <button
                onClick={() => setStep(1)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                ← Change mode
              </button>

              <div className="glass-card p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">App name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      placeholder="My Production App"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Slug</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => updateForm("slug", e.target.value)}
                      placeholder="my-production-app"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Supabase Project URL</label>
                  <input
                    type="text"
                    value={form.supabaseUrl}
                    onChange={(e) => updateForm("supabaseUrl", e.target.value)}
                    placeholder="https://xxxxx.supabase.co"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Allowed Origins</label>
                  <input
                    type="text"
                    value={form.origins}
                    onChange={(e) => updateForm("origins", e.target.value)}
                    placeholder="https://myapp.com, https://staging.myapp.com"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-[11px] text-muted-foreground">Comma-separated. Use * for development only.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Enabled Services</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SERVICES.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleService(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          form.services.includes(s)
                            ? "border-primary/50 bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Rate Limit (req/min)</label>
                  <input
                    type="number"
                    value={form.rateLimit}
                    onChange={(e) => updateForm("rateLimit", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={!canCreate}
                className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Create {mode === "self-hosted" ? "& deploy" : "gateway"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ConsoleNew;
