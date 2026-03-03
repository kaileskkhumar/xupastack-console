import AnimatedSection from "@/components/AnimatedSection";
import { XCircle, CheckCircle2, ShieldAlert, Wifi, Smartphone, Users } from "lucide-react";

const myths = [
  {
    icon: Wifi,
    title: "Changing DNS only fixes your machine",
    desc: "Custom DNS (1.1.1.1, 8.8.8.8) works for your dev machine. Your end users won't change their DNS — and you can't make them.",
  },
  {
    icon: Smartphone,
    title: "Mobile apps can't enforce DNS or VPN",
    desc: "You can't ship a mobile app that requires a VPN. App Store and Play Store won't allow it, and users won't install one.",
  },
  {
    icon: Users,
    title: "VPN is not a solution for production users",
    desc: "Telling paying customers to 'use a VPN' is not acceptable. Your app should just work on any network.",
  },
];

const WhyNotDnsVpn = () => (
  <section className="py-14 md:py-20 relative">
    <div className="section-container">
      <AnimatedSection className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-destructive/30 bg-destructive/10 text-xs font-semibold text-destructive mb-5">
          <ShieldAlert className="h-3 w-3" />
          Common Mistake
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Why DNS & VPN aren't real fixes
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          They work for you, the developer. They don't work for your users.
        </p>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-12">
        {myths.map((m, i) => (
          <AnimatedSection key={m.title} delay={i * 0.08}>
            <div className="glass-card p-6 h-full">
              <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <m.icon className="h-4 w-4 text-destructive" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{m.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.3}>
        <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
            <p className="text-xs font-bold text-destructive mb-3 flex items-center gap-1.5">
              <XCircle className="h-3.5 w-3.5" /> Per-device workarounds
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>✗ Change DNS on every device</li>
              <li>✗ Ask users to install a VPN</li>
              <li>✗ Wait for ISPs to fix it</li>
            </ul>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-xs font-bold text-emerald-500 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Infra-level fix (XupaStack)
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>✓ One URL change in your codebase</li>
              <li>✓ All users fixed instantly</li>
              <li>✓ No user action required</li>
            </ul>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default WhyNotDnsVpn;
