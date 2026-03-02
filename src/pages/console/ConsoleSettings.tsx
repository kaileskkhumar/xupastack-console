import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ConsoleSettings = () => {
  const { id } = useParams();

  return (
    <div className="section-container py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to={`/app/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to gateway
        </Link>

        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Gateway Settings</h1>
        <p className="text-sm text-muted-foreground mb-8">Configure CORS, rate limits, and service toggles.</p>

        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Allowed Origins (CORS)</h3>
            <input
              type="text"
              placeholder="https://myapp.com, https://staging.myapp.com"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Rate Limiting</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Enable rate limiting</span>
              <button className="w-10 h-6 rounded-full bg-secondary border border-border relative transition-colors">
                <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-muted-foreground transition-transform" />
              </button>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Strict Mode</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Block requests without valid origin</span>
              <button className="w-10 h-6 rounded-full bg-secondary border border-border relative transition-colors">
                <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-muted-foreground transition-transform" />
              </button>
            </div>
          </div>

          <div className="glass-card p-6 space-y-3 border-destructive/30">
            <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
            <button className="h-9 px-4 rounded-lg border border-destructive/50 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
              Delete Gateway
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConsoleSettings;
