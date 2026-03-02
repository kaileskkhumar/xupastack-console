import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const Footer = () => (
  <footer className="border-t border-border/50 bg-background">
    <div className="section-container py-14">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-foreground">
            <Logo className="h-6 w-6" />
            XupaStack
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Open-source gateway for Supabase connectivity. Free forever.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/quickstart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Quickstart</Link></li>
              <li><Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Docs</Link></li>
              <li><Link to="/guides" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guides</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Community</h4>
            <ul className="space-y-2">
              <li><Link to="/donate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Donate</Link></li>
              <li><a href="https://github.com" target="_blank" rel="noopener" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs text-muted-foreground">© 2025 XupaStack. Free and open-source.</p>
        <p className="text-xs text-muted-foreground">MIT License</p>
      </div>
    </div>
  </footer>
);

export default Footer;
