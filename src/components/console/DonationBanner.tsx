import { useState } from "react";
import { Coffee, X } from "lucide-react";

const BMC_LINK = "https://buymeacoffee.com/kailesk";
const BANNER_KEY = "xupastack_banner_dismissed";

const DonationBanner = () => {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(BANNER_KEY) === "1");

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(BANNER_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border-b border-amber-500/20">
      <div className="section-container flex items-center justify-between gap-3 py-2">
        <p className="text-xs text-muted-foreground flex-1 min-w-0">
          <span className="hidden sm:inline">XupaStack is free because of people like you — </span>
          <span className="sm:hidden">Free &amp; community-funded — </span>
          <a
            href={BMC_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 hover:underline"
          >
            <Coffee className="h-3 w-3" />
            Support the solo founder behind it
          </a>
        </p>
        <button
          onClick={handleDismiss}
          className="shrink-0 p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default DonationBanner;
