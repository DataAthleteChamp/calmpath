import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import SplashScreen from "@/pages/SplashScreen";
import SetupFlow from "@/pages/SetupFlow";
import MainApp from "@/pages/MainApp";
import SupportCardPage from "@/pages/SupportCardPage";
import QuietPlacePage from "@/pages/QuietPlacePage";
import FallbackGuidePage from "@/pages/FallbackGuidePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/setup" element={<SetupFlow />} />
            <Route path="/app" element={<MainApp />} />
            <Route path="/support-card" element={<SupportCardPage />} />
            <Route path="/quiet-place" element={<QuietPlacePage />} />
            <Route path="/fallback-guide" element={<FallbackGuidePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
