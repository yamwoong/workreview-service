import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { HomePage } from '@/pages/HomePage';
import { ProfilePage } from '@/pages/ProfilePage';
import { StoresPage } from '@/pages/StoresPage';
import { SearchStorePage } from '@/pages/SearchStorePage';
import { StoreDetailPage } from '@/pages/StoreDetailPage';
import { CreateReviewPage } from '@/pages/CreateReviewPage';
import { NotFoundPage } from '@/pages/error/NotFoundPage';
import { ServerErrorPage } from '@/pages/error/ServerErrorPage';
import { ForbiddenPage } from '@/pages/error/ForbiddenPage';
import { MainLayout } from '@/components/layout/MainLayout';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { useAuthStore } from '@/stores/authStore';

function App(): JSX.Element {
  const initialize = useAuthStore((state) => state.initialize);

  // Initialize auth state from localStorage on app start
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff'
            }
          }
        }}
      />
      <Routes>
        {/* Auth Pages - No Layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Public Pages - With Layout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        {/* Store Pages - With Layout */}
        <Route
          path="/stores"
          element={
            <MainLayout>
              <StoresPage />
            </MainLayout>
          }
        />
        <Route
          path="/stores/search"
          element={
            <MainLayout>
              <SearchStorePage />
            </MainLayout>
          }
        />
        <Route
          path="/stores/:id"
          element={
            <MainLayout>
              <StoreDetailPage />
            </MainLayout>
          }
        />

        {/* Protected Pages - With Layout + Auth Required */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/stores/:storeId/review/new"
          element={
            <PrivateRoute>
              <MainLayout>
                <CreateReviewPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Error Pages - With Layout */}
        <Route
          path="/403"
          element={
            <MainLayout>
              <ForbiddenPage />
            </MainLayout>
          }
        />
        <Route
          path="/500"
          element={
            <MainLayout>
              <ServerErrorPage />
            </MainLayout>
          }
        />
        <Route
          path="*"
          element={
            <MainLayout>
              <NotFoundPage />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
