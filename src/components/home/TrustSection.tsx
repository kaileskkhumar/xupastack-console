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
      <AnimatedSection className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
          Security &amp; privacy — the honest version
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-3">
          Any hosted gateway sits in the request path. Even with good intentions, you're trusting their logging policy and operational security.
        </p>
        <p className="text-muted-foreground text-lg leading-relaxed">
          <strong className="text-foreground">Self-hosted mode avoids this</strong>: XupaStack deploys into your Cloudflare account, under your domain. You keep control.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.15} className="max-w-2xl mx-auto">
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 font-medium text-muted-foreground"></th>
                <th className="p-4 font-semibold text-foreground text-center">Self-hosted</th>
                <th className="p-4 font-semibold text-foreground text-center">Managed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={`transition-colors hover:bg-primary/[0.03] ${
                    i < rows.length - 1 ? "border-b border-border/30" : ""
                  }`}
                >
                  <td className="p-4 text-foreground font-medium">{row.label}</td>
                  <td className="p-4 text-center">
                    {row.selfHost ? (
                      <Check className="h-4 w-4 text-primary mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {row.managed ? (
                      <Check className="h-4 w-4 text-primary mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.25} className="text-center mt-8">
        <Link to="/security" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline transition-colors">
          Read the full security model <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </AnimatedSection>
    </div>
  </section>
);

export default TrustSection;
