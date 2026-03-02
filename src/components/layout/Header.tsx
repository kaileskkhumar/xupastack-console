import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { label: "Quickstart", href: "/quickstart" },
  { label: "Docs", href: "/docs" },
  { label: "Guides", href: "/guides" },
  { label: "Security", href: "/security" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
];

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="section-container flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg tracking-tight text-foreground">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold">X</span>
          XupaStack
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                location.pathname.startsWith(item.href)
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/donate"
            className="hidden sm:inline-flex px-3.5 py-1.5 text-sm font-medium rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
          >
            Donate
          </Link>
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background pb-4">
          <nav className="section-container flex flex-col gap-1 pt-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname.startsWith(item.href)
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/donate"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-accent"
            >
              Donate
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
