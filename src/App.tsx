import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import SEOHead from "@/components/SEOHead";
import { FEATURES_CONFIG } from "@/config/config";
import { clearAllCache, getCacheStats } from "@/utils/cache";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Expose cache utilities to window for manual debugging
if (typeof window !== 'undefined') {
  (window as any).dochubCache = {
    clear: clearAllCache,
    stats: getCacheStats,
    clearLocalStorage: () => {
      localStorage.clear();
      console.log('All localStorage cleared. Reload the page.');
    },
  };
  console.log('Cache utilities available: window.dochubCache.clear(), window.dochubCache.stats(), window.dochubCache.clearLocalStorage()');
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme={FEATURES_CONFIG.defaultTheme as "light" | "dark" | "system"} storageKey="docs-theme">
      <SEOHead />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/:repoId/*" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
