import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Heart, Coffee, Star } from "lucide-react";

const tiers = [
  {
    icon: Coffee,
    title: "Buy a coffee",
    amount: "$5",
    description: "Keeps the docs updated and the CI running.",
  },
  {
    icon: Heart,
    title: "Sustainer",
    amount: "$25/mo",
    description: "Funds regular maintenance, security patches, and community support.",
  },
  {
    icon: Star,
    title: "Sponsor",
    amount: "$100+",
    description: "Funds security audits, new features, and ecosystem integrations.",
  },
];

const Donate = () => (
  <Layout>
    <div className="section-container py-16 md:py-24 max-w-3xl">
      <AnimatedSection className="text-center mb-14">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-accent/10 mb-5">
          <Heart className="h-6 w-6 text-accent" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Support XupaStack</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          XupaStack is free and open-source. No paywall, no premium tier. If it saved your production app, consider donating to keep it maintained.
        </p>
      </AnimatedSection>

      <div className="grid sm:grid-cols-3 gap-5 mb-14">
        {tiers.map((tier, i) => (
          <AnimatedSection key={tier.title} delay={i * 0.1}>
            <div className="surface-elevated rounded-xl p-6 text-center h-full flex flex-col">
              <tier.icon className="h-6 w-6 text-accent mx-auto mb-3" />
              <h3 className="text-base font-bold text-foreground mb-1">{tier.title}</h3>
              <p className="text-2xl font-bold text-foreground mb-2">{tier.amount}</p>
              <p className="text-sm text-muted-foreground flex-1 mb-4">{tier.description}</p>
              <button className="w-full py-2.5 px-4 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity">
                Donate
              </button>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.3}>
        <div className="surface-elevated rounded-xl p-8 text-center">
          <h3 className="text-lg font-bold text-foreground mb-3">What donations fund</h3>
          <div className="grid sm:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground mb-1">Maintenance</p>
              <p>Bug fixes, dependency updates, Cloudflare API changes.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Documentation</p>
              <p>Guides, blog posts, framework-specific tutorials.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Security</p>
              <p>Code audits, vulnerability scanning, responsible disclosure program.</p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </Layout>
);

export default Donate;
