import { useState } from "react";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import StepUpdateUrl from "./StepUpdateUrl";
import StepFixAuth from "./StepFixAuth";
import StepDiagnostics from "./StepDiagnostics";
import DonationCard from "./DonationCard";
import AdvancedView from "./AdvancedView";
import type { Gateway } from "@/data/gateway-types";

interface GoLiveChecklistProps {
  gw: Gateway;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

const STEPS = [
  { label: "Update Supabase URL", key: "url" },
  { label: "Fix Auth Redirects", key: "auth" },
  { label: "Run Diagnostics", key: "diagnostics" },
] as const;

type ViewMode = "simple" | "advanced";

const GoLiveChecklist = ({ gw, onDelete, isDeleting }: GoLiveChecklistProps) => {
  const [mode, setMode] = useState<ViewMode>("simple");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = useState(0);

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPct = Math.round((completedCount / STEPS.length) * 100);

  const markComplete = (key: string) => {
    setCompleted((prev) => ({ ...prev, [key]: true }));
    // Auto-advance to next incomplete step
    const nextIdx = STEPS.findIndex((s, i) => i > activeStep && !completed[s.key]);
    if (nextIdx !== -1) setActiveStep(nextIdx);
  };

  return (
    <div>
      {/* Section header with toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-display font-bold text-foreground">Go Live in India</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completedCount}/{STEPS.length} steps complete
          </p>
        </div>
        <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card/50 p-0.5 w-fit">
          <button
            onClick={() => setMode("simple")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              mode === "simple" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Simple
          </button>
          <button
            onClick={() => setMode("advanced")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              mode === "advanced" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <Progress value={progressPct} className="h-1.5 mb-6" />

      {mode === "simple" ? (
        <div className="space-y-4">
          {STEPS.map((step, i) => {
            const isActive = activeStep === i;
            const isDone = !!completed[step.key];

            return (
              <div
                key={step.key}
                className={`rounded-xl border transition-colors ${
                  isDone
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : isActive
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-card/30"
                }`}
              >
                {/* Step header — clickable */}
                <button
                  onClick={() => setActiveStep(i)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                      isDone
                        ? "bg-emerald-500 text-primary-foreground"
                        : isActive
                        ? "bg-primary/20 text-primary border border-primary/50"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isDone ? "text-emerald-400" : isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                    {isDone && <span className="ml-2 text-[11px]">✓ Done</span>}
                  </span>
                </button>

                {/* Step content */}
                {isActive && !isDone && (
                  <div className="px-4 pb-4 pl-14">
                    {step.key === "url" && (
                      <StepUpdateUrl
                        upstreamUrl={gw.upstreamUrl}
                        gatewayUrl={gw.gatewayUrl}
                        onComplete={() => markComplete("url")}
                        completed={isDone}
                      />
                    )}
                    {step.key === "auth" && (
                      <StepFixAuth
                        gatewayUrl={gw.gatewayUrl}
                        onComplete={() => markComplete("auth")}
                        completed={isDone}
                      />
                    )}
                    {step.key === "diagnostics" && (
                      <StepDiagnostics
                        appId={gw.id}
                        onComplete={() => markComplete("diagnostics")}
                        completed={isDone}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Donation card after all complete */}
          {completedCount === STEPS.length && <DonationCard />}
        </div>
      ) : (
        <AdvancedView gw={gw} onDelete={onDelete} isDeleting={isDeleting} />
      )}
    </div>
  );
};

export default GoLiveChecklist;
