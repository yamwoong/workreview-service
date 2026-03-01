import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';

export const NotFoundPage = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex w-full md:w-1/2 bg-gradient-to-br from-primary via-[#c4a2d8] to-[#b897c7] flex-col justify-center items-center px-6 md:px-12 lg:px-16 min-h-[30vh] md:min-h-screen">
        <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4">
          {t('error.404.code')}
        </h2>
        <p className="text-white/90 text-lg md:text-xl font-medium">{t('error.404.title')}</p>
      </div>

      <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center px-6 md:px-8 py-12 md:py-0">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <h1 className="text-[24px] md:text-[28px] font-semibold text-gray-900 mb-4">
              {t('error.404.subtitle')}
            </h1>
            <p className="text-[14px] text-gray-600 mb-8 leading-relaxed">
              {t('error.404.description1')}
              <br />
              {t('error.404.description2')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="px-6 py-3 bg-primary hover:bg-[#b897c7] text-white font-medium text-[14px] rounded-xl transition-all duration-200 shadow-sm"
              >
                {t('common.goToHome')}
              </Link>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium text-[14px] rounded-xl border border-gray-200 transition-all duration-200"
                >
                  {t('common.signOut')}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium text-[14px] rounded-xl border border-gray-200 transition-all duration-200"
                >
                  {t('common.signIn')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
