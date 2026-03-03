import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Heart, Coffee, Star, ExternalLink } from "lucide-react";
import bmcQr from "@/assets/bmc-qr.png";

const BMC_LINK = "https://buymeacoffee.com/kailesk";

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
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-amber-500/10 mb-5">
          <Coffee className="h-6 w-6 text-amber-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Support XupaStack</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          I'm <span className="font-semibold text-foreground">Kailesk</span>, a solo founder building XupaStack entirely out of pocket. No VC funding, no premium tier, no paywall. If it saved your production app, a coffee goes a long way ☕
        </p>
      </AnimatedSection>

      {/* QR Code */}
      <AnimatedSection delay={0.1} className="flex justify-center mb-12">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <img src={bmcQr} alt="Buy Me a Coffee QR Code" className="w-44 h-44" />
        </div>
      </AnimatedSection>

      <div className="grid sm:grid-cols-3 gap-5 mb-14">
        {tiers.map((tier, i) => (
          <AnimatedSection key={tier.title} delay={0.15 + i * 0.1}>
            <div className="surface-elevated rounded-xl p-6 text-center h-full flex flex-col">
              <tier.icon className="h-6 w-6 text-amber-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-foreground mb-1">{tier.title}</h3>
              <p className="text-2xl font-bold text-foreground mb-2">{tier.amount}</p>
              <p className="text-sm text-muted-foreground flex-1 mb-4">{tier.description}</p>
              <a
                href={BMC_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
              >
                <Coffee className="h-4 w-4" />
                Donate
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.4}>
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
