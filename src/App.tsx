import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { AuthError } from "@/lib/api-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/auth/RequireAuth";
import Index from "./pages/Index";
import Quickstart from "./pages/Quickstart";
import Docs from "./pages/Docs";
import Guides from "./pages/Guides";
import Security from "./pages/Security";
import FAQ from "./pages/FAQ";
import Donate from "./pages/Donate";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FairUse from "./pages/FairUse";
import FixIndex from "./pages/fix/FixIndex";
import FixISP from "./pages/fix/FixISP";
import ErrConnectionTimedOut from "./pages/errors/ErrConnectionTimedOut";
import AuthErrorPage from "./pages/AuthError";

// Lazy-loaded console pages
const ConsoleLayout = lazy(() => import("./components/layout/ConsoleLayout"));
const ConsoleDashboard = lazy(() => import("./pages/console/ConsoleDashboard"));
const ConsoleNew = lazy(() => import("./pages/console/ConsoleNew"));
const ConsoleDetail = lazy(() => import("./pages/console/ConsoleDetail"));
const ConsoleDeploy = lazy(() => import("./pages/console/ConsoleDeploy"));
const ConsoleSettings = lazy(() => import("./pages/console/ConsoleSettings"));
const ConsoleHelp = lazy(() => import("./pages/console/ConsoleHelp"));

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AuthError) {
        window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof AuthError) return false;
        return failureCount < 2;
      },
      staleTime: 30_000,
    },
  },
});

const ProtectedConsole = ({ children }: { children: React.ReactNode }) => (
  <RequireAuth>
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ConsoleLayout>{children}</ConsoleLayout>
    </Suspense>
  </RequireAuth>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public pages */}
              <Route path="/" element={<Index />} />
              <Route path="/quickstart" element={<Quickstart />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/security" element={<Security />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/fair-use" element={<FairUse />} />
              <Route path="/fix" element={<FixIndex />} />
              <Route path="/fix/:isp" element={<FixISP />} />
              <Route path="/errors/err_connection_timed_out" element={<ErrConnectionTimedOut />} />
              <Route path="/auth/error" element={<AuthErrorPage />} />

              {/* Console (auth-gated, lazy-loaded) */}
              <Route path="/app" element={<ProtectedConsole><Suspense fallback={null}><ConsoleDashboard /></Suspense></ProtectedConsole>} />
              <Route path="/app/new" element={<ProtectedConsole><Suspense fallback={null}><ConsoleNew /></Suspense></ProtectedConsole>} />
              <Route path="/app/help" element={<ProtectedConsole><Suspense fallback={null}><ConsoleHelp /></Suspense></ProtectedConsole>} />
              <Route path="/app/:id" element={<ProtectedConsole><Suspense fallback={null}><ConsoleDetail /></Suspense></ProtectedConsole>} />
              <Route path="/app/:id/deploy" element={<ProtectedConsole><Suspense fallback={null}><ConsoleDeploy /></Suspense></ProtectedConsole>} />
              <Route path="/app/:id/settings" element={<ProtectedConsole><Suspense fallback={null}><ConsoleSettings /></Suspense></ProtectedConsole>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
