import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, HelpCircle, Heart, User } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const consoleNav = [
  { label: "Apps", href: "/app", icon: LayoutGrid },
  { label: "Help", href: "/app/help", icon: HelpCircle },
  { label: "Donate", href: "/donate", icon: Heart },
];

const ConsoleLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col grain-overlay bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-2xl">
        <div className="section-container flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-sm text-foreground">
            <Logo className="h-6 w-6" />
            <span className="hidden sm:inline">XupaStack</span>
          </Link>

          <nav className="flex items-center gap-0.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-xl px-1.5 py-1">
            {consoleNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/app"
              className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <User className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
};

export default ConsoleLayout;
