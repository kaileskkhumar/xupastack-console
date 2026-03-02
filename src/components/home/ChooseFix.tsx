import AnimatedSection from "@/components/AnimatedSection";
import { Server, Zap, Shield, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const ChooseFix = () => (
  <section className="py-24 md:py-32">
    <div className="section-container">
      <AnimatedSection className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Choose your fix</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Two paths to the same result. Pick the one that fits your threat model.</p>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-8 h-full flex flex-col transition-all duration-300 hover:-translate-y-1">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-[0_0_20px_-4px_hsl(var(--primary)/0.3)]">
                <Server className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Recommended</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Self-host</h3>
            <ul className="space-y-3 text-sm text-muted-foreground mb-8 flex-1">
              <li className="flex items-start gap-2.5">
                <Shield className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                Deploy into your Cloudflare account.
              </li>
              <li className="flex items-start gap-2.5">
                <Shield className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                You control the data plane.
              </li>
              <li className="flex items-start gap-2.5">
                <Shield className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                Best for production and sensitive apps.
              </li>
            </ul>
            <Link
              to="/quickstart"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all duration-200 shadow-[0_0_16px_-4px_hsl(var(--primary)/0.4)]"
            >
              Get self-host command
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="glass-card p-8 h-full flex flex-col transition-all duration-300 hover:-translate-y-1">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Fastest</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Managed</h3>
            <ul className="space-y-3 text-sm text-muted-foreground mb-8 flex-1">
              <li className="flex items-start gap-2.5">
                <Rocket className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                Instant endpoint, no setup.
              </li>
              <li className="flex items-start gap-2.5">
                <Rocket className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                Different trust model: a third-party sits in the request path.
              </li>
              <li className="flex items-start gap-2.5">
                <Rocket className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                Best for prototypes and emergencies.
              </li>
            </ul>
            <Link
              to="/quickstart?mode=managed"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-border/50 bg-card/50 text-sm font-semibold text-foreground hover:bg-secondary/50 transition-all duration-200"
            >
              Open Console
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export default ChooseFix;
