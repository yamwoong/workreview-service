import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
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

export const RegisterPage = (): JSX.Element => {
  const registerMutation = useRegister();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      department: '',
      position: ''
    }
  });

  const onSubmit = (values: RegisterFormInput): void => {
    const { confirmPassword, ...payload } = values;
    registerMutation.mutate(payload);
  };

  const registerErrorMessage = registerMutation.error ? resolveErrorMessage(registerMutation.error) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <Card className="max-w-md w-full" padding="lg" hover>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">계정 만들기</h1>
            <p className="text-gray-600 mt-2">WorkReview에 가입하세요</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  label="이메일"
                  type="email"
                  placeholder="user@example.com"
                  required
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  label="비밀번호"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  required
                  error={errors.password?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  label="비밀번호 확인"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                  error={errors.confirmPassword?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  label="이름"
                  placeholder="홍길동"
                  required
                  error={errors.name?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="department"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  label="부서"
                  placeholder="예: 엔지니어링"
                  error={errors.department?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="position"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  label="직책"
                  placeholder="예: 팀장"
                  error={errors.position?.message}
                  {...field}
                />
              )}
            />

            {registerErrorMessage ? (
              <p className="text-sm text-red-600 mt-1" role="alert" aria-live="assertive">
                {registerErrorMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={registerMutation.isPending}
            >
              회원가입
            </Button>
          </form>

          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};


