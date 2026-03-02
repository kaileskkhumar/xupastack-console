import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Zap } from "lucide-react";

const Hero = () => (
  <section className="relative overflow-hidden">
    <div className="hero-glow absolute inset-0 pointer-events-none" />
    <div className="section-container pt-20 pb-16 md:pt-32 md:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary text-xs font-medium text-muted-foreground mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Open-source · Free forever
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight text-foreground text-balance mb-5">
          Supabase blocked in India?{" "}
          <span className="gradient-text">Keep your app working in minutes.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 text-balance">
          XupaStack provides two free options: a privacy-first self-hosted gateway (recommended) and an instant managed gateway (fastest). Both keep Auth, Storage, Realtime, and Functions working.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/quickstart"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Terminal className="h-4 w-4" />
            Self-host (recommended)
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/quickstart?mode=managed"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card font-semibold text-sm text-foreground hover:bg-secondary transition-colors"
          >
            <Zap className="h-4 w-4" />
            Use managed gateway (fastest)
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="mt-16 max-w-2xl mx-auto"
      >
        <div className="code-block p-5 text-center">
          <p className="text-xs text-muted-foreground mb-2">One command. That's it.</p>
          <code className="text-sm md:text-base font-mono text-foreground">
            npx xupastack deploy --project-ref <span className="text-primary">your-ref</span>
          </code>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
