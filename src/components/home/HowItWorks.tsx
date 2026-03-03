import AnimatedSection from "@/components/AnimatedSection";
import CodeBlock from "@/components/CodeBlock";

const steps = [
  {
    number: "01",
    title: "Create gateway",
    description: "Deploy a self-hosted worker or spin up a managed endpoint.",
    code: "npx xupastack deploy --project-ref your-ref",
  },
  {
    number: "02",
    title: "Swap SUPABASE_URL",
    description: "Replace your environment variable. That's the only code change.",
    code: `# .env\nSUPABASE_URL=https://your-ref.gw.xupastack.com`,
  },
  {
    number: "03",
    title: "Verify everything works",
    description: "Run the doctor to confirm REST, Auth, Storage, and Realtime.",
    code: "npx xupastack doctor --project-ref your-ref",
  },
];

const HowItWorks = () => (
  <section className="py-14 md:py-20 relative">
    <div className="section-container">
      <AnimatedSection className="text-center mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary mb-2">Setup</p>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">How it works</h2>
        <p className="text-muted-foreground text-sm">Three steps. No magic, no lock-in.</p>
      </AnimatedSection>

      <div className="max-w-xl mx-auto space-y-0">
        {steps.map((step, i) => (
          <AnimatedSection key={step.number} delay={i * 0.1}>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-full border border-primary/40 bg-primary/[0.08] flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-gradient-to-b from-primary/30 to-transparent my-1.5" />
                )}
              </div>
              <div className="pb-8 flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground mb-0.5">{step.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{step.description}</p>
                <CodeBlock code={step.code} />
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
