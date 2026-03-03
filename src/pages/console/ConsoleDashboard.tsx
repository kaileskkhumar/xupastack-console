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
  { label: "Self-host", value: "selfhost" },
  { label: "Managed", value: "managed" },
  { label: "Active", value: "active" },
  { label: "Disabled", value: "disabled" },
];

const ConsoleDashboard = () => {
  const [filter, setFilter] = useState<FilterKey>("all");
  const { data: gateways = [], isLoading, isError } = useApps();

  const filtered = gateways.filter((gw) => {
    if (filter === "all") return true;
    if (filter === "selfhost" || filter === "managed") return gw.mode === filter;
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
              <div className="space-y-3">
                {filtered.map((gw) => (
                  <Link
                    key={gw.id}
                    to={`/app/${gw.id}`}
                    className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-secondary/30 transition-colors block"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground truncate">{gw.name}</p>
                        <StatusBadge status={gw.status} />
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          {gw.mode === "selfhost" ? <Server className="h-3 w-3" /> : <Cloud className="h-3 w-3" />}
                          {gw.mode === "selfhost" ? "Self-host" : "Managed"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {gw.gatewayUrl && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded" onClick={(e) => e.preventDefault()}>
                            <span className="truncate max-w-[250px]">{gw.gatewayUrl}</span>
                            <CopyButton text={gw.gatewayUrl} />
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(gw.createdAt * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ConsoleDashboard;
