import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, FileText, MessageCircle, ExternalLink, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";

const helpLinks = [
  { icon: BookOpen, title: "Documentation", description: "Full reference for all XupaStack features", href: "/docs" },
  { icon: FileText, title: "Quickstart Guide", description: "Get your first gateway running in minutes", href: "/quickstart" },
  { icon: MessageCircle, title: "FAQ", description: "Common questions and troubleshooting", href: "/faq" },
  { icon: ExternalLink, title: "GitHub Issues", description: "Report bugs or request features", href: "https://github.com", external: true },
];

const troubleshootingItems = [
  {
    q: "Gateway returns 502 Bad Gateway",
    a: "This usually means the upstream Supabase URL is unreachable from the gateway. Verify the URL is correct and your Supabase project is active. For self-hosted, check the Cloudflare Worker logs.",
  },
  {
    q: "Auth redirects land on the blocked domain",
    a: 'Your OAuth provider callback URL still points to *.supabase.co. Update it to your gateway URL. In Supabase Dashboard → Auth → URL Configuration, add your gateway\'s /auth/v1/callback URL.',
  },
  {
    q: "Realtime WebSocket connection drops",
    a: "Ensure your gateway has the 'realtime' service enabled. WebSocket connections require the gateway to support upgrades — self-hosted Workers handle this natively.",
  },
  {
    q: "CORS errors in browser console",
    a: "Add your frontend domain to the allowed origins in gateway settings. Avoid using * in production. Check that the request Origin header matches exactly (including protocol and port).",
  },
  {
    q: "Rate limit hitting too early",
    a: "The default rate limit may be too low for your traffic. Increase it in settings. For self-hosted, you can also adjust the window duration in the Worker config.",
  },
];

const ConsoleHelp = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="section-container py-10 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Help & Support</h1>
        <p className="text-sm text-muted-foreground mb-8">Troubleshooting, resources, and a quick backout plan.</p>

        {/* Resources */}
        <h2 className="text-sm font-semibold text-foreground mb-3">Resources</h2>
        <div className="space-y-2 mb-10">
          {helpLinks.map((item) => {
            const isExt = item.external;
            return (
              <Link
                key={item.title}
                to={isExt ? "#" : item.href}
                {...(isExt ? { onClick: () => window.open(item.href, "_blank") } : {})}
                className="glass-card p-4 flex items-center gap-4 group block"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Troubleshooting */}
        <h2 className="text-sm font-semibold text-foreground mb-3">Troubleshooting</h2>
        <div className="space-y-1 mb-10">
          {troubleshootingItems.map((item, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium text-foreground pr-4">{item.q}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4">
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Backout plan */}
        <h2 className="text-sm font-semibold text-foreground mb-3">Backout Plan</h2>
        <div className="glass-card p-5 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            If you need to revert to direct Supabase connectivity, simply change <code className="font-mono bg-secondary px-1 py-0.5 rounded text-foreground">SUPABASE_URL</code> back to your original <code className="font-mono bg-secondary px-1 py-0.5 rounded text-foreground">*.supabase.co</code> URL and redeploy.
          </p>
          <CodeBlock
            code={`# Revert .env\nNEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co`}
            title="Revert to direct connection"
          />
          <p className="text-xs text-muted-foreground leading-relaxed">
            No data migration is needed. The gateway is stateless — it only proxies requests. Your Supabase project data remains untouched.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ConsoleHelp;
