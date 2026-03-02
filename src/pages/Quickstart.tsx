import { useState } from "react";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import CodeBlock from "@/components/CodeBlock";
import { Check } from "lucide-react";

const tabs = ["Next.js", "Vite", "Expo", "Flutter", "Node"];

const envSnippets: Record<string, string> = {
  "Next.js": `# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.xupastack.dev
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`,
  Vite: `# .env
VITE_SUPABASE_URL=https://your-ref.xupastack.dev
VITE_SUPABASE_ANON_KEY=your-anon-key`,
  Expo: `// app.config.js
export default {
  extra: {
    supabaseUrl: 'https://your-ref.xupastack.dev',
    supabaseAnonKey: 'your-anon-key',
  },
};`,
  Flutter: `// lib/constants.dart
const supabaseUrl = 'https://your-ref.xupastack.dev';
const supabaseAnonKey = 'your-anon-key';`,
  Node: `# .env
SUPABASE_URL=https://your-ref.xupastack.dev
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`,
};

const Quickstart = () => {
  const [activeTab, setActiveTab] = useState("Next.js");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (step: number) => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    );
  };

  const steps = [
    {
      title: "Create your gateway",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">For self-hosted (recommended):</p>
          <CodeBlock code="npx xupastack deploy --project-ref your-project-ref" title="Terminal" />
          <p className="text-sm text-muted-foreground mt-4">For managed (fastest):</p>
          <CodeBlock code={`npx xupastack managed:create --project-ref your-project-ref`} title="Terminal" />
        </div>
      ),
    },
    {
      title: "Swap your Supabase URL",
      content: (
        <div className="space-y-3">
          <div className="flex gap-1 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <CodeBlock code={envSnippets[activeTab]} title={activeTab} language="env" />
        </div>
      ),
    },
    {
      title: "Add callback URL for OAuth",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            In your Supabase dashboard → Authentication → URL Configuration, add:
          </p>
          <CodeBlock code="https://your-ref.xupastack.dev/auth/v1/callback" />
          <p className="text-sm text-muted-foreground">
            Also update your OAuth provider (Google Console, GitHub, etc.) with the new callback URL.
          </p>
        </div>
      ),
    },
    {
      title: "Run the doctor",
      content: (
        <div className="space-y-3">
          <CodeBlock code="npx xupastack doctor --project-ref your-project-ref" title="Terminal" />
          <p className="text-sm text-muted-foreground">
            This checks REST, Auth, Storage, Realtime, and Functions through your gateway.
          </p>
        </div>
      ),
    },
    {
      title: "Lock down origins for production",
      content: (
        <div className="space-y-3">
          <CodeBlock
            code={`// xupastack.config.js
export default {
  cors: {
    allowedOrigins: [
      'https://your-app.com',
      'https://staging.your-app.com'
    ]
  },
  strictMode: true
}`}
            title="Config"
            language="javascript"
          />
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="section-container py-16 md:py-24">
        <AnimatedSection className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Quickstart</h1>
          <p className="text-lg text-muted-foreground mb-12">Get your app working in five steps.</p>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="surface-elevated rounded-xl p-6">
                  <button
                    onClick={() => toggleStep(i)}
                    className="flex items-center gap-3 w-full text-left mb-4"
                  >
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        completedSteps.includes(i)
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {completedSteps.includes(i) ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                  </button>
                  {step.content}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
};

export default Quickstart;
