import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Logo from "@/components/Logo";

const REASONS: Record<string, string> = {
  missing_params: "Authentication failed: missing parameters.",
  invalid_state: "This login link has expired. Please try again.",
  github_error: "GitHub authentication failed. Please try again.",
  missing_token: "This magic link is invalid or has expired.",
  invalid_token: "This magic link is invalid or has expired.",
  expired_token: "This magic link has expired. Please request a new one.",
  already_used: "This magic link has already been used.",
};

const AuthError = () => {
  const [params] = useSearchParams();
  const reason = params.get("reason") || "";
  const message = REASONS[reason] || "An authentication error occurred. Please try again.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-sm text-center"
      >
        <Link to="/" className="inline-flex items-center gap-2.5 font-display font-bold text-xl text-foreground mb-8">
          <Logo className="h-9 w-9" />
          XupaStack
        </Link>

        <div className="glass-card p-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-sm text-foreground font-medium">{message}</p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Try again
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthError;
