import { useState } from "react";
import { Loader2, Code2 } from "lucide-react";
import { useSnippets } from "@/hooks/use-apps";
import CopyButton from "@/components/console/CopyButton";
import CodeBlock from "@/components/CodeBlock";

interface IntegrationSnippetsProps {
  appId: string;
  gatewayUrl?: string | null;
  mode?: string;
}

const TAB_LABELS: Record<string, string> = {
  "supabase-js": "supabase-js",
  "nextjs": "Next.js",
  "vite": "Vite",
  "node": "Node",
  "python": "Python",
  "flutter": "Flutter",
  "expo": "Expo",
  "emergent": "Emergent",
  "other": "Other",
};

const IntegrationSnippets = ({ appId, gatewayUrl, mode }: IntegrationSnippetsProps) => {
  const skipFetch = mode === "selfhost" && !gatewayUrl;
  const { data: raw, isLoading, isError } = useSnippets(appId, !skipFetch);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  if (skipFetch) {
    return (
      <div className="mb-6 rounded-xl border border-border bg-card/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">Deploy your gateway first to see code snippets.</p>
      </div>
    );
  }

  const snippetsMap = raw?.snippets && typeof raw.snippets === "object" ? raw.snippets : {};
  const entries = Object.entries(snippetsMap);

  if (isLoading) {
    return (
      <div className="mb-6 rounded-xl border border-border bg-card/30 p-6 flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mb-6 rounded-xl border border-border bg-card/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">Deploy your gateway first to see code snippets.</p>
      </div>
    );
  }

  if (entries.length === 0) return null;

  const currentKey = activeTab && snippetsMap[activeTab] ? activeTab : entries[0][0];
  const currentCode = snippetsMap[currentKey];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Code2 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Integration Snippets</h3>
      </div>

      <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-0.5 p-1.5 border-b border-border bg-secondary/30 overflow-x-auto">
          {entries.map(([key]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                currentKey === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {TAB_LABELS[key] || key}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-end mb-2">
            <CopyButton text={currentCode} />
          </div>
          <CodeBlock code={currentCode} language="bash" />
        </div>
      </div>
    </div>
  );
};

export default IntegrationSnippets;
