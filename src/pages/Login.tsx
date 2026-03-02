import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Github, ArrowRight, Shield, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { signInWithGitHub, signInWithMagicLink } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const next = searchParams.get("next") || "/app";

  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGitHub = async () => {
    setLoading(true);
    try {
      await signInWithGitHub();
      navigate(next, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await signInWithMagicLink(email);
      setMagicLinkSent(true);
      // Stub: in real flow, user clicks link in email → callback sets session → redirect
      setTimeout(() => navigate(next, { replace: true }), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background grain-overlay px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="glow-orb w-[500px] h-[500px] fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 font-display font-bold text-xl text-foreground mb-3">
            <Logo className="h-9 w-9" />
            XupaStack
          </Link>
          <p className="text-sm text-muted-foreground">Sign in to access the console</p>
        </div>

        <div className="glass-card p-6 space-y-5">
          {/* GitHub */}
          <button
            onClick={handleGitHub}
            disabled={loading}
            className="w-full h-11 rounded-lg bg-foreground text-background text-sm font-semibold flex items-center justify-center gap-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading && !showEmail ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Github className="h-4.5 w-4.5" />
            )}
            Continue with GitHub
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Magic link */}
          {!showEmail ? (
            <button
              onClick={() => setShowEmail(true)}
              className="w-full h-11 rounded-lg border border-border bg-card text-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
            >
              Email magic link
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : magicLinkSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-3"
            >
              <p className="text-sm font-medium text-foreground">Check your inbox</p>
              <p className="text-xs text-muted-foreground mt-1">We sent a login link to <span className="text-foreground">{email}</span></p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
              onSubmit={handleMagicLink}
              className="space-y-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoFocus
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!email || loading}
                className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Send magic link"}
              </button>
            </motion.form>
          )}
        </div>

        {/* Security note */}
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
