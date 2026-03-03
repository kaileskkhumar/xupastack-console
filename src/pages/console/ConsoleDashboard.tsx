import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowRight, ExternalLink, Server, Cloud, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { GatewayMode, GatewayStatus } from "@/data/gateway-types";
import StatusBadge from "@/components/console/StatusBadge";
import CopyButton from "@/components/console/CopyButton";
import { useApps } from "@/hooks/use-apps";

type FilterKey = "all" | GatewayMode | GatewayStatus;

const filters: { label: string; value: FilterKey }[] = [
  { label: "All", value: "all" },
  { label: "Self-hosted", value: "self-hosted" },
  { label: "Managed", value: "managed" },
  { label: "Needs setup", value: "needs-setup" },
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
];

const ConsoleDashboard = () => {
  const [filter, setFilter] = useState<FilterKey>("all");
  const { data: gateways = [], isLoading, isError } = useApps();

  const filtered = gateways.filter((gw) => {
    if (filter === "all") return true;
    if (filter === "self-hosted" || filter === "managed") return gw.mode === filter;
    return gw.status === filter;
  });

  return (
    <div className="section-container py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Gateways</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLoading ? "Loading…" : `${gateways.length} gateway${gateways.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link
            to="/app/new"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="h-4 w-4" />
            Create gateway
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                filter === f.value
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="glass-card p-12 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="glass-card p-12 text-center">
            <p className="text-sm text-destructive">Failed to load gateways. Please try again.</p>
          </div>
        )}

        {/* Table or empty state */}
        {!isLoading && !isError && (
          <>
            {filtered.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">No gateways found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                  {filter === "all"
                    ? "Create your first gateway to start routing traffic through XupaStack."
                    : "No gateways match this filter."}
                </p>
                <Link
                  to="/app/new"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Create gateway <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Name</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">Mode</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Gateway URL</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Last check</th>
                        <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">Requests</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((gw) => (
                        <tr key={gw.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3.5">
                            <Link to={`/app/${gw.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                              {gw.name}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-0.5 md:hidden">
                              {gw.mode === "self-hosted" ? "Self-hosted" : "Managed"}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 hidden md:table-cell">
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                              {gw.mode === "self-hosted" ? <Server className="h-3 w-3" /> : <Cloud className="h-3 w-3" />}
                              {gw.mode === "self-hosted" ? "Self-hosted" : "Managed"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={gw.status} />
                          </td>
                          <td className="px-4 py-3.5 hidden lg:table-cell">
                            {gw.gatewayUrl ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                                <span className="truncate max-w-[200px]">{gw.gatewayUrl}</span>
                                <CopyButton text={gw.gatewayUrl} />
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-muted-foreground">{gw.lastCheck}</td>
                          <td className="px-4 py-3.5 hidden md:table-cell text-right text-xs text-muted-foreground font-mono">
                            {gw.requestsMonth.toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <Link
                              to={`/app/${gw.id}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ConsoleDashboard;
