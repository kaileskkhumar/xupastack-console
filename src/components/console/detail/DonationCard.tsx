import { Coffee } from "lucide-react";

const BMC_LINK = "https://buymeacoffee.com/kailesk";

const DonationCard = () => (
  <div className="glass-card p-5 mt-8 flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
      <Coffee className="h-5 w-5 text-amber-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground">XupaStack is free &amp; community-funded</p>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
        Built by a solo founder, funded out of pocket. If this saved your production app, a coffee keeps it alive for everyone.
      </p>
      <a
        href={BMC_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline mt-2"
      >
        <Coffee className="h-3 w-3" />
        Buy Me a Coffee
      </a>
    </div>
  </div>
);

export default DonationCard;
