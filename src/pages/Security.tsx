import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Shield, AlertTriangle, Lock, CheckCircle } from "lucide-react";

const Security = () => (
  <Layout>
    <div className="section-container py-16 md:py-24 max-w-3xl">
      <AnimatedSection>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Security &amp; Privacy</h1>
        <p className="text-lg text-muted-foreground mb-12">
          An honest assessment of the security model. Read this before deploying to production.
        </p>
      </AnimatedSection>

      <div className="space-y-12">
        <AnimatedSection>
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Threat model summary</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Any gateway that proxies your Supabase traffic can theoretically inspect, log, or modify requests and responses. This is true for XupaStack's managed gateway, any reverse proxy, and any CDN you use.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The risk isn't hypothetical — it's architectural. If a service sits in the request path, it has access to the data in transit. TLS terminates at the gateway, so the gateway sees plaintext.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Self-host: recommended for production</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Self-hosted mode deploys a Cloudflare Worker into <strong className="text-foreground">your</strong> Cloudflare account, on <strong className="text-foreground">your</strong> domain. No third-party infrastructure is in the request path.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent shrink-0" /> You control the Worker code and configuration</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent shrink-0" /> Logs stay in your Cloudflare account</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent shrink-0" /> No XupaStack servers involved at runtime</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent shrink-0" /> You can audit every line of the Worker code</li>
              </ul>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Managed: convenience with a different trust model</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The managed gateway runs on XupaStack infrastructure. It's the fastest way to get unblocked, but it means:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0" /> XupaStack infrastructure sees your traffic</li>
                <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0" /> You're trusting our no-logging policy</li>
                <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0" /> Shared infrastructure = shared risk</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                We don't log request payloads by default, but you're taking our word for it. For sensitive data or production workloads, self-host.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Comparison</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A factual look at the trade-offs between hosting models.
            </p>
            <div className="surface-elevated rounded-xl overflow-hidden mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 font-medium text-muted-foreground"></th>
                    <th className="p-4 font-semibold text-foreground text-center">Hosted gateway</th>
                    <th className="p-4 font-semibold text-foreground text-center">Self-hosted gateway</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { label: "Who controls the data plane?", hosted: "Gateway provider", self: "You" },
                    { label: "Third party in request path?", hosted: "Yes", self: "No" },
                    { label: "TLS terminates at", hosted: "Provider's infrastructure", self: "Your Cloudflare account" },
                    { label: "Logging policy", hosted: "Trust provider's policy", self: "You define it" },
                    { label: "Setup time", hosted: "Seconds", self: "~5 minutes" },
                    { label: "Cloudflare account required?", hosted: "No", self: "Yes (free tier works)" },
                    { label: "Cost", hosted: "Free", self: "Free" },
                    { label: "Audit the code?", hosted: "Depends on provider", self: "Yes — it's your Worker" },
                  ].map((row, i, arr) => (
                    <tr key={row.label} className={i < arr.length - 1 ? "border-b border-border/30" : ""}>
                      <td className="p-4 text-foreground font-medium">{row.label}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.hosted}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.self}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Admin token protection</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Self-hosted deployments use an admin token to protect the dashboard and configuration endpoints. This token is set during deployment and should be rotated regularly.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Never expose the admin token in client-side code. It should only be used in server-side operations.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Best practices checklist</h2>
            <div className="surface-elevated rounded-xl p-6">
              <ul className="space-y-3 text-sm">
                {[
                  "Use self-hosted mode for production",
                  "Restrict CORS origins to your app domains",
                  "Enable strict mode to disable unused services",
                  "Configure rate limiting",
                  "Rotate admin tokens regularly",
                  "Review Cloudflare Worker logs periodically",
                  "Run doctor checks after any configuration change",
                  "Keep XupaStack updated to latest version",
                  "Use a custom domain for your gateway",
                  "Test the backout plan — confirm you can revert to direct Supabase URLs",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </Layout>
);

export default Security;
