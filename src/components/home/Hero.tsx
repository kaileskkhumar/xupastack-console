import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Zap } from "lucide-react";

const Hero = () => (
  <section className="relative overflow-hidden">
    {/* Ambient glow orbs */}
    <div className="glow-orb absolute w-[600px] h-[600px] -top-[200px] left-1/2 -translate-x-1/2 animate-glow-pulse" />
    <div className="glow-orb absolute w-[300px] h-[300px] top-[100px] left-[15%] opacity-20" />
    <div className="glow-orb absolute w-[200px] h-[200px] top-[200px] right-[10%] opacity-15" />
    <div className="hero-glow absolute inset-0 pointer-events-none" />

    <div className="section-container pt-24 pb-20 md:pt-40 md:pb-32 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-4xl mx-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-xl text-xs font-bold text-primary mb-8 shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="gradient-text-shimmer">Open-Source · Free Forever</span>
        </motion.div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-foreground text-balance mb-6">
          Supabase blocked in India?{" "}
          <span className="gradient-text-shimmer">Keep your app working in minutes.</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 text-balance"
        >
          XupaStack provides two free options: a privacy-first self-hosted gateway (recommended) and an instant managed gateway (fastest). Both keep Auth, Storage, Realtime, and Functions working.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/app/new"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-[0_0_24px_-4px_hsl(var(--primary)/0.4)]"
          >
            <Terminal className="h-4 w-4" />
            Self-host (recommended)
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/app/new"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-xl font-semibold text-sm text-foreground hover:bg-secondary/50 transition-all duration-200"
          >
            <Zap className="h-4 w-4" />
            Use managed gateway (fastest)
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="mt-20 max-w-2xl mx-auto"
      >
        <div className="relative rounded-xl border border-border/50 bg-card/30 backdrop-blur-xl p-6 text-center shadow-[0_0_60px_-12px_hsl(var(--primary)/0.15)]">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <p className="text-xs text-muted-foreground mb-3 relative z-10">One command. That's it.</p>
          <code className="text-sm md:text-base font-mono text-foreground relative z-10">
            npx xupastack deploy --project-ref <span className="text-primary">your-ref</span>
          </code>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
