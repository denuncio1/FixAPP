import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import PreventiveMaintenance from "./pages/PreventiveMaintenance";
import SmartAlerts from "./pages/SmartAlerts";
import MaintenanceHistory from "./pages/MaintenanceHistory";
import StockControl from "./pages/StockControl";
import MaterialMovement from "./pages/MaterialMovement";
import LowStockAlerts from "./pages/LowStockAlerts";
import SupplierIntegration from "./pages/SupplierIntegration";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Gamification from "./pages/Gamification";
import InternalChat from "./pages/InternalChat";
import HelpCenter from "./pages/HelpCenter";
import SupportRequest from "./pages/SupportRequest";
import EnergyConsumption from "./pages/EnergyConsumption";
import WasteDisposal from "./pages/WasteDisposal";
import ImageRecognition from "./pages/ImageRecognition";
import VirtualAssistant from "./pages/VirtualAssistant";
import DigitalMeters from "./pages/DigitalMeters"; // Importar nova página
import { SessionContextProvider, useSession } from "./components/SessionContextProvider";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Carregando...</h1>
          <p className="text-xl text-gray-600">Verificando sessão de usuário.</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionContextProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><MaintenanceDashboard /></ProtectedRoute>} />
            <Route path="/work-orders" element={<ProtectedRoute><WorkOrders /></ProtectedRoute>} />
            <Route path="/automatic-planner" element={<ProtectedRoute><AutomaticPlanner /></ProtectedRoute>} />
            <Route path="/technicians" element={<ProtectedRoute><Technicians /></ProtectedRoute>} />
            <Route path="/technicians/new" element={<ProtectedRoute><TechnicianRegistration /></ProtectedRoute>} />
            <Route path="/locations" element={<ProtectedRoute><Locations /></ProtectedRoute>} />
            <Route path="/locations/new" element={<ProtectedRoute><LocationRegistration /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="/clients/new" element={<ProtectedRoute><ViewClient /></ProtectedRoute>} />
            <Route path="/suppliers/new" element={<ProtectedRoute><SupplierRegistration /></ProtectedRoute>} />
            <Route path="/managers/new" element={<ProtectedRoute><ManagerRegistration /></ProtectedRoute>} />
            <Route path="/assets/new" element={<ProtectedRoute><AssetRegistration /></ProtectedRoute>} />
            <Route path="/maintenance/preventive" element={<ProtectedRoute><PreventiveMaintenance /></ProtectedRoute>} />
            <Route path="/maintenance/alerts" element={<ProtectedRoute><SmartAlerts /></ProtectedRoute>} />
            <Route path="/maintenance/history" element={<ProtectedRoute><MaintenanceHistory /></ProtectedRoute>} />
            <Route path="/maintenance/image-recognition" element={<ProtectedRoute><ImageRecognition /></ProtectedRoute>} />
            <Route path="/maintenance/virtual-assistant" element={<ProtectedRoute><VirtualAssistant /></ProtectedRoute>} />
            <Route path="/maintenance/digital-meters" element={<ProtectedRoute><DigitalMeters /></ProtectedRoute>} /> {/* Nova rota */}
            <Route path="/stock/control" element={<ProtectedRoute><StockControl /></ProtectedRoute>} />
            <Route path="/stock/movement" element={<ProtectedRoute><MaterialMovement /></ProtectedRoute>} />
            <Route path="/stock/alerts" element={<ProtectedRoute><LowStockAlerts /></ProtectedRoute>} />
            <Route path="/stock/supplier-integration" element={<ProtectedRoute><SupplierIntegration /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/gamification" element={<ProtectedRoute><Gamification /></ProtectedRoute>} />
            <Route path="/communication/chat" element={<ProtectedRoute><InternalChat /></ProtectedRoute>} />
            <Route path="/communication/help-center" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
            <Route path="/communication/support-request" element={<ProtectedRoute><SupportRequest /></ProtectedRoute>} />
            <Route path="/sustainability/energy-consumption" element={<ProtectedRoute><EnergyConsumption /></ProtectedRoute>} />
            <Route path="/sustainability/waste-disposal" element={<ProtectedRoute><WasteDisposal /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;