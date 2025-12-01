import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts';
import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import { BecomeHostPage } from '@/pages/BecomeHost';
import { DashboardPage } from '@/pages/Dashboard';
import { PrivateRoute } from '@/components/PrivateRoute';
import { Header } from '@/components/layout/Header';

import { NewAppointmentPage } from '@/pages/NewAppointment';
import { AppointmentDetailsPage } from '@/pages/AppointmentDetails';

import { HomePage } from '@/pages/Home';
import { CreateServicePage } from '@/pages/CreateService';
import { ServiceDetailsPage } from '@/pages/ServiceDetails';
import { WishlistPage } from '@/pages/Wishlist';
import { MyBookingsPage } from '@/pages/MyBookings';
import { ProfilePage } from '@/pages/Profile';
import { MyServicesPage } from '@/pages/MyServices';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster richColors position="top-center" />
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/services/new" element={<CreateServicePage />} />
            <Route path="/services/:id/edit" element={<CreateServicePage />} />
            <Route path="/services/:id" element={<ServiceDetailsPage />} />
            <Route path="/wishlists" element={<WishlistPage />} />

            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/my-services" element={<MyServicesPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/become-host" element={<BecomeHostPage />} />
              <Route
                element={
                  <>
                    <Header />
                    <Outlet />
                  </>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/appointments/new" element={<NewAppointmentPage />} />
                <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
