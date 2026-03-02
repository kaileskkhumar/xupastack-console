import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const DonateSection = () => (
  <section className="py-24 md:py-32 relative">
    {/* Ambient glow */}
    <div className="glow-orb absolute w-[500px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />

    <div className="section-container relative z-10">
      <AnimatedSection className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-6 shadow-[0_0_30px_-4px_hsl(var(--primary)/0.3)]">
          <Heart className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
          Free forever. Community-funded.
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-10">
          If XupaStack saved your production app, consider donating. It funds maintenance, docs, and security reviews.
        </p>
        <Link
          to="/donate"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.4)]"
        >
          <Heart className="h-4 w-4" />
          Support the project
        </Link>
      </AnimatedSection>
    </div>
  </section>
);

export default DonateSection;
