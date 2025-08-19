import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { HydrationGuard } from './components/layout/HydrationGuard';
import { useAuthStore } from './store/useAuthStore';
import { AnimatePresence } from 'framer-motion';

// Layouts
import { AppLayout } from './components/layout/AppLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { VendorLayout } from './components/layout/VendorLayout';

// All Pages
import { OutletsPage } from './pages/OutletsPage';
import { OutletDetailPage } from './pages/OutletDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { PayPenaltyPage } from './pages/PayPenaltyPage';
import { AdminDashboardPage } from './features/admin/pages/AdminDashboardPage';
import { UserManagementPage } from './features/admin/pages/UserManagementPage';
import { UserDetailPage } from './features/admin/pages/UserDetailPage';
import { OutletManagementPage } from './features/admin/pages/OutletManagementPage';
import { VendorDashboardPage } from './features/vendor/pages/VendorDashboardPage';
import { VendorMenuPage } from './features/vendor/pages/VendorMenuPage';
import { VendorInventoryPage } from './features/vendor/pages/VendorInventoryPage';
import { VendorKdsPage } from './features/vendor/pages/VendorKdsPage';
import { VendorDeliveryPage } from './features/vendor/pages/VendorDeliveryPage';
import { VendorEarningsPage } from './features/vendor/pages/VendorEarningsPage';
import { VendorRatingsPage } from './features/vendor/pages/VendorRatingsPage';
import { OrderManagementPage } from './features/admin/pages/OrderManagementPage';
import { AdminOrderDetailPage } from './features/admin/pages/AdminOrderDetailPage';
import { SignupPage } from './pages/SignupPage';


const HomeRedirect = () => {
  const user = useAuthStore((state) => state.user);
  if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user?.role === 'VENDOR') return <Navigate to="/vendor/dashboard" replace />;
  return <Navigate to="/outlets" replace />;
};

// This new component contains all the routes and allows Framer Motion to track location changes
const AppRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
    
              <Route element={<ProtectedRoute />}>
                {/* Customer Routes */}
                <Route element={<AppLayout />}>
                  <Route path="/outlets" element={<OutletsPage />} />
                  <Route path="/outlets/:id" element={<OutletDetailPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
                  <Route path="/my-orders" element={<MyOrdersPage />} />
                  <Route path="/pay-penalty" element={<PayPenaltyPage />} />
                </Route>
    
                {/* Admin Routes */}
                <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="users/:id" element={<UserDetailPage />} />
                <Route path="outlets" element={<OutletManagementPage />} />
                <Route path="orders" element={<OrderManagementPage />} />
                <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                </Route>
    
                {/* Vendor Routes */}
                <Route path="/vendor" element={<VendorLayout />}>
                  <Route path="dashboard" element={<VendorDashboardPage />} />
                  <Route path="menu" element={<VendorMenuPage />} />
                  <Route path="inventory" element={<VendorInventoryPage />} />
                  <Route path="earnings" element={<VendorEarningsPage />} />
                  <Route path="ratings" element={<VendorRatingsPage />} />
                  <Route path="kds" element={<VendorKdsPage />} />
                  <Route path="delivery" element={<VendorDeliveryPage />} />
                </Route>
    
                <Route path="/" element={<HomeRedirect />} />
              </Route>
            </Routes>
        </AnimatePresence>
    )
}

function App() {
  return (
    <BrowserRouter>
      <HydrationGuard>
        <AppRoutes />
      </HydrationGuard>
    </BrowserRouter>
  );
}

export default App;