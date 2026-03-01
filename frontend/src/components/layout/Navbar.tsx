import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, useLogout } from '@/hooks/useAuth';
import { MapPin, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export const Navbar = (): JSX.Element => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success(t('nav.logoutSuccess'));
      navigate('/');
      setIsDropdownOpen(false);
    } catch {
      toast.error(t('nav.logoutFailed'));
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="text-white" size={20} />
            </div>
            <span className="text-[20px] font-semibold text-gray-900">WorkReview</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-[15px] text-gray-600 hover:text-gray-900 transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/stores" className="text-[15px] text-gray-600 hover:text-gray-900 transition-colors">
              {t('nav.findStores')}
            </Link>
            <Link to="/stores/search" className="text-[15px] text-gray-600 hover:text-gray-900 transition-colors">
              {t('nav.search')}
            </Link>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[14px] text-gray-600">{t('nav.language')}</span>
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="px-3 py-1.5 text-[14px] border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                <option value="en">{t('nav.languages.en')}</option>
                <option value="ko">{t('nav.languages.ko')}</option>
              </select>
            </div>

            {isAuthenticated && user ? (
              /* User Dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.username?.charAt(0)?.toUpperCase() ?? '?'}
                    </span>
                  </div>
                  <span className="text-[14px] text-gray-900 font-medium hidden sm:block">
                    {user.username ?? user.email}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-[14px] text-gray-900 font-medium truncate">{user.username}</p>
                        <p className="text-[13px] text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User size={16} className="text-gray-400" />
                        {t('nav.profile')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-[14px] text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <LogOut size={16} />
                        {logoutMutation.isPending ? t('common.loading') : t('nav.logout')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-[14px] text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-[#b897c7] transition-all duration-200 text-[14px] font-medium shadow-sm"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/stores"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('nav.findStores')}
              </Link>
              <Link
                to="/stores/search"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('nav.search')}
              </Link>

              {/* Language Selector Mobile */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <span className="text-[14px] text-gray-600">{t('nav.language')}</span>
                <select
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="px-3 py-1.5 text-[14px] border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
                >
                  <option value="en">{t('nav.languages.en')}</option>
                  <option value="ko">{t('nav.languages.ko')}</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                {isAuthenticated && user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-[14px] text-gray-700 bg-gray-50 rounded-lg"
                    >
                      <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {user.username?.charAt(0)?.toUpperCase() ?? '?'}
                        </span>
                      </div>
                      {user.username ?? user.email}
                    </Link>
                    <button
                      onClick={() => { setMobileMenuOpen(false); void handleLogout(); }}
                      className="flex items-center gap-2 px-4 py-2.5 text-[14px] text-red-600 bg-red-50 rounded-lg font-medium"
                    >
                      <LogOut size={16} />
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-5 py-2 text-[14px] text-gray-700 hover:text-gray-900 transition-colors font-medium text-left"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-[#b897c7] transition-all duration-200 text-[14px] font-medium shadow-sm text-center"
                    >
                      {t('nav.register')}
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
