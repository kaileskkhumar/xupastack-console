import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, Database, ExternalLink, Github, Linkedin, Twitter, Heart, ArrowRight, Server, Zap } from "lucide-react";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";

const About = () => (
  <Layout>
    {/* 1. Hero */}
    <section className="relative overflow-hidden">
      <div className="hero-glow absolute inset-0" />
      <div className="section-container pt-24 pb-20 relative z-10">
        <AnimatedSection>
          <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">About XupaStack</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-[1.1] mb-6 max-w-3xl">
            Your Supabase app should work for users in India.{" "}
            <span className="gradient-text">Always.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
            In late February 2026, developers across India discovered their Supabase-powered apps had gone silent — not because of a bug in their code, but because major ISPs stopped resolving <code className="code-block px-1.5 py-0.5 text-sm">*.supabase.co</code> entirely. XupaStack was born to make this failure mode boring: a one-line config change that keeps your app working, no matter what the network does.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/app">Open Console</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/quickstart">Read Quickstart</Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Divider */}
    <div className="section-container"><div className="border-t border-border/50" /></div>

    {/* 2. The Problem */}
    <section className="section-container py-20">
      <AnimatedSection>
        <h2 className="text-3xl font-display font-bold text-foreground mb-4">The Problem</h2>
        <div className="max-w-2xl space-y-4 text-muted-foreground leading-relaxed">
          <p>
            When ISPs block or fail to resolve DNS for <code className="code-block px-1.5 py-0.5 text-sm">*.supabase.co</code>, every Supabase-powered app in the affected region breaks simultaneously — auth, database, storage, realtime, everything. Users see blank screens, failed logins, and spinning loaders.
          </p>
          <p>
            The standard advice — "tell your users to change their DNS to 1.1.1.1 or 8.8.8.8" — doesn't work at scale. You can't ask millions of end users to reconfigure their devices. The fix has to be in your code, not their settings.
          </p>
        </div>
      </AnimatedSection>
    </section>

    <div className="section-container"><div className="border-t border-border/50" /></div>

    {/* 3. What It Does */}
    <section className="section-container py-20">
      <AnimatedSection>
        <h2 className="text-3xl font-display font-bold text-foreground mb-4">What XupaStack Does</h2>
        <div className="max-w-2xl space-y-4 text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">One environment variable change.</strong> Point your Supabase client at a gateway URL instead of the default <code className="code-block px-1.5 py-0.5 text-sm">.supabase.co</code> endpoint. That's it.
          </p>
          <p>
            The gateway acts as a transparent proxy — it forwards every request to Supabase and returns the response unmodified. Auth, Postgres, Storage, Realtime, Edge Functions — full API coverage, zero code changes beyond the URL swap.
          </p>
          <p>
            And it's completely reversible. Remove the environment variable and you're back to direct Supabase connectivity. No lock-in, no migration.
          </p>
        </div>
      </AnimatedSection>
    </section>

    <div className="section-container"><div className="border-t border-border/50" /></div>

    {/* 4. Choose Your Trust Model */}
    <section className="section-container py-20">
      <AnimatedSection>
        <h2 className="text-3xl font-display font-bold text-foreground mb-6">Choose Your Trust Model</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ y: -2 }}
            className="glass-card p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Server className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Self-Hosted</h3>
                <span className="text-xs font-medium text-primary">Recommended</span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed flex-1">
              Runs inside your Cloudflare account on your own domain. You control the infrastructure, the logs, and the data plane. XupaStack only stores the metadata you enter in the console — we never see your traffic.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="glass-card p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Managed</h3>
                <span className="text-xs font-medium text-accent">Fastest</span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed flex-1">
              Instant gateway URL with no infrastructure setup. Traffic routes through XupaStack-operated infrastructure — a different trust model. Subject to fair-use capacity limits. Great for prototyping or when you need to ship fast.
            </p>
          </motion.div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          <Link to="/security" className="text-primary hover:underline inline-flex items-center gap-1">
            Compare Security &amp; Privacy <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </AnimatedSection>
    </section>

    <div className="section-container"><div className="border-t border-border/50" /></div>

    {/* 5. Security & Privacy */}
    <section className="section-container py-20">
      <AnimatedSection>
        <h2 className="text-3xl font-display font-bold text-foreground mb-6">Security &amp; Privacy</h2>
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Shield, title: "No secret keys", desc: "We never ask for your Supabase service or secret keys. Ever." },
            { icon: Eye, title: "No payload logging", desc: "Request and response bodies are not logged by default. Your users' data stays invisible to us." },
            { icon: Database, title: "Minimal metadata", desc: "We store only what's needed to manage your gateway: app name, slug, project reference, and status." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-6">
              <Icon className="h-5 w-5 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1.5">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <a href="https://github.com" target="_blank" rel="noopener">
              <Github className="h-4 w-4 mr-1.5" /> GitHub
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <a href="https://github.com" target="_blank" rel="noopener">
              SECURITY.md <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <a href="https://github.com" target="_blank" rel="noopener">
              PRIVACY.md <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </a>
          </Button>
        </div>
      </AnimatedSection>
    </section>

    <div className="section-container"><div className="border-t border-border/50" /></div>

    {/* 6. Why Free */}
    <section className="section-container py-20">
      <AnimatedSection>
        <h2 className="text-3xl font-display font-bold text-foreground mb-4">Why Is This Free?</h2>
        <div className="max-w-2xl space-y-4 text-muted-foreground leading-relaxed">
          <p>
            XupaStack exists because developers in India needed a fix and shouldn't have to pay for one. The project is MIT-licensed, community-driven, and sustained by voluntary donations. There are no premium tiers, no usage gates, and no plans to change that.
          </p>
          <p>
            If XupaStack saved you time or kept your app running, consider supporting the project so we can keep the managed infrastructure online and the tooling sharp.
          </p>
        </div>
        <Button asChild variant="outline" size="lg" className="rounded-full mt-6">
          <Link to="/donate">
            <Heart className="h-4 w-4 mr-2 text-primary" /> Support the Project
          </Link>
        </Button>
      </AnimatedSection>
    </section>

    <div className="section-container"><div className="border-t border-border/50" /></div>

    {/* 7. Founder */}
    <section className="section-container py-20">
      <AnimatedSection>
        <h2 className="text-3xl font-display font-bold text-foreground mb-6">Built By</h2>
        <div className="glass-card p-8 max-w-lg">
          <h3 className="text-xl font-display font-semibold text-foreground mb-1">Kailesk Khumar</h3>
          <p className="text-sm text-primary mb-3">HouseofMVP's</p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            Builder, developer, and founder of HouseofMVP's. Passionate about solving real infrastructure problems for the developer community.
          </p>
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <a href="https://in.linkedin.com/in/kailesk-khumar-soundararajan" target="_blank" rel="noopener">
                <Linkedin className="h-3.5 w-3.5 mr-1.5" /> LinkedIn
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <a href="https://github.com" target="_blank" rel="noopener" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <a href="https://x.com/kaileskkhumar" target="_blank" rel="noopener" aria-label="X">
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </section>

    <div className="section-container"><div className="border-t border-border/50" /></div>

    {/* 8. Final CTA */}
    <section className="section-container py-24 text-center">
      <AnimatedSection>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4 max-w-xl mx-auto">
          Keep your Supabase app working in India in minutes.
        </h2>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/app">Open Console</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/docs">Read Docs</Link>
          </Button>
        </div>
      </AnimatedSection>
    </section>
  </Layout>
);

export default About;
