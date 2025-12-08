import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRegister } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormInput } from '@/validators/auth.validator';

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
    return typed.message ?? typed.error?.message ?? '회원가입 중 오류가 발생했습니다.';
  }

  return '회원가입 중 오류가 발생했습니다.';
};

const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    {isVisible ? (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </>
    ) : (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.88 9.88l4.242 4.242M9.88 9.88L3 3m6.88 6.88l3.759-3.759M3 3l3.759 3.759m0 0L12 12m-5.241-5.241L12 12"
        />
      </>
    )}
  </svg>
);

export const RegisterPage = (): JSX.Element => {
  const registerMutation = useRegister();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    }
  });

  const onSubmit = (values: RegisterFormInput): void => {
    const { confirmPassword, ...payload } = values;
    registerMutation.mutate(payload);
  };

  const registerErrorMessage = registerMutation.error ? resolveErrorMessage(registerMutation.error) : null;

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
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Sign up for WorkReview
          </h1>

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

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2.5">
                Password
              </label>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <div className="relative">
                      <input
                        id="password"
                        type={isPasswordVisible ? 'text' : 'password'}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className={`w-full px-3 py-2.5 pr-10 text-sm text-gray-900 bg-white border rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-colors duration-150 ${
                          errors.password
                            ? 'border-[#cf222e] focus:border-[#cf222e] focus:ring-[#cf222e]'
                            : 'border-[#d0d7de] focus:border-[#4DCDB3] focus:ring-[#4DCDB3]'
                        }`}
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                      >
                        <EyeIcon isVisible={isPasswordVisible} />
                      </button>
                    </div>
                    {errors.password ? (
                      <p id="password-error" className="text-xs text-[#cf222e] mt-2">
                        {errors.password.message}
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
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={isConfirmPasswordVisible ? 'text' : 'password'}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className={`w-full px-3 py-2.5 pr-10 text-sm text-gray-900 bg-white border rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-colors duration-150 ${
                          errors.confirmPassword
                            ? 'border-[#cf222e] focus:border-[#cf222e] focus:ring-[#cf222e]'
                            : 'border-[#d0d7de] focus:border-[#4DCDB3] focus:ring-[#4DCDB3]'
                        }`}
                        aria-invalid={Boolean(errors.confirmPassword)}
                        aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={isConfirmPasswordVisible ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                      >
                        <EyeIcon isVisible={isConfirmPasswordVisible} />
                      </button>
                    </div>
                    {errors.confirmPassword ? (
                      <p id="confirm-password-error" className="text-xs text-[#cf222e] mt-2">
                        {errors.confirmPassword.message}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2.5">
                Display name
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <input
                      id="name"
                      type="text"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      className={`w-full px-3 py-2.5 text-sm text-gray-900 bg-white border rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-colors duration-150 ${
                        errors.name
                          ? 'border-[#cf222e] focus:border-[#cf222e] focus:ring-[#cf222e]'
                          : 'border-[#d0d7de] focus:border-[#4DCDB3] focus:ring-[#4DCDB3]'
                      }`}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name ? (
                      <p id="name-error" className="text-xs text-[#cf222e] mt-2">
                        {errors.name.message}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>

            {/* Error Message */}
            {registerErrorMessage ? (
              <p className="text-xs text-[#cf222e] mt-2" role="alert" aria-live="assertive">
                {registerErrorMessage}
              </p>
            ) : null}

            {/* Sign up Button */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full px-4 py-3 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium text-sm rounded-md border border-[#4DCDB3] hover:border-[#3CB89F] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DCDB3]"
            >
              {registerMutation.isPending ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        {/* Sign in Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2FA48B] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
