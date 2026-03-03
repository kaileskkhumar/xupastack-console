import { GatewayStatus } from "@/data/gateway-types";

const statusConfig: Record<GatewayStatus, { label: string; dotClass: string; textClass: string }> = {
  active: { label: "Active", dotClass: "bg-emerald-500", textClass: "text-emerald-400" },
  disabled: { label: "Disabled", dotClass: "bg-destructive", textClass: "text-destructive" },
};

const StatusBadge = ({ status }: { status: GatewayStatus }) => {
  const config = statusConfig[status] || statusConfig.disabled;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.textClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
