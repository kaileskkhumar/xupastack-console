import { useState, useEffect, useRef } from "react";
import { Loader2, Server, Clock, Terminal, RefreshCw } from "lucide-react";
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
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => () => clearTimer(), []);

  const startCountdown = (expiresAt: string) => {
    clearTimer();
    const update = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(diff);
      if (diff <= 0) {
        clearTimer();
        setConfig(null);
      }
    };
    update();
    timerRef.current = setInterval(update, 1000);
  };

  const handleGetConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getSignedConfigUrl(appId);
      setConfig(result);
      startCountdown(result.expiresAt);
    } catch (err: any) {
      if (err?.name === "AuthError") {
        setError("Session expired — please log in again.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to get config");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const importCmd = config ? `npx create-xupastack@latest import --import "${config.configUrl}"` : "";
  const doctorCmd = "npx create-xupastack@latest doctor --gateway https://your-worker.workers.dev";

  return (
    <div className="space-y-6">
      {/* Explanation */}
      <div className="rounded-xl border border-border bg-card/30 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            <Server className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Self-Host Your Gateway</h3>
            <p className="text-xs text-muted-foreground">Free forever — unlimited requests</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Self-hosting is free forever. Your gateway runs on your own Cloudflare account with unlimited requests.
        </p>
      </div>

      {/* Generate / Active config */}
      <div className="rounded-xl border border-border bg-card/30 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">1</div>
          <h3 className="text-sm font-semibold text-foreground">Generate Setup Command</h3>
        </div>

        {!config ? (
          <>
            <p className="text-xs text-muted-foreground mb-3">Generate a signed config link for the CLI.</p>
            <button
              onClick={handleGetConfig}
              disabled={loading}
              className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {loading ? "Generating…" : "Generate Setup Command →"}
            </button>
            {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          </>
        ) : (
          <div className="space-y-3">
            {/* Countdown warning */}
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
              <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-500 font-medium">
                ⚠ This link expires in {formatTime(secondsLeft)}. Run the command now.
              </p>
            </div>

            {/* Copyable command */}
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 font-mono text-xs">
              <Terminal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="flex-1 truncate">{importCmd}</span>
              <CopyButton text={importCmd} />
            </div>

            {/* Regenerate button */}
            <button
              onClick={handleGetConfig}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Generate new link
            </button>
          </div>
        )}
      </div>

      {/* Verify deployment */}
      {config && (
        <div className="rounded-xl border border-border bg-card/30 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">2</div>
            <h3 className="text-sm font-semibold text-foreground">Verify Deployment</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            After running the command, your self-hosted gateway will be deployed. Run this to verify it's working:
          </p>
          <CodeBlock code={doctorCmd} />
        </div>
      )}
    </div>
  );
};

export default SelfHostTab;
