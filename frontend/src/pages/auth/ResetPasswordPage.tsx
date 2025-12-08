import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { resetPasswordSchema, type ResetPasswordInput } from '@/validators/auth.validator';
import { resetPassword, verifyResetToken } from '@/api/auth.api';

const resolveErrorMessage = (error: unknown): string => {
  if (!error) {
    return '알 수 없는 오류가 발생했습니다.';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const typed = error as { message?: string; error?: { message?: string } };
    return typed.message ?? typed.error?.message ?? '요청 중 오류가 발생했습니다.';
  }

  return '요청 중 오류가 발생했습니다.';
};

export const ResetPasswordPage = (): JSX.Element => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [verificationError, setVerificationError] = useState<string>('');

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { newPassword: string }) => {
      if (!token) {
        throw new Error('유효하지 않은 토큰입니다.');
      }
      return resetPassword(token, data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched'
  });

  // 페이지 로딩 시 토큰 검증
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        setIsTokenValid(false);
        return;
      }

      try {
        await verifyResetToken(token);
        setIsTokenValid(true);
        setVerificationError('');
      } catch (error) {
        setIsTokenValid(false);
        setVerificationError(resolveErrorMessage(error));
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const onSubmit = (data: ResetPasswordInput): void => {
    resetPasswordMutation.mutate({ newPassword: data.newPassword });
  };

  const errorMessage = resetPasswordMutation.error ? resolveErrorMessage(resetPasswordMutation.error) : null;

  // 토큰 검증 중
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white border border-[#d0d7de] rounded-md p-6 sm:p-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#4DCDB3] border-t-transparent"></div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Verifying link...</h2>
              <p className="mt-2 text-sm text-gray-600">
                Please wait a moment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 토큰이 없거나 유효하지 않음
  if (!token || !isTokenValid) {
    return (
      <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white border border-[#d0d7de] rounded-md p-6 sm:p-8">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-[#cf222e]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Invalid or expired link</h2>
              <p className="mt-2 text-sm text-gray-600">
                {verificationError || 'This password reset link is invalid or has expired.'}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                The link may have already been used or expired.
              </p>
              <Link
                to="/forgot-password"
                className="mt-6 inline-block px-4 py-3 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium text-sm rounded-md border border-[#4DCDB3] hover:border-[#3CB89F] transition-colors duration-150"
              >
                Request new link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="WorkReview Logo"
            className="h-12 w-auto"
            // TODO: 실제 로고 이미지 경로로 교체 필요
          />
        </div>

        {/* Card Container */}
        <div className="bg-white border border-[#d0d7de] rounded-md p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-4">
            Set new password
          </h1>
          <p className="text-sm text-gray-600 text-center mb-8">
            Enter a new password for your account.
          </p>

          {isSuccess ? (
            <div className="space-y-6">
              <div className="bg-[#E8F9F6] border border-[#4DCDB3] rounded-md p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-[#2FA48B]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Password changed successfully</h3>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        You can now sign in with your new password.
                        Redirecting to sign in page...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/login"
                className="block w-full px-4 py-3 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium text-sm rounded-md border border-[#4DCDB3] hover:border-[#3CB89F] transition-colors duration-150 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DCDB3]"
              >
                Sign in now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
              {/* New Password Input */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900 mb-2.5">
                  New password
                </label>
                <Controller
                  name="newPassword"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <input
                        id="newPassword"
                        type="password"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className={`w-full px-3 py-2.5 text-sm text-gray-900 bg-white border rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-colors duration-150 ${
                          errors.newPassword
                            ? 'border-[#cf222e] focus:border-[#cf222e] focus:ring-[#cf222e]'
                            : 'border-[#d0d7de] focus:border-[#4DCDB3] focus:ring-[#4DCDB3]'
                        }`}
                        aria-invalid={Boolean(errors.newPassword)}
                        aria-describedby={errors.newPassword ? 'newPassword-error' : undefined}
                      />
                      {errors.newPassword ? (
                        <p id="newPassword-error" className="text-xs text-[#cf222e] mt-2">
                          {errors.newPassword.message}
                        </p>
                      ) : null}
                    </>
                  )}
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2.5">
                  Confirm password
                </label>
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className={`w-full px-3 py-2.5 text-sm text-gray-900 bg-white border rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-colors duration-150 ${
                          errors.confirmPassword
                            ? 'border-[#cf222e] focus:border-[#cf222e] focus:ring-[#cf222e]'
                            : 'border-[#d0d7de] focus:border-[#4DCDB3] focus:ring-[#4DCDB3]'
                        }`}
                        aria-invalid={Boolean(errors.confirmPassword)}
                        aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                      />
                      {errors.confirmPassword ? (
                        <p id="confirmPassword-error" className="text-xs text-[#cf222e] mt-2">
                          {errors.confirmPassword.message}
                        </p>
                      ) : null}
                    </>
                  )}
                />
              </div>

              {/* Error Message */}
              {errorMessage ? (
                <p className="text-xs text-[#cf222e] mt-2" role="alert" aria-live="assertive">
                  {errorMessage}
                </p>
              ) : null}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="w-full px-4 py-3 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium text-sm rounded-md border border-[#4DCDB3] hover:border-[#3CB89F] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DCDB3]"
              >
                {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset password'}
              </button>
            </form>
          )}
        </div>

        {/* Back to Sign in Link */}
        {!isSuccess && (
          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm text-[#2FA48B] hover:underline">
              Back to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
