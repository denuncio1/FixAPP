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
import Technicians from "./pages/Technicians";
import LocationRegistration from "./pages/LocationRegistration";
import Locations from "./pages/Locations";
import ViewClient from "./pages/ViewClient";
import Clients from "./pages/Clients";
import SupplierRegistration from "./pages/SupplierRegistration";
import ManagerRegistration from "./pages/ManagerRegistration";
import AssetRegistration from "./pages/AssetRegistration";
import PreventiveMaintenance from "./pages/PreventiveMaintenance"; // Nova importação
import SmartAlerts from "./pages/SmartAlerts"; // Nova importação
import MaintenanceHistory from "./pages/MaintenanceHistory"; // Nova importação

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
          <Route path="/technicians" element={<Technicians />} />
          <Route path="/technicians/new" element={<TechnicianRegistration />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/locations/new" element={<LocationRegistration />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/new" element={<ViewClient />} />
          <Route path="/suppliers/new" element={<SupplierRegistration />} />
          <Route path="/managers/new" element={<ManagerRegistration />} />
          <Route path="/assets/new" element={<AssetRegistration />} />
          <Route path="/maintenance/preventive" element={<PreventiveMaintenance />} /> {/* Nova rota */}
          <Route path="/maintenance/alerts" element={<SmartAlerts />} /> {/* Nova rota */}
          <Route path="/maintenance/history" element={<MaintenanceHistory />} /> {/* Nova rota */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;