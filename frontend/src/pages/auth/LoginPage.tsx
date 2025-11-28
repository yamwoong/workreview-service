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
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex w-full md:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex-col justify-center items-start px-6 md:px-12 lg:px-16 min-h-[30vh] md:min-h-screen animate-slide-up">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 md:mb-6">
          지금 로그인하고<br />
          최적의 모니터링 환경을<br />
          경험하세요.
        </h2>
        <p className="text-white/70 text-sm md:text-base animate-fade-in-delay">Mobile Performance Management Solution</p>
      </div>

      <div className="w-full md:w-1/2 bg-white flex items-center justify-center px-6 md:px-8">
        <div className="max-w-md w-full animate-slide-in-right">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 md:mb-10">WorkReview</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div>
                  <input
                    type="email"
                    placeholder="아이디를 입력하세요."
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out`}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email ? (
                    <p id="email-error" className="text-sm text-red-600 -mt-3 mb-4">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div>
                  <input
                    type="password"
                    placeholder="비밀번호를 입력하세요."
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out`}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  {errors.password ? (
                    <p id="password-error" className="text-sm text-red-600 -mt-3 mb-4">
                      {errors.password.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <div className="flex items-center gap-2 text-sm text-gray-600 my-4">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="cursor-pointer">
                아이디 저장
              </label>
            </div>

            {loginErrorMessage ? (
              <p className="text-sm text-red-600 mt-1" role="alert" aria-live="assertive">
                {loginErrorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              {loginMutation.isPending ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-600">
            <Link to="/register" className="hover:text-blue-600 transition-colors">
              회원가입하기
            </Link>
            <span className="text-gray-400 mx-2">|</span>
            <Link to="/forgot-password" className="hover:text-blue-600 transition-colors">
              비밀번호 찾기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

