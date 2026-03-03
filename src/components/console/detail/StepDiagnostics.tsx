import { CheckCircle2, XCircle, Loader2, RotateCcw } from "lucide-react";
import { useVerifyApp } from "@/hooks/use-apps";
import type { VerifyResult } from "@/lib/api-client";

interface StepDiagnosticsProps {
  appId: string;
  onComplete: () => void;
  completed: boolean;
}

const SERVICE_META: Record<string, { label: string; required: boolean; fixHint: string }> = {
  rest: { label: "REST API", required: true, fixHint: "Check that 'rest' is enabled in your gateway services." },
  auth: { label: "Auth", required: true, fixHint: "Ensure 'auth' service is enabled and your Supabase Auth is configured." },
  storage: { label: "Storage", required: false, fixHint: "Enable 'storage' in gateway services if you use Supabase Storage." },
  realtime: { label: "Realtime", required: false, fixHint: "Enable 'realtime' in gateway services if you use subscriptions." },
};

const StepDiagnostics = ({ appId, onComplete, completed }: StepDiagnosticsProps) => {
  const verify = useVerifyApp(appId);

  const handleRun = () => {
    verify.mutate(undefined, {
      onSuccess: (data: VerifyResult) => {
        if (data.allHealthy) onComplete();
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
          <button
            onClick={handleRun}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" /> Retry
          </button>
        </div>
      )}

      {verify.data && (
        <div className="space-y-3">
          <div className="space-y-2">
            {(Array.isArray(verify.data.services) ? verify.data.services : []).map((svc) => {
              const meta = SERVICE_META[svc.name.toLowerCase()] || {
                label: svc.name,
                required: false,
                fixHint: "Check gateway configuration.",
              };
              return (
                <div key={svc.name} className="flex items-start gap-2.5">
                  {svc.ok ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm text-foreground">
                      {meta.label}
                      {!meta.required && (
                        <span className="text-[10px] text-muted-foreground ml-1.5">(optional)</span>
                      )}
                    </p>
                    {!svc.ok && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">{meta.fixHint}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {verify.data.allHealthy && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="text-sm font-medium text-foreground">
                ✅ Your app should work in India now.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All services are responding through your gateway.
              </p>
            </div>
          )}

          {!verify.data.allHealthy && (
            <button
              onClick={handleRun}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Re-run diagnostics
            </button>
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
