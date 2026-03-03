import AnimatedSection from "@/components/AnimatedSection";
import { Heart, Coffee } from "lucide-react";
import bmcQr from "@/assets/bmc-qr.png";

const DonateSection = () => (
  <section className="py-14 md:py-20 relative">
    <div className="glow-orb absolute w-[400px] h-[250px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]" />

    <div className="section-container relative z-10">
      <AnimatedSection className="max-w-lg mx-auto text-center">
        {/* Pulsing heart */}
        <div className="relative inline-flex items-center justify-center h-12 w-12 mb-6">
          <span className="absolute inset-0 rounded-full bg-red-500/20 animate-[heartPing_2s_ease-out_infinite]" />
          <span className="absolute inset-0 rounded-full bg-red-500/15 animate-[heartPing_2s_ease-out_0.6s_infinite]" />
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/15">
            <Heart className="h-4.5 w-4.5 text-red-500 fill-red-500 animate-[heartBeat_1.2s_ease-in-out_infinite]" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
          One person. Zero funding.
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Built by a solo developer — no company, no investors. Servers and security audits cost money.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-8">
          If XupaStack kept your app alive, a single coffee means I can keep doing this.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="https://buymeacoffee.com/kailesk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity"
          >
            <Coffee className="h-3.5 w-3.5" />
            Buy Me a Coffee
          </a>

          <div className="flex flex-col items-center gap-1.5">
            <div className="rounded-lg border border-border/30 bg-white p-2">
              <img src={bmcQr} alt="Buy Me a Coffee QR code" className="h-20 w-20" />
            </div>
            <span className="text-[10px] text-muted-foreground/60">Scan to donate</span>
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
