import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App(): JSX.Element {
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Store Pages */}
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/stores/search" element={<SearchStorePage />} />
        <Route path="/stores/:id" element={<StoreDetailPage />} />
        <Route path="/stores/:storeId/review/new" element={<CreateReviewPage />} />

        {/* Error Pages */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

