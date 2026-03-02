import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

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
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-2xl">
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg tracking-tight text-foreground">
          <Logo className="h-8 w-8" />
          XupaStack
        </Link>

        {/* Center nav pill */}
        <nav className="hidden md:flex items-center gap-0.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-xl px-1.5 py-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                location.pathname.startsWith(item.href)
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            to="/donate"
            className="hidden sm:inline-flex px-4 py-1.5 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
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

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-2xl pb-4">
          <nav className="section-container flex flex-col gap-1 pt-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
              className="px-3 py-2 rounded-lg text-sm font-medium text-primary"
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
