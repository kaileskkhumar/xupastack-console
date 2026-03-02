import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Settings, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const ConsoleDetail = () => {
  const { id } = useParams();

  return (
    <div className="section-container py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/app" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to gateways
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Gateway {id}</h1>
            <p className="text-sm text-muted-foreground mt-1">Overview and status</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/app/${id}/deploy`}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Rocket className="h-3.5 w-3.5" />
              Deploy
            </Link>
            <Link
              to={`/app/${id}/settings`}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-card p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Active
            </p>
          </div>
          <div className="glass-card p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Endpoint</p>
            <p className="text-sm font-mono text-foreground truncate">gw-{id}.xupastack.dev</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Requests (24h)</p>
            <p className="text-sm font-semibold text-foreground">—</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConsoleDetail;
