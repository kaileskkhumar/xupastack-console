import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Heart, Coffee, ExternalLink } from "lucide-react";
import bmcQr from "@/assets/bmc-qr.png";

const BMC_LINK = "https://buymeacoffee.com/kailesk";
const STORAGE_KEY = "xupastack_donated_dismissed";
const SHOW_KEY = "xupastack_show_donation";

const DonationPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const shouldShow = localStorage.getItem(SHOW_KEY);
    const alreadyDismissed = localStorage.getItem(STORAGE_KEY);
    if (shouldShow && !alreadyDismissed) {
      localStorage.removeItem(SHOW_KEY);
      // Small delay so the page renders first
      const t = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(t);
    } else if (shouldShow) {
      localStorage.removeItem(SHOW_KEY);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleDismiss(); }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border bg-card">
        {/* Top accent strip */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary" />

        <div className="px-6 pt-5 pb-6 space-y-5">
          <DialogTitle className="sr-only">Support XupaStack</DialogTitle>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 mx-auto">
              <Coffee className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              You just created a gateway — for free ☕
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Hey, I'm <span className="font-semibold text-foreground">Kailesk</span> — a solo founder building and funding XupaStack entirely out of pocket. No VC money, no paywall, no premium tier.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Every coffee keeps the servers running and this service <span className="font-semibold text-foreground">free for everyone</span>. If XupaStack just saved your production app, consider buying me one ☕
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <img src={bmcQr} alt="Buy Me a Coffee QR Code" className="w-36 h-36" />
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-2.5">
            <a
              href={BMC_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Coffee className="h-4 w-4" />
              Buy Me a Coffee
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
            <button
              onClick={handleDismiss}
              className="w-full h-10 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          </div>

          <p className="text-center text-[11px] text-muted-foreground/60 flex items-center justify-center gap-1">
            <Heart className="h-3 w-3" /> Built with love by one person for the community
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationPopup;
