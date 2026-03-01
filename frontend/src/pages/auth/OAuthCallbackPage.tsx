import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

/**
 * OAuth 콜백 페이지
 * Google OAuth 로그인 후 리다이렉트되는 페이지
 * URL 쿼리 파라미터에서 토큰을 받아 저장하고 홈으로 이동
 */
export const OAuthCallbackPage = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    // 에러가 있으면 로그인 페이지로 리다이렉트
    if (error) {
      toast.error(
        error === 'oauth_failed'
          ? t('login.oauthFailed')
          : t('login.unknownError')
      );
      navigate('/login', { replace: true });
      return;
    }

    // 토큰이 있으면 저장하고 홈으로 이동
    if (accessToken && refreshToken) {
      setAuth(accessToken, refreshToken);
      toast.success(t('login.oauthSuccess'));
      navigate('/', { replace: true });
      return;
    }

    // 토큰도 에러도 없으면 로그인 페이지로 이동
    toast.error(t('login.unknownError'));
    navigate('/login', { replace: true });
  }, [searchParams, navigate, setAuth, t]);

  return (
    <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center px-6 py-12">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t('login.processingOAuth')}
        </h2>
        <p className="text-sm text-gray-600">
          {t('login.pleaseWait')}
        </p>
      </div>
    </div>
  );
};
