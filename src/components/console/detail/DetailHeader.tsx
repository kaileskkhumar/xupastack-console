import { Link } from "react-router-dom";
import { ArrowLeft, Settings, Loader2, Power } from "lucide-react";
import StatusBadge from "@/components/console/StatusBadge";
import { useDeactivateApp, useActivateApp } from "@/hooks/use-apps";
import type { Gateway } from "@/data/gateway-types";

interface DetailHeaderProps {
  gw: Gateway;
}

const DetailHeader = ({ gw }: DetailHeaderProps) => {
  const deactivate = useDeactivateApp(gw.id);
  const activate = useActivateApp(gw.id);
  const isToggling = deactivate.isPending || activate.isPending;

  const handleToggle = () => {
    if (gw.status === "active") {
      deactivate.mutate();
    } else if (gw.status === "disabled") {
      activate.mutate();
    }
  };

  return (
    <>
      <Link
        to="/app"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to gateways
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-display font-bold text-foreground">{gw.name}</h1>
            <StatusBadge status={gw.status} />
          </div>
          <p className="text-xs text-muted-foreground">
            Created {new Date(Number(gw.createdAt) * 1000).toLocaleDateString()}
          </p>
          {gw.status === "disabled" && (
            <div className="mt-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2">
              <p className="text-xs text-destructive">Your gateway is offline. Requests will return 403.</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(gw.status === "active" || gw.status === "disabled") && (
            <button
              onClick={handleToggle}
              disabled={isToggling}
              className={`inline-flex items-center gap-2 h-9 px-4 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 ${
                gw.status === "active"
                  ? "border-destructive/50 text-destructive hover:bg-destructive/10"
                  : "border-primary/50 text-primary hover:bg-primary/10"
              }`}
            >
              {isToggling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Power className="h-3.5 w-3.5" />}
              {gw.status === "active" ? "Disable" : "Enable"}
            </button>
          )}
          <Link
            to={`/app/${gw.id}/settings`}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Settings className="h-3.5 w-3.5" /> Settings
          </Link>
        </div>
      </div>
    </>
  );
};

export default DetailHeader;
