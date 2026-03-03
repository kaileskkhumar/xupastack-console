import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Wifi, ArrowRight, AlertTriangle } from "lucide-react";

const isps = [
  { slug: "jio", name: "Jio", desc: "Fix Supabase connectivity on Jio networks" },
  { slug: "airtel", name: "Airtel", desc: "Fix Supabase connectivity on Airtel networks" },
  { slug: "act", name: "ACT Fibernet", desc: "Fix Supabase connectivity on ACT networks" },
];

const FixIndex = () => (
  <Layout>
    <section className="section-container py-20">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-6">
          <AlertTriangle className="h-4 w-4" />
          Connectivity Issues
        </div>
        <h1 className="text-4xl font-display font-bold tracking-tight text-foreground mb-4">
          Fix Guides
        </h1>
        <p className="text-lg text-muted-foreground">
          Step-by-step guides to fix Supabase connectivity issues on Indian ISPs and common browser errors.
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-3">
        {isps.map((isp) => (
          <Link
            key={isp.slug}
            to={`/fix/${isp.slug}`}
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Wifi className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{isp.name}</p>
                <p className="text-sm text-muted-foreground">{isp.desc}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        ))}

        <Link
          to="/errors/err_connection_timed_out"
          className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-foreground">ERR_CONNECTION_TIMED_OUT</p>
              <p className="text-sm text-muted-foreground">Fix the common browser timeout error</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>
      </div>
    </section>
  </Layout>
);

export default FixIndex;
