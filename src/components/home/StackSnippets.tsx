import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import CodeBlock from "@/components/CodeBlock";

const STACKS = [
  {
    label: "Next.js / React",
    value: "nextjs",
    code: `# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-slug.gw.xupastack.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key   # ← unchanged`,
    hint: "Works with App Router, Pages Router, and Vite-based React.",
  },
  {
    label: "Node.js",
    value: "node",
    code: `# .env
SUPABASE_URL=https://your-slug.gw.xupastack.com
SUPABASE_SERVICE_ROLE_KEY=your-key   # ← unchanged`,
    hint: "Express, Fastify, NestJS — any Node backend.",
  },
  {
    label: "Python",
    value: "python",
    code: `# .env or settings.py
SUPABASE_URL=https://your-slug.gw.xupastack.com
SUPABASE_KEY=your-anon-key   # ← unchanged`,
    hint: "Django, Flask, FastAPI, or standalone scripts.",
  },
  {
    label: "Flutter / Dart",
    value: "flutter",
    code: `// lib/constants.dart
const supabaseUrl = 'https://your-slug.gw.xupastack.com';
const supabaseAnonKey = 'your-anon-key';  // ← unchanged`,
    hint: "Works with supabase_flutter package.",
  },
  {
    label: "Generic",
    value: "generic",
    code: `// Wherever you initialize Supabase:
const client = createClient(
  'https://your-slug.gw.xupastack.com',  // ← Gateway URL (new)
  'your-anon-key'                         // ← unchanged
);`,
    hint: "Any language or framework. Only the URL changes.",
  },
];

const StackSnippets = () => {
  const [active, setActive] = useState("nextjs");
  const current = STACKS.find((s) => s.value === active) ?? STACKS[0];

  return (
    <section className="py-24 md:py-32">
      <div className="section-container">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Works with any stack</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            One URL swap. Your keys, schema, and RLS policies stay exactly the same.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="max-w-2xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 mb-5 justify-center">
            {STACKS.map((s) => (
              <button
                key={s.value}
                onClick={() => setActive(s.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active === s.value
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Snippet */}
          <div className="glass-card p-5">
            <CodeBlock code={current.code} />
            <p className="text-[11px] text-muted-foreground mt-3">{current.hint}</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default StackSnippets;
