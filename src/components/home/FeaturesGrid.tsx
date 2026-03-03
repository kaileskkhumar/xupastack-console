import AnimatedSection from "@/components/AnimatedSection";
import { Globe, Lock, Shield, Gauge, LayoutDashboard, Stethoscope } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Full Supabase surface",
    description: "REST, Auth, Storage, Functions, GraphQL, Realtime WebSockets — all proxied.",
    span: "lg:col-span-2",
  },
  {
    icon: Lock,
    title: "OAuth-safe redirects",
    description: "Auth flows won't bounce back to blocked domains. Google, GitHub, Apple sign-in just work.",
    span: "",
  },
  {
    icon: Shield,
    title: "CORS controls & service toggles",
    description: "Restrict origins, enable only the services you need, block everything else.",
    span: "",
  },
  {
    icon: Gauge,
    title: "Rate limits & strict mode",
    description: "Configurable rate limiting and strict mode for production hardening.",
    span: "",
  },
  {
    icon: LayoutDashboard,
    title: "Self-hosted mini dashboard",
    description: "Manage your gateway, view logs, and configure settings locally.",
    span: "",
  },
  {
    icon: Stethoscope,
    title: "Doctor checks",
    description: "One command to verify every endpoint. Prove it's fixed before you ship.",
    span: "lg:col-span-2",
  },
];

const FeaturesGrid = () => (
  <section className="py-14 md:py-20 relative">
    <div className="glow-orb absolute w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]" />

    <div className="section-container relative z-10">
      <AnimatedSection className="text-center mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary mb-2">Features</p>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">Everything you need</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">Full Supabase compatibility with production-grade controls.</p>
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {features.map((feat, i) => (
          <AnimatedSection key={feat.title} delay={i * 0.05} className={feat.span}>
            <div className="rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm p-5 h-full transition-all duration-300 hover:border-primary/20 group">
              <div className="h-7 w-7 rounded-md bg-primary/[0.08] flex items-center justify-center mb-3 transition-shadow duration-300 group-hover:shadow-[0_0_16px_-4px_hsl(var(--primary)/0.3)]">
                <feat.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <h3 className="text-xs font-bold text-foreground mb-1">{feat.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{feat.description}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesGrid;
