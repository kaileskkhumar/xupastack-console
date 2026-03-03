import { useState } from "react";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import CodeBlock from "@/components/CodeBlock";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "endpoints", label: "Supported endpoints" },
  { id: "realtime", label: "Realtime / WebSockets" },
  { id: "cors", label: "CORS" },
  { id: "auth", label: "Redirect-safe auth" },
  { id: "dashboard", label: "Self-host dashboard" },
  { id: "managed-limits", label: "Managed gateway limits" },
  { id: "strict-mode", label: "Strict mode" },
  { id: "rate-limiting", label: "Rate limiting" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "backout", label: "Backout plan" },
];

const Docs = () => {
  const [active, setActive] = useState("overview");

  return (
    <Layout>
      <div className="section-container py-12 md:py-20">
        <div className="flex gap-10">
          {/* Sidebar */}
          <nav className="hidden lg:block w-56 shrink-0 sticky top-20 self-start">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Documentation</h4>
            <ul className="space-y-0.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setActive(s.id)}
                    className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                      active === s.id
                        ? "bg-secondary text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            <AnimatedSection>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Documentation</h1>
            </AnimatedSection>

            <div className="space-y-16">
              <section id="overview">
                <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  XupaStack is a gateway that proxies traffic between your application and your Supabase project. When <code className="code-block px-1.5 py-0.5 text-xs">*.supabase.co</code> is blocked at the network or DNS level, XupaStack routes requests through an alternative domain that isn't affected by the block.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  It supports the full Supabase API surface: REST (PostgREST), Auth (GoTrue), Storage, Edge Functions, GraphQL, and Realtime WebSockets. No code changes beyond updating your <code className="code-block px-1.5 py-0.5 text-xs">SUPABASE_URL</code> environment variable.
                </p>
              </section>

              <section id="endpoints">
                <h2 className="text-2xl font-bold text-foreground mb-4">Supported endpoints</h2>
                <div className="surface-elevated rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">Service</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Path</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Protocol</th>
                      </tr>
                    </thead>
                    <tbody className="text-foreground">
                      {[
                        ["REST (PostgREST)", "/rest/v1/*", "HTTP"],
                        ["Auth (GoTrue)", "/auth/v1/*", "HTTP"],
                        ["Storage", "/storage/v1/*", "HTTP"],
                        ["Edge Functions", "/functions/v1/*", "HTTP"],
                        ["GraphQL", "/graphql/v1", "HTTP"],
                        ["Realtime", "/realtime/v1/*", "WebSocket"],
                      ].map(([service, path, proto]) => (
                        <tr key={service} className="border-b border-border last:border-0">
                          <td className="p-4 font-medium">{service}</td>
                          <td className="p-4 font-mono text-xs text-primary">{path}</td>
                          <td className="p-4 text-muted-foreground">{proto}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="realtime">
                <h2 className="text-2xl font-bold text-foreground mb-4">Realtime / WebSockets</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  XupaStack proxies WebSocket connections for Supabase Realtime. The gateway handles the HTTP → WebSocket upgrade automatically.
                </p>
                <CodeBlock
                  code={`const channel = supabase
  .channel('my-channel')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'messages'
  }, (payload) => {
    console.log('Change:', payload)
  })
  .subscribe()`}
                  language="javascript"
                  title="Realtime subscription"
                />
              </section>

              <section id="cors">
                <h2 className="text-2xl font-bold text-foreground mb-4">CORS</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Configure allowed origins to restrict which domains can make requests through your gateway. Managed gateways: configure in the XupaStack console under your gateway settings. Self-hosted: accessible at the <code className="code-block px-1.5 py-0.5 text-xs">/__xupastack</code> path on your gateway.
                </p>
                <CodeBlock
                  code={`allowedOrigins: ["https://your-app.com"]   // array of allowed origins, or ["*"]
allowCredentials: true                      // boolean`}
                  language="javascript"
                  title="CORS settings"
                />
              </section>

              <section id="auth">
                <h2 className="text-2xl font-bold text-foreground mb-4">Redirect-safe auth</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  OAuth flows (Google, GitHub, Apple) involve redirects back to your Supabase auth endpoint. When the domain is blocked, the redirect fails. XupaStack rewrites redirect URLs so the entire flow stays on your gateway domain.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You need to add your gateway URL as an allowed redirect URL in both your Supabase project settings and your OAuth provider console.
                </p>
              </section>

              <section id="dashboard">
                <h2 className="text-2xl font-bold text-foreground mb-4">Self-host dashboard</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Self-hosted deployments include a mini dashboard for configuration management. Access it at your gateway URL with the <code className="code-block px-1.5 py-0.5 text-xs">/__xupastack</code> path.
                </p>
                <CodeBlock code="https://your-gateway.your-domain.com/__xupastack" title="Dashboard URL" />
              </section>

              <section id="managed-limits">
                <h2 className="text-2xl font-bold text-foreground mb-4">Managed gateway limits</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The managed gateway is shared infrastructure. It's designed for convenience, not high-throughput production workloads.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Rate limited to 100 requests/minute per project</li>
                  <li>No SLA — best-effort uptime</li>
                  <li>Shared Cloudflare Worker (capacity is limited)</li>
                  <li>For production, self-host to get your own capacity</li>
                </ul>
              </section>

              <section id="strict-mode">
                <h2 className="text-2xl font-bold text-foreground mb-4">Strict mode</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Strict mode adds extra validation to requests passing through the gateway. Configure in the XupaStack console under your gateway settings, or via the <code className="code-block px-1.5 py-0.5 text-xs">/__xupastack</code> path on self-hosted gateways.
                </p>
                <CodeBlock code={`strictMode: true\nenabledServices: ["rest", "auth", "storage", "functions", "graphql", "realtime"]\n// Remove services you don't need, e.g. ["rest", "auth"]`} language="javascript" title="Strict mode + services" />
              </section>

              <section id="rate-limiting">
                <h2 className="text-2xl font-bold text-foreground mb-4">Rate limiting</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Configure per-IP rate limits to protect your gateway from abuse. Set in the XupaStack console under your gateway settings, or via the <code className="code-block px-1.5 py-0.5 text-xs">/__xupastack</code> path on self-hosted gateways.
                </p>
                <CodeBlock code={`rateLimitPerMin: 600   // number — requests per minute (default: 600)`} language="javascript" title="Rate limit setting" />
              </section>

              <section id="troubleshooting">
                <h2 className="text-2xl font-bold text-foreground mb-4">Troubleshooting</h2>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Gateway returns 502</h4>
                    <p className="text-sm text-muted-foreground">Check that your Supabase project is active and the project ref is correct.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Auth redirects fail</h4>
                    <p className="text-sm text-muted-foreground">Ensure your gateway URL is added as an allowed redirect URL in Supabase and your OAuth provider.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Realtime won't connect</h4>
                    <p className="text-sm text-muted-foreground">Open browser DevTools → Network → WS tab. You should see a 101 Switching Protocols connection to your gateway. Also confirm Realtime is enabled in your gateway's service settings.</p>
                  </div>
                </div>
              </section>

              <section id="backout">
                <h2 className="text-2xl font-bold text-foreground mb-4">Backout plan</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you need to revert, simply change your <code className="code-block px-1.5 py-0.5 text-xs">SUPABASE_URL</code> back to the original <code className="code-block px-1.5 py-0.5 text-xs">*.supabase.co</code> URL. No data migration, no schema changes. Your database, keys, and RLS policies remain unchanged.
                </p>
                <CodeBlock code={`# Revert\nSUPABASE_URL=https://your-ref.supabase.co`} title=".env" />
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Docs;
