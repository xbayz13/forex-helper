import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainLayout } from "@/components/layout/main-layout";
import { lazy, Suspense } from "react";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { Toaster } from "@/components/ui/toast";

// Lazy load pages untuk code splitting
const LotCalculatorPage = lazy(() => import("@/pages/lot-calculator").then(m => ({ default: m.LotCalculatorPage })));
const TradeHistoryPage = lazy(() => import("@/pages/trade-history").then(m => ({ default: m.TradeHistoryPage })));
const ReportsPage = lazy(() => import("@/pages/reports").then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import("@/pages/settings").then(m => ({ default: m.SettingsPage })));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Public: Lot Calculator (index) */}
      <Route
        path="/"
        element={<MainLayout />}
      >
        <Route index element={<Suspense fallback={<LoadingSpinner />}><LotCalculatorPage /></Suspense>} />
      </Route>

      {/* Protected routes: History and Reports */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="history" element={<Suspense fallback={<LoadingSpinner />}><TradeHistoryPage /></Suspense>} />
        <Route path="reports" element={<Suspense fallback={<LoadingSpinner />}><ReportsPage /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<LoadingSpinner />}><SettingsPage /></Suspense>} />
      </Route>

      {/* Redirect old routes */}
      <Route path="/trade-history" element={<Navigate to="/history" replace />} />
      <Route path="/lot-calculator" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
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
