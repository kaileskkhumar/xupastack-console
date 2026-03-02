import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";

const ConsoleDeploy = () => {
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

        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Deploy Gateway</h1>
        <p className="text-sm text-muted-foreground mb-8">Run these commands to deploy your gateway to Cloudflare Workers.</p>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">1. Clone and configure</h3>
            <CodeBlock code={`npx xupastack init --gateway ${id}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">2. Deploy to Cloudflare</h3>
            <CodeBlock code="npx wrangler deploy" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">3. Verify</h3>
            <CodeBlock code="npx xupastack doctor" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConsoleDeploy;
