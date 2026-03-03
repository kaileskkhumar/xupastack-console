import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { Wifi, Smartphone, Users } from "lucide-react";

const myths = [
  {
    icon: Wifi,
    title: "DNS only fixes your machine",
    desc: "1.1.1.1 or 8.8.8.8 works for you. Your users won't change their DNS.",
  },
  {
    icon: Smartphone,
    title: "Mobile apps can't enforce VPN",
    desc: "App stores won't allow it, and users won't install one for your app.",
  },
  {
    icon: Users,
    title: "VPN isn't production-grade",
    desc: "Telling customers to 'use a VPN' is a support ticket, not a solution.",
  },
];

const WhyNotDnsVpn = () => (
  <section className="py-14 md:py-20 relative">
    <div className="section-container">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-destructive/20" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-destructive/80">Common pitfall</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-destructive/20" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2 tracking-tight">
            Why DNS & VPN aren't real fixes
          </h2>
          <p className="text-sm text-muted-foreground text-center max-w-lg mx-auto">
            They work for you. They don't work for your users.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-3 mb-8">
          {myths.map((m, i) => (
            <AnimatedSection key={m.title} delay={i * 0.06}>
              <div className="group relative rounded-xl border border-border/40 bg-card/30 p-5 h-full transition-colors duration-300 hover:border-destructive/20">
                <m.icon className="h-4 w-4 text-destructive/70 mb-3" />
                <h3 className="text-xs font-bold text-foreground mb-1 tracking-tight">{m.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{m.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            <div className="rounded-xl border border-destructive/15 bg-destructive/[0.03] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-destructive/70 mb-2.5">Per-device workaround</p>
              <ul className="space-y-1 text-[11px] text-muted-foreground">
                <li className="flex items-center gap-1.5"><span className="text-destructive/60">✗</span> Change DNS on every device</li>
                <li className="flex items-center gap-1.5"><span className="text-destructive/60">✗</span> Ask users to install a VPN</li>
                <li className="flex items-center gap-1.5"><span className="text-destructive/60">✗</span> Wait for ISPs to fix it</li>
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.03] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/70 mb-2.5">Infra-level fix</p>
              <ul className="space-y-1 text-[11px] text-muted-foreground">
                <li className="flex items-center gap-1.5"><span className="text-emerald-500/80">✓</span> One URL change in codebase</li>
                <li className="flex items-center gap-1.5"><span className="text-emerald-500/80">✓</span> All users fixed instantly</li>
                <li className="flex items-center gap-1.5"><span className="text-emerald-500/80">✓</span> No user action required</li>
              </ul>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export default WhyNotDnsVpn;
