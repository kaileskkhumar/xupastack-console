import { useState } from "react";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import CodeBlock from "@/components/CodeBlock";
import { Check, ClipboardCopy, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  STACKS, Stack, CHECKLIST_ITEMS, DOCTOR_SERVICES,
  getEnvSnippet, fixEnvLine, getAllStepsCopyText,
} from "@/data/quickstart-helpers";

const Quickstart = () => {
  const [stack, setStack] = useState<Stack>("Next.js");
  const [checklist, setChecklist] = useState<boolean[]>(new Array(CHECKLIST_ITEMS.length).fill(false));
  const [envInput, setEnvInput] = useState("");

  const toggleCheck = (i: number) =>
    setChecklist((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const copyAll = async () => {
    await navigator.clipboard.writeText(getAllStepsCopyText());
    toast.success("All steps copied to clipboard");
  };

  const fixedLine = envInput ? fixEnvLine(envInput) : null;

  return (
    <Layout>
      <div className="section-container py-16 md:py-24">
        <AnimatedSection className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Quickstart</h1>
            <button
              onClick={copyAll}
              className="shrink-0 h-8 px-3 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5 mt-1"
            >
              <ClipboardCopy className="h-3.5 w-3.5" /> Copy all steps
            </button>
          </div>
          <p className="text-lg text-muted-foreground mb-6">Get your app working in five steps.</p>

          {/* Stack picker */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-medium text-muted-foreground">Your stack</span>
            <div className="relative">
              <select
                value={stack}
                onChange={(e) => setStack(e.target.value as Stack)}
                className="appearance-none h-8 pl-3 pr-7 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                {STACKS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Checklist */}
          <AnimatedSection delay={0.05}>
            <div className="surface-elevated rounded-xl p-6 mb-8 space-y-2.5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Quickstart Checklist</h3>
              {CHECKLIST_ITEMS.map((item, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => toggleCheck(i)}
                    className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      checklist[i]
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    {checklist[i] && <Check className="h-3 w-3" />}
                  </div>
                  <span className={`text-xs transition-colors ${checklist[i] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {item}
                  </span>
                </label>
              ))}
              <p className="text-xs text-muted-foreground pt-1">
                {checklist.filter(Boolean).length}/{CHECKLIST_ITEMS.length} complete
              </p>
            </div>
          </AnimatedSection>

          {/* Steps */}
          <div className="space-y-6">
            {/* Step 1: Create gateway */}
            <AnimatedSection delay={0.1}>
              <div className="surface-elevated rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-secondary text-foreground">1</div>
                  <h3 className="text-base font-semibold text-foreground">Create your gateway</h3>
                </div>
                <div className="space-y-4">
                  <CodeBlock code="npx xupastack deploy --project-ref your-project-ref" title="Self-hosted (recommended)" />
                  <CodeBlock code="npx xupastack managed:create --project-ref your-project-ref" title="Managed (fastest)" />
                </div>
              </div>
            </AnimatedSection>

            {/* Step 2: Swap URL */}
            <AnimatedSection delay={0.16}>
              <div className="surface-elevated rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-secondary text-foreground">2</div>
                  <h3 className="text-base font-semibold text-foreground">Swap your Supabase URL</h3>
                </div>
                <CodeBlock code={getEnvSnippet(stack)} title={stack} />

                {/* Env fixer */}
                <div className="mt-4 rounded-lg border border-border p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-foreground">Paste your current env line</h4>
                  <input
                    type="text"
                    value={envInput}
                    onChange={(e) => setEnvInput(e.target.value)}
                    placeholder="NEXT_PUBLIC_SUPABASE_URL=https://abc.supabase.co"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {fixedLine && <CodeBlock code={fixedLine} title="Corrected" />}
                </div>
              </div>
            </AnimatedSection>

            {/* Step 3: Auth callback */}
            <AnimatedSection delay={0.22}>
              <div className="surface-elevated rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-secondary text-foreground">3</div>
                  <h3 className="text-base font-semibold text-foreground">Add callback URL for OAuth</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  In your Supabase dashboard → Authentication → URL Configuration, add:
                </p>
                <CodeBlock code="https://your-ref.gw.xupastack.com/auth/v1/callback" />
                <p className="text-sm text-muted-foreground mt-3">
                  Also update your OAuth provider (Google Console, GitHub, etc.) with the new callback URL.
                </p>
              </div>
            </AnimatedSection>

            {/* Step 4: Doctor */}
            <AnimatedSection delay={0.28}>
              <div className="surface-elevated rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-secondary text-foreground">4</div>
                  <h3 className="text-base font-semibold text-foreground">Run the doctor</h3>
                </div>
                <CodeBlock code="npx xupastack doctor --project-ref your-project-ref" title="Terminal" />
                <div className="mt-4 rounded-lg border border-border p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Expected output</h4>
                  <div className="space-y-1.5 font-mono text-xs">
                    {DOCTOR_SERVICES.map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <span className="text-emerald-500">✓</span>
                        <span className="text-foreground">{s}</span>
                        <span className="text-emerald-400 ml-auto">OK</span>
                      </div>
                    ))}
                    <div className="border-t border-border mt-3 pt-3 text-emerald-400">
                      All services healthy — gateway is ready.
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Step 5: Lock down */}
            <AnimatedSection delay={0.34}>
              <div className="surface-elevated rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-secondary text-foreground">5</div>
                  <h3 className="text-base font-semibold text-foreground">Lock down origins for production</h3>
                </div>
                <CodeBlock
                  code={`// xupastack.config.js\nexport default {\n  cors: {\n    allowedOrigins: [\n      'https://your-app.com',\n      'https://staging.your-app.com'\n    ]\n  },\n  strictMode: true\n}`}
                  title="Config"
                  language="javascript"
                />
              </div>
            </AnimatedSection>
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
};

export default Quickstart;
