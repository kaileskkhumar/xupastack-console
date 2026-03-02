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
    code: `# .env\nSUPABASE_URL=https://your-ref.xupastack.dev`,
  },
  {
    number: "03",
    title: "Verify everything works",
    description: "Run the doctor to confirm REST, Auth, Storage, and Realtime.",
    code: "npx xupastack doctor --project-ref your-ref",
  },
];

const HowItWorks = () => (
  <section className="py-20 md:py-28 bg-secondary/30">
    <div className="section-container">
      <AnimatedSection className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How it works</h2>
        <p className="text-muted-foreground text-lg">Three steps. No magic, no lock-in.</p>
      </AnimatedSection>

      <div className="max-w-2xl mx-auto space-y-8">
        {steps.map((step, i) => (
          <AnimatedSection key={step.number} delay={i * 0.12}>
            <div className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold shrink-0">
                  {step.number}
                </div>
                {i < steps.length - 1 && <div className="w-px flex-1 bg-border mt-3" />}
              </div>
              <div className="pb-8 flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
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
