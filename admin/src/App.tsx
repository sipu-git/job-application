import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import Applications from "./pages/Applications";
import Jobs from "./pages/Jobs";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { AtsProvider } from "./context/AtsContext";
import ViewJobDetail from "./pages/ViewJobDetail";
import ViewJobApplication from "./pages/ViewApplicationByJob";
import UpdateJob from "./pages/EditJob";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./lib/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AtsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              } />
              <Route path="/add-job" element={
                <DashboardLayout>
                  <AddJob />
                </DashboardLayout>
              } />
              <Route path="/applications" element={
                <DashboardLayout>
                  <Applications />
                </DashboardLayout>
              } />
              <Route path="/view-application/:id" element={
                <DashboardLayout>
                  <ViewJobApplication />
                </DashboardLayout>
              } />
              <Route path="/job/:id" element={
                <DashboardLayout>
                  <ViewJobDetail />
                </DashboardLayout>
              } />

              <Route path="/jobs" element={
                <DashboardLayout>
                  <Jobs />
                </DashboardLayout>
              } />
              <Route path="/edit-job/:id" element={
                <DashboardLayout>
                  <UpdateJob />
                </DashboardLayout>
              } />
              <Route path="/settings" element={
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AtsProvider>
  </QueryClientProvider>
);

export default App;
