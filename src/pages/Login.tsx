import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background grain-overlay px-4">
      {/* Background glow */}
      <div className="glow-orb w-[400px] h-[400px] top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-lg text-foreground mb-2">
            <Logo className="h-8 w-8" />
            XupaStack
          </Link>
          <p className="text-sm text-muted-foreground">Sign in to access the console</p>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Sign in
          </button>
          <p className="text-xs text-center text-muted-foreground">
            Don't have an account?{" "}
            <span className="text-primary cursor-pointer hover:underline">Sign up</span>
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
