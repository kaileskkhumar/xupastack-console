import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import ConfirmModal from "@/components/console/ConfirmModal";
import type { Gateway } from "@/data/gateway-types";

interface AdvancedViewProps {
  gw: Gateway;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

const AdvancedView = ({ gw, onDelete, isDeleting }: AdvancedViewProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Requests this month</p>
          <p className="text-xl font-display font-bold text-foreground">{(gw.requestsMonth ?? 0).toLocaleString()}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Rate limit</p>
          <p className="text-xl font-display font-bold text-foreground">{gw.rateLimitPerMin}/min</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Last check</p>
          <p className="text-xl font-display font-bold text-foreground">{gw.lastCheck || "—"}</p>
        </div>
      </div>

      {/* Details */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Details</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Upstream</p>
            <p className="font-mono text-foreground text-xs">{gw.upstreamUrl}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Allowed Origins</p>
            <p className="font-mono text-foreground text-xs">{gw.allowedOrigins.join(", ") || "None"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Services</p>
            <div className="flex flex-wrap gap-1.5">
              {gw.enabledServices.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded text-[11px] bg-secondary text-foreground font-medium">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Created</p>
            <p className="text-foreground text-xs">{gw.createdAt}</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 space-y-4 border-destructive/20">
        <h3 className="text-sm font-semibold text-foreground">Danger Zone</h3>
        <button
          onClick={() => setDeleteOpen(true)}
          disabled={isDeleting}
          className="h-9 px-4 rounded-lg border border-destructive/50 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Delete gateway
        </button>
      </div>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => { await onDelete(); setDeleteOpen(false); }}
        title="Delete gateway?"
        description="This action is irreversible. All configuration and history for this gateway will be permanently removed."
        confirmLabel="Delete gateway"
        variant="danger"
      />
    </div>
  );
};

export default AdvancedView;
