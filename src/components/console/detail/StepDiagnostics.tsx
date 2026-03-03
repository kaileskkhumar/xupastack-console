import { CheckCircle2, XCircle, Loader2, RotateCcw } from "lucide-react";
import { useVerifyApp } from "@/hooks/use-apps";
import type { VerifyResult } from "@/lib/api-client";

interface StepDiagnosticsProps {
  appId: string;
  onComplete: () => void;
  completed: boolean;
}

const StepDiagnostics = ({ appId, onComplete, completed }: StepDiagnosticsProps) => {
  const verify = useVerifyApp(appId);

  const handleRun = () => {
    verify.mutate(undefined, {
      onSuccess: (data: VerifyResult) => {
        if (data.authOk && data.restOk) onComplete();
      },
    });
  };

  return (
    <div className="space-y-4">
      {!verify.data && !verify.isPending && (
        <button
          onClick={handleRun}
          className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          Run Diagnostics
        </button>
      )}

      {verify.isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Running diagnostics…
        </div>
      )}

      {verify.isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-2">
          <p className="text-xs text-destructive">Diagnostics failed. Check your connection and try again.</p>
          <button onClick={handleRun} className="text-xs text-primary hover:underline flex items-center gap-1">
            <RotateCcw className="h-3 w-3" /> Retry
          </button>
        </div>
      )}

      {verify.data && (
        <div className="space-y-3">
          <div className="space-y-2">
            {([
              { key: "restOk", label: "REST API", required: true },
              { key: "authOk", label: "Auth", required: true },
              { key: "storageOk", label: "Storage", required: false },
            ] as const).map((svc) => {
              const val = verify.data![svc.key];
              const isNull = val === null;
              const ok = val === true;
              return (
                <div key={svc.key} className="flex items-start gap-2.5">
                  {isNull ? (
                    <span className="text-muted-foreground text-xs mt-0.5">—</span>
                  ) : ok ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm text-foreground">
                      {svc.label}
                      {!svc.required && <span className="text-[10px] text-muted-foreground ml-1.5">(optional)</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {verify.data.authOk && verify.data.restOk && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="text-sm font-medium text-foreground">✅ Your app should work in India now.</p>
              <p className="text-xs text-muted-foreground mt-1">All required services are responding through your gateway.</p>
            </div>
          )}

          {(!verify.data.authOk || !verify.data.restOk) && (
            <button onClick={handleRun} className="text-xs text-primary hover:underline flex items-center gap-1">
              <RotateCcw className="h-3 w-3" /> Re-run diagnostics
            </button>
          )}

          {verify.data.notes && verify.data.notes.length > 0 && (
            <div className="space-y-1">
              {verify.data.notes.map((note, i) => (
                <p key={i} className="text-xs text-muted-foreground">• {note}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {completed && !verify.data && (
        <p className="text-xs text-muted-foreground">Diagnostics passed previously.</p>
      )}
    </div>
  );
};

export default StepDiagnostics;
