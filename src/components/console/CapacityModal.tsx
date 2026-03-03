import { useState, useEffect } from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { CAPACITY_EVENT } from "@/lib/api-client";

interface CapacityModalProps {
  onSelfHost?: () => void;
}

const CapacityModal = ({ onSelfHost }: CapacityModalProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(CAPACITY_EVENT, handler);
    return () => window.removeEventListener(CAPACITY_EVENT, handler);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-amber-500/15 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
        </div>
        <h2 className="text-xl font-display font-bold text-foreground mb-2">Monthly Capacity Reached</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Your app has used its free monthly allowance on the managed gateway. Switch to self-host mode to continue with no limits — it's free forever.
        </p>
        <div className="space-y-2">
          <button
            onClick={() => {
              setOpen(false);
              onSelfHost?.();
            }}
            className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Self-Host for Free <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-full h-10 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default CapacityModal;
