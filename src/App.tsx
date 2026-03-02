import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";
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

// Lazy-loaded console pages
const ConsoleLayout = lazy(() => import("./components/layout/ConsoleLayout"));
const ConsoleDashboard = lazy(() => import("./pages/console/ConsoleDashboard"));
const ConsoleNew = lazy(() => import("./pages/console/ConsoleNew"));
const ConsoleDetail = lazy(() => import("./pages/console/ConsoleDetail"));
const ConsoleDeploy = lazy(() => import("./pages/console/ConsoleDeploy"));
const ConsoleSettings = lazy(() => import("./pages/console/ConsoleSettings"));
const ConsoleHelp = lazy(() => import("./pages/console/ConsoleHelp"));

const queryClient = new QueryClient();

const ConsoleWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="min-h-screen bg-background" />}>
    <ConsoleLayout>{children}</ConsoleLayout>
  </Suspense>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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

            {/* Console (lazy-loaded) */}
            <Route path="/app" element={<ConsoleWrapper><Suspense fallback={null}><ConsoleDashboard /></Suspense></ConsoleWrapper>} />
            <Route path="/app/new" element={<ConsoleWrapper><Suspense fallback={null}><ConsoleNew /></Suspense></ConsoleWrapper>} />
            <Route path="/app/help" element={<ConsoleWrapper><Suspense fallback={null}><ConsoleHelp /></Suspense></ConsoleWrapper>} />
            <Route path="/app/:id" element={<ConsoleWrapper><Suspense fallback={null}><ConsoleDetail /></Suspense></ConsoleWrapper>} />
            <Route path="/app/:id/deploy" element={<ConsoleWrapper><Suspense fallback={null}><ConsoleDeploy /></Suspense></ConsoleWrapper>} />
            <Route path="/app/:id/settings" element={<ConsoleWrapper><Suspense fallback={null}><ConsoleSettings /></Suspense></ConsoleWrapper>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
