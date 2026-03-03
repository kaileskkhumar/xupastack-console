import { useState } from "react";
import { Loader2, Server, Clock, Terminal } from "lucide-react";
import { api } from "@/lib/api-client";
import CopyButton from "@/components/console/CopyButton";
import CodeBlock from "@/components/CodeBlock";

interface SelfHostTabProps {
  appId: string;
}

const SelfHostTab = ({ appId }: SelfHostTabProps) => {
  const [config, setConfig] = useState<{ configUrl: string; expiresAt: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getSignedConfigUrl(appId);
      setConfig(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get config");
    } finally {
      setLoading(false);
    }
  };

  const importCmd = config ? `npx create-xupastack@latest import --import ${config.configUrl}` : "";
  const doctorCmd = "npx create-xupastack@latest doctor --gateway https://your-worker.workers.dev";

  return (
    <div className="space-y-6">
      {/* Step 1: Explanation */}
      <div className="rounded-xl border border-border bg-card/30 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            <Server className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Self-Host Your Gateway</h3>
            <p className="text-xs text-muted-foreground">Free forever — no caps, no rate limits</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Self-hosting is free forever. Your gateway runs on your own Cloudflare account — no monthly caps, no rate limits except your own.
        </p>
      </div>

      {/* Step 2: Get Config */}
      <div className="rounded-xl border border-border bg-card/30 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">1</div>
          <h3 className="text-sm font-semibold text-foreground">Get Configuration</h3>
        </div>

        {!config ? (
          <>
            <p className="text-xs text-muted-foreground mb-3">Download a signed config file for the CLI.</p>
            <button
              onClick={handleGetConfig}
              disabled={loading}
              className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {loading ? "Generating…" : "Get Config"}
            </button>
            {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-500">
              <Clock className="h-3 w-3" />
              This link expires in 15 minutes. Run the command immediately.
            </div>
          </div>
        )}
      </div>

      {/* Step 3: CLI command */}
      {config && (
        <div className="rounded-xl border border-border bg-card/30 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">2</div>
            <h3 className="text-sm font-semibold text-foreground">Run Import Command</h3>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 font-mono text-xs">
            <Terminal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="flex-1 truncate">{importCmd}</span>
            <CopyButton text={importCmd} />
          </div>
        </div>
      )}

      {/* Step 4: Doctor */}
      {config && (
        <div className="rounded-xl border border-border bg-card/30 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">3</div>
            <h3 className="text-sm font-semibold text-foreground">Verify Deployment</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">After deploying, run the doctor command to verify everything works:</p>
          <CodeBlock code={doctorCmd} />
        </div>
      )}
    </div>
  );
};

export default SelfHostTab;
