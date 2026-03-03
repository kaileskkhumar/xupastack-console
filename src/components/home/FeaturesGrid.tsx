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
    description: "Prevents auth flows bouncing back to blocked domains. Google, GitHub, Apple sign-in just work.",
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
    description: "Manage your gateway and configure settings from a built-in dashboard at /__xupastack.",
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
    <div className="glow-orb absolute w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />

    <div className="section-container relative z-10">
      <AnimatedSection className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything you need</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Full Supabase compatibility with production-grade controls.</p>
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {features.map((feat, i) => (
          <AnimatedSection key={feat.title} delay={i * 0.06} className={feat.span}>
            <div className="glass-card p-6 h-full transition-all duration-300 hover:-translate-y-0.5 group">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4 shadow-[0_0_16px_-4px_hsl(var(--primary)/0.3)] group-hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.4)] transition-shadow duration-300">
                <feat.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1.5">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesGrid;
