import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { User, Settings, Lock, LogOut } from 'lucide-react';
import { useAuth, useMe, useUpdateProfile, useUpdatePassword, useLogout } from '@/hooks/useAuth';
import {
  updateProfileSchema,
  updatePasswordSchema,
  type UpdateProfileInput,
  type UpdatePasswordInput
} from '@/validators/auth.validator';
import { Spinner } from '@/components/ui/Spinner';

const resolveErrorMessage = (error: unknown, t: (key: string) => string): string => {
  if (!error) return t('profile.unknownError');
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const typed = error as { message?: string; error?: { message?: string } };
    return typed.message ?? typed.error?.message ?? t('profile.requestError');
  }
  return t('profile.requestError');
};

const formatDate = (dateString: string | undefined, language: string): string => {
  if (!dateString) return '-';
  try {
    const locale = language === 'ko' ? 'ko-KR' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return dateString; }
};

export const ProfilePage = (): JSX.Element => {
  const { t, i18n } = useTranslation();
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
  } = useForm<UpdateProfileInput>({ resolver: zodResolver(updateProfileSchema), mode: 'onTouched' });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm<UpdatePasswordInput>({ resolver: zodResolver(updatePasswordSchema), mode: 'onTouched' });

  useEffect(() => {
    if (isInitialized && !isAuthenticated) navigate('/login', { replace: true });
  }, [isInitialized, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      resetProfile({ username: user.username, department: user.department ?? '', position: user.position ?? '' });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = (data: UpdateProfileInput): void => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => toast.success(t('profile.profileUpdated')),
      onError: (error) => toast.error(resolveErrorMessage(error, t))
    });
  };

  const onPasswordSubmit = (data: UpdatePasswordInput): void => {
    updatePasswordMutation.mutate(data, {
      onSuccess: () => { toast.success(t('profile.passwordChanged')); resetPassword(); },
      onError: (error) => toast.error(resolveErrorMessage(error, t))
    });
  };

  const handleLogout = (): void => {
    if (window.confirm(t('profile.confirmSignOut'))) {
      logoutMutation.mutate(undefined, {
        onSuccess: () => { toast.success(t('profile.signedOut')); navigate('/login', { replace: true }); }
      });
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-[15px] ${
      hasError ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-primary'
    }`;

  if (!isInitialized || isLoadingUser) return (
    <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[15px] text-gray-600">{t('profile.unableToLoadUser')}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-[#b897c7] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-[32px] font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-[28px] font-semibold text-gray-900 mb-1">@{user.username}</h1>
              <p className="text-[15px] text-gray-600 mb-3">{user.email}</p>
              <span className="px-3 py-1 bg-primary/10 text-primary text-[13px] font-medium rounded-full">
                {t('profile.memberSince')} {formatDate(user.createdAt, i18n.language)}
              </span>
            </div>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
            <h2 className="text-[20px] font-semibold text-gray-900">{t('profile.basicInfo')}</h2>
          </div>

          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
            <div>
              <label className="block text-[14px] text-gray-700 font-medium mb-2">{t('profile.email')}</label>
              <input type="email" value={user.email} disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-[15px] text-gray-500 cursor-not-allowed" />
              <p className="text-[13px] text-gray-400 mt-1.5">{t('profile.emailCannotChange')}</p>
            </div>

            <Controller name="username" control={profileControl} defaultValue={user.username}
              render={({ field }) => (
                <div>
                  <label className="block text-[14px] text-gray-700 font-medium mb-2">{t('profile.username')}</label>
                  <input type="text" {...field} value={field.value ?? ''}
                    className={inputClass(Boolean(profileErrors.username))} />
                  {profileErrors.username && <p className="text-[13px] text-red-500 mt-1.5">{profileErrors.username.message}</p>}
                </div>
              )}
            />

            <Controller name="department" control={profileControl} defaultValue={user.department ?? ''}
              render={({ field }) => (
                <div>
                  <label className="block text-[14px] text-gray-700 font-medium mb-2">{t('profile.department')}</label>
                  <input type="text" {...field} value={field.value ?? ''}
                    className={inputClass(Boolean(profileErrors.department))} />
                </div>
              )}
            />

            <Controller name="position" control={profileControl} defaultValue={user.position ?? ''}
              render={({ field }) => (
                <div>
                  <label className="block text-[14px] text-gray-700 font-medium mb-2">{t('profile.position')}</label>
                  <input type="text" {...field} value={field.value ?? ''}
                    className={inputClass(Boolean(profileErrors.position))} />
                </div>
              )}
            />

            {updateProfileMutation.error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-[13px] text-red-600">{resolveErrorMessage(updateProfileMutation.error, t)}</p>
              </div>
            ) : null}

            <button type="submit" disabled={updateProfileMutation.isPending}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-[#b897c7] transition-all duration-200 font-medium text-[15px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {updateProfileMutation.isPending ? t('profile.saving') : t('profile.saveChanges')}
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Lock size={20} className="text-primary" />
            </div>
            <h2 className="text-[20px] font-semibold text-gray-900">{t('profile.changePassword')}</h2>
          </div>

          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
            <Controller name="currentPassword" control={passwordControl} defaultValue=""
              render={({ field }) => (
                <div>
                  <label className="block text-[14px] text-gray-700 font-medium mb-2">{t('profile.currentPassword')}</label>
                  <input type="password" {...field}
                    className={inputClass(Boolean(passwordErrors.currentPassword))} />
                  {passwordErrors.currentPassword && (
                    <p className="text-[13px] text-red-500 mt-1.5">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>
              )}
            />
            <Controller name="newPassword" control={passwordControl} defaultValue=""
              render={({ field }) => (
                <div>
                  <label className="block text-[14px] text-gray-700 font-medium mb-2">{t('profile.newPassword')}</label>
                  <input type="password" {...field}
                    className={inputClass(Boolean(passwordErrors.newPassword))} />
                  {passwordErrors.newPassword && (
                    <p className="text-[13px] text-red-500 mt-1.5">{passwordErrors.newPassword.message}</p>
                  )}
                  <p className="text-[13px] text-gray-400 mt-1.5">{t('profile.passwordRequirement')}</p>
                </div>
              )}
            />
            <Controller name="confirmPassword" control={passwordControl} defaultValue=""
              render={({ field }) => (
                <div>
                  <label className="block text-[14px] text-gray-700 font-medium mb-2">{t('profile.confirmPassword')}</label>
                  <input type="password" {...field}
                    className={inputClass(Boolean(passwordErrors.confirmPassword))} />
                  {passwordErrors.confirmPassword && (
                    <p className="text-[13px] text-red-500 mt-1.5">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
              )}
            />

            {updatePasswordMutation.error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-[13px] text-red-600">{resolveErrorMessage(updatePasswordMutation.error, t)}</p>
              </div>
            ) : null}

            <button type="submit" disabled={updatePasswordMutation.isPending}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-[#b897c7] transition-all duration-200 font-medium text-[15px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {updatePasswordMutation.isPending ? t('profile.changing') : t('profile.changePasswordButton')}
            </button>
          </form>
        </div>

        {/* Account Management */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Settings size={20} className="text-red-500" />
            </div>
            <h2 className="text-[20px] font-semibold text-gray-900">{t('profile.accountManagement')}</h2>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={18} />
            {logoutMutation.isPending ? t('profile.signingOut') : t('profile.signOut')}
          </button>
        </div>
      </div>
    </div>
  );
};
