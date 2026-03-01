import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail, RefreshCw } from 'lucide-react';
import { useVerifyEmail, useResendVerification } from '@/hooks/useAuth';

const resolveErrorMessage = (error: unknown, t: (key: string) => string): string => {
  if (!error) return t('verifyEmail.unknownError');
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const typed = error as { message?: string; error?: { message?: string } };
    return typed.message ?? typed.error?.message ?? t('verifyEmail.verifyError');
  }
  return t('verifyEmail.verifyError');
};

const RESEND_COOLDOWN = 60; // seconds

export const VerifyEmailPage = (): JSX.Element => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [code, setCode] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerification();

  // Start cooldown timer
  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6 && email) {
      verifyMutation.mutate({ email, code });
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  const handleResend = () => {
    if (cooldown > 0 || !email) return;
    resendMutation.mutate(email, {
      onSuccess: () => startCooldown()
    });
  };

  const verifyError = verifyMutation.error
    ? resolveErrorMessage(verifyMutation.error, t)
    : null;

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
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-primary" />
            </div>
            <h1 className="text-[28px] font-semibold text-gray-900 mb-2">
              {t('verifyEmail.title')}
            </h1>
            <p className="text-[15px] text-gray-600">
              {t('verifyEmail.subtitle')}
            </p>
            {email && (
              <p className="text-[14px] font-medium text-primary mt-2 break-all">
                {email}
              </p>
            )}
          </div>

          {/* Verification Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="code" className="block text-[14px] text-gray-700 font-medium">
                {t('verifyEmail.codeLabel')}
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                maxLength={6}
                className={`w-full px-4 py-4 bg-gray-50 border rounded-xl text-center text-[28px] font-bold tracking-[0.5em]
                         focus:outline-none focus:ring-2 focus:border-transparent
                         transition-all duration-200 placeholder:text-gray-300 placeholder:tracking-[0.5em] ${
                           verifyMutation.isError
                             ? 'border-red-400 focus:ring-red-400'
                             : 'border-gray-200 focus:ring-primary'
                         }`}
                aria-invalid={verifyMutation.isError}
              />
              <p className="text-[12px] text-gray-400 text-center">
                {t('verifyEmail.codeExpiry')}
              </p>
            </div>

            {/* Error */}
            {verifyError && (
              <p className="text-[13px] text-red-500 text-center" role="alert">
                {verifyError}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={code.length !== 6 || verifyMutation.isPending || !email}
              className="w-full py-3.5 bg-primary text-white rounded-xl
                       hover:bg-[#b897c7] active:bg-[#a788b7]
                       transition-all duration-200 shadow-sm hover:shadow-md
                       font-medium text-[15px]
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifyMutation.isPending ? t('verifyEmail.submitting') : t('verifyEmail.submit')}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-[14px] text-gray-600 mb-3">
              {t('verifyEmail.didntReceive')}
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resendMutation.isPending || !email}
              className="inline-flex items-center gap-2 text-[14px] text-primary hover:text-[#b897c7]
                       transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={14} className={resendMutation.isPending ? 'animate-spin' : ''} />
              {cooldown > 0
                ? t('verifyEmail.resendCooldown', { seconds: cooldown })
                : t('verifyEmail.resend')}
            </button>
            {resendMutation.isSuccess && (
              <p className="text-[13px] text-green-600 mt-2">
                {t('verifyEmail.resendSuccess')}
              </p>
            )}
          </div>

          {/* Back to login */}
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-[14px] text-gray-500 hover:text-gray-700 transition-colors"
            >
              {t('verifyEmail.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
