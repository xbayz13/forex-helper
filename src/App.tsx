import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainLayout } from "@/components/layout/main-layout";
import { lazy, Suspense } from "react";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { Toaster } from "@/components/ui/toast";

// Lazy load pages untuk code splitting
const DashboardPage = lazy(() => import("@/pages/dashboard").then(m => ({ default: m.DashboardPage })));
const LotCalculatorPage = lazy(() => import("@/pages/lot-calculator").then(m => ({ default: m.LotCalculatorPage })));
const TradeHistoryPage = lazy(() => import("@/pages/trade-history").then(m => ({ default: m.TradeHistoryPage })));
const ReportsPage = lazy(() => import("@/pages/reports").then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import("@/pages/settings").then(m => ({ default: m.SettingsPage })));

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}><DashboardPage /></Suspense>} />
        <Route path="lot-calculator" element={<Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}><LotCalculatorPage /></Suspense>} />
        <Route path="trade-history" element={<Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}><TradeHistoryPage /></Suspense>} />
        <Route path="reports" element={<Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}><ReportsPage /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}><SettingsPage /></Suspense>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
export { App };
