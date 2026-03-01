import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { MapPin, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordInput } from '@/validators/auth.validator';
import { resetPassword, verifyResetToken } from '@/api/auth.api';
import { Spinner } from '@/components/ui/Spinner';

const resolveErrorMessage = (error: unknown, t: (key: string) => string): string => {
  if (!error) return t('resetPassword.unknownError');
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const typed = error as { message?: string; error?: { message?: string } };
    return typed.message ?? typed.error?.message ?? t('resetPassword.resetError');
  }
  return t('resetPassword.resetError');
};

export const ResetPasswordPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [verificationError, setVerificationError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { newPassword: string }) => {
      if (!token) throw new Error(t('resetPassword.invalidTokenError'));
      return resetPassword(token, data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  });

  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched'
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) { setIsVerifying(false); setIsTokenValid(false); return; }
      try {
        await verifyResetToken(token);
        setIsTokenValid(true);
        setVerificationError('');
      } catch (error) {
        setIsTokenValid(false);
        setVerificationError(resolveErrorMessage(error, t));
      } finally {
        setIsVerifying(false);
      }
    };
    verifyToken();
  }, [token, t]);

  const onSubmit = (data: ResetPasswordInput): void => {
    resetPasswordMutation.mutate({ newPassword: data.newPassword });
  };

  const errorMessage = resetPasswordMutation.error
    ? resolveErrorMessage(resetPasswordMutation.error, t)
    : null;

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-[15px] ${
      hasError ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-primary'
    }`;

  const pageShell = (children: React.ReactNode) => (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f1f7] via-[#faf8fb] to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <MapPin size={20} className="text-white" />
          </div>
          <span className="text-[22px] font-semibold text-gray-900">WorkReview</span>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );

  if (isVerifying) return pageShell(
    <div className="text-center py-4">
      <Spinner size="lg" />
      <h2 className="mt-4 text-[20px] font-semibold text-gray-900">{t('resetPassword.verifyingTitle')}</h2>
      <p className="mt-2 text-[14px] text-gray-500">{t('resetPassword.verifyingDescription')}</p>
    </div>
  );

  if (!token || !isTokenValid) return pageShell(
    <div className="text-center py-4">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={28} className="text-red-500" />
      </div>
      <h2 className="text-[20px] font-semibold text-gray-900 mb-2">{t('resetPassword.invalidTokenTitle')}</h2>
      <p className="text-[14px] text-gray-600 mb-1">{verificationError || t('resetPassword.invalidTokenDescription')}</p>
      <p className="text-[13px] text-gray-400 mb-6">{t('resetPassword.invalidTokenAlreadyUsed')}</p>
      <Link
        to="/forgot-password"
        className="inline-block px-6 py-3 bg-primary text-white font-medium text-[15px] rounded-xl hover:bg-[#b897c7] transition-all duration-200 shadow-sm"
      >
        {t('resetPassword.requestNewLink')}
      </Link>
    </div>
  );

  return pageShell(
    <>
      <h1 className="text-[24px] font-semibold text-gray-900 text-center mb-2">{t('resetPassword.title')}</h1>
      <p className="text-[14px] text-gray-500 text-center mb-8">{t('resetPassword.description')}</p>

      {isSuccess ? (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[14px] font-medium text-gray-900 mb-1">{t('resetPassword.successTitle')}</p>
                <p className="text-[13px] text-gray-600">
                  {t('resetPassword.successMessage')} {t('resetPassword.successRedirecting')}
                </p>
              </div>
            </div>
          </div>
          <Link
            to="/login"
            className="block w-full px-6 py-3 bg-primary text-white font-medium text-[15px] rounded-xl hover:bg-[#b897c7] transition-all duration-200 text-center shadow-sm"
          >
            {t('resetPassword.signInNow')}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* New Password */}
          <div>
            <label className="block text-[14px] text-gray-700 font-medium mb-2">{t('resetPassword.newPassword')}</label>
            <Controller
              name="newPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    className={`${inputClass(Boolean(errors.newPassword))} pr-12`}
                    aria-invalid={Boolean(errors.newPassword)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              )}
            />
            {errors.newPassword && (
              <p className="text-[13px] text-red-500 mt-1.5">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[14px] text-gray-700 font-medium mb-2">{t('resetPassword.confirmPassword')}</label>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...field}
                    className={`${inputClass(Boolean(errors.confirmPassword))} pr-12`}
                    aria-invalid={Boolean(errors.confirmPassword)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              )}
            />
            {errors.confirmPassword && (
              <p className="text-[13px] text-red-500 mt-1.5">{errors.confirmPassword.message}</p>
            )}
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-[13px] text-red-600">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full px-6 py-3 bg-primary text-white font-medium text-[15px] rounded-xl hover:bg-[#b897c7] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resetPasswordMutation.isPending ? t('resetPassword.submitting') : t('resetPassword.submit')}
          </button>

          <p className="text-center text-[14px] text-gray-500">
            <Link to="/login" className="text-primary hover:text-[#b897c7] font-medium transition-colors">
              {t('resetPassword.backToSignIn')}
            </Link>
          </p>
        </form>
      )}
    </>
  );
};
