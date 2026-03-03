import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronDown, ExternalLink, CheckCircle2 } from "lucide-react";
import CopyButton from "@/components/console/CopyButton";

interface SetupChecklistProps {
  appId: string;
  gatewayUrl: string;
}

const STORAGE_KEY = (id: string) => `xupastack_setup_dismissed_${id}`;

const SetupChecklist = ({ appId, gatewayUrl }: SetupChecklistProps) => {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY(appId)) === "true";
    } catch {
      return false;
    }
  });
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    try {
      if (dismissed) localStorage.setItem(STORAGE_KEY(appId), "true");
    } catch {}
  }, [dismissed, appId]);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/[0.06] overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <div className="h-8 w-8 rounded-lg bg-yellow-500/15 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Setup Checklist</p>
          <p className="text-xs text-muted-foreground">1 required step to complete</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Expandable body */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/[0.04] p-4">
                <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-[10px] font-bold text-yellow-500">1</span>
                  Configure Supabase redirect URL
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  To make email magic links and OAuth work through your gateway, set your Supabase Site URL to your gateway URL.
                </p>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Go to:</p>
                    <p className="text-xs">
                      Supabase Dashboard → Authentication → URL Configuration
                    </p>
                    <a
                      href="https://supabase.com/dashboard/project/_/auth/url-configuration"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-1"
                    >
                      Open Supabase Auth settings <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Set Site URL to:</p>
                    <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs">
                      <span className="flex-1 truncate">{gatewayUrl}</span>
                      <CopyButton text={gatewayUrl} />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Also add it to the <strong className="text-foreground">Additional Redirect URLs</strong> list.
                  </p>
                </div>
              </div>

              {/* Dismiss checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={dismissed}
                  onChange={(e) => setDismissed(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="h-4 w-4 rounded border border-border bg-background flex items-center justify-center transition-colors peer-checked:bg-primary peer-checked:border-primary">
                  <CheckCircle2 className="h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  I've configured this — don't show again
                </span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SetupChecklist;
