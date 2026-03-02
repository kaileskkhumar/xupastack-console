import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, ArrowRight, ClipboardCopy, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Stepper from "@/components/console/Stepper";
import CodeBlock from "@/components/CodeBlock";
import { toast } from "sonner";
import {
  STACKS, Stack, CHECKLIST_ITEMS, DOCTOR_SERVICES,
  getEnvSnippet, fixEnvLine, getAllStepsCopyText,
} from "@/data/quickstart-helpers";

const STEPS = ["Deploy", "Swap URL", "Auth checklist", "Verify", "Lock down"];

const ConsoleDeploy = () => {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [gatewayUrl, setGatewayUrl] = useState("");
  const [stack, setStack] = useState<Stack>("Next.js");
  const [checklist, setChecklist] = useState<boolean[]>(new Array(CHECKLIST_ITEMS.length).fill(false));
  const [envInput, setEnvInput] = useState("");

  const next = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const toggleCheck = (i: number) =>
    setChecklist((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const copyAll = async () => {
    await navigator.clipboard.writeText(getAllStepsCopyText(gatewayUrl, id));
    toast.success("All steps copied to clipboard");
  };

  const fixedLine = envInput ? fixEnvLine(envInput, gatewayUrl) : null;

  return (
    <div className="section-container py-10 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Link to={`/app/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to gateway
        </Link>

        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl font-display font-bold text-foreground">Deploy Self-Hosted Gateway</h1>
          <button
            onClick={copyAll}
            className="shrink-0 h-8 px-3 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5"
          >
            <ClipboardCopy className="h-3.5 w-3.5" /> Copy all steps
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Follow these steps to deploy your gateway to Cloudflare Workers.</p>

        {/* Stack picker */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-medium text-muted-foreground">Stack</span>
          <div className="relative">
            <select
              value={stack}
              onChange={(e) => setStack(e.target.value as Stack)}
              className="appearance-none h-8 pl-3 pr-7 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              {STACKS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Checklist */}
        <div className="glass-card p-5 mb-8 space-y-2.5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Quickstart Checklist</h3>
          {CHECKLIST_ITEMS.map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => toggleCheck(i)}
                className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  checklist[i]
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border hover:border-foreground/30"
                }`}
              >
                {checklist[i] && <Check className="h-3 w-3" />}
              </div>
              <span className={`text-xs transition-colors ${checklist[i] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {item}
              </span>
            </label>
          ))}
          <p className="text-xs text-muted-foreground pt-1">
            {checklist.filter(Boolean).length}/{CHECKLIST_ITEMS.length} complete
          </p>
        </div>

        <Stepper steps={STEPS} currentStep={currentStep}>
          {currentStep === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Clone and deploy the XupaStack worker to your Cloudflare account.</p>
              <CodeBlock code={`npx xupastack init --gateway ${id}`} title="1. Initialize" />
              <CodeBlock code="npx wrangler deploy" title="2. Deploy to Cloudflare" />
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium text-foreground">Deployed gateway URL (optional)</label>
                <input
                  type="text"
                  value={gatewayUrl}
                  onChange={(e) => setGatewayUrl(e.target.value)}
                  placeholder="https://gw-prod.your-domain.workers.dev"
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Replace your Supabase URL with the gateway URL. Snippets below are for <strong className="text-foreground">{stack}</strong>.
              </p>
              <CodeBlock code={getEnvSnippet(stack, gatewayUrl)} title={stack} />
              <p className="text-xs text-muted-foreground">Your anon key stays the same — the gateway proxies to your real Supabase project.</p>

              {/* Env fixer */}
              <div className="glass-card p-4 space-y-3 mt-2">
                <h4 className="text-xs font-semibold text-foreground">Paste your current env line</h4>
                <input
                  type="text"
                  value={envInput}
                  onChange={(e) => setEnvInput(e.target.value)}
                  placeholder="NEXT_PUBLIC_SUPABASE_URL=https://abc.supabase.co"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {fixedLine && (
                  <CodeBlock code={fixedLine} title="Corrected" />
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Update your Supabase project's auth settings to allow redirects from the gateway.</p>
              <CodeBlock code={`${gatewayUrl || "https://your-gateway.workers.dev"}/auth/v1/callback`} title="Callback URL" />
              <div className="glass-card p-5 space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Auth redirect checklist</h4>
                {[
                  "Add callback URL to Supabase Dashboard → Auth → URL Configuration",
                  "Update OAuth provider (Google, GitHub, etc.) callback URL",
                  "Test a full sign-in + redirect cycle",
                ].map((item, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-0.5 accent-primary" />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Run the doctor command to verify all services are accessible through the gateway.</p>
              <CodeBlock code="npx xupastack doctor" title="Verify gateway" />
              {/* Doctor success output */}
              <div className="glass-card p-5">
                <h4 className="text-sm font-semibold text-foreground mb-3">Expected output</h4>
                <div className="space-y-1.5 font-mono text-xs">
                  {DOCTOR_SERVICES.map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span className="text-foreground">{s}</span>
                      <span className="text-emerald-400 ml-auto">OK</span>
                    </div>
                  ))}
                  <div className="border-t border-border mt-3 pt-3 text-emerald-400">
                    All services healthy — gateway is ready.
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Lock down your gateway for production use.</p>
              <div className="glass-card p-5 space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Production checklist</h4>
                {[
                  "Replace wildcard (*) origins with exact production domains",
                  "Enable strict mode to reject invalid origins",
                  "Enable rate limiting",
                  "Disable unused services",
                  "Set up monitoring on Cloudflare dashboard",
                ].map((item, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-0.5 accent-primary" />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">{item}</span>
                  </label>
                ))}
              </div>
              <Link
                to={`/app/${id}/settings`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Open settings <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6">
            <button
              onClick={prev}
              disabled={currentStep === 0}
              className="h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-30"
            >
              Back
            </button>
            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={next}
                className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Next <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Link
                to={`/app/${id}`}
                className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Done <Check className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </Stepper>
      </motion.div>
    </div>
  );
};

export default ConsoleDeploy;
