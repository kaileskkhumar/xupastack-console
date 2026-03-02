import AnimatedSection from "@/components/AnimatedSection";
import { Globe, Lock, Shield, Gauge, LayoutDashboard, Stethoscope } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Full Supabase surface",
    description: "REST, Auth, Storage, Functions, GraphQL, Realtime WebSockets — all proxied.",
  },
  {
    icon: Lock,
    title: "OAuth-safe redirects",
    description: "Prevents auth flows bouncing back to blocked domains. Google, GitHub, Apple sign-in just work.",
  },
  {
    icon: Shield,
    title: "CORS controls & service toggles",
    description: "Restrict origins, enable only the services you need, block everything else.",
  },
  {
    icon: Gauge,
    title: "Rate limits & strict mode",
    description: "Configurable rate limiting and strict mode for production hardening.",
  },
  {
    icon: LayoutDashboard,
    title: "Self-hosted mini dashboard",
    description: "Manage your gateway, view logs, and configure settings from a local dashboard.",
  },
  {
    icon: Stethoscope,
    title: "Doctor checks",
    description: "One command to verify every endpoint. Prove it's fixed before you ship.",
  },
];

const FeaturesGrid = () => (
  <section className="py-20 md:py-28">
    <div className="section-container">
      <AnimatedSection className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything you need</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Full Supabase compatibility with production-grade controls.</p>
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {features.map((feat, i) => (
          <AnimatedSection key={feat.title} delay={i * 0.06}>
            <div className="surface-elevated rounded-xl p-6 h-full transition-shadow duration-300">
              <feat.icon className="h-5 w-5 text-primary mb-3" />
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
