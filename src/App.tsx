import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              
              {/* Protected Admin Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
              </Route>
              <Route path="/bookings" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Bookings />} />
              </Route>
              <Route path="/users" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Users />} />
              </Route>
              <Route path="/mechanics" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Mechanics />} />
              </Route>
              <Route path="/payments" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Payments />} />
              </Route>
              <Route path="/payouts" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Payouts />} />
              </Route>
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Notifications />} />
              </Route>
              
              {/* Services Routes */}
              <Route path="/services/sos" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<SOSServices />} />
              </Route>
              <Route path="/services/regular" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<RegularServices />} />
              </Route>
              <Route path="/services/parts" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Parts />} />
              </Route>
              
              {/* Master Routes */}
              <Route path="/master/slots" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Slots />} />
              </Route>
              <Route path="/master/vehicle-models" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<VehicleModels />} />
              </Route>
              <Route path="/master/config" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AppConfig />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;