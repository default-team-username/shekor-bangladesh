import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "./contexts/SessionContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { BatchProvider } from "./contexts/BatchContext";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import SignupInfographicPage from "./pages/SignupInfographicPage";
import NotFound from "./pages/NotFound";
import FarmerDashboard from "./pages/FarmerDashboard";
import BatchRegistrationPage from "./pages/BatchRegistrationPage";
import BatchDetailsPage from "./pages/BatchDetailsPage";
import WeatherPage from "./pages/WeatherPage";
import MapPage from "./pages/MapPage";
import VoicePage from "./pages/VoicePage";
import QualityEvaluationPage from "./pages/QualityEvaluationPage"; // Import new QualityEvaluationPage

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <SessionContextProvider>
            <BatchProvider>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupInfographicPage />} />
                <Route path="/dashboard" element={<FarmerDashboard />} />
                <Route path="/dashboard/new-batch" element={<BatchRegistrationPage />} />
                <Route path="/dashboard/batch/:id" element={<BatchDetailsPage />} />
                <Route path="/dashboard/weather" element={<WeatherPage />} />
                <Route path="/dashboard/map" element={<MapPage />} />
                <Route path="/dashboard/voice" element={<VoicePage />} />
                <Route path="/dashboard/quality-scan" element={<QualityEvaluationPage />} /> {/* New Quality Scan Route */}
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BatchProvider>
          </SessionContextProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;