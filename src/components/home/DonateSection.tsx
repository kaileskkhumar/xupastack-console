import AnimatedSection from "@/components/AnimatedSection";
import { Heart, Coffee } from "lucide-react";
import bmcQr from "@/assets/bmc-qr.png";

const DonateSection = () => (
  <section className="py-24 md:py-32 relative">
    <div className="glow-orb absolute w-[500px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />

    <div className="section-container relative z-10">
      <AnimatedSection className="max-w-2xl mx-auto text-center">
        {/* Pulsing heart */}
        <div className="relative inline-flex items-center justify-center h-16 w-16 mb-8">
          {/* Spreading rings */}
          <span className="absolute inset-0 rounded-full bg-red-500/20 animate-[heartPing_2s_ease-out_infinite]" />
          <span className="absolute inset-0 rounded-full bg-red-500/15 animate-[heartPing_2s_ease-out_0.6s_infinite]" />
          <span className="absolute inset-0 rounded-full bg-red-500/10 animate-[heartPing_2s_ease-out_1.2s_infinite]" />
          {/* Heart icon */}
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 shadow-[0_0_30px_-4px_rgba(239,68,68,0.4)]">
            <Heart className="h-6 w-6 text-red-500 fill-red-500 animate-[heartBeat_1.2s_ease-in-out_infinite]" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
          One person. Zero funding. Your support keeps it free.
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-4">
          XupaStack is built and maintained by a solo developer — no company, no investors, no premium tier. Servers cost money, security audits cost money, and every hour spent on this is an hour I'm not earning elsewhere.
        </p>
        <p className="text-muted-foreground text-base leading-relaxed mb-10">
          If XupaStack kept your production app alive when nothing else worked, a single coffee means I can keep doing this — for you and for every developer who needs it next.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <a
            href="https://buymeacoffee.com/kailesk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.4)]"
          >
            <Coffee className="h-4 w-4" />
            Buy Me a Coffee
          </a>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-xl border border-border/50 bg-white p-2.5 shadow-sm">
              <img src={bmcQr} alt="Buy Me a Coffee QR code" className="h-24 w-24" />
            </div>
            <span className="text-[11px] text-muted-foreground">Scan to donate</span>
          </div>
        </div>
      </AnimatedSection>
    </div>

    <style>{`
      @keyframes heartPing {
        0% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(2.2); opacity: 0; }
      }
      @keyframes heartBeat {
        0%, 100% { transform: scale(1); }
        14% { transform: scale(1.2); }
        28% { transform: scale(1); }
        42% { transform: scale(1.15); }
        56% { transform: scale(1); }
      }
    `}</style>
  </section>
);

export default DonateSection;
