import { Link } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";
import StatusBadge from "@/components/console/StatusBadge";
import type { Gateway } from "@/data/gateway-types";

interface DetailHeaderProps {
  gw: Gateway;
}

const DetailHeader = ({ gw }: DetailHeaderProps) => (
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
          Created {gw.createdAt}
        </p>
      </div>
      <Link
        to={`/app/${gw.id}/settings`}
        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
      >
        <Settings className="h-3.5 w-3.5" /> Settings
      </Link>
    </div>
  </>
);

export default DetailHeader;
