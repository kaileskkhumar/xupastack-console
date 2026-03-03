import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Connect your Supabase project",
    description: "Paste your Supabase URL, we validate it instantly.",
  },
  {
    number: "02",
    title: "Get your gateway URL",
    description: "Replace SUPABASE_URL in your .env — one line change.",
  },
  {
    number: "03",
    title: "Works in 60 seconds",
    description: "Your users in India can now access your app.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-14 md:py-20 relative">
    <div className="section-container">
      <AnimatedSection className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How it works</h2>
        <p className="text-muted-foreground text-lg">Three steps. No magic, no lock-in.</p>
      </AnimatedSection>

      <div className="max-w-2xl mx-auto space-y-0">
        {steps.map((step, i) => (
          <AnimatedSection key={step.number} delay={i * 0.12}>
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="h-11 w-11 rounded-full border-2 border-primary/50 bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0 shadow-[0_0_20px_-4px_hsl(var(--primary)/0.4)]">
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-gradient-to-b from-primary/40 to-primary/5 my-2" />
                )}
              </div>
              <div className="pb-12 flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground mb-1.5">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.4} className="text-center mt-4">
        <Link
          to="/app/new"
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.4)]"
        >
          Fix My App — Free
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </AnimatedSection>
    </div>
  </section>
);

export default HowItWorks;
