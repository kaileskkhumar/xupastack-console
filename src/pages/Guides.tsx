import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import CodeBlock from "@/components/CodeBlock";
import { ArrowRight } from "lucide-react";

const frameworks = [
  {
    name: "Next.js",
    env: `NEXT_PUBLIC_SUPABASE_URL=https://your-ref.gw.xupastack.com\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`,
    file: ".env.local",
    notes: "Works with both App Router and Pages Router. If using middleware for auth, no changes needed beyond the URL swap.",
  },
  {
    name: "Vite (React/Vue)",
    env: `VITE_SUPABASE_URL=https://your-ref.gw.xupastack.com\nVITE_SUPABASE_ANON_KEY=your-anon-key`,
    file: ".env",
    notes: "Restart the dev server after changing env vars. Vite caches env at build time.",
  },
  {
    name: "SvelteKit",
    env: `PUBLIC_SUPABASE_URL=https://your-ref.gw.xupastack.com\nPUBLIC_SUPABASE_ANON_KEY=your-anon-key`,
    file: ".env",
    notes: "Use the $env/static/public module for client-side access.",
  },
  {
    name: "Remix",
    env: `SUPABASE_URL=https://your-ref.gw.xupastack.com\nSUPABASE_ANON_KEY=your-anon-key`,
    file: ".env",
    notes: "Pass the URL through the loader to avoid exposing server env vars directly.",
  },
  {
    name: "Nuxt",
    env: `SUPABASE_URL=https://your-ref.gw.xupastack.com\nSUPABASE_KEY=your-anon-key`,
    file: ".env",
    notes: "If using @nuxtjs/supabase, update the runtimeConfig in nuxt.config.ts.",
  },
  {
    name: "Expo / React Native",
    env: `// app.config.js\nexport default {\n  extra: {\n    supabaseUrl: 'https://your-ref.gw.xupastack.com',\n    supabaseAnonKey: 'your-anon-key',\n  }\n};`,
    file: "app.config.js",
    notes: "Rebuild the app after changing config. OTA updates won't pick up config changes.",
  },
  {
    name: "Flutter",
    env: `const supabaseUrl = 'https://your-ref.gw.xupastack.com';\nconst supabaseAnonKey = 'your-anon-key';`,
    file: "lib/constants.dart",
    notes: "Use --dart-define for environment-specific URLs in production builds.",
  },
  {
    name: "Node.js",
    env: `SUPABASE_URL=https://your-ref.gw.xupastack.com\nSUPABASE_SERVICE_ROLE_KEY=your-service-role-key`,
    file: ".env",
    notes: "Server-side only. Use the service role key for admin operations.",
  },
];

const Guides = () => (
  <Layout>
    <div className="section-container py-16 md:py-24">
      <AnimatedSection>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Framework guides</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Swap one environment variable. Here's how for each framework.
        </p>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
        {frameworks.map((fw, i) => (
          <AnimatedSection key={fw.name} delay={i * 0.05}>
            <div className="surface-elevated rounded-xl p-6 h-full">
              <h3 className="text-lg font-bold text-foreground mb-4">{fw.name}</h3>
              <CodeBlock code={fw.env} title={fw.file} language="env" />
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{fw.notes}</p>

              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">OAuth redirect checklist</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                    Add gateway callback URL to Supabase dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                    Update OAuth provider with new redirect URI
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                    Test sign-in flow end-to-end on blocked network
                  </li>
                </ul>
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Realtime:</strong> WebSocket connections are proxied automatically. No additional config needed.
                </p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </Layout>
);

export default Guides;
