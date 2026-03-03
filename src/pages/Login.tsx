import { Link, useSearchParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Github, ArrowRight, Shield, Loader2, Mail, RotateCw } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const { user, isLoading, signInWithGitHub, signInWithMagicLink } = useAuth();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "/app";

  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [loading, setLoading] = useState<"github" | "email" | "resend" | null>(null);
  const [error, setError] = useState("");

  // Redirect if already logged in
  if (!isLoading && user) {
    return <Navigate to={next} replace />;
  }

  const handleGitHub = () => {
    setLoading("github");
    signInWithGitHub(next);
  };

  const sendMagicLink = async (variant: "email" | "resend") => {
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setLoading(variant);
    try {
      const result = await signInWithMagicLink(email, next);
      if (result.ok) {
        setMagicLinkSent(true);
      } else {
        setError(result.error || "Couldn't sign in. Please try again.");
      }
    } finally {
      setLoading(null);
    }
  };

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    sendMagicLink("email");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background grain-overlay px-4 relative overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 font-display font-bold text-xl text-foreground mb-3">
            <Logo className="h-9 w-9" />
            XupaStack
          </Link>
          <p className="text-sm text-muted-foreground">Sign in to access the console</p>
        </div>

        <div className="glass-card p-6 space-y-5">
          <button
            onClick={handleGitHub}
            disabled={loading !== null}
            className="w-full h-11 rounded-lg bg-foreground text-background text-sm font-semibold flex items-center justify-center gap-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading === "github" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4.5 w-4.5" />}
            Continue with GitHub
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {!showEmail ? (
            <button
              onClick={() => setShowEmail(true)}
              className="w-full h-11 rounded-lg border border-border bg-card text-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email magic link
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : magicLinkSent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-3 space-y-3">
              <p className="text-sm font-medium text-foreground">Check your inbox</p>
              <p className="text-xs text-muted-foreground mt-1">
                We sent a secure sign-in link to <span className="text-foreground font-medium">{email}</span>.
              </p>
              <button onClick={() => sendMagicLink("resend")} disabled={loading === "resend"} className="inline-flex items-center gap-1.5 text-xs text-primary hover:opacity-80 transition-opacity disabled:opacity-50">
                {loading === "resend" ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCw className="h-3 w-3" />}
                Resend
              </button>
              <p className="text-[11px] text-muted-foreground">If you don't see it, check spam/promotions.</p>
            </motion.div>
          ) : (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.2 }} onSubmit={handleMagicLink} className="space-y-3">
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }} placeholder="you@example.com" autoFocus className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              {error && <p className="text-xs text-destructive">{error}</p>}
              <button type="submit" disabled={!email || loading !== null} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading === "email" ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Send magic link"}
              </button>
            </motion.form>
          )}
        </div>

        <div className="flex items-start gap-2 mt-6 px-1">
          <Shield className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            XupaStack never needs your Supabase keys. Your project credentials stay in your app — the gateway only routes traffic.
          </p>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground transition-colors">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
