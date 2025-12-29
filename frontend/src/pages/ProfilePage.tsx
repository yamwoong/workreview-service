import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth, useMe, useUpdateProfile, useUpdatePassword, useLogout } from '@/hooks/useAuth';
import {
  updateProfileSchema,
  updatePasswordSchema,
  type UpdateProfileInput,
  type UpdatePasswordInput
} from '@/validators/auth.validator';
import { Spinner } from '@/components/ui/Spinner';

// 헬퍼 함수들 (컴포넌트 외부로 이동 - 성능 최적화)
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
    return typed.message ?? typed.error?.message ?? '오류가 발생했습니다.';
  }

  return '오류가 발생했습니다.';
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// 스타일 상수 분리
const INPUT_BASE_CLASS =
  'w-full px-3 py-2.5 text-sm text-gray-900 bg-white border rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-1 transition-colors duration-150';
const INPUT_ERROR_CLASS = 'border-[#cf222e] focus:border-[#cf222e] focus:ring-[#cf222e]';
const INPUT_NORMAL_CLASS = 'border-[#d0d7de] focus:border-[#4DCDB3] focus:ring-[#4DCDB3]';

const getInputClassName = (hasError: boolean) =>
  `${INPUT_BASE_CLASS} ${hasError ? INPUT_ERROR_CLASS : INPUT_NORMAL_CLASS}`;

export const ProfilePage = (): JSX.Element => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useMe();
  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();
  const logoutMutation = useLogout();

  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    mode: 'onTouched'
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    mode: 'onTouched'
  });

  // 로그인 상태 확인
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isInitialized, isAuthenticated, navigate]);

  // 프로필 데이터 로드 후 폼 초기화
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        department: user.department ?? '',
        position: user.position ?? ''
      });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = (data: UpdateProfileInput): void => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        toast.success('프로필이 업데이트되었습니다.');
      },
      onError: (error) => {
        toast.error(resolveErrorMessage(error));
      }
    });
  };

  const onPasswordSubmit = (data: UpdatePasswordInput): void => {
    updatePasswordMutation.mutate(data, {
      onSuccess: () => {
        toast.success('비밀번호가 변경되었습니다.');
        resetPassword();
      },
      onError: (error) => {
        toast.error(resolveErrorMessage(error));
      }
    });
  };

  const handleLogout = (): void => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          toast.success('로그아웃되었습니다.');
          navigate('/login', { replace: true });
        }
      });
    }
  };

  if (!isInitialized || isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa]">
        <p className="text-sm text-gray-600">Unable to load user information.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fa] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

        {/* 1. 기본 정보 섹션 */}
        <div className="bg-white border border-[#d0d7de] rounded-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2.5 text-sm border border-[#d0d7de] rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1.5">Email cannot be changed.</p>
            </div>

            <Controller
              name="name"
              control={profileControl}
              defaultValue={user.name}
              render={({ field }) => (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                    Display name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className={getInputClassName(Boolean(profileErrors.name))}
                    aria-invalid={Boolean(profileErrors.name)}
                    aria-describedby={profileErrors.name ? 'name-error' : undefined}
                  />
                  {profileErrors.name ? (
                    <p id="name-error" className="text-xs text-[#cf222e] mt-1.5">
                      {profileErrors.name.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <Controller
              name="department"
              control={profileControl}
              defaultValue={user.department ?? ''}
              render={({ field }) => (
                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className={getInputClassName(Boolean(profileErrors.department))}
                    aria-invalid={Boolean(profileErrors.department)}
                  />
                </div>
              )}
            />

            <Controller
              name="position"
              control={profileControl}
              defaultValue={user.position ?? ''}
              render={({ field }) => (
                <div>
                  <label
                    htmlFor="position"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className={getInputClassName(Boolean(profileErrors.position))}
                    aria-invalid={Boolean(profileErrors.position)}
                  />
                </div>
              )}
            />

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Joined date</label>
              <input
                type="text"
                value={formatDate(user.createdAt)}
                disabled
                className="w-full px-3 py-2.5 text-sm border border-[#d0d7de] rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* API Error Message */}
            {updateProfileMutation.error ? (
              <div className="bg-[#fff5f5] border border-[#cf222e] rounded-md p-3">
                <p className="text-xs text-[#cf222e]" role="alert" aria-live="assertive">
                  {resolveErrorMessage(updateProfileMutation.error)}
                </p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full sm:w-auto px-4 py-3 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium text-sm rounded-md border border-[#4DCDB3] hover:border-[#3CB89F] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DCDB3]"
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* 2. 비밀번호 변경 섹션 */}
        <div className="bg-white border border-[#d0d7de] rounded-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>

          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
            <Controller
              name="currentPassword"
              control={passwordControl}
              defaultValue=""
              render={({ field }) => (
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Current password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className={getInputClassName(Boolean(passwordErrors.currentPassword))}
                    aria-invalid={Boolean(passwordErrors.currentPassword)}
                    aria-describedby={
                      passwordErrors.currentPassword ? 'current-password-error' : undefined
                    }
                  />
                  {passwordErrors.currentPassword ? (
                    <p id="current-password-error" className="text-xs text-[#cf222e] mt-1.5">
                      {passwordErrors.currentPassword.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <Controller
              name="newPassword"
              control={passwordControl}
              defaultValue=""
              render={({ field }) => (
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    New password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className={getInputClassName(Boolean(passwordErrors.newPassword))}
                    aria-invalid={Boolean(passwordErrors.newPassword)}
                    aria-describedby={passwordErrors.newPassword ? 'new-password-error' : undefined}
                  />
                  {passwordErrors.newPassword ? (
                    <p id="new-password-error" className="text-xs text-[#cf222e] mt-1.5">
                      {passwordErrors.newPassword.message}
                    </p>
                  ) : null}
                  <p className="text-xs text-gray-500 mt-1.5">
                    Password must be at least 8 characters with letters and numbers.
                  </p>
                </div>
              )}
            />

            <Controller
              name="confirmPassword"
              control={passwordControl}
              defaultValue=""
              render={({ field }) => (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className={getInputClassName(Boolean(passwordErrors.confirmPassword))}
                    aria-invalid={Boolean(passwordErrors.confirmPassword)}
                    aria-describedby={
                      passwordErrors.confirmPassword ? 'confirm-password-error' : undefined
                    }
                  />
                  {passwordErrors.confirmPassword ? (
                    <p id="confirm-password-error" className="text-xs text-[#cf222e] mt-1.5">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            {/* API Error Message */}
            {updatePasswordMutation.error ? (
              <div className="bg-[#fff5f5] border border-[#cf222e] rounded-md p-3">
                <p className="text-xs text-[#cf222e]" role="alert" aria-live="assertive">
                  {resolveErrorMessage(updatePasswordMutation.error)}
                </p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={updatePasswordMutation.isPending}
              className="w-full sm:w-auto px-4 py-3 bg-[#4DCDB3] hover:bg-[#3CB89F] text-white font-medium text-sm rounded-md border border-[#4DCDB3] hover:border-[#3CB89F] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DCDB3]"
            >
              {updatePasswordMutation.isPending ? 'Changing...' : 'Change password'}
            </button>
          </form>
        </div>

        {/* 3. 계정 관리 섹션 */}
        <div className="bg-white border border-[#d0d7de] rounded-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Management</h2>

          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full sm:w-auto px-4 py-3 bg-[#cf222e] hover:bg-[#a40e26] text-white font-medium text-sm rounded-md border border-[#cf222e] hover:border-[#a40e26] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>
    </div>
  );
};
















