import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Stepper from "@/components/console/Stepper";
import CodeBlock from "@/components/CodeBlock";

const STEPS = ["Deploy", "Swap URL", "Auth checklist", "Verify", "Lock down"];

const ConsoleDeploy = () => {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [gatewayUrl, setGatewayUrl] = useState("");

  const next = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  return (
    <div className="section-container py-10 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Link to={`/app/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to gateway
        </Link>

        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Deploy Self-Hosted Gateway</h1>
        <p className="text-sm text-muted-foreground mb-8">Follow these steps to deploy your gateway to Cloudflare Workers.</p>

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
              <p className="text-sm text-muted-foreground">Replace <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded">SUPABASE_URL</code> in your app with the gateway URL.</p>
              <CodeBlock
                code={`# .env.local (Next.js)\nNEXT_PUBLIC_SUPABASE_URL=${gatewayUrl || "https://your-gateway.workers.dev"}\n\n# .env (Vite)\nVITE_SUPABASE_URL=${gatewayUrl || "https://your-gateway.workers.dev"}\n\n# Expo: app.config.js\nextra: { supabaseUrl: "${gatewayUrl || "https://your-gateway.workers.dev"}" }`}
                title="Environment variable"
              />
              <p className="text-xs text-muted-foreground">Your <code className="font-mono">SUPABASE_ANON_KEY</code> stays the same — the gateway proxies to your real Supabase project.</p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Update your Supabase project's auth settings to allow redirects from the gateway.</p>
              <div className="glass-card p-5 space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Auth redirect checklist</h4>
                {[
                  `Add ${gatewayUrl || "gateway URL"}/auth/v1/callback to Redirect URLs in Supabase Dashboard → Auth → URL Configuration`,
                  "If using OAuth (Google, GitHub, etc.), update the provider's callback URL to point to the gateway",
                  "Test a full sign-in + redirect cycle before going to production",
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
              <div className="glass-card p-5">
                <h4 className="text-sm font-semibold text-foreground mb-3">What success looks like</h4>
                <div className="space-y-2 font-mono text-xs">
                  {["REST API", "Auth", "Storage", "Realtime", "Functions"].map((s) => (
                    <div key={s} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{s}</span>
                      <span className="text-emerald-400 ml-auto">OK</span>
                    </div>
                  ))}
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
                  "Replace wildcard (*) origins with your exact production domains",
                  "Enable strict mode to reject requests without a valid origin",
                  "Enable rate limiting to protect against abuse",
                  "Disable any services you don't use (e.g., GraphQL if unused)",
                  "Set up monitoring/alerting on the Cloudflare Worker dashboard",
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
