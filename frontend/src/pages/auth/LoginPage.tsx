import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { loginSchema, type LoginInput } from '@/validators/auth.validator';
import { useLogin } from '@/hooks/useAuth';

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
    return typed.message ?? typed.error?.message ?? '로그인 중 오류가 발생했습니다.';
  }

  return '로그인 중 오류가 발생했습니다.';
};

export const LoginPage = (): JSX.Element => {
  const loginMutation = useLogin();
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

  const loginErrorMessage = loginMutation.error ? resolveErrorMessage(loginMutation.error) : null;

  return (
    <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo - 나중에 실제 로고 이미지로 교체 가능 */}
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
            Sign in to WorkReview
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            {/* Username/Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2.5">
                Username or email address
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
              <div className="flex items-center justify-between mb-2.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#2FA48B] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <input
                      id="password"
                      type="password"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      className={`w-full px-3 py-2.5 text-sm text-gray-900 bg-white border rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-colors duration-150 ${
                        errors.password
                          ? 'border-[#cf222e] focus:border-[#cf222e] focus:ring-[#cf222e]'
                          : 'border-[#d0d7de] focus:border-[#4DCDB3] focus:ring-[#4DCDB3]'
                      }`}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                    />
                    {errors.password ? (
                      <p id="password-error" className="text-xs text-[#cf222e] mt-2">
                        {errors.password.message}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>

            {/* Error Message */}
            {loginErrorMessage ? (
              <p className="text-xs text-[#cf222e] mt-2" role="alert" aria-live="assertive">
                {loginErrorMessage}
              </p>
            ) : null}

            {/* Sign in Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full px-4 py-3 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium text-sm rounded-md border border-[#4DCDB3] hover:border-[#3CB89F] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DCDB3]"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#d0d7de]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            {/* Google OAuth Button */}
            <button
              type="button"
              className="w-full px-4 py-3 bg-[#f6f8fa] hover:bg-[#eaeef2] text-gray-900 font-medium text-sm rounded-md border border-[#d0d7de] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 flex items-center justify-center gap-2"
              disabled
            >
              {/* TODO: Google 아이콘 추가 예정 */}
              <span className="w-5 h-5"></span>
              Continue with Google
            </button>

            {/* Apple OAuth Button */}
            <button
              type="button"
              className="w-full px-4 py-3 bg-[#f6f8fa] hover:bg-[#eaeef2] text-gray-900 font-medium text-sm rounded-md border border-[#d0d7de] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 flex items-center justify-center gap-2"
              disabled
            >
              {/* TODO: Apple 아이콘 추가 예정 */}
              <span className="w-5 h-5"></span>
              Continue with Apple
            </button>
          </div>
        </div>

        {/* Create Account Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            New to WorkReview?{' '}
            <Link to="/register" className="text-[#2FA48B] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

