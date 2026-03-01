import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, MapPin } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/validators/auth.validator';
import { useLogin } from '@/hooks/useAuth';

const resolveErrorMessage = (error: unknown, t: (key: string) => string): string => {
  if (!error) return t('login.unknownError');
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const typed = error as { message?: string; error?: { code?: string; message?: string } };
    // EMAIL_VERIFICATION_REQUIRED is handled by navigation in useLogin onError, skip displaying it here
    if (typed.error?.code === 'EMAIL_VERIFICATION_REQUIRED') return '';
    return typed.message ?? typed.error?.message ?? t('login.loginError');
  }
  return t('login.loginError');
};

export const LoginPage = (): JSX.Element => {
  const { t } = useTranslation();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched'
  });

  const onSubmit = (data: LoginInput): void => {
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = (): void => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const loginErrorMessage = loginMutation.error ? resolveErrorMessage(loginMutation.error, t) : null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#f5f1f7] via-[#faf8fb] to-white p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <MapPin className="text-white" size={22} />
          </div>
          <span className="text-[24px] font-semibold text-gray-900">WorkReview</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-semibold text-gray-900 mb-2">{t('login.title')}</h1>
            <p className="text-[15px] text-gray-600 font-normal">
              {t('login.subtitle')}
            </p>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3.5 border-2 border-gray-200 rounded-xl
                     hover:border-gray-300 hover:bg-gray-50
                     transition-all duration-200 shadow-sm
                     font-medium text-[15px] mb-6 flex items-center justify-center gap-3
                     text-gray-700"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4"/>
              <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
              <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
              <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
            </svg>
            {t('login.continueWithGoogle')}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-[13px] text-gray-500">{t('login.or')}</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Identifier (email or username) */}
            <div className="space-y-2">
              <label htmlFor="identifier" className="block text-[14px] text-gray-700 font-medium">
                {t('login.identifier')}
              </label>
              <Controller
                name="identifier"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input
                        id="identifier"
                        type="text"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder={t('login.identifierPlaceholder')}
                        className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl
                                 focus:outline-none focus:ring-2 focus:border-transparent
                                 transition-all duration-200 placeholder:text-gray-400 text-[15px] ${
                                   errors.identifier
                                     ? 'border-red-400 focus:ring-red-400'
                                     : 'border-gray-200 focus:ring-primary'
                                 }`}
                        aria-invalid={Boolean(errors.identifier)}
                      />
                    </div>
                    {errors.identifier && (
                      <p className="text-[13px] text-red-500">{errors.identifier.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-[14px] text-gray-700 font-medium">
                  {t('login.password')}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[14px] text-primary hover:text-[#b897c7] transition-colors font-medium"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock size={18} />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="Enter your password"
                        className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border rounded-xl
                                 focus:outline-none focus:ring-2 focus:border-transparent
                                 transition-all duration-200 placeholder:text-gray-400 text-[15px] ${
                                   errors.password
                                     ? 'border-red-400 focus:ring-red-400'
                                     : 'border-gray-200 focus:ring-primary'
                                 }`}
                        aria-invalid={Boolean(errors.password)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[13px] text-red-500">{errors.password.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            {/* API Error */}
            {loginErrorMessage && (
              <p className="text-[13px] text-red-500" role="alert" aria-live="assertive">
                {loginErrorMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3.5 bg-primary text-white rounded-xl
                       hover:bg-[#b897c7] active:bg-[#a788b7]
                       transition-all duration-200 shadow-sm hover:shadow-md
                       font-medium text-[15px] mt-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? t('login.submitting') : t('login.submit')}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-[15px] text-gray-600">
              {t('login.newToWorkReview2')}{' '}
              <Link
                to="/register"
                className="text-primary hover:text-[#b897c7] transition-colors font-medium"
              >
                {t('login.createAccount')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
