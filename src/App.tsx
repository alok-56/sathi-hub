import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

// Layout Components
import { AdminLayout } from "@/components/layout/AdminLayout";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Bookings from "@/pages/Bookings";
import Users from "@/pages/Users";
import Mechanics from "@/pages/Mechanics";
import Payments from "@/pages/Payments";
import Payouts from "@/pages/Payouts";
import Notifications from "@/pages/Notifications";

// Service Pages
import SOSServices from "@/pages/services/SOSServices";
import RegularServices from "@/pages/services/RegularServices";
import Parts from "@/pages/services/Parts";

// Master Pages
import Slots from "@/pages/master/Slots";
import VehicleModels from "@/pages/master/VehicleModels";
import AppConfig from "@/pages/master/AppConfig";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route path="/" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="users" element={<Users />} />
            <Route path="mechanics" element={<Mechanics />} />
            <Route path="payments" element={<Payments />} />
            <Route path="payouts" element={<Payouts />} />
            <Route path="notifications" element={<Notifications />} />
            
            {/* Services Routes */}
            <Route path="services/sos" element={<SOSServices />} />
            <Route path="services/regular" element={<RegularServices />} />
            <Route path="services/parts" element={<Parts />} />
            
            {/* Master Routes */}
            <Route path="master/slots" element={<Slots />} />
            <Route path="master/vehicle-models" element={<VehicleModels />} />
            <Route path="master/config" element={<AppConfig />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
  </QueryClientProvider>
);

export default App;