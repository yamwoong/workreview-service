import { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail, CheckCircle } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/validators/auth.validator';
import { forgotPassword } from '@/api/auth.api';

const resolveErrorMessage = (error: unknown, t: (key: string) => string): string => {
  if (!error) return t('forgotPassword.unknownError');
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const typed = error as { message?: string; error?: { message?: string } };
    return typed.message ?? typed.error?.message ?? t('forgotPassword.requestError');
  }
  return t('forgotPassword.requestError');
};

export const ForgotPasswordPage = (): JSX.Element => {
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => setIsSuccess(true)
  });

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched'
  });

  const onSubmit = (data: ForgotPasswordInput): void => {
    forgotPasswordMutation.mutate(data);
  };

  const errorMessage = forgotPasswordMutation.error
    ? resolveErrorMessage(forgotPasswordMutation.error, t)
    : null;

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-[15px] ${
      hasError ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-primary'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f1f7] via-[#faf8fb] to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <MapPin size={20} className="text-white" />
          </div>
          <span className="text-[22px] font-semibold text-gray-900">WorkReview</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h1 className="text-[24px] font-semibold text-gray-900 text-center mb-2">
            {t('forgotPassword.title')}
          </h1>
          <p className="text-[14px] text-gray-500 text-center mb-8">
            {t('forgotPassword.description')}
          </p>

          {isSuccess ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[14px] font-medium text-gray-900 mb-1">{t('forgotPassword.successTitle')}</p>
                    <p className="text-[13px] text-gray-600">{t('forgotPassword.successMessage')}</p>
                  </div>
                </div>
              </div>
              <Link
                to="/login"
                className="block w-full px-6 py-3 bg-primary text-white font-medium text-[15px] rounded-xl hover:bg-[#b897c7] transition-all duration-200 text-center shadow-sm"
              >
                {t('forgotPassword.backToSignIn')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div>
                <label className="block text-[14px] text-gray-700 font-medium mb-2">{t('forgotPassword.email')}</label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        {...field}
                        className={`${inputClass(Boolean(errors.email))} pl-11`}
                        aria-invalid={Boolean(errors.email)}
                      />
                    </div>
                  )}
                />
                {errors.email && (
                  <p className="text-[13px] text-red-500 mt-1.5">{errors.email.message}</p>
                )}
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-[13px] text-red-600">{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className="w-full px-6 py-3 bg-primary text-white font-medium text-[15px] rounded-xl hover:bg-[#b897c7] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {forgotPasswordMutation.isPending ? t('forgotPassword.submitting') : t('forgotPassword.submit')}
              </button>
            </form>
          )}
        </div>

        {!isSuccess && (
          <p className="mt-6 text-center text-[14px] text-gray-500">
            <Link to="/login" className="text-primary hover:text-[#b897c7] font-medium transition-colors">
              {t('forgotPassword.backToSignIn')}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};
