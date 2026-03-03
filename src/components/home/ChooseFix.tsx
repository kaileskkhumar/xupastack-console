import AnimatedSection from "@/components/AnimatedSection";
import { Server, Zap, Shield, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const ChooseFix = () => (
  <section className="py-14 md:py-20">
    <div className="section-container">
      <AnimatedSection className="text-center mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary mb-2">Two paths</p>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">Choose your fix</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">Same result. Pick the one that fits your threat model.</p>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        <AnimatedSection delay={0.08}>
          <div className="relative rounded-2xl border border-primary/20 bg-card/40 backdrop-blur-sm p-6 h-full flex flex-col transition-all duration-300 hover:border-primary/40 group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Server className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Self-host</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Recommended</span>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground mb-6 flex-1">
              <li className="flex items-start gap-2"><Shield className="h-3 w-3 mt-0.5 text-primary/70 shrink-0" />Deploy into your Cloudflare account</li>
              <li className="flex items-start gap-2"><Shield className="h-3 w-3 mt-0.5 text-primary/70 shrink-0" />You control the data plane</li>
              <li className="flex items-start gap-2"><Shield className="h-3 w-3 mt-0.5 text-primary/70 shrink-0" />Best for production apps</li>
            </ul>
            <Link
              to="/app/new"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Open Console
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.16}>
          <div className="relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 h-full flex flex-col transition-all duration-300 hover:border-border/70 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Zap className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Managed</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">Fastest</span>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground mb-6 flex-1">
              <li className="flex items-start gap-2"><Rocket className="h-3 w-3 mt-0.5 text-accent/70 shrink-0" />Instant endpoint, no setup</li>
              <li className="flex items-start gap-2"><Rocket className="h-3 w-3 mt-0.5 text-accent/70 shrink-0" />Third-party sits in request path</li>
              <li className="flex items-start gap-2"><Rocket className="h-3 w-3 mt-0.5 text-accent/70 shrink-0" />Best for prototypes & emergencies</li>
            </ul>
            <Link
              to="/app/new"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border/50 bg-card/50 text-xs font-semibold text-foreground hover:bg-secondary/50 transition-colors"
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
