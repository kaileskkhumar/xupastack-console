import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, ExternalLink, ClipboardList } from "lucide-react";
import CopyButton from "@/components/console/CopyButton";

interface SetupChecklistProps {
  appId: string;
  gatewayUrl: string;
}

const STORAGE_KEY = (id: string) => `xupastack_setup_${id}`;

interface ChecklistState {
  updateUrl: boolean;
  authRedirects: boolean;
  emailConfirm: boolean;
}

const SetupChecklist = ({ appId, gatewayUrl }: SetupChecklistProps) => {
  const [expanded, setExpanded] = useState(true);
  const [checks, setChecks] = useState<ChecklistState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY(appId));
      return stored ? JSON.parse(stored) : { updateUrl: false, authRedirects: false, emailConfirm: false };
    } catch {
      return { updateUrl: false, authRedirects: false, emailConfirm: false };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY(appId), JSON.stringify(checks));
    } catch {}
  }, [checks, appId]);

  const toggle = (key: keyof ChecklistState) =>
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));

  const completedCount = Object.values(checks).filter(Boolean).length;
  const allDone = completedCount === 3;

  if (allDone) return null;

  const envLine = `SUPABASE_URL=${gatewayUrl}`;
  const redirectUrl1 = gatewayUrl;
  const redirectUrl2 = `${gatewayUrl}/**`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 rounded-xl border border-primary/20 bg-primary/[0.04] overflow-hidden"
    >
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
          <ClipboardList className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Complete Your Setup</p>
          <p className="text-xs text-muted-foreground">{completedCount}/3 steps complete</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {/* Item 1: Update frontend URL */}
              <ChecklistItem
                checked={checks.updateUrl}
                onToggle={() => toggle("updateUrl")}
                title="Update your frontend: replace SUPABASE_URL with your gateway URL"
              >
                <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs">
                  <span className="flex-1 truncate">{envLine}</span>
                  <CopyButton text={envLine} />
                </div>
              </ChecklistItem>

              {/* Item 2: Auth redirect URLs */}
              <ChecklistItem
                checked={checks.authRedirects}
                onToggle={() => toggle("authRedirects")}
                title="Add gateway to Supabase Auth redirect URLs"
              >
                <p className="text-xs text-muted-foreground mb-2">
                  Go to: Supabase Dashboard → Authentication → URL Configuration
                </p>
                <a
                  href="https://supabase.com/dashboard/project/_/auth/url-configuration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline mb-3"
                >
                  Open Supabase Auth settings <ExternalLink className="h-3 w-3" />
                </a>
                <p className="text-xs text-muted-foreground mb-2">Add these to "Redirect URLs":</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs">
                    <span className="flex-1 truncate">{redirectUrl1}</span>
                    <CopyButton text={redirectUrl1} />
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs">
                    <span className="flex-1 truncate">{redirectUrl2}</span>
                    <CopyButton text={redirectUrl2} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This allows Supabase to send auth confirmation emails that work through your gateway.
                </p>
              </ChecklistItem>

              {/* Item 3: Disable email confirmation */}
              <ChecklistItem
                checked={checks.emailConfirm}
                onToggle={() => toggle("emailConfirm")}
                title="(Optional) Disable email confirmation in Supabase"
                optional
              >
                <p className="text-xs text-muted-foreground mb-2">
                  Go to: Supabase Dashboard → Authentication → Providers → Email
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  Toggle OFF "Enable email confirmations"
                </p>
                <p className="text-xs text-muted-foreground">
                  Email confirmation links go directly to Supabase (not through the gateway). Until you set up a custom email template, disable confirmations to avoid broken links for users in restricted regions.
                </p>
              </ChecklistItem>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface ChecklistItemProps {
  checked: boolean;
  onToggle: () => void;
  title: string;
  optional?: boolean;
  children: React.ReactNode;
}

const ChecklistItem = ({ checked, onToggle, title, optional, children }: ChecklistItemProps) => (
  <div className={`rounded-lg border p-4 transition-colors ${checked ? "border-emerald-500/20 bg-emerald-500/[0.04]" : "border-border bg-card/30"}`}>
    <label className="flex items-start gap-3 cursor-pointer mb-3">
      <button
        onClick={onToggle}
        className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
          checked ? "bg-emerald-500 border-emerald-500" : "border-border hover:border-foreground/30"
        }`}
      >
        {checked && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
      </button>
      <span className={`text-sm font-medium ${checked ? "text-muted-foreground line-through" : "text-foreground"}`}>
        {title}
        {optional && <span className="text-xs text-muted-foreground font-normal ml-1">(optional)</span>}
      </span>
    </label>
    {!checked && <div className="pl-7">{children}</div>}
  </div>
);

export default SetupChecklist;
