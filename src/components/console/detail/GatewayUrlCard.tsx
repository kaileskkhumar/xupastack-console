import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

interface GatewayUrlCardProps {
  url: string;
}

const GatewayUrlCard = ({ url }: GatewayUrlCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-5 mb-8">
      <p className="text-xs text-muted-foreground mb-2">Gateway URL</p>
      <div className="flex items-center justify-between gap-3">
        <p className="text-base font-mono font-semibold text-foreground truncate">{url}</p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="h-8 px-3 rounded-lg border border-border text-xs font-medium flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener"
            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">
        Only change the URL in your app. Keep your anon key the same.
      </p>
    </div>
  );
};

export default GatewayUrlCard;
