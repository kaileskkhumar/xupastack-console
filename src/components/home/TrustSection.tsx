import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";
import { Check, X, ArrowRight } from "lucide-react";

const rows = [
  { label: "Your data plane", selfHost: true, managed: false },
  { label: "No third-party in path", selfHost: true, managed: false },
  { label: "Custom domain", selfHost: true, managed: false },
  { label: "Instant setup", selfHost: false, managed: true },
  { label: "No Cloudflare account needed", selfHost: false, managed: true },
  { label: "Full Supabase surface", selfHost: true, managed: true },
  { label: "Production-ready", selfHost: true, managed: false },
  { label: "Free", selfHost: true, managed: true },
];

const TrustSection = () => (
  <section className="py-14 md:py-20 relative">
    <div className="section-container">
      <AnimatedSection className="max-w-2xl mx-auto text-center mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary mb-2">Trust model</p>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
          Security — the honest version
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Any hosted gateway sits in the request path. <strong className="text-foreground">Self-hosted mode avoids this</strong> — it deploys into your Cloudflare account, under your domain.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="max-w-xl mx-auto">
        <div className="rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-3 font-medium text-muted-foreground"></th>
                <th className="p-3 font-bold text-foreground text-center text-[11px]">Self-hosted</th>
                <th className="p-3 font-bold text-foreground text-center text-[11px]">Managed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={`transition-colors hover:bg-primary/[0.02] ${
                    i < rows.length - 1 ? "border-b border-border/20" : ""
                  }`}
                >
                  <td className="p-3 text-foreground/90 font-medium">{row.label}</td>
                  <td className="p-3 text-center">
                    {row.selfHost ? <Check className="h-3.5 w-3.5 text-primary mx-auto" /> : <X className="h-3.5 w-3.5 text-muted-foreground/20 mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {row.managed ? <Check className="h-3.5 w-3.5 text-primary mx-auto" /> : <X className="h-3.5 w-3.5 text-muted-foreground/20 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2} className="text-center mt-5">
        <Link to="/security" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-colors">
          Read full security model <ArrowRight className="h-3 w-3" />
        </Link>
      </AnimatedSection>
    </div>
  </section>
);

export default TrustSection;
