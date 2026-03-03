import { useState } from "react";
import { Loader2, Code2 } from "lucide-react";
import { useSnippets } from "@/hooks/use-apps";
import CopyButton from "@/components/console/CopyButton";
import CodeBlock from "@/components/CodeBlock";

interface IntegrationSnippetsProps {
  appId: string;
}

const IntegrationSnippets = ({ appId }: IntegrationSnippetsProps) => {
  const { data: rawSnippets, isLoading, isError } = useSnippets(appId);
  const [activeTab, setActiveTab] = useState(0);

  const snippets = Array.isArray(rawSnippets) ? rawSnippets : [];

  if (isLoading) {
    return (
      <div className="mb-6 rounded-xl border border-border bg-card/30 p-6 flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || snippets.length === 0) return null;

  const current = snippets[activeTab];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Code2 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Integration Snippets</h3>
      </div>

      <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-0.5 p-1.5 border-b border-border bg-secondary/30">
          {snippets.map((snippet, i) => (
            <button
              key={snippet.language}
              onClick={() => setActiveTab(i)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === i
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {snippet.language}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">{current.title}</p>
            <CopyButton text={current.code} />
          </div>
          <CodeBlock code={current.code} language={current.language.toLowerCase()} />
        </div>
      </div>
    </div>
  );
};

export default IntegrationSnippets;
