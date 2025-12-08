import { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/validators/auth.validator';
import { forgotPassword } from '@/api/auth.api';

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

export const ForgotPasswordPage = (): JSX.Element => {
  const [isSuccess, setIsSuccess] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setIsSuccess(true);
    }
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched'
  });

  const onSubmit = (data: ForgotPasswordInput): void => {
    forgotPasswordMutation.mutate(data);
  };

  const errorMessage = forgotPasswordMutation.error ? resolveErrorMessage(forgotPasswordMutation.error) : null;

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
            Reset your password
          </h1>
          <p className="text-sm text-gray-600 text-center mb-8">
            Enter your email address and we'll send you a link to reset your password.
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
                    <h3 className="text-sm font-medium text-gray-900">Check your email</h3>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        We've sent a password reset link to your email address.
                        Please check your inbox and follow the instructions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/login"
                className="block w-full px-4 py-3 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium text-sm rounded-md border border-[#4DCDB3] hover:border-[#3CB89F] transition-colors duration-150 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DCDB3]"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2.5">
                  Email address
                </label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <input
                        id="email"
                        type="email"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className={`w-full px-3 py-2.5 text-sm text-gray-900 bg-white border rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-colors duration-150 ${
                          errors.email
                            ? 'border-[#cf222e] focus:border-[#cf222e] focus:ring-[#cf222e]'
                            : 'border-[#d0d7de] focus:border-[#4DCDB3] focus:ring-[#4DCDB3]'
                        }`}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email ? (
                        <p id="email-error" className="text-xs text-[#cf222e] mt-2">
                          {errors.email.message}
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
                disabled={forgotPasswordMutation.isPending}
                className="w-full px-4 py-3 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium text-sm rounded-md border border-[#4DCDB3] hover:border-[#3CB89F] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DCDB3]"
              >
                {forgotPasswordMutation.isPending ? 'Sending...' : 'Send reset link'}
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
