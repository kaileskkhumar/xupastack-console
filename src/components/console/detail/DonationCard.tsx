import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const DonationCard = () => (
  <div className="glass-card p-5 mt-8 flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
      <Heart className="h-5 w-5 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground">XupaStack is free &amp; community-funded</p>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
        If this saved your production app, consider supporting the project. It funds maintenance, docs, and security reviews.
      </p>
      <Link
        to="/donate"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline mt-2"
      >
        <Heart className="h-3 w-3" />
        Support the project
      </Link>
    </div>
  </div>
);

export default DonationCard;
