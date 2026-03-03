import { useState } from "react";
import { Search } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";

const STACKS = [
  { label: "Lovable.dev", value: "lovable" },
  { label: "Emergent.sh", value: "emergent" },
  { label: "Next.js", value: "nextjs" },
  { label: "React / Vite", value: "vite" },
  { label: "Node", value: "node" },
  { label: "Python", value: "python" },
  { label: "Flutter", value: "flutter" },
  { label: "Expo", value: "expo" },
  { label: "Other", value: "other" },
];

interface StepUpdateUrlProps {
  upstreamUrl: string;
  gatewayUrl: string;
  onComplete: () => void;
  completed: boolean;
}

const getSnippet = (stack: string, gwUrl: string): { code: string; hint: string } => {
  const snippets: Record<string, { code: string; hint: string }> = {
    lovable: {
      code: `# .env\nVITE_SUPABASE_URL=${gwUrl}`,
      hint: "Paste in your Lovable project's environment variables (Settings → Env Vars).",
    },
    emergent: {
      code: `# .env\nVITE_SUPABASE_URL=${gwUrl}`,
      hint: "Update in your Emergent project settings under Environment Variables.",
    },
    nextjs: {
      code: `# .env.local\nNEXT_PUBLIC_SUPABASE_URL=${gwUrl}`,
      hint: "Paste in .env.local at your project root. Restart the dev server.",
    },
    vite: {
      code: `# .env\nVITE_SUPABASE_URL=${gwUrl}`,
      hint: "Paste in .env at your project root. Restart the dev server.",
    },
    node: {
      code: `# .env\nSUPABASE_URL=${gwUrl}`,
      hint: "Update your server's .env file and restart.",
    },
    python: {
      code: `# .env\nSUPABASE_URL=${gwUrl}`,
      hint: "Update your .env or settings file and restart the server.",
    },
    flutter: {
      code: `// lib/constants.dart\nconst supabaseUrl = '${gwUrl}';`,
      hint: "Replace the URL constant in your Supabase init file.",
    },
    expo: {
      code: `// app.config.js\nextra: {\n  supabaseUrl: '${gwUrl}',\n}`,
      hint: "Update app.config.js and rebuild.",
    },
    other: {
      code: `# Replace your Supabase Project URL with:\n${gwUrl}`,
      hint: "Find where you initialize the Supabase client and swap the URL. Keep your anon key unchanged.",
    },
  };
  return snippets[stack] || snippets.other;
};

const StepUpdateUrl = ({ upstreamUrl, gatewayUrl, onComplete, completed }: StepUpdateUrlProps) => {
  const [activeStack, setActiveStack] = useState("lovable");
  const [search, setSearch] = useState("");

  const filtered = STACKS.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase())
  );

  const snippet = getSnippet(activeStack, gatewayUrl);

  return (
    <div className="space-y-4">
      {/* Before / After */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-secondary/30 p-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Before — Upstream Supabase Project URL (original)</p>
          <p className="text-xs font-mono text-foreground truncate">{upstreamUrl}</p>
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
          <p className="text-[11px] text-primary uppercase tracking-wider mb-1">After — Gateway URL (new base URL)</p>
          <p className="text-xs font-mono text-foreground truncate">{gatewayUrl}</p>
        </div>
      </div>

      {/* Stack selector with search */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search framework…"
            className="w-full h-8 pl-8 pr-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {filtered.map((s) => (
            <button
              key={s.value}
              onClick={() => setActiveStack(s.value)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                activeStack === s.value
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Snippet */}
      <CodeBlock code={snippet.code} language={activeStack} />
      <p className="text-[11px] text-muted-foreground">{snippet.hint}</p>

      {/* Mark done */}
      {!completed && (
        <button
          onClick={onComplete}
          className="h-8 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
        >
          I've updated my URL →
        </button>
      )}
    </div>
  );
};

export default StepUpdateUrl;
