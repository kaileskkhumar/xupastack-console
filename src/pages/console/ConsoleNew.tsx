import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ConsoleNew = () => {
  return (
    <div className="section-container py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/app" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to gateways
        </Link>

        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Create Gateway</h1>
        <p className="text-sm text-muted-foreground mb-8">Configure a new XupaStack gateway deployment.</p>

        <div className="glass-card p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Gateway name</label>
            <input
              type="text"
              placeholder="my-app-gateway"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Supabase Project URL</label>
            <input
              type="text"
              placeholder="https://xxxxx.supabase.co"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Deployment type</label>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-lg border-2 border-primary bg-primary/5 text-left">
                <p className="text-sm font-semibold text-foreground">Self-hosted</p>
                <p className="text-xs text-muted-foreground mt-1">Deploy to your Cloudflare</p>
              </button>
              <button className="p-4 rounded-lg border border-border hover:border-border/80 text-left transition-colors">
                <p className="text-sm font-semibold text-foreground">Managed</p>
                <p className="text-xs text-muted-foreground mt-1">Instant, no setup</p>
              </button>
            </div>
          </div>
          <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Create Gateway
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConsoleNew;
