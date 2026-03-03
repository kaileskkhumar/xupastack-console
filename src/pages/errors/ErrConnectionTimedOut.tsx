import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import CodeBlock from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, AlertTriangle, CheckCircle2, XCircle, Terminal } from "lucide-react";

const ErrConnectionTimedOut = () => (
  <Layout>
    {/* Hero */}
    <div className="relative overflow-hidden">
      <div className="hero-glow absolute inset-0" />
      <div className="section-container py-20 md:py-28 relative z-10">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-destructive/30 bg-destructive/10 text-xs font-semibold text-destructive mb-6">
            <AlertTriangle className="h-3 w-3" />
            Browser Error
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-foreground text-balance mb-5">
            Fix{" "}
            <span className="font-mono text-destructive">ERR_CONNECTION_TIMED_OUT</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-4">
            Seeing this error when your app tries to reach Supabase? Your ISP is likely blocking the connection. Here's how to fix it.
          </p>
          <CodeBlock
            code={`GET https://abc123.supabase.co/rest/v1/todos\nnet::ERR_CONNECTION_TIMED_OUT`}
            title="Browser Console"
            language="plaintext"
          />
          <div className="flex flex-wrap gap-3 mt-8">
            <Button asChild size="lg">
              <Link to="/app/new">
                Create Gateway <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/quickstart">Self-host (recommended)</Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>

    <div className="section-container pb-20 space-y-16">
      {/* What causes this */}
      <AnimatedSection>
        <SectionHeading title="What causes this error" />
        <div className="surface-elevated rounded-xl p-6 space-y-3">
          {[
            "Your browser tried to connect to Supabase but got no response.",
            "This usually means your ISP is blocking or throttling the connection.",
            "Common on Indian ISPs: Jio, Airtel, ACT Fibernet, BSNL.",
            "It is NOT a Supabase outage, and your code is NOT broken.",
          ].map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
              <p className="text-sm text-muted-foreground">{point}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Quick test */}
      <AnimatedSection>
        <SectionHeading title="Quick test — is your ISP blocking Supabase?" />
        <div className="space-y-3">
          <CodeBlock
            code="curl -I https://your-ref.supabase.co/rest/v1/"
            title="Run this in your terminal"
            language="bash"
          />
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-semibold text-emerald-500 mb-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> If you get HTTP 200
            </p>
            <p className="text-xs text-muted-foreground">Your network is fine. The issue is elsewhere (CORS, auth, etc.).</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-semibold text-destructive mb-1 flex items-center gap-1">
              <XCircle className="h-3 w-3" /> If it times out
            </p>
            <p className="text-xs text-muted-foreground">Your ISP is blocking Supabase. Follow the fix below.</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Do this / Don't do this */}
      <AnimatedSection>
        <SectionHeading title="Do this / Don't do this" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="surface-elevated rounded-xl p-6 border-l-4 border-l-emerald-500">
            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Do this
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Set up a gateway proxy (XupaStack)</li>
              <li>✓ Swap your Supabase URL with the gateway URL</li>
              <li>✓ Update OAuth redirect URLs</li>
              <li>✓ Test on a blocked network before deploying</li>
            </ul>
          </div>
          <div className="surface-elevated rounded-xl p-6 border-l-4 border-l-destructive">
            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" /> Don't do this
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✗ Don't just change your DNS and call it done</li>
              <li>✗ Don't tell users to use a VPN</li>
              <li>✗ Don't wait for the ISP to fix it — they won't</li>
              <li>✗ Don't rewrite your code — it's not a code bug</li>
            </ul>
          </div>
        </div>
      </AnimatedSection>

      {/* The fix */}
      <AnimatedSection>
        <SectionHeading title="The fix — 3 steps" />
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: "Create a gateway proxy",
              desc: "XupaStack deploys a Cloudflare Worker that proxies all Supabase traffic, bypassing ISP blocks.",
              action: (
                <Button asChild size="sm">
                  <Link to="/app/new">Create Gateway <ArrowRight className="h-3 w-3" /></Link>
                </Button>
              ),
            },
            {
              step: 2,
              title: "Replace your Supabase URL",
              desc: "In your .env file or Supabase client init, swap the Supabase URL with your gateway URL.",
            },
            {
              step: 3,
              title: "Update auth redirect URLs",
              desc: "If you use OAuth or magic links, add the gateway callback URL to your Supabase dashboard and OAuth providers.",
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

      {/* FAQ */}
      <AnimatedSection>
        <h2 className="text-xl font-bold text-foreground mb-4">FAQ</h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: "Is this a Supabase bug?", a: "No. Your ISP is blocking the connection. Supabase is working fine." },
            { q: "Why does it work on WiFi but not mobile data?", a: "Your WiFi ISP may not block Supabase. Mobile data (Jio, Airtel) often does." },
            { q: "Will changing DNS fix it?", a: "For your machine only. Your end users will still be blocked." },
            { q: "Is XupaStack free?", a: "Yes. Open-source and free forever." },
            { q: "Does the proxy add latency?", a: "Negligible. It runs on Cloudflare's global edge network." },
          ].map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-sm text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </AnimatedSection>

      {/* ISP-specific pages */}
      <AnimatedSection>
        <h3 className="text-lg font-bold text-foreground mb-4">ISP-specific guides</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: "Fix on Jio", href: "/fix/jio" },
            { label: "Fix on Airtel", href: "/fix/airtel" },
            { label: "Fix on ACT Fibernet", href: "/fix/act" },
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

const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <Terminal className="h-5 w-5 text-primary" />
    <h2 className="text-xl font-bold text-foreground">{title}</h2>
  </div>
);

export default ErrConnectionTimedOut;
