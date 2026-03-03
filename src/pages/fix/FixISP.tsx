import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import CodeBlock from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ISP_DATA, STACK_SNIPPETS, COMMON_FAQ } from "@/data/isp-data";
import { ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Terminal, Zap } from "lucide-react";
import { useState } from "react";
import NotFound from "@/pages/NotFound";

const FixISP = () => {
  const { isp } = useParams<{ isp: string }>();
  const data = isp ? ISP_DATA[isp] : undefined;
  const [activeStack, setActiveStack] = useState("lovable");

  if (!data) return <NotFound />;

  const allFaq = [...COMMON_FAQ, ...(data.faqExtra || [])];
  const snippet = STACK_SNIPPETS[activeStack];

  return (
    <Layout>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="hero-glow absolute inset-0" />
        <div className="section-container py-20 md:py-28 relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-destructive/30 bg-destructive/10 text-xs font-semibold text-destructive mb-6">
              <AlertTriangle className="h-3 w-3" />
              ISP connectivity issue — {data.region}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-foreground text-balance mb-5">
              Fix Supabase on{" "}
              <span className="gradient-text">{data.name}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              {data.fullName} blocks Supabase. Your app isn't broken — the network is.
              Here's how to fix it in under 5 minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={`/app/new?isp=${data.slug}`}>
                  Create Gateway <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/app/new">Self-host (recommended)</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <div className="section-container pb-20 space-y-16">
        {/* What's happening */}
        <AnimatedSection>
          <SectionHeading icon={<AlertTriangle />} title="What's happening" />
          <div className="surface-elevated rounded-xl p-6 space-y-3">
            {data.whatsHappening.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                <p className="text-sm text-muted-foreground">{point}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Does changing DNS help? */}
        <AnimatedSection>
          <SectionHeading icon={<XCircle />} title="Does changing DNS help?" />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="surface-elevated rounded-xl p-6 border-l-4 border-l-emerald-500">
              <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Do this (dev only)
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Change DNS to 1.1.1.1 or 8.8.8.8 on your machine</li>
                <li>• Useful for local development & testing</li>
                <li>• Quick temporary workaround</li>
              </ul>
            </div>
            <div className="surface-elevated rounded-xl p-6 border-l-4 border-l-destructive">
              <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" /> Don't do this (production)
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Don't tell users to change their DNS</li>
                <li>• Don't assume it works because it works for you</li>
                <li>• Don't ship without a proxy gateway</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 p-4 rounded-lg bg-muted/50 border border-border">
            💡 {data.dnsNote}
          </p>
        </AnimatedSection>

        {/* Diagnose in 30s */}
        <AnimatedSection>
          <SectionHeading icon={<Terminal />} title="Diagnose in 30 seconds" />
          <p className="text-sm text-muted-foreground mb-4">
            Open your terminal and run these commands. If they fail, the ISP is blocking Supabase.
          </p>
          <div className="space-y-3">
            <CodeBlock
              code={`nslookup ${data.nslookupDomain}`}
              title="Step 1 — Check DNS resolution"
              language="bash"
            />
            <CodeBlock
              code={`curl -I https://${data.nslookupDomain}/rest/v1/`}
              title="Step 2 — Check HTTP connectivity"
              language="bash"
            />
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs font-semibold text-emerald-500 mb-1">✓ If it works</p>
              <p className="text-xs text-muted-foreground">You'll see an IP address and HTTP 200. Your network is fine.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs font-semibold text-destructive mb-1">✗ If it fails</p>
              <p className="text-xs text-muted-foreground">You'll see "connection timed out" or no response. The ISP is blocking it.</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Production fix */}
        <AnimatedSection>
          <SectionHeading icon={<Zap />} title="Production fix — 3 steps" />
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Create a gateway",
                desc: "Use XupaStack to create a Cloudflare Workers proxy that routes traffic around the ISP block.",
                action: (
                  <Button asChild size="sm">
                    <Link to={`/app/new?isp=${data.slug}`}>Create Gateway <ArrowRight className="h-3 w-3" /></Link>
                  </Button>
                ),
              },
              {
                step: 2,
                title: "Swap your Supabase URL",
                desc: "Replace your Supabase project URL with the gateway URL in your environment variables. See stack-specific snippets below.",
              },
              {
                step: 3,
                title: "Update auth redirect URLs",
                desc: "Add the gateway callback URL to your Supabase dashboard and OAuth providers. See the Auth checklist below.",
              },
            ].map((item) => (
              <div key={item.step} className="surface-elevated rounded-xl p-6 flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary text-sm font-bold shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                  {item.action && <div className="mt-3">{item.action}</div>}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Stack picker */}
        <AnimatedSection>
          <SectionHeading icon={<Terminal />} title="Copy-paste for your stack" />
          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card/50 p-1 mb-4">
            {Object.entries(STACK_SNIPPETS).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setActiveStack(key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeStack === key
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {snippet && <CodeBlock code={snippet.env} title={snippet.file} language="env" />}
        </AnimatedSection>

        {/* Auth gotcha */}
        <AnimatedSection>
          <SectionHeading icon={<ShieldCheck />} title="Auth redirect URL checklist" />
          <div className="surface-elevated rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-4">
              If you use OAuth (Google, GitHub, etc.) or magic links, you <strong className="text-foreground">must</strong> update your redirect URLs. Otherwise login will break.
            </p>
            <ol className="space-y-3">
              {[
                "Go to your Supabase dashboard → Authentication → URL Configuration",
                "Add your gateway URL to 'Redirect URLs': https://your-ref.gw.xupastack.com/**",
                "Go to each OAuth provider (Google Console, GitHub App settings, etc.)",
                "Update the redirect URI to: https://your-ref.gw.xupastack.com/auth/v1/callback",
                "Test sign-in end-to-end on a blocked network (e.g., Jio mobile data)",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </AnimatedSection>

        {/* Security */}
        <AnimatedSection>
          <SectionHeading icon={<ShieldCheck />} title="Security & Privacy" />
          <div className="surface-elevated rounded-xl p-6">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                XupaStack is a transparent proxy. It does not store, log, or inspect your data.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                All traffic stays encrypted (HTTPS end-to-end).
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                Open-source — audit the code yourself.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                Self-host for full control.
              </li>
            </ul>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/security">Read full security policy <ArrowRight className="h-3 w-3" /></Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        {/* FAQ */}
        <AnimatedSection>
          <SectionHeading icon={<AlertTriangle />} title="Frequently asked questions" />
          <Accordion type="single" collapsible className="w-full">
            {allFaq.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>

        {/* Related pages */}
        <AnimatedSection>
          <h3 className="text-lg font-bold text-foreground mb-4">Related pages</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Quickstart Guide", href: "/quickstart" },
              { label: "Framework Guides", href: "/guides" },
              { label: "ERR_CONNECTION_TIMED_OUT", href: "/errors/err_connection_timed_out" },
              { label: "Security", href: "/security" },
              { label: "FAQ", href: "/faq" },
              { label: "Documentation", href: "/docs" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="surface-elevated rounded-lg p-4 text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center justify-between"
              >
                {link.label}
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
};

const SectionHeading = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
    <h2 className="text-xl font-bold text-foreground">{title}</h2>
  </div>
);

export default FixISP;
