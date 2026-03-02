import { Link } from "react-router-dom";
import { BookOpen, MessageCircle, FileText, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const helpLinks = [
  { icon: BookOpen, title: "Documentation", description: "Full reference for all XupaStack features", href: "/docs" },
  { icon: FileText, title: "Quickstart Guide", description: "Get your first gateway running in minutes", href: "/quickstart" },
  { icon: MessageCircle, title: "FAQ", description: "Common questions and troubleshooting", href: "/faq" },
  { icon: ExternalLink, title: "GitHub Issues", description: "Report bugs or request features", href: "https://github.com", external: true },
];

const ConsoleHelp = () => {
  return (
    <div className="section-container py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Help & Support</h1>
        <p className="text-sm text-muted-foreground mb-8">Resources to help you get the most out of XupaStack.</p>

        <div className="space-y-3">
          {helpLinks.map((item) => {
            const Comp = item.external ? "a" : Link;
            const extraProps = item.external ? { target: "_blank", rel: "noopener" } : {};
            return (
              <Comp
                key={item.title}
                to={!item.external ? item.href : undefined}
                href={item.external ? item.href : undefined}
                {...(extraProps as any)}
                className="glass-card p-5 flex items-center gap-4 group cursor-pointer block"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <item.icon className="h-4.5 w-4.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </Comp>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ConsoleHelp;
