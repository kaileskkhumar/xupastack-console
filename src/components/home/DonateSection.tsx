import AnimatedSection from "@/components/AnimatedSection";
import { Heart, Coffee } from "lucide-react";

const DonateSection = () => (
  <section className="py-24 md:py-32 relative">
    <div className="glow-orb absolute w-[500px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />

    <div className="section-container relative z-10">
      <AnimatedSection className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-6 shadow-[0_0_30px_-4px_hsl(var(--primary)/0.3)]">
          <Heart className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
          One person. Zero funding. Your support keeps it free.
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-4">
          XupaStack is built and maintained by a solo developer — no company, no investors, no premium tier. Servers cost money, security audits cost money, and every hour spent on this is an hour I'm not earning elsewhere.
        </p>
        <p className="text-muted-foreground text-base leading-relaxed mb-10">
          If XupaStack kept your production app alive when nothing else worked, a single coffee means I can keep doing this — for you and for every developer who needs it next.
        </p>
        <a
          href="https://buymeacoffee.com/kailesk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.4)]"
        >
          <Coffee className="h-4 w-4" />
          Buy Me a Coffee
        </a>
      </AnimatedSection>
    </div>
  </section>
);

export default DonateSection;
