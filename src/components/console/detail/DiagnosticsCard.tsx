import { Activity, Loader2, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useDiagnostics } from "@/hooks/use-apps";

interface DiagnosticsCardProps {
  appId: string;
}

const SERVICE_LABELS: Record<string, string> = {
  rest: "REST API",
  auth: "Auth",
  storage: "Storage",
  realtime: "Realtime",
};

const DiagnosticsCard = ({ appId }: DiagnosticsCardProps) => {
  const { data, isLoading, isFetching, refetch } = useDiagnostics(appId);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Diagnostics</h3>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 h-7 px-3 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {isFetching ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          {isFetching ? "Running…" : "Run Diagnostics"}
        </button>
      </div>

      {!data && !isLoading && (
        <div className="rounded-xl border border-border bg-card/30 p-6 text-center">
          <p className="text-xs text-muted-foreground">Click "Run Diagnostics" to check service health.</p>
        </div>
      )}

      {isLoading && (
        <div className="rounded-xl border border-border bg-card/30 p-6 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {data && (
        <div className="rounded-xl border border-border bg-card/30 p-4 space-y-3">
          {/* Upstream */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">Upstream Reachable</span>
            <StatusDot ok={data.upstreamReachable} />
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-2 gap-2">
            {data.services && Object.entries(data.services).map(([key, ok]) => (
              <div
                key={key}
                className={`flex items-center gap-2 rounded-lg border p-3 ${
                  ok ? "border-emerald-500/20 bg-emerald-500/[0.04]" : "border-destructive/20 bg-destructive/[0.04]"
                }`}
              >
                <StatusDot ok={ok as boolean} />
                <span className="text-xs font-medium text-foreground">{SERVICE_LABELS[key] || key}</span>
              </div>
            ))}
          </div>

          {/* Latency */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Latency</span>
            <span className="text-xs font-mono text-foreground">{data.latencyMs}ms</span>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusDot = ({ ok }: { ok: boolean }) =>
  ok ? (
    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
  ) : (
    <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
  );

export default DiagnosticsCard;
