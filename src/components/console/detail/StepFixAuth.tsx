import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StepFixAuthProps {
  gatewayUrl: string;
  onComplete: () => void;
  completed: boolean;
}

const StepFixAuth = ({ gatewayUrl, onComplete, completed }: StepFixAuthProps) => {
  const [usesAuth, setUsesAuth] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const callbackUrl = `${gatewayUrl}/auth/v1/callback`;

  if (!usesAuth && !skipped) {
    return (
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <Checkbox
            checked={usesAuth}
            onCheckedChange={(v) => setUsesAuth(v === true)}
            className="mt-0.5"
          />
          <span className="text-sm text-foreground">My app uses Supabase Auth (login, OAuth, magic links)</span>
        </label>
        <button
          onClick={() => { setSkipped(true); onComplete(); }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip — I don't use Auth
        </button>
      </div>
    );
  }

  if (skipped) {
    return (
      <p className="text-xs text-muted-foreground">
        Skipped — you don't use Supabase Auth. You can come back if you add it later.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5 mb-1">
        <p className="text-sm font-medium text-foreground">Fix Auth Redirects</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs">
              Without this, password resets, magic links, and OAuth callbacks may redirect to localhost or break entirely in India.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-3 text-sm">
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="text-xs font-medium text-foreground mb-1">1. Set Site URL</p>
            <p className="text-xs text-muted-foreground">
              In your Supabase Dashboard → Authentication → URL Configuration, set <strong>Site URL</strong> to your production domain (e.g. <code className="text-foreground">https://yourapp.com</code>).
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-foreground mb-1">2. Add Redirect URLs</p>
            <p className="text-xs text-muted-foreground mb-2">
              Add these to <strong>Redirect URLs</strong>:
            </p>
            <div className="space-y-1">
              <code className="block text-[11px] font-mono text-foreground bg-background/50 px-2 py-1 rounded">
                https://yourapp.com/**
              </code>
              <code className="block text-[11px] font-mono text-foreground bg-background/50 px-2 py-1 rounded">
                http://localhost:3000/**
              </code>
              <code className="block text-[11px] font-mono text-foreground bg-background/50 px-2 py-1 rounded">
                {callbackUrl}
              </code>
            </div>
          </div>
        </div>
      </div>

      {!completed && (
        <button
          onClick={onComplete}
          className="h-8 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
        >
          I've fixed my redirects →
        </button>
      )}
    </div>
  );
};

export default StepFixAuth;
