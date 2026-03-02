import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const DonateSection = () => (
  <section className="py-20 md:py-28">
    <div className="section-container">
      <AnimatedSection className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-accent/10 mb-5">
          <Heart className="h-5 w-5 text-accent" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Free forever. Community-funded.
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
          If XupaStack saved your production app, consider donating. It funds maintenance, docs, and security reviews.
        </p>
        <Link
          to="/donate"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Heart className="h-4 w-4" />
          Support the project
        </Link>
      </AnimatedSection>
    </div>
  </section>
);

export default DonateSection;
