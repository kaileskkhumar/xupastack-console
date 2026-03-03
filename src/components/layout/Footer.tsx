import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const Footer = () => (
  <footer className="border-t border-border/50 bg-background">
    <div className="section-container py-14">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-3 max-w-xs">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-foreground">
            <Logo className="h-6 w-6" />
            XupaStack
          </Link>
          <p className="text-sm text-muted-foreground">
            Open-source gateway for Supabase connectivity. Free forever.
          </p>
          <p className="text-xs text-muted-foreground/70 leading-relaxed mt-1">
            We are not affiliated with Supabase Inc or anyone. XupaStack is an open-source project for the developer community.
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
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</Link></li>
              <li><a href="https://status.xupastack.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Status</a></li>
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

      {/* Builder credit */}
      <div className="mt-10 pt-6 border-t border-border/30">
        <p className="text-sm text-muted-foreground">
          Built by{" "}
          <a
            href="https://in.linkedin.com/in/kailesk-khumar-soundararajan"
            target="_blank"
            rel="noopener"
            className="text-foreground font-medium hover:text-primary transition-colors"
          >
            Kailesk Khumar (HouseofMVP's)
          </a>
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} XupaStack. Free and open-source.</p>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          <Link to="/fair-use" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Fair Use</Link>
          <p className="text-xs text-muted-foreground">MIT License</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
