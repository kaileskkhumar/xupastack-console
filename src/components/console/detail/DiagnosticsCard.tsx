import { Activity, Loader2, CheckCircle2, XCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { useDiagnostics } from "@/hooks/use-apps";

interface DiagnosticsCardProps {
  appId: string;
}

const SERVICE_LABELS: Record<string, string> = {
  authOk: "Auth",
  restOk: "REST API",
  storageOk: "Storage",
};

const DiagnosticsCard = ({ appId }: DiagnosticsCardProps) => {
  const diag = useDiagnostics(appId);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Diagnostics</h3>
        </div>
        <button
          onClick={() => diag.mutate()}
          disabled={diag.isPending}
          className="inline-flex items-center gap-1.5 h-7 px-3 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {diag.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          {diag.isPending ? "Running…" : "Run Diagnostics"}
        </button>
      </div>

      {!diag.data && !diag.isPending && (
        <div className="rounded-xl border border-border bg-card/30 p-6 text-center">
          <p className="text-xs text-muted-foreground">Click "Run Diagnostics" to check service health.</p>
        </div>
      )}

      {diag.isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-xs text-destructive">Diagnostics failed. Please try again.</p>
        </div>
      )}

      {diag.data && (
        <div className="rounded-xl border border-border bg-card/30 p-4 space-y-3">
          {/* Services grid */}
          <div className="grid grid-cols-2 gap-2">
            {(["authOk", "restOk", "storageOk"] as const).map((key) => {
              const val = diag.data![key];
              const isNull = val === null;
              const ok = val === true;
              return (
                <div
                  key={key}
                  className={`flex items-center gap-2 rounded-lg border p-3 ${
                    isNull
                      ? "border-border bg-secondary/30"
                      : ok
                      ? "border-emerald-500/20 bg-emerald-500/[0.04]"
                      : "border-destructive/20 bg-destructive/[0.04]"
                  }`}
                >
                  {isNull ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  ) : ok ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                  )}
                  <span className="text-xs font-medium text-foreground">{SERVICE_LABELS[key] || key}</span>
                </div>
              );
            })}
          </div>

          {/* Notes */}
          {diag.data.notes && diag.data.notes.length > 0 && (
            <div className="pt-2 border-t border-border space-y-1">
              {diag.data.notes.map((note, i) => (
                <p key={i} className="text-xs text-muted-foreground">• {note}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosticsCard;
