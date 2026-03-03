import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  'https://your-slug.gw.xupastack.com',  // ← Gateway URL
  'your-anon-key'                         // ← unchanged
);`,
    hint: "Any language or framework. Only the URL changes.",
  },
];

const StackSnippets = () => {
  const [active, setActive] = useState("nextjs");
  const current = STACKS.find((s) => s.value === active) ?? STACKS[0];

  return (
    <section className="py-14 md:py-20">
      <div className="section-container">
        <AnimatedSection className="text-center mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary mb-2">Integration</p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">Works with any stack</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            One URL swap. Keys, schema, and RLS policies stay exactly the same.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.08} className="max-w-xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 mb-4 justify-center">
            {STACKS.map((s) => (
              <button
                key={s.value}
                onClick={() => setActive(s.value)}
                className={`relative px-3 py-1.5 rounded-md text-[11px] font-medium transition-all duration-200 ${
                  active === s.value
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                {active === s.value && (
                  <motion.div
                    layoutId="stack-tab"
                    className="absolute inset-0 rounded-md bg-secondary border border-border/60"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Snippet */}
          <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.value}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="p-4"
              >
                <CodeBlock code={current.code} />
                <p className="text-[10px] text-muted-foreground/70 mt-2.5">{current.hint}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default StackSnippets;
