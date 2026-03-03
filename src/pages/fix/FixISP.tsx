import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ISP_DATA, STACK_SNIPPETS, COMMON_FAQ } from "@/data/isp-data";
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Terminal,
  Zap,
  Wifi,
  Globe,
  Lock,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import NotFound from "@/pages/NotFound";

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

const FixISP = () => {
  const { isp } = useParams<{ isp: string }>();
  const data = isp ? ISP_DATA[isp] : undefined;
  const [activeStack, setActiveStack] = useState("lovable");

  if (!data) return <NotFound />;

  const allFaq = [...COMMON_FAQ, ...(data.faqExtra || [])];
  const snippet = STACK_SNIPPETS[activeStack];

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden isolate">
        {/* Ambient glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-destructive/[0.07] blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-primary/[0.06] blur-[100px] pointer-events-none" />

        <div className="section-container pt-24 pb-16 md:pt-32 md:pb-24 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fade} custom={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-destructive/30 bg-destructive/10 text-xs font-semibold tracking-wide uppercase text-destructive mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
              </span>
              ISP Block Detected — {data.region}
            </div>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fade}
            custom={1}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold leading-[1.05] tracking-tight text-foreground text-balance max-w-4xl"
          >
            Fix Supabase on{" "}
            <span className="gradient-text-shimmer">{data.name}</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fade}
            custom={2}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            {data.fullName} is blocking Supabase at the network level. Your app isn't broken — the ISP is.
            Fix it in under 5 minutes.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fade}
            custom={3}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Button asChild size="lg" className="rounded-full px-6 h-12 text-sm font-semibold shadow-lg shadow-primary/20">
              <Link to={`/app/new?isp=${data.slug}`}>
                Create Gateway <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6 h-12 text-sm font-semibold">
              <Link to="/app/new">Self-host</Link>
            </Button>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fade}
            custom={4}
            className="mt-12 flex items-center gap-6 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> End-to-end encrypted</span>
            <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Edge network</span>
            <span className="flex items-center gap-1.5"><Wifi className="h-3.5 w-3.5" /> All Supabase services</span>
          </motion.div>
        </div>
      </section>

      <div className="section-container pb-24 space-y-20">
        {/* ── What's happening ── */}
        <Section index={0}>
          <SectionLabel>The Problem</SectionLabel>
          <SectionTitle>What's happening</SectionTitle>
          <div className="grid gap-3 mt-6">
            {data.whatsHappening.map((point, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fade}
                custom={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-card/50 border border-border/50"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── DNS section ── */}
        <Section index={1}>
          <SectionLabel>Development vs Production</SectionLabel>
          <SectionTitle>Does changing DNS help?</SectionTitle>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-500/0" />
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <h4 className="text-sm font-bold text-foreground">Do this (dev only)</h4>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><ChevronRight className="h-3.5 w-3.5 mt-0.5 text-emerald-500 shrink-0" />Change DNS to 1.1.1.1 or 8.8.8.8</li>
                <li className="flex items-start gap-2"><ChevronRight className="h-3.5 w-3.5 mt-0.5 text-emerald-500 shrink-0" />Useful for local development & testing</li>
                <li className="flex items-start gap-2"><ChevronRight className="h-3.5 w-3.5 mt-0.5 text-emerald-500 shrink-0" />Quick temporary workaround</li>
              </ul>
            </div>
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-destructive to-destructive/0" />
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div>
                <h4 className="text-sm font-bold text-foreground">Don't do this (production)</h4>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><ChevronRight className="h-3.5 w-3.5 mt-0.5 text-destructive shrink-0" />Don't tell users to change their DNS</li>
                <li className="flex items-start gap-2"><ChevronRight className="h-3.5 w-3.5 mt-0.5 text-destructive shrink-0" />Don't assume it works for everyone</li>
                <li className="flex items-start gap-2"><ChevronRight className="h-3.5 w-3.5 mt-0.5 text-destructive shrink-0" />Don't ship without a proxy gateway</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl border border-border/50 bg-card/30 text-sm text-muted-foreground">
            <span className="text-foreground font-medium">💡 Note:</span> {data.dnsNote}
          </div>
        </Section>

        {/* ── Diagnose ── */}
        <Section index={2}>
          <SectionLabel>Verify the Block</SectionLabel>
          <SectionTitle>Diagnose in 30 seconds</SectionTitle>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Run these commands in your terminal. If they fail, the ISP is blocking Supabase.
          </p>
          <div className="space-y-3">
            <CodeBlock code={`nslookup ${data.nslookupDomain}`} title="Step 1 — Check DNS resolution" language="bash" />
            <CodeBlock code={`curl -I https://${data.nslookupDomain}/rest/v1/`} title="Step 2 — Check HTTP connectivity" language="bash" />
          </div>
          <div className="mt-5 grid md:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-500 mb-0.5">If it works</p>
                <p className="text-xs text-muted-foreground">You'll see an IP address and HTTP 200.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/[0.05] border border-destructive/20">
              <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-destructive mb-0.5">If it fails</p>
                <p className="text-xs text-muted-foreground">You'll see "timed out" or no response.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Production fix ── */}
        <Section index={3}>
          <SectionLabel>The Solution</SectionLabel>
          <SectionTitle>Fix it in 3 steps</SectionTitle>
          <div className="mt-6 space-y-0 relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-6 bottom-6 w-px bg-border hidden md:block" />

            {[
              {
                step: 1,
                icon: <Zap className="h-4 w-4" />,
                title: "Create a gateway",
                desc: "Spin up a Cloudflare Workers proxy that routes traffic around the ISP block. Takes 30 seconds.",
                action: (
                  <Button asChild size="sm" className="rounded-full mt-3">
                    <Link to={`/app/new?isp=${data.slug}`}>Create Gateway <ArrowRight className="h-3 w-3 ml-1" /></Link>
                  </Button>
                ),
              },
              {
                step: 2,
                icon: <Terminal className="h-4 w-4" />,
                title: "Swap your Supabase URL",
                desc: "Replace your Supabase project URL with the gateway URL. See stack-specific snippets below.",
              },
              {
                step: 3,
                icon: <ShieldCheck className="h-4 w-4" />,
                title: "Update auth redirect URLs",
                desc: "Add the gateway callback URL to your Supabase dashboard and OAuth providers.",
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fade}
                custom={item.step}
                className="relative flex gap-5 py-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0 z-10">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Step {item.step}</span>
                  </div>
                  <h4 className="text-base font-bold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                  {item.action}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── Stack picker ── */}
        <Section index={4}>
          <SectionLabel>Integration</SectionLabel>
          <SectionTitle>Copy-paste for your stack</SectionTitle>
          <div className="mt-6 flex flex-wrap items-center gap-1 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-1.5">
            {Object.entries(STACK_SNIPPETS).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setActiveStack(key)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeStack === key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {snippet && (
            <div className="mt-4">
              <CodeBlock code={snippet.env} title={snippet.file} language="env" />
            </div>
          )}
        </Section>

        {/* ── Auth checklist ── */}
        <Section index={5}>
          <SectionLabel>Auth Configuration</SectionLabel>
          <SectionTitle>Redirect URL checklist</SectionTitle>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Using OAuth or magic links? You <strong className="text-foreground">must</strong> update redirect URLs or login will break.
          </p>
          <div className="space-y-3">
            {[
              "Go to Supabase Dashboard → Authentication → URL Configuration",
              "Add gateway URL to Redirect URLs: https://your-ref.gw.xupastack.com/**",
              "Update each OAuth provider (Google, GitHub, etc.) with the new callback URL",
              "Set callback to: https://your-ref.gw.xupastack.com/auth/v1/callback",
              "Test sign-in on a blocked network (e.g., Jio mobile data)",
            ].map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fade}
                custom={i}
                className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border/50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-muted-foreground leading-relaxed pt-1">{step}</span>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── Security ── */}
        <Section index={6}>
          <SectionLabel>Trust & Safety</SectionLabel>
          <SectionTitle>Security & Privacy</SectionTitle>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {[
              { icon: <Lock className="h-4 w-4" />, text: "Transparent proxy — no data stored, logged, or inspected" },
              { icon: <ShieldCheck className="h-4 w-4" />, text: "HTTPS end-to-end encryption on all traffic" },
              { icon: <Globe className="h-4 w-4" />, text: "Open-source — audit the code yourself" },
              { icon: <Zap className="h-4 w-4" />, text: "Self-host for complete control" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card/50 border border-border/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                  {item.icon}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pt-1">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/security">Read security policy <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </div>
        </Section>

        {/* ── FAQ ── */}
        <Section index={7}>
          <SectionLabel>Common Questions</SectionLabel>
          <SectionTitle>FAQ</SectionTitle>
          <Accordion type="single" collapsible className="mt-6 w-full space-y-2">
            {allFaq.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border/50 rounded-xl px-5 data-[state=open]:bg-card/50 transition-colors"
              >
                <AccordionTrigger className="text-sm text-left font-medium py-4 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>

        {/* ── Related pages ── */}
        <Section index={8}>
          <SectionLabel>Learn More</SectionLabel>
          <SectionTitle>Related pages</SectionTitle>
          <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-primary/20 transition-all duration-200"
              >
                <span className="text-sm font-medium text-foreground">{link.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </Layout>
  );
};

/* ── Helpers ── */

const Section = ({ children, index }: { children: React.ReactNode; index: number }) => (
  <motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    variants={fade}
    custom={index}
  >
    {children}
  </motion.section>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">{children}</p>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">{children}</h2>
);

export default FixISP;
