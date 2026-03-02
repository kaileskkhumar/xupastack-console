import { Link } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ConsoleDashboard = () => {
  return (
    <div className="section-container py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Your Gateways</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your XupaStack gateway deployments</p>
          </div>
          <Link
            to="/app/new"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            New Gateway
          </Link>
        </div>

        {/* Empty state */}
        <div className="glass-card p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Plus className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-display font-semibold text-foreground mb-2">No gateways yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            Create your first gateway to start routing traffic through XupaStack.
          </p>
          <Link
            to="/app/new"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Create gateway <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ConsoleDashboard;
