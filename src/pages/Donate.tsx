import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Heart, Coffee, ExternalLink } from "lucide-react";
import bmcQr from "@/assets/bmc-qr.png";

const BMC_LINK = "https://buymeacoffee.com/kailesk";

const Donate = () =>
<Layout>
    <div className="section-container py-16 md:py-24 max-w-2xl">
      <AnimatedSection className="text-center space-y-6">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-2">
          <Heart className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Keep XupaStack Alive</h1>
        <div className="space-y-4 text-muted-foreground text-base leading-relaxed max-w-lg mx-auto">
          <p>
            I'm <span className="font-semibold text-foreground">Kailesk</span> — a solo developer who built XupaStack to solve a real problem: Supabase getting blocked in production.
          </p>
          <p>There's no company behind this. No investors. No premium tier. Just one person paying for servers and writing code at midnight so that your project stays live in India

        </p>
          <p>
            If XupaStack kept your app running when nothing else worked, a small donation means I can keep it <span className="font-semibold text-foreground">free and maintained for everyone</span>.
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center pt-2">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <img src={bmcQr} alt="Buy Me a Coffee QR Code" className="w-40 h-40" />
          </div>
        </div>

        <a
        href={BMC_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.4)]">
        
          <Coffee className="h-4 w-4" />
          Buy Me a Coffee
          <ExternalLink className="h-3 w-3 opacity-70" />
        </a>

        <p className="text-xs text-muted-foreground/60 pt-4">
          Every contribution — no matter the size — keeps this project going. Thank you 💜
        </p>
      </AnimatedSection>
    </div>
  </Layout>;


export default Donate;