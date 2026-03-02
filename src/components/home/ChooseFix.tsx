import AnimatedSection from "@/components/AnimatedSection";
import { Server, Zap, Shield, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const ChooseFix = () => (
  <section className="py-20 md:py-28">
    <div className="section-container">
      <AnimatedSection className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Choose your fix</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Two paths to the same result. Pick the one that fits your threat model.</p>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <AnimatedSection delay={0.1}>
          <div className="surface-elevated rounded-2xl p-8 h-full flex flex-col">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Server className="h-4.5 w-4.5 text-primary" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Recommended</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Self-host</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground mb-6 flex-1">
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                Deploy into your Cloudflare account.
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                You control the data plane.
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                Best for production and sensitive apps.
              </li>
            </ul>
            <Link
              to="/quickstart"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get self-host command
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="surface-elevated rounded-2xl p-8 h-full flex flex-col">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <Zap className="h-4.5 w-4.5 text-accent" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Fastest</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Managed</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground mb-6 flex-1">
              <li className="flex items-start gap-2">
                <Rocket className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                Instant endpoint, no setup.
              </li>
              <li className="flex items-start gap-2">
                <Rocket className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                Different trust model: a third-party sits in the request path.
              </li>
              <li className="flex items-start gap-2">
                <Rocket className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                Best for prototypes and emergencies.
              </li>
            </ul>
            <Link
              to="/quickstart?mode=managed"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
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
