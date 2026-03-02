import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="section-container py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Product</h4>
          <ul className="space-y-2">
            <li><Link to="/quickstart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Quickstart</Link></li>
            <li><Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Docs</Link></li>
            <li><Link to="/guides" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guides</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Resources</h4>
          <ul className="space-y-2">
            <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
            <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
            <li><Link to="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Community</h4>
          <ul className="space-y-2">
            <li><Link to="/donate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Donate</Link></li>
            <li><a href="https://github.com" target="_blank" rel="noopener" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
          <ul className="space-y-2">
            <li><Link to="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
            <li><span className="text-sm text-muted-foreground">MIT License</span></li>
          </ul>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs text-muted-foreground">© 2025 XupaStack. Free and open-source.</p>
        <p className="text-xs text-muted-foreground">Built by the community, for the community.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
