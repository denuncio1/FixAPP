import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MaintenanceDashboard from "./pages/MaintenanceDashboard";
import WorkOrders from "./pages/WorkOrders";
import AutomaticPlanner from "./pages/AutomaticPlanner";
import TechnicianRegistration from "./pages/TechnicianRegistration";
import LocationRegistration from "./pages/LocationRegistration"; // Importar a nova página

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<MaintenanceDashboard />} />
          <Route path="/work-orders" element={<WorkOrders />} />
          <Route path="/automatic-planner" element={<AutomaticPlanner />} />
          <Route path="/technicians/new" element={<TechnicianRegistration />} />
          <Route path="/locations/new" element={<LocationRegistration />} /> {/* Nova rota */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;